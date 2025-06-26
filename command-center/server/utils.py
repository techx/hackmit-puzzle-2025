"""Utilities for the server."""

import hashlib
import math
from typing import Dict, List

import requests
from sqlalchemy import select

from server.config import (
    DISCORD_WEBHOOK,
    IS_VERCEL,
    PUZZLE_SECRETS,
    SECRET_KEY,
)
from server.db import db
from server.models.Puzzle import PuzzleUser
from server.models.Submission import Submission


def sus_detector(submission: str, submission_user_id: str) -> List[Dict[str, str]]:
    """Detect if a user submission is sus."""
    submission = submission.strip()
    submissions = (
        db.session.execute(
            select(Submission).where(
                Submission.submission_text == submission,
            )
        )
        .scalars()
        .all()
    )
    suspect_submissions = []
    for db_submission in submissions:
        if db_submission.user_id != submission_user_id:
            suspect_submissions.append(
                {
                    "username": get_username_from_user_id(db_submission.user_id),
                    "submission_time": db_submission.submission_time,
                }
            )
    return suspect_submissions


def send_discord_embed(title, description, color):
    """Send a discord embed."""
    data = {"embeds": [{"title": title, "description": description, "color": color}]}
    response = requests.post(DISCORD_WEBHOOK, json=data)
    return response


def generate_user_id(github_username: str) -> str:
    """Generate a user ID from a GitHub username."""
    hashed = hashlib.sha256(
        f"{github_username}_{SECRET_KEY}".encode("utf-8")
    ).hexdigest()
    return f"{github_username}_{hashed[:8]}"


def get_username_from_user_id(user_id: str) -> str:
    """Get username from a user ID."""
    return user_id.split("_")[0]


def get_puzzle_answer(user_id: str, puzzle_name: str) -> str:
    """Get the answer for a puzzle."""
    assert puzzle_name in PUZZLE_SECRETS, "Puzzle not found"
    secret = PUZZLE_SECRETS[puzzle_name]
    if IS_VERCEL[puzzle_name]:
        return hashlib.sha256(f"{user_id}{secret}".encode("utf-8")).hexdigest()
    return hashlib.sha256(f"{user_id}_{secret}".encode("utf-8")).hexdigest()


def get_puzzle_answer_from_submission_evan_adam(
    submission: str, user_id: str, puzzle_name: str
) -> tuple[bool, int | None]:
    """Check all hashes from 2000 to 4500 and determine if they match the submission.

    Returns a tuple (is_valid, score) where is_valid is True if a match is found,
    and score is the matched score (or None if no match is found).
    """
    for score in range(2000, 4501):
        hash_input = f"{user_id}_{PUZZLE_SECRETS[puzzle_name]}_{score}"
        hashed = hashlib.sha256(hash_input.encode("utf-8")).hexdigest()
        if hashed == submission:
            return True, score
    return False, None


def compute_puzzle_value(
    solves: int,
    puzzle_name: str,
    user_score: int | None = None,
    all_scores: List[int] | None = None,
) -> int:
    """Compute the dynamic puzzle score given the number of solves."""
    if solves == 0:
        return 2750
    # if puzzle_name == EVAN_ADAM_PUZZLE_NAME:
    #     if user_score is None or all_scores is None:
    #         return 2750
    #     n = sum(1 for score in all_scores if score >= user_score) - 1
    #     return int(2250 ** (1 - n / 200)) + 500
    return 1750 + 250 * max(4 - math.floor(2 * math.log(solves)), -5)


def get_puzzle_values(puzzle_users: List[PuzzleUser]) -> Dict[str, int]:
    """Get the dynamic puzzle values."""
    puzzle_names = PUZZLE_SECRETS.keys()
    solves = {puzzle_name: 0 for puzzle_name in puzzle_names}
    scores = {puzzle_name: [] for puzzle_name in puzzle_names}

    for puzzle_user in puzzle_users:
        if puzzle_user.is_solved:
            solves[puzzle_user.puzzle_name] += 1
            # if puzzle_user.puzzle_name == EVAN_ADAM_PUZZLE_NAME:
            #     scores[puzzle_user.puzzle_name].append(puzzle_user.evan_adam_score)

    return {
        puzzle_name: compute_puzzle_value(
            solves[puzzle_name],
            puzzle_name,
            max(scores[puzzle_name]) if len(scores[puzzle_name]) > 0 else None,
            scores[puzzle_name],
        )
        for puzzle_name in puzzle_names
    }


def validate_user_submission(user_id: str, puzzle_name: str, submission: str) -> bool:
    """Validate a user submission."""
    # if puzzle_name == EVAN_ADAM_PUZZLE_NAME:
    #     is_valid, _ = get_puzzle_answer_from_submission_evan_adam(
    #         submission, user_id, puzzle_name
    #     )
    #     return is_valid
    return submission == get_puzzle_answer(user_id, puzzle_name)
