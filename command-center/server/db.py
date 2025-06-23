"""SQLAlchemy database + helpers.

Provides a SQLAlchemy instance and helper functions for initializing the database.
"""

from typing import Type, cast

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase, MappedAsDataclass


class Base(DeclarativeBase, MappedAsDataclass):
    """Base SQLAlchemy class. Don't use this class; use db.Model instead.

    Since we use Flask SQLAlchemy, this class shouldn't be used directly.
    Instead, use db.Model.
    """

    pass


class ProperlyTypedSQLAlchemy(SQLAlchemy):
    """Temporary type hinting workaround for Flask SQLAlchemy.

    This is a temporary workaround for the following issue:
    https://github.com/pallets-eco/flask-sqlalchemy/issues/1312
    This workaround may not be correct.
    """

    Model: Type[Base]


db = SQLAlchemy(model_class=Base)
db = cast(ProperlyTypedSQLAlchemy, db)


def init_db(db: ProperlyTypedSQLAlchemy):
    """Initializes the db.

    Calls db.create_all() and initializes global data like admin user.
    """
    db.create_all()
