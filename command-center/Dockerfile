# Use official Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy rest of app
COPY . .

# Default is sleep so container doesn't crash if db isn't ready
CMD ["sleep", "infinity"]
