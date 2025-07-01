import hashlib
import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Game configuration from environment variables
ANSWER_PHASE1 = os.environ.get("ANSWER_PHASE1", "polaris")
ANSWER_PHASE2 = os.environ.get("ANSWER_PHASE2", "2022")
ANSWER_FINAL = os.environ.get("ANSWER_FINAL", "kirsten carthew")
PUZZLE_SECRET = os.environ.get("PUZZLE_SECRET", "default_secret_key")

# Store user progress (in production, use a database)
user_progress = {}

def get_user_id():
    """Extract user ID from request headers or query parameters"""
    # Try to get from headers first
    user_id = request.headers.get('X-User-ID')
    if user_id:
        return user_id
    
    # Fall back to query parameter
    user_id = request.args.get('userId')
    if user_id:
        return user_id
    
    # Generate a default user ID if none provided
    return "default_user"

def generate_flag(user_id):
    """Generate a unique flag for a user who completes the game"""
    flag_data = f"{user_id}_{PUZZLE_SECRET}_papas_cipheria_complete"
    return hashlib.sha256(flag_data.encode("utf-8")).hexdigest()

def verify_answer(user_answer, correct_answer):
    """Verify if user's answer matches the correct answer (case insensitive)"""
    return user_answer.lower().strip() == correct_answer.lower().strip()

@app.route('/api/verify-phase1', methods=['POST'])
def verify_phase1():
    """Verify Phase 1 final challenge answer"""
    user_id = get_user_id()
    data = request.get_json()
    user_answer = data.get('answer', '')
    
    if verify_answer(user_answer, ANSWER_PHASE1):
        # Initialize user progress if not exists
        if user_id not in user_progress:
            user_progress[user_id] = {'phase1_complete': False, 'phase2_complete': False, 'game_complete': False}
        
        user_progress[user_id]['phase1_complete'] = True
        return jsonify({
            'success': True,
            'message': 'Phase 1 completed!',
            'phase1_complete': True
        })
    else:
        return jsonify({
            'success': False,
            'message': 'Incorrect answer. Try again!'
        }), 400

@app.route('/api/verify-phase2', methods=['POST'])
def verify_phase2():
    """Verify Phase 2 final challenge answer"""
    user_id = get_user_id()
    data = request.get_json()
    user_answer = data.get('answer', '')
    
    # Check if user completed phase 1
    if user_id not in user_progress or not user_progress[user_id].get('phase1_complete'):
        return jsonify({
            'success': False,
            'message': 'Complete Phase 1 first!'
        }), 400
    
    if verify_answer(user_answer, ANSWER_PHASE2):
        user_progress[user_id]['phase2_complete'] = True
        return jsonify({
            'success': True,
            'message': 'Phase 2 completed!',
            'phase2_complete': True
        })
    else:
        return jsonify({
            'success': False,
            'message': 'Incorrect answer. Try again!'
        }), 400

@app.route('/api/verify-final', methods=['POST'])
def verify_final():
    """Verify final challenge answer and generate flag"""
    user_id = get_user_id()
    data = request.get_json()
    user_answer = data.get('answer', '')
    
    # Check if user completed both phases
    if user_id not in user_progress or not user_progress[user_id].get('phase1_complete') or not user_progress[user_id].get('phase2_complete'):
        return jsonify({
            'success': False,
            'message': 'Complete both phases first!'
        }), 400
    
    if verify_answer(user_answer, ANSWER_FINAL):
        user_progress[user_id]['game_complete'] = True
        flag = generate_flag(user_id)
        return jsonify({
            'success': True,
            'message': 'Congratulations! You completed the game!',
            'game_complete': True,
            'flag': flag
        })
    else:
        return jsonify({
            'success': False,
            'message': 'Incorrect answer. Try again!'
        }), 400

@app.route('/api/progress', methods=['GET'])
def get_progress():
    """Get user's current progress"""
    user_id = get_user_id()
    
    if user_id not in user_progress:
        user_progress[user_id] = {'phase1_complete': False, 'phase2_complete': False, 'game_complete': False}
    
    return jsonify({
        'user_id': user_id,
        'progress': user_progress[user_id]
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Papa\'s Cipheria Backend is running!'
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5003) 