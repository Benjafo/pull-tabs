# Railway Deployment Guide

## Overview
This application is configured for deployment on Railway with a PostgreSQL database, Node.js/Express backend, and React/Vite frontend.

## Prerequisites
1. Railway account (sign up at railway.app)
2. GitHub repository connected to Railway

## Deployment Steps

### 1. Create Railway Project
1. Log into Railway Dashboard
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your pull-tabs repository

### 2. Set Up Services

#### PostgreSQL Database
1. In Railway project, click "New" → "Database" → "Add PostgreSQL"
2. Railway will automatically provision a PostgreSQL instance
3. Note the DATABASE_URL (automatically available to your services)

#### Backend Service (Server)
1. Click "New" → "GitHub Repo" → Select your repo
2. Set the root directory to `/server`
3. Railway will detect Node.js and use the railway.json configuration

#### Frontend Service (Client)  
1. Click "New" → "GitHub Repo" → Select your repo again
2. Set the root directory to `/client`
3. Railway will use the client/railway.json configuration

### 3. Environment Variables

#### Backend Service Variables
Set these in the Railway backend service settings:

```env
NODE_ENV=production
JWT_SECRET=your-secure-jwt-secret-min-32-chars
JWT_EXPIRES_IN=24h
CLIENT_URL=https://your-frontend-domain.railway.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

Note: DATABASE_URL is automatically provided by Railway when you connect the PostgreSQL service.

#### Frontend Service Variables
Set these in the Railway frontend service settings:

```env
VITE_API_URL=https://your-backend-domain.railway.app
```

### 4. Service Configuration

#### Connect Services
1. In each service settings, go to "Variables"
2. For backend: Reference the PostgreSQL database to get DATABASE_URL
3. For frontend: Set VITE_API_URL to your backend's public URL

#### Domain Setup
1. Each service gets a generated railway.app domain
2. You can add custom domains in service settings
3. Update CLIENT_URL and VITE_API_URL accordingly

### 5. Database Migrations

After first deployment, you may need to run migrations:

1. Open backend service in Railway
2. Go to "Settings" → "Deploy" 
3. Add a one-time start command: `npm run migrate && npm start`
4. After migration completes, revert to normal start command

### 6. Monitoring

- Check deployment logs in Railway dashboard
- Monitor service health at `/health` endpoint
- Database metrics available in PostgreSQL service

## Project Structure

```
pull-tabs/
├── railway.json          # Root monorepo config
├── nixpacks.toml        # Build configuration
├── client/
│   ├── railway.json     # Frontend service config
│   └── .env.production  # Production env placeholder
└── server/
    └── railway.json     # Backend service config
```

## Important Notes

1. **Database SSL**: Production database connections use SSL (configured in database.ts)
2. **CORS**: Ensure CLIENT_URL matches your frontend domain
3. **Port**: Railway provides PORT environment variable automatically
4. **Build Commands**: Defined in railway.json files for each service
5. **Static Files**: Frontend uses `serve` package for production

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL is available in backend service
- Check SSL settings in database configuration
- Ensure PostgreSQL service is running

### CORS Errors
- Verify CLIENT_URL environment variable matches frontend URL
- Check that credentials are included in API requests

### Build Failures
- Check TypeScript compilation errors
- Verify all dependencies are in package.json
- Review Railway build logs for specific errors

### Environment Variables Not Working
- Ensure variables are set in correct service
- Restart service after changing variables
- Use Railway CLI to verify: `railway variables`

## Local Development vs Production

| Setting | Local Development | Railway Production |
|---------|------------------|-------------------|
| Database | Local PostgreSQL | Railway PostgreSQL (DATABASE_URL) |
| Backend URL | http://localhost:3001 | https://backend.railway.app |
| Frontend URL | http://localhost:5173 | https://frontend.railway.app |
| SSL | Disabled | Enabled |
| NODE_ENV | development | production |