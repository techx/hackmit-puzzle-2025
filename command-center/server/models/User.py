"""user table model."""

import uuid
from datetime import datetime

from sqlalchemy import DateTime
from sqlalchemy.orm import Mapped, mapped_column

from server import db


class User(db.Model):
    """User entity.

    This isn't used in any routes, just to collect user data for analytics.
    """

    # "user" is reserved keyword i think
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(
        primary_key=True,
        init=False,
        default=lambda: "us_" + str(uuid.uuid4()),
    )

    github_username: Mapped[str] = mapped_column()
    hack_email: Mapped[str] = mapped_column(default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now())
