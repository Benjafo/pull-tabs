#!/bin/bash

echo "🚀 Starting Pull Tabs application..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Start services (will build if needed)
docker-compose up -d

# Wait for health checks
echo "⏳ Waiting for services..."
sleep 3

# Check status
if docker-compose ps | grep -q "Up"; then
    echo "✅ Application started successfully!"
    echo ""
    echo "📍 Access points:"
    echo "   Server:   http://localhost:3001"
    echo "   Database: localhost:5432"
    echo ""
    echo "💡 Tips:"
    echo "   View logs:    ./scripts/logs.sh"
    echo "   Stop app:     ./scripts/stop.sh"
    echo "   Run tests:    ./scripts/test.sh"
    echo "   Access DB:    ./scripts/db.sh"
else
    echo "❌ Error: Failed to start services"
    docker-compose ps
    exit 1
fi