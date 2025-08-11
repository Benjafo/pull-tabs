#!/bin/bash

echo "🔨 Starting fresh build..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Stop and remove existing containers
echo "📦 Stopping existing containers..."
docker-compose down

# Remove old images to ensure fresh build
echo "🗑️  Removing old images..."
docker-compose rm -f

# Build with no cache for clean build
echo "🔨 Building fresh images (no cache)..."
docker-compose build --no-cache

# Start services
echo "🚀 Starting services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be healthy..."
sleep 5

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Build complete! Services are running."
    echo ""
    echo "📍 Access points:"
    echo "   Server:   http://localhost:3002"
    echo "   Database: localhost:5433"
    echo ""
else
    echo "❌ Error: Services failed to start"
    docker-compose ps
    exit 1
fi

# Show logs
echo "📋 Showing logs (Ctrl+C to exit)..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
docker-compose logs -f