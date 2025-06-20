"""puzzle-user table model."""

import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import Boolean, DateTime, Integer
from sqlalchemy.orm import Mapped, mapped_column

from server import db


class PuzzleUser(db.Model):
    """Puzzle User combined entity."""

    __tablename__ = "puzzle_user"

    id: Mapped[str] = mapped_column(
        primary_key=True,
        init=False,
        default=lambda: "pu_" + str(uuid.uuid4()),
    )

    puzzle_name: Mapped[str] = mapped_column()
    user_id: Mapped[str] = mapped_column()

    earliest_correct_time: Mapped[datetime] = mapped_column(
        DateTime, default=None, nullable=True
    )
    last_submission_time: Mapped[datetime] = mapped_column(
        DateTime, default=None, nullable=True
    )
    is_solved: Mapped[bool] = mapped_column(Boolean, default=False)

    # evan and adam's puzzle has custom scoring
    evan_adam_score: Mapped[Optional[int]] = mapped_column(
        Integer, default=None, nullable=True
    )
