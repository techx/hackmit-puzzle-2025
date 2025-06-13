from flask import Flask, jsonify, render_template
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_caption', methods=['GET'])
def get_caption():
    # Placeholder caption - can be modified later
    caption = "VGhpcyBpcyBhIHBsYWNlaG9sZGVyIGNhcHRpb24="
    return jsonify({'caption': caption})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 