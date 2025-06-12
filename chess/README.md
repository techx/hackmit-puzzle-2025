# Chess Cipher Web App

A minimal client-server web application with Flask backend and HTML frontend for displaying ciphertext.

## Features

- Simple web interface with automatic ciphertext loading
- Flask backend that serves ciphertext via REST API
- Clean, responsive design

## Setup and Running

### Prerequisites

- Python 3.7+
- pip

### Installation

1. Create and activate a virtual environment:

```bash
# Create virtual environment
python -m venv venv

# Activate it (macOS/Linux)
source venv/bin/activate

# Activate it (Windows)
venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

### Running the Application

1. Make sure your virtual environment is activated:

```bash
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate     # Windows
```

2. Start the Flask server:

```bash
python app.py
```

3. Open your browser and navigate to:

```
http://localhost:5000
```

The ciphertext will load automatically when the page opens.

## API Endpoints

- `GET /` - Serves the main web interface
- `GET /get_ciphertext` - Returns JSON with ciphertext

## Development

The app runs in debug mode by default. Any changes to the Python code will automatically restart the server.
