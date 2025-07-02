import hashlib
import os
from pathlib import Path
from flask import Flask, jsonify, render_template, request
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv(Path(__file__).parent.parent / ".env")

app = Flask(__name__)
CORS(app)

#### command center stuff ####

PUZZLE_SECRET = os.getenv("PAPAS_PUZZLE_SECRET")
SECRET_KEY = os.getenv("SECRET_KEY")

ANSWERS = {
    "1": os.getenv("ANSWER_1", ""),
    "2": os.getenv("ANSWER_2", ""),
    "3": os.getenv("ANSWER_3", ""),
    "4": os.getenv("ANSWER_4", ""),
    "5": os.getenv("ANSWER_PHASE1", ""),  
    "6": os.getenv("ANSWER_6", ""),
    "7": os.getenv("ANSWER_7", ""),
    "8": os.getenv("ANSWER_8", ""),
    "9": os.getenv("ANSWER_9", ""),
    "10": os.getenv("ANSWER_PHASE2", ""), 
    "FINAL": os.getenv("ANSWER_FINAL", "") 
}

def get_flag(user_id):
    return hashlib.sha256(
        f"{user_id}_{PUZZLE_SECRET}".encode("utf-8")
    ).hexdigest()


def verify_username(uname):
    if not uname:
        return False
    if '_' not in uname:
        return False
    parts = uname.split("_")
    if len(parts) != 2:
        return False
    return hashlib.sha256(
        f"{parts[0]}_{SECRET_KEY}".encode("utf-8")
    ).hexdigest()[:8] == parts[1]
    

#### api ####
@app.route("/api/answers", methods=["GET"])
def get_answers():
    return jsonify(ANSWERS)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/u/<user_id>')
def user_index(user_id):
    return render_template('index.html')

@app.route('/api/submit', methods=['POST'])
def submit_puzzle():
    """Submit endpoint."""
    print("submitting", user_id)
    body = request.get_json(force=True)
    print("body", body)
    if body is None:
        return jsonify({"solved": False, "message": "Invalid request"}), 400

    user_id = body.get("user", None)
    flag = body.get("flag", None)
    print("flag", flag, ANSWERS["FINAL"])
    if user_id is None or flag is None:
        return jsonify({"solved": False, "message": "Invalid request"}), 400

    print("herro", flag.strip().lower(), ANSWERS["FINAL"].strip().lower())
    if flag.strip().lower() == ANSWERS["FINAL"].strip().lower():
        print("yay in here")
        return jsonify(
            {
                "solved": True,
                "message": f"congrats! submit this code to the command center to "
                f"collect your points: {get_flag(user_id)}",
            }
        ), 200

    return jsonify({"solved": False, "message": "wrong"}), 400

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5103) 