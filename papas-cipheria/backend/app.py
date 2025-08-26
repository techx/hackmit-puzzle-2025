import hashlib
import os
from pathlib import Path
from flask import Flask, jsonify, render_template, request
from flask_cors import CORS
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv(Path(__file__).parent.parent / ".env")

STATIC_FOLDER = "../dist"

app = Flask(
    __name__,
    static_folder=STATIC_FOLDER,
    template_folder=STATIC_FOLDER,
    static_url_path="",
)

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
    logging.warning("get_flag called with user_id: %r", user_id)
    # logging.warning("get_flag input: %r", hash_input)
    logging.warning(
        "get flag=%s",
        hashlib.sha256(f"{user_id}_{PUZZLE_SECRET}".encode("utf-8")).hexdigest()
    )
    logging.warning("get_flag: hashing %r", f"{user_id}_{PUZZLE_SECRET}")
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
@app.route('/')
def index():
    return app.send_static_file("index.html")
    # return render_template('index.html')

@app.route('/u/<user_id>')
def user_index(user_id):
    return app.send_static_file("index.html")
    # return render_template('index.html')

@app.route('/api/submit', methods=['POST'])
def submit_puzzle():
    """Submit endpoint."""
    body = request.get_json(force=True)
    if body is None:
        return jsonify({"solved": False, "message": "Invalid request"}), 400

    user_id = body.get("user", None)
    flag = body.get("flag", None)
    if user_id is None or flag is None:
        return jsonify({"solved": False, "message": "Invalid request"}), 400
    
    print(f"FLAG from user: '{flag.strip().lower()}'")
    print(f"EXPECTED: '{ANSWERS['FINAL'].strip().lower()}'")

    if flag.strip().lower() == ANSWERS["FINAL"].strip().lower():
        # print("yay in here")
        return jsonify(
            {
                "solved": True,
                "message": f"congrats! submit this code to the command center to "
                f"collect your points: {get_flag(user_id)}",
            }
        ), 200

    return jsonify({"solved": False, "message": "wrong"}), 400

@app.route('/api/check_answer', methods=['POST'])
def check_answer():
    """Check if a customer's answer is correct."""
    body = request.get_json(force=True)
    if body is None:
        return jsonify({"correct": False, "message": "Invalid request"}), 400

    customer_id = body.get("customerId", None)
    answer = body.get("answer", None)
    
    if customer_id is None or answer is None:
        return jsonify({"correct": False, "message": "Invalid request"}), 400

    customer_id_str = str(customer_id)
    if customer_id_str not in ANSWERS:
        return jsonify({"correct": False, "message": "Customer not found"}), 400

    expected_answer = ANSWERS[customer_id_str]
    if not expected_answer:
        return jsonify({"correct": False, "message": "No answer registered for this customer"}), 400

    is_correct = answer.strip().lower() == expected_answer.strip().lower()
    
    return jsonify({
        "correct": is_correct,
        "message": "Correct!" if is_correct else "Try again!"
    }), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5103) 
