#!/bin/bash

echo "🚀 Deploying Production Stack with Neon & Upstash..."

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "❌ .env.production not found!"
    exit 1
fi

# Build and start services
echo "📦 Building Docker images..."
docker-compose -f docker-compose.production.yml build

echo "🔄 Starting services..."
docker-compose -f docker-compose.production.yml up -d

echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check backend health
echo "🏥 Checking backend health..."
curl -f http://localhost:8080/health || echo "⚠️  Backend health check failed"

echo "✅ Deployment complete!"
echo ""
echo "📊 Service Status:"
docker-compose -f docker-compose.production.yml ps
echo ""
echo "📝 View logs:"
echo "  Backend:  docker-compose -f docker-compose.production.yml logs -f backend"
echo "  Frontend: docker-compose -f docker-compose.production.yml logs -f frontend"
