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

EVAN_ADAM_PUZZLE_NAME = "Hexhunt"

IS_VERCEL = {
    "Twister": False,
    "Hexhunt": False,
    "Library": False,
    "Wodou": True,
    "😈 Connections 😈": True,
    "Curseword": False,
    "PapasCipheria": False,
}

PUZZLE_SECRETS = {
    "Twister": cast(str, _get_config_option("TWISTER_PUZZLE_SECRET")),
    "Hexhunt": cast(str, _get_config_option("HEXHUNT_PUZZLE_SECRET")),
    "Library": cast(str, _get_config_option("LIBRARY_PUZZLE_SECRET")),
    "Wodou": cast(str, _get_config_option("WODOU_PUZZLE_SECRET")),
    "😈 Connections 😈": cast(str, _get_config_option("CONNECTIONS_PUZZLE_SECRET")),
    "Curseword": cast(str, _get_config_option("CURSEWORD_PUZZLE_SECRET")),
    "PapasCipheria": cast(str, _get_config_option("PAPAS_PUZZLE_SECRET")),
}

PUZZLE_TABLE_METADATA = {
    "Twister": {"abbrv": "Tw", "url": "https://twister.hackmit.org"},
    "Hexhunt": {"abbrv": "Hx", "url": "https://hexhunt.hackmit.org"},
    "Library": {
        "abbrv": "Lib",
        "url": "https://library.hackmit.org",
    },
    "Wodou": {
        "abbrv": "Wo",
        "url": "https://wodou.hackmit.org",
    },
    "😈 Connections 😈": {"abbrv": "Con", "url": "https://connections.hackmit.org"},
    "Curseword": {
        "abbrv": "Crw",
        "url": "https://curseword.hackmit.org",
    },
    "PapasCipheria": {"abbrv": "Pc", "url": "https://papas-cipheria.hackmit.org"},

}

PUZZLE_FAILURE_MESSAGES = {
    "Twister": [
        "wrong 🐦",
        "did you try answering every question? 🤔",
    ],
    "Hexhunt": ["Incorrect"],
    "Library": ["Incorrect"],
    "Wodou": ["Press Enter to restart"],
    "😈 Connections 😈": [
        "😈😈😈😈😈😈😈😈",
        "tomorrow is always a new day 🥱",
        "one fish two fish four fish eight fish",
    ],
    "Curseword": [
        "Incorrect flag",
        "Did you try Googling?",
        "Some answers are easier than others",
    ],
    "PapasCipheria": [
        "wrong 🐦",
        "did you try answering every question? 🤔",
    ],
}

PUZZLE_CORRECT_MESSAGES = {
    "Twister": ["Correct!"],
    "Hexhunt": [
        "Correct!! However, the challenge might not be over yet. "
        "The number of points you receive depends on the number of "
        "people who match or beat your result. We encourage you to keep "
        "refining your solution and aim for the highest possible score. "
        "Feel free to resubmit to improve your ranking. Best of luck!"
    ],
    "Library": ["Correct!"],
    "Wodou": ["Correct!"],
    "😈 Connections 😈": ["🤑🤑🤑🤑nice one 🤑🤑🤑🤑"],
    "Curseword": ["Correct!"],
    "PapasCipheria": ["Correct!"],
}
