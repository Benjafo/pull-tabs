#!/bin/bash

echo "⚠️  WARNING: This will remove all data!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
read -p "Are you sure? (y/N): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️  Removing all containers and volumes..."
    docker-compose down -v
    
    echo "🧹 Cleaning up Docker system..."
    docker system prune -f
    
    echo "✅ Reset complete. Run './scripts/build.sh' to start fresh."
else
    echo "❌ Reset cancelled"
fi