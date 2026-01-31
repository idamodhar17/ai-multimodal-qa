FROM python:3.11-slim

WORKDIR /app

# System deps
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app
COPY . .

# Cloud Run listens on 8080
EXPOSE 8080

CMD exec uvicorn app.main:app \
  --host 0.0.0.0 \
  --port ${PORT:-8080}
