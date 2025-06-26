#!/bin/bash
set -e

# Wait for backend to be ready
until getent hosts backend; do
  echo "Waiting for backend..."
  sleep 1
done

BACKEND_IP=$(getent hosts backend | awk '{ print $1 }')
echo "Resolved backend IP: $BACKEND_IP"

# Run websocat in background
websockify 4300 "$BACKEND_IP":5000 &
echo "Started websocket forwarding to $BACKEND_IP:5000"

# Start nginx in foreground
nginx -g 'daemon off;'