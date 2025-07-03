"""Puzzle API endpoints."""

import random
from datetime import datetime, timedelta, timezone
from typing import Any, cast

from apiflask import APIBlueprint
from flask import jsonify, request, session
from sqlalchemy import select

from server import db
from server.config import (
    # EVAN_ADAM_PUZZLE_NAME,
    PUZZLE_CORRECT_MESSAGES,
    PUZZLE_FAILURE_MESSAGES,
    PUZZLE_TABLE_METADATA,
)
from server.models.Puzzle import PuzzleUser
from server.models.Submission import Submission
from server.models.User import User
from server.utils import (
    compute_puzzle_value,
    get_puzzle_answer_from_submission_evan_adam,
    get_puzzle_values,
    get_user_solved_puzzles,
    get_username_from_user_id,
    send_discord_embed,
    sus_detector,
    validate_user_submission,
)

puzzle = APIBlueprint("puzzle", __name__, url_prefix="/api/puzzle", tag="Puzzle")


@puzzle.post("/submit")
def submit():
    """Submit a puzzle."""
    if not session.get("user"):
        return jsonify({"solved": False, "message": "User not logged in"}), 401

    body = request.json
    if body is None:
        return jsonify({"solved": False, "message": "Invalid request"}), 400

    puzzle_name = body.get("puzzle_name", None)
    user_id = body.get("user_id", None)
    submission = body.get("submission", None)

    if puzzle_name is None or user_id is None or submission is None:
        return jsonify({"solved": False, "message": "Invalid request"}), 400

    # strip whitespace around user submitted code
    submission = submission.strip()

    is_solved = validate_user_submission(
        user_id=user_id, puzzle_name=puzzle_name, submission=submission
    )

    score = None
    # if puzzle_name == EVAN_ADAM_PUZZLE_NAME:
    #     _, score = get_puzzle_answer_from_submission_evan_adam(
    #         submission, user_id, puzzle_name
    #     )

    puzzle_user = (
        db.session.execute(
            select(PuzzleUser).where(
                PuzzleUser.user_id == user_id, PuzzleUser.puzzle_name == puzzle_name
            )
        )
        .scalars()
        .first()
    )

    if puzzle_user is None:
        puzzle_user = PuzzleUser(
            user_id=user_id,
            puzzle_name=puzzle_name,
            is_solved=is_solved,
            evan_adam_score=score,
        )
        if is_solved:
            puzzle_user.earliest_correct_time = datetime.now()
        puzzle_user.last_submission_time = datetime.now()
        db.session.add(puzzle_user)
        db.session.commit()
    else:
        last_submission_time = puzzle_user.last_submission_time
        if (
            last_submission_time is None
            or datetime.now() - last_submission_time > timedelta(minutes=1)
        ):
            puzzle_user.last_submission_time = datetime.now()
            if is_solved:
                puzzle_user.is_solved = is_solved
            if is_solved and puzzle_user.earliest_correct_time is None:
                puzzle_user.earliest_correct_time = datetime.now()
            # if puzzle_name == EVAN_ADAM_PUZZLE_NAME:
            #     puzzle_user.evan_adam_score = max(
            #         puzzle_user.evan_adam_score or 0, score or 0
            #     )
            db.session.commit()
        else:
            return jsonify(
                {
                    "solved": False,
                    "message": "Please wait one minute before submitting again",
                }
            ), 400

    submission_db = Submission(
        user_id=user_id,
        puzzle_name=puzzle_name,
        submission_text=submission,
        is_correct=is_solved,
    )
    db.session.add(submission_db)
    db.session.commit()

    if is_solved:
        message = random.choice(PUZZLE_CORRECT_MESSAGES[puzzle_name])
    else:
        message = random.choice(PUZZLE_FAILURE_MESSAGES[puzzle_name])

    is_possibly_sus = sus_detector(submission, user_id)

    sus_message = ""
    if len(is_possibly_sus) > 0:
        sus_submission_strings = ""
        for idx, sus in enumerate(is_possibly_sus):
            sus_submission_strings += (
                f"{idx + 1}. {sus['username']} ({sus['submission_time']})\n"
            )
        sus_message = (
            f"Suspicious activity detected. "
            f"{len(is_possibly_sus)} submissions from other users matched this "
            "submission:\n"
            f"```\n{sus_submission_strings}\n```"
        )
    else:
        sus_message = "This submission was not flagged as suspicious.\n"

    title = "New Submission"
    description = (
        f"**Puzzle:** {puzzle_name}\n"
        f"**Username:** {get_username_from_user_id(user_id)}\n"
        f"**Status:** {'✅ Solved' if is_solved else '❌ Not Solved'}\n"
        f"\n**Suspicious detector:**\n{sus_message}\n"
        f"**Submission:**\n```\n{submission}\n```"
    )
    color = 0x00FF00 if is_solved else 0xFF0000

    send_discord_embed(title, description, color)

    return jsonify({"solved": is_solved, "message": message})


def _empty_row(puzzle_values):
    return {
        "username": "",
        "scores": [
            {"name": _, "score": None, "earliest_correct_time": None}
            for _ in puzzle_values
        ],
        "time_penalty": None,
        "total_score": None,
    }


@puzzle.get("/leaderboard")
def leaderboard():
    """Get the puzzle leaderboard."""
    puzzle_metadatas: list[dict[str, Any]] = list(PUZZLE_TABLE_METADATA.values())
    puzzle_users = db.session.execute(select(PuzzleUser)).scalars().all()
    user_ids = set(puzzle_user.user_id for puzzle_user in puzzle_users)
    puzzle_values = get_puzzle_values(list(puzzle_users))

    for puzzle_name, puzzle_metadata in zip(
        PUZZLE_TABLE_METADATA.keys(), puzzle_metadatas
    ):
        puzzle_metadata["name"] = puzzle_name
        puzzle_metadata["value"] = puzzle_values[puzzle_name]

    puzzle_metadatas = sorted(puzzle_metadatas, key=lambda x: x["value"])

    puzzle_users_by_user_id = {user_id: [] for user_id in user_ids}
    for puzzle_user in puzzle_users:
        puzzle_users_by_user_id[puzzle_user.user_id].append(puzzle_user)

    user_scores = []
    for user_id in user_ids:
        scores = {
            puzzle_name: {
                "name": puzzle_name,
                "score": None,
                "earliest_correct_time": None,
            }
            for puzzle_name in puzzle_values
        }
        for puzzle_user in puzzle_users_by_user_id[user_id]:
            if puzzle_user.is_solved:
                # if puzzle_user.puzzle_name == EVAN_ADAM_PUZZLE_NAME:
                #     puzzle_score = compute_puzzle_value(
                #         -1,
                #         EVAN_ADAM_PUZZLE_NAME,
                #         puzzle_user.evan_adam_score,
                #         [
                #             cast(int, pu.evan_adam_score)
                #             for pu in puzzle_users
                #             if pu.puzzle_name == EVAN_ADAM_PUZZLE_NAME and pu.is_solved
                #         ],
                #     )
                # else:
                puzzle_score = puzzle_values[puzzle_user.puzzle_name]

                scores[puzzle_user.puzzle_name] = {
                    **scores[puzzle_user.puzzle_name],
                    "score": puzzle_score,
                    "earliest_correct_time": puzzle_user.earliest_correct_time.timestamp(),  # noqa
                }
        # scores must be sorted in the same order as the table headers,
        # i.e., increasing by puzzle value
        scores = sorted(scores.values(), key=lambda x: puzzle_values[x["name"]])

        base_timestamp = datetime(2024, 7, 8, 12, 0, tzinfo=timezone.utc).timestamp()
        total_score = 0
        for score in scores:
            if score["score"] is not None:
                total_score += score["score"]
        if total_score == 0:
            total_score = None
        time_penalty = sum(
            (
                (score["earliest_correct_time"] - base_timestamp)
                if score["earliest_correct_time"]
                else 0
                for score in scores
            ),
            start=0,
        )
        user_scores.append(
            {
                "username": get_username_from_user_id(user_id),
                "scores": scores,
                "time_penalty": time_penalty,
                "total_score": total_score,
            }
        )

    def sort_fn(x):
        return (
            -x["total_score"] if x["total_score"] is not None else 0,
            x["time_penalty"],
        )

    user_scores = sorted(user_scores, key=sort_fn)

    for user_score in user_scores:
        user_score["time_penalty"] = user_score["time_penalty"] // 3600
        if user_score["time_penalty"] == 0:
            user_score["time_penalty"] = None

    for i, user_score in enumerate(user_scores):
        user_score["rank"] = i + 1

    personal_user_score = None
    if session.get("user"):
        username = get_username_from_user_id(session["user"]["login"])
        personal_user_score = next(
            (x for x in user_scores if x["username"] == username), None
        )
        if personal_user_score is None:
            personal_user_score = _empty_row(puzzle_values)
            personal_user_score["username"] = username
            personal_user_score["rank"] = len(user_scores) + 1

    if len(user_scores) > 50:
        user_scores = user_scores[:50]
    else:
        # pad with empty rows
        len_to_pad = 50 - len(user_scores)
        for _ in range(len_to_pad):
            user_scores.append(_empty_row(puzzle_values))

    return jsonify(
        {
            "leaderboard": user_scores,
            "puzzle_metadatas": puzzle_metadatas,
            "personal_user_score": personal_user_score,
        }
    )

@puzzle.get("/solved")
def get_puzzles_solved():
    """Get puzzles solved from a user"""
    if not session.get("user"):
        return jsonify({"success": False, "message": "User not logged in"}), 401
    print("ses", session["user"]["login"])
    puzzle_users = (
        db.session.execute(
            select(PuzzleUser).where(PuzzleUser.user_id == session["user"]["login"])
        )
        .scalars()
        .all()
    )
    puzzles = get_user_solved_puzzles(puzzle_users)
    if not puzzles:
        return jsonify({"success": False, "message": "No puzzles completed"}), 404
    return jsonify({"success": True, "solved_puzzles": puzzles})


@puzzle.get("/email")
def get_email():
    """Get a user email."""
    if not session.get("user"):
        return jsonify({"success": False, "message": "User not logged in"}), 401
    u = (
        db.session.execute(
            select(User).where(User.github_username == session["user"]["login"])
        )
        .scalars()
        .first()
    )
    if not u:
        return jsonify({"success": False, "message": "User not found"}), 404
    return jsonify({"success": True, "email": u.hack_email})


@puzzle.post("/email")
def email():
    """Update user email."""
    if not session.get("user"):
        return jsonify({"success": False, "message": "User not logged in"}), 401

    body = request.json
    if body is None:
        return jsonify({"success": False, "message": "Invalid request"}), 400

    user_id = body.get("user_id", None)
    email = body.get("email", None)

    if user_id is None or email is None:
        return jsonify({"success": False, "message": "Invalid request"}), 4000

    github_username = get_username_from_user_id(user_id)
    user = (
        db.session.execute(select(User).where(User.github_username == github_username))
        .scalars()
        .first()
    )

    if user is None:
        return jsonify({"success": False, "message": "User not found"}), 404

    user.hack_email = email
    db.session.commit()

    session["user"]["hack_email"] = email
    return jsonify({"success": True, "message": "Email successfully updated"})
