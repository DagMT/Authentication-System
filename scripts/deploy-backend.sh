#!/bin/bash

echo "🚀 Deploying Backend (Go API + PostgreSQL + Redis)..."

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Build and start backend services
docker-compose -f docker-compose.backend.yml up -d --build

echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check health
if curl -s http://localhost:8080/health > /dev/null 2>&1; then
    echo "✅ Backend deployed successfully!"
    echo "   API: http://localhost:8080"
    echo "   Health: http://localhost:8080/health"
else
    echo "❌ Backend health check failed"
    echo "   Check logs: docker-compose -f docker-compose.backend.yml logs"
    exit 1
fi
