# Docker Scripts

Quick reference for development scripts:

## Building & Testing

- `./scripts/build.sh` - Fresh build with no cache
- `./scripts/dev.sh` - Complete dev environment setup
- `./scripts/test.sh [pattern]` - Run tests (optional: test pattern)

## Database & Debugging

- `./scripts/db.sh` - Access PostgreSQL CLI
- `./scripts/shell.sh` - Access server container shell

## Maintenance

- `./scripts/reset.sh` - ⚠️ Remove all data and containers

## Examples

```bash
# Complete rebuild
./scripts/build.sh

# Start development
./scripts/dev.sh

# Run specific tests
./scripts/test.sh auth
```
