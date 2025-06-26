"""server cli."""

import random
from datetime import datetime, timedelta

import faker
from flask import Blueprint

from server import db
from server.config import PUZZLE_TABLE_METADATA
from server.models.Puzzle import PuzzleUser
from server.utils import generate_user_id

seed = Blueprint("seed", __name__)


def generate_random_future_date():
    """Generate a random future date."""
    return datetime.now() + timedelta(days=random.randint(10, 100))


@seed.cli.command()
def leaderboard():
    """Seed the database."""
    fake = faker.Faker()
    github_usernames = [fake.user_name() for _ in range(50)]
    github_usernames[0] = "ricchen"
    github_usernames[1] = "azliu0"
    user_ids = [generate_user_id(username) for username in github_usernames]
    puzzle_names = list(PUZZLE_TABLE_METADATA.keys())

    for user_id in user_ids:
        # everyone solves the first puzzle
        n_p_u_0 = PuzzleUser(
            user_id=user_id,
            puzzle_name=puzzle_names[0],
            is_solved=True,
            earliest_correct_time=generate_random_future_date(),
            last_submission_time=generate_random_future_date(),
        )
        db.session.add(n_p_u_0)
        db.session.commit()

        for puzzle_name in puzzle_names[1:]:
            # other puzzles harder
            if random.random() < 0.1:
                n_p_u = PuzzleUser(
                    user_id=user_id,
                    puzzle_name=puzzle_name,
                    is_solved=True,
                    earliest_correct_time=generate_random_future_date(),
                    last_submission_time=generate_random_future_date(),
                )
                db.session.add(n_p_u)
                db.session.commit()


@seed.cli.command()
def reset():
    """Reset the database."""
    db.session.query(PuzzleUser).delete()
    db.session.commit()
