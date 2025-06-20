import hashlib
import os
import base64

from flask import Flask, jsonify, render_template, request
from flask_cors import CORS

from make_puzzle.construct_puzzle import get_ciphertext

app = Flask(__name__)
CORS(app)

#### command center stuff ####

PUZZLE_SECRET = os.getenv("PUZZLE_SECRET") # TODO: fix these based on true config
SECRET_KEY = os.getenv("SECRET_KEY") # TODO: fix these based on true config

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
    # padding_length = len(FULL_GAME_PGN) - (len(INSTRUCTION) + len("_Submit this token: ") + len(flag))
    # full_plaintext = f"{INSTRUCTION}" + "_" * padding_length + f"Submit this token: {flag}"
    
    # # Base64 encode FULL_GAME_PGN
    # encoded_pgn = base64.b64encode(FULL_GAME_PGN.encode('utf-8')).decode('utf-8')
    
    # # Base64 encode full_plaintext
    # encoded_plaintext = base64.b64encode(full_plaintext.encode('utf-8')).decode('utf-8')
    
    # # XOR the two base64 encoded strings
    # ciphertext = ""
    # for i in range(len(encoded_pgn)):
    #     if i < len(encoded_plaintext):
    #         ciphertext += chr(ord(encoded_pgn[i]) ^ ord(encoded_plaintext[i]))
    #     else:
    #         ciphertext += encoded_pgn[i]
    
    # return full_plaintext

#### api ####

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_caption', methods=['GET'])
def get_caption_endpoint():
    user_id = request.args.get("userId", "default_user")
    caption = get_caption(user_id)
    return jsonify({'caption': caption})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5003) 