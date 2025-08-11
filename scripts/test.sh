#!/bin/bash

echo "🧪 Running tests..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if server is running
if ! docker-compose ps | grep pulltabs-server | grep -q "Up"; then
    echo "⚠️  Server not running. Starting services..."
    docker-compose up -d
    sleep 5
fi

# Run tests
if [ -z "$1" ]; then
    echo "Running all tests..."
    docker-compose exec server npm test
else
    echo "Running tests matching: $1"
    docker-compose exec server npm test -- --testPathPattern="$1"
fi