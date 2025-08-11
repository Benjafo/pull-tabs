#!/bin/bash

# Default to showing all logs
SERVICE=${1:-""}

if [ -z "$SERVICE" ]; then
    echo "📋 Showing logs for all services (Ctrl+C to exit)..."
    echo "💡 Tip: Use './scripts/logs.sh server' or './scripts/logs.sh postgres' for specific service"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    docker-compose logs -f --tail=100
else
    echo "📋 Showing logs for $SERVICE (Ctrl+C to exit)..."
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    docker-compose logs -f --tail=100 $SERVICE
fi