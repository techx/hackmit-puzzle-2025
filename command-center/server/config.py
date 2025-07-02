"""Configuration for the backend server.

Default values are necessary to pass ci-checks.
"""

import os
from pathlib import Path
from typing import cast

from dotenv import load_dotenv

load_dotenv(os.path.dirname(__file__) / Path("../.env"))
print("DATABASE_URL =", os.environ.get("DATABASE_URL"))


ENV = os.environ.get("ENVIRONMENT", "development")
SECRET_KEY = os.environ.get("SECRET_KEY", "secret")


def _get_config_option(
    name: str, default_value: str | None = None, required: bool = False
) -> str | None:
    if ENV == "production":
        value = os.environ.get(name, None)
        if value is None:
            raise Exception(
                f"Environment variable {name} not set. In production, "
                "every environment variable must be set."
            )
    else:
        value = os.environ.get(name, default_value)

    if required and value is None:
        raise Exception(f"Environment variable {name} is required but not set.")

    return value


# from flaskenv
FLASK_RUN_PORT = 2000
DEBUG = True

# CORS configuration
FRONTEND_URL = cast(str, _get_config_option("FRONTEND_URL", "http://localhost:5173"))
BACKEND_URL = cast(str, _get_config_option("BACKEND_URL", "http://localhost:2000"))
ALLOWED_DOMAINS = [FRONTEND_URL]

# Database
SQLALCHEMY_DATABASE_URI = _get_config_option(
    "DATABASE_URL", "postgresql://postgres@localhost/cmd"
)

# Github
GITHUB_CLIENT_ID = _get_config_option("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = _get_config_option("GITHUB_CLIENT_SECRET")

# Discord
DISCORD_WEBHOOK = cast(str, _get_config_option("DISCORD_WEBHOOK"))

# puzzle config
# this should have been done with a class-level config but it's fine

# EVAN_ADAM_PUZZLE_NAME = "Hexhunt"

IS_VERCEL = {
    "Chess": False,
    "LemonadeStand": False,
    "Romhack": True,
    "Jailbreak": False,
    "TripleTile": True,
    "PapasCipheria": True,
}

PUZZLE_SECRETS = {
    "Chess": cast(str, _get_config_option("CHESS_PUZZLE_SECRET")),
    "LemonadeStand": cast(str, _get_config_option("LEMON_PUZZLE_SECRET")),
    "Romhack": cast(str, _get_config_option("ROMHACK_PUZZLE_SECRET")),
    "Jailbreak": cast(str, _get_config_option("JAILBREAK_PUZZLE_SECRET")),
    "TripleTile": cast(str, _get_config_option("TRIPLE_PUZZLE_SECRET")),
    "PapasCipheria": cast(str, _get_config_option("PAPAS_PUZZLE_SECRET")),
}

PUZZLE_TABLE_METADATA = {
    "Chess": {"abbrv": "Ch", "url": "https://chess.hackmit.org"},
    "LemonadeStand": {"abbrv": "Ls", "url": "https://lemonade.hackmit.org"},
    "Romhack": {
        "abbrv": "Rh",
        "url": "https://romhack.hackmit.org",
    },
    "Jailbreak": {
        "abbrv": "Jb",
        "url": "https://jailbreak.hackmit.org",
    },
    "TripleTile": {
        "abbrv": "Tt",
        "url": "https://tripletile.hackmit.org",
    },
    "PapasCipheria": {"abbrv": "Pc", "url": "https://papas.hackmit.org"},
}

PUZZLE_FAILURE_MESSAGES = {
    "Chess": ["Incorrect"],
    "LemonadeStand": ["Incorrect"],
    "Romhack": ["Incorrect"],
    "Jailbreak": ["Incorrect"],
    "TripleTile": ["Incorrect"],
    "PapasCipheria": ["Incorrect"],
}

PUZZLE_CORRECT_MESSAGES = {
    "Chess": ["Correct!"],
    "LemonadeStand": ["Correct! Have some lemonade to go with your victory!"],
    "Romhack": ["Correct!"],
    "Jailbreak": ["Correct!"],
    "TripleTile": ["Correct!"],
    "PapasCipheria": ["Correct!"],
}
