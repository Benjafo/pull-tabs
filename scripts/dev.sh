#!/bin/bash

echo "🚀 Starting development environment..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "📊 Ensuring database is ready..."
docker-compose exec server npm run typecheck

# Check everything is working
if docker-compose ps | grep -q "Up"; then
    echo "✅ Development environment ready!"
    echo ""
    echo "📍 Services:"
    echo "   Server:   http://localhost:3001"
    echo "   Database: localhost:5432"
    echo ""
    echo "🔨 Development commands:"
    echo "   Logs:     ./scripts/logs.sh"
    echo "   Tests:    ./scripts/test.sh"
    echo "   DB CLI:   ./scripts/db.sh"
    echo "   Shell:    ./scripts/shell.sh"
    echo ""
    echo "📋 Following server logs..."
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    docker-compose logs -f server
else
    echo "❌ Error: Services failed to start"
    docker-compose ps
    docker-compose logs
    exit 1
fi