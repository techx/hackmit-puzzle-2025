from flask import Flask, jsonify, render_template
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_ciphertext', methods=['GET'])
def get_ciphertext():
    # Placeholder ciphertext - can be modified later
    ciphertext = "VGhpcyBpcyBhIHBsYWNlaG9sZGVyIGNpcGhlcnRleHQ="
    return jsonify({'ciphertext': ciphertext})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 