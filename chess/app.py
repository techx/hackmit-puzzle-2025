import hashlib
from dotenv import load_dotenv
import os

from flask import Flask, jsonify, render_template, request
from flask_cors import CORS

from make_puzzle.encode_puzzle import get_ciphertext

app = Flask(__name__, static_folder='assets', static_url_path='/assets')
CORS(app)

load_dotenv("../.env")

#### command center stuff ####

PUZZLE_SECRET = os.getenv("CHESS_PUZZLE_SECRET")
SECRET_KEY = os.getenv("SECRET_KEY")

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
    
    
#### puzzle stuff ####

def get_caption(user_id):
    flag = get_flag(user_id)
    return get_ciphertext(flag)

#### api ####

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/u/<user_id>')
def user_index(user_id):
    return render_template('index.html')

@app.route('/get_caption', methods=['GET'])
def get_caption_endpoint():
    user_id = request.args.get("userId")

    if not user_id or not verify_username(user_id):
        return jsonify({"error": "invalid_user"}), 403

    caption = get_caption(user_id)
    return jsonify({'caption': caption})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5003)
