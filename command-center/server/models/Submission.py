"""submission table model."""

import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column

from server import db


class Submission(db.Model):
    """Submission entity."""

    __tablename__ = "submission"

    id: Mapped[str] = mapped_column(
        primary_key=True,
        init=False,
        default=lambda: "su_" + str(uuid.uuid4()),
    )

    puzzle_name: Mapped[str] = mapped_column()
    user_id: Mapped[str] = mapped_column()
    is_correct: Mapped[bool] = mapped_column(Boolean)
    submission_text: Mapped[str] = mapped_column()

    submission_time: Mapped[datetime] = mapped_column(DateTime, default=datetime.now())
