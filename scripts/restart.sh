#!/bin/bash

echo "🔄 Restarting Pull Tabs application..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Stop services
echo "🛑 Stopping services..."
docker-compose stop

# Start services again
echo "🚀 Starting services..."
docker-compose start

# Check status
sleep 2
if docker-compose ps | grep -q "Up"; then
    echo "✅ Services restarted successfully!"
else
    echo "❌ Error: Services failed to restart"
    docker-compose ps
    exit 1
fi

# Follow logs
echo "📋 Showing logs (Ctrl+C to exit)..."
docker-compose logs -f