#!/bin/bash

echo "🗄️  Connecting to PostgreSQL database..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Database: pulltabs"
echo "User: pulltabs_user"
echo "Type \\q to exit"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

docker-compose exec postgres psql -U pulltabs_user -d pulltabs