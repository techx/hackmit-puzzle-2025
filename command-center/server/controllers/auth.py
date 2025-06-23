"""Authentication API endpoints."""

from apiflask import APIBlueprint
from authlib.integrations.flask_client import OAuth
from flask import redirect, session, url_for
from sqlalchemy import select

from server import db
from server.config import FRONTEND_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET
from server.models.User import User
from server.utils import generate_user_id

auth = APIBlueprint("auth", __name__, url_prefix="/api/auth", tag="Auth")

oauth = OAuth()

github = oauth.register(
    name="github",
    client_id=GITHUB_CLIENT_ID,
    client_secret=GITHUB_CLIENT_SECRET,
    access_token_url="https://github.com/login/oauth/access_token",
    authorize_url="https://github.com/login/oauth/authorize",
    api_base_url="https://api.github.com",
    client_kwargs={"scope": "user:email"},
)


@auth.get("/login")
def login():
    """Login endpoint."""
    github = oauth.create_client("github")
    redirect_uri = url_for("auth.authorize", _external=True)
    return github.authorize_redirect(redirect_uri)  # type: ignore


@auth.route("/login/github/authorize")
def authorize():
    """Authorize with Github."""
    github = oauth.create_client("github")
    _ = github.authorize_access_token()  # type: ignore
    user_info = github.get("user").json()  # type: ignore
    user_id = generate_user_id(user_info["login"])
    u = (
        db.session.execute(
            select(User).where(User.github_username == user_info["login"])
        )
        .scalars()
        .first()
    )
    if u is None:
        u = User(
            github_username=user_info["login"],
        )
        db.session.add(u)
        db.session.commit()
    session["user"] = user_info
    session["user"]["hack_email"] = u.hack_email
    return redirect(f"{FRONTEND_URL}/u/{user_id}")


@auth.get("/whoami")
def whoami():
    """Whoami endpoint."""
    if "user" not in session:
        return {"loggedIn": False}
    return {
        "loggedIn": True,
        "user": session["user"]["login"],
        "user_id": generate_user_id(session["user"]["login"]),
        "hack_email": session["user"].get("hack_email", ""),
    }


@auth.get("/logout")
def logout():
    """Logout endpoint."""
    session.clear()
    return redirect(FRONTEND_URL)
