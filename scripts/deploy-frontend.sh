#!/bin/bash

echo "🎨 Deploying Frontend (React App)..."

# Set API URL (default or from argument)
export VITE_API_URL=${1:-http://localhost:8080}

echo "   API URL: $VITE_API_URL"

# Build and start frontend
docker-compose -f docker-compose.frontend.yml up -d --build

echo "⏳ Waiting for frontend to start..."
sleep 5

# Check if frontend is running
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend deployed successfully!"
    echo "   URL: http://localhost:3000"
else
    echo "❌ Frontend deployment failed"
    echo "   Check logs: docker-compose -f docker-compose.frontend.yml logs"
    exit 1
fi
