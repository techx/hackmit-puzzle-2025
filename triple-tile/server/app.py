import os
import hashlib
from pathlib import Path
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import dotenv_values, load_dotenv

# Load secrets from .env file (adjust path if needed)
env_path = Path(__file__).resolve().parents[2] / "command-center" / ".env"
load_dotenv(dotenv_path=env_path, override=True)  

app = Flask(__name__)
CORS(app)

# Load the puzzle-specific secret and global secret key
env = dotenv_values(env_path)
PUZZLE_SECRET = os.getenv("TRIPLE_PUZZLE_SECRET")
SECRET_KEY = os.getenv("SECRET_KEY")
# const FLAG = "FORESTTMPL";

print(PUZZLE_SECRET, SECRET_KEY)
if not PUZZLE_SECRET or not SECRET_KEY:
    raise ValueError("TRIPLE_PUZZLE_SECRET or SECRET_KEY not set in .env")


# Verifies a userId of the form "name_hash"
def verify_username(user_id):
    if not user_id or "_" not in user_id:
        return False
    parts = user_id.split("_")
    if len(parts) != 2:
        return False
    name, suffix = parts
    expected = hashlib.sha256(f"{name}_{SECRET_KEY}".encode("utf-8")).hexdigest()[:8]
    return expected == suffix

# Generates a personalized flag
def get_flag(user_id):
    print("HIII", user_id)
    return hashlib.sha256(f"{user_id}_{SECRET_KEY}".encode("utf-8")).hexdigest()

# POST endpoint to serve hashed flag
@app.route("/get_triple_flag", methods=["POST"])
def serve_triple_flag():
    data = request.get_json()
    user_id = data.get("userId")

    if not verify_username(user_id):
        return jsonify({"error": "Invalid or missing user ID"}), 403

    # flag = get_flag(user_id)
    return jsonify({"flag": PUZZLE_SECRET})

@app.route("/api/submit", methods=["POST"])
def submit_puzzle():
    """Submit endpoint."""
    body = request.json
    if body is None:
        return jsonify({"solved": False, "message": "Invalid request"}), 400

    user_id = body.get("user", None)
    flag = body.get("flag", None)

    if user_id is None or flag is None:
        return jsonify({"solved": False, "message": "Invalid request"}), 400

    # this kinda defeats the purpose of the user hashing but it's fine
    print("hi", flag, PUZZLE_SECRET)
    if flag.strip().lower() == PUZZLE_SECRET.strip().lower():
        return jsonify(
            {
                "solved": True,
                "message": f"congrats! submit this code to the command center to "
                f"collect your points: {get_flag(user_id)}",
            }
        ), 200
    return jsonify({"solved": False, "message": "wrong"}), 400


# Root fallback (optional for frontend routing)
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def catch_all(path):
    return jsonify({"message": "Triple Tile backend is running."})

# Run server
if __name__ == "__main__":
    app.run(debug=True, port=2007)