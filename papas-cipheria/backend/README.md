# Papa's Cipheria Backend

A simple Flask backend for the Papa's Cipheria puzzle game that handles multiple users and flag generation.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create a `.env` file with the following variables:
```env
# Game Answers
ANSWER_PHASE1=polaris
ANSWER_PHASE2=2022
ANSWER_FINAL=kirsten carthew

# Security
PUZZLE_SECRET=your_super_secret_key_here_change_this_in_production
```

3. Run the server:
```bash
python app.py
```

The server will run on `http://localhost:5003`

## API Endpoints

### Health Check
- `GET /api/health` - Check if server is running

### Progress
- `GET /api/progress` - Get user's current progress

### Verification Endpoints
- `POST /api/verify-phase1` - Verify Phase 1 final challenge
- `POST /api/verify-phase2` - Verify Phase 2 final challenge  
- `POST /api/verify-final` - Verify final challenge and get flag

## User Identification

The backend supports multiple ways to identify users:
1. `X-User-ID` header in requests
2. `userId` query parameter
3. Falls back to "default_user" if none provided

## Flag Generation

Flags are generated using SHA256 hash of: `{user_id}_{PUZZLE_SECRET}_papas_cipheria_complete`

Each user gets a unique flag when they complete the game.

## Example Usage

```bash
# Check progress
curl "http://localhost:5003/api/progress?userId=player123"

# Verify Phase 1
curl -X POST "http://localhost:5003/api/verify-phase1" \
  -H "Content-Type: application/json" \
  -H "X-User-ID: player123" \
  -d '{"answer": "polaris"}'

# Verify final challenge and get flag
curl -X POST "http://localhost:5003/api/verify-final" \
  -H "Content-Type: application/json" \
  -H "X-User-ID: player123" \
  -d '{"answer": "kirsten carthew"}'
``` 