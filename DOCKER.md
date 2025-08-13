# Docker Setup Guide

## Prerequisites

- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- Docker Compose v2+

## Quick Start

```bash
# 1. Clone the repository
git clone <repository-url>
cd pull-tabs

# 2. Make scripts executable (Linux/Mac)
chmod +x scripts/*.sh

# 3. Build and start everything
./scripts/build.sh
```

The application will be available at:

- **Server**: http://localhost:3001
- **Database**: localhost:5432

## Development Workflow

### Daily Commands

```bash
# Start the application
./scripts/start.sh

# View logs
./scripts/logs.sh          # All services
./scripts/logs.sh server    # Server only
./scripts/logs.sh postgres  # Database only

# Stop the application
./scripts/stop.sh

# Restart services (preserves data)
./scripts/restart.sh
```

### Building & Testing

```bash
# Fresh rebuild (no cache)
./scripts/build.sh

# Complete dev environment setup
./scripts/dev.sh

# Run tests
./scripts/test.sh           # All tests
./scripts/test.sh auth      # Specific test pattern
```

### Database Access

```bash
# Access PostgreSQL CLI
./scripts/db.sh

# Common database commands:
\dt              # List tables
\d users         # Describe users table
SELECT * FROM users;
\q               # Exit
```

### Debugging

```bash
# Access server container shell
./scripts/shell.sh

# Inside container:
npm run typecheck    # Check TypeScript
npm run lint         # Run linter
npm test            # Run tests
exit                # Leave container
```

### Maintenance

```bash
# Complete reset (removes all data!)
./scripts/reset.sh
```

## Architecture

```
┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │
│  Node.js Server │────▶│   PostgreSQL    │
│   (port 3001)   │     │   (port 5432)   │
│                 │     │                 │
└─────────────────┘     └─────────────────┘
      ▲                          ▲
      │                          │
      └──────────┬───────────────┘
                 │
         Docker Network
```

## Database Schema

- **users**: User accounts and authentication
- **game_boxes**: 500-ticket game boxes with winner distribution
- **tickets**: Individual tickets with symbols and payouts
- **user_statistics**: Gameplay statistics and history

## Environment Variables

Docker uses environment variables from `docker-compose.yml`:

- `DB_HOST=postgres` - Database container name
- `DB_PORT=5432` - PostgreSQL port
- `DB_NAME=pulltabs` - Database name
- `DB_USER=pulltabs_user` - Database user
- `JWT_SECRET` - JWT signing key

## Troubleshooting

### Services won't start

```bash
# Check service status
docker-compose ps

# View detailed logs
docker-compose logs

# Reset everything
./scripts/reset.sh
./scripts/build.sh
```

### Database connection issues

```bash
# Check if database is healthy
docker-compose ps postgres

# View database logs
./scripts/logs.sh postgres

# Manually connect to database
docker-compose exec postgres psql -U postgres
```

### Port conflicts

If ports 3001 or 5432 are already in use:

1. Stop conflicting services, or
2. Change ports in `docker-compose.yml`:

```yaml
ports:
  - "3001:3001" # Change external port
```

### Permission issues (Linux)

```bash
# Fix script permissions
chmod +x scripts/*.sh

# Fix Docker socket permissions
sudo usermod -aG docker $USER
# Log out and back in
```

## Production Deployment

For production, create `docker-compose.prod.yml` with:

- Production database credentials
- SSL/TLS configuration
- Optimized build settings
- Health monitoring
- Backup volumes

## Clean Up

To completely remove Docker resources:

```bash
# Remove project containers and volumes
./scripts/reset.sh

# Remove all unused Docker resources
docker system prune -a
```
