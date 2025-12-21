#!/bin/bash

MODE=${1:-prod}

if [ "$MODE" = "dev" ]; then
    echo "🔧 Starting DEVELOPMENT mode (with local PostgreSQL & Redis)..."
    docker-compose --profile dev up -d
    echo ""
    echo "✅ Development services started:"
    echo "  - Backend: http://localhost:8080"
    echo "  - Frontend: http://localhost:3000"
    echo "  - PostgreSQL: localhost:5432"
    echo "  - Redis: localhost:6379"
else
    echo "🚀 Starting PRODUCTION mode (with Neon & Upstash)..."
    docker-compose up -d
    echo ""
    echo "⏳ Waiting for services..."
    sleep 5
    echo ""
    echo "🏥 Checking health..."
    curl -s http://localhost:8080/health | jq
    echo ""
    echo "✅ Production services started:"
    echo "  - Backend: http://localhost:8080"
    echo "  - Frontend: http://localhost:3000"
    echo "  - Database: Neon PostgreSQL"
    echo "  - Cache: Upstash Redis"
fi

echo ""
echo "📝 View logs: docker-compose logs -f"
echo "🛑 Stop: docker-compose down"
