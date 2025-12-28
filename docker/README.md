# Docker Setup for Up-Site Turborepo

This Docker setup uses Turborepo's pruning strategy for optimal build caching and minimal image sizes.

## Architecture

The setup includes the following services:

- **postgres**: PostgreSQL database (v16)
- **redis**: Redis cache (v7)
- **migrator**: Runs Prisma migrations on startup
- **server**: Express backend API (Bun)
- **producer**: Redis stream producer (Bun)
- **consumer**: Redis stream consumer (Bun)
- **notifier**: Email notification service (Bun)
- **alert-worker**: Alert processing worker (Bun)
- **web**: Next.js frontend (Node.js)

## Prerequisites

1. Ensure you have a `.env` file in the root with all required environment variables:

```env
# Database
DATABASE_URL=postgresql://postgres:yourpassword@postgres:5432/upsite
POSTGRES_USER=postgres
POSTGRES_PASSWORD=yourpassword
POSTGRES_DB=upsite

# Redis
REDIS_URL=redis://redis:6379

# JWT
JWT_SECRET=your-secret-key

# API
NEXT_PUBLIC_API_URL=http://localhost:8080

# Email (Resend)
RESEND_API_KEY=your-resend-api-key
```

## Building and Running

### Build all services

```bash
docker-compose build
```

### Start all services

```bash
docker-compose up
```

### Start in detached mode

```bash
docker-compose up -d
```

### View logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f server
```

### Stop all services

```bash
docker-compose down
```

### Stop and remove volumes (clean slate)

```bash
docker-compose down -v
```

## Service Order

The services start in this order:

1. **postgres** and **redis** (infrastructure)
2. **migrator** (runs Prisma migrations)
3. **server**, **producer**, **consumer**, **notifier**, **alert-worker** (backend services)
4. **web** (frontend)

## Prisma Migrations

The `migrator` service automatically runs `prisma migrate deploy` when the stack starts. This ensures the database schema is up to date before any application services start.

## Turborepo Pruning

Each Dockerfile uses `turbo prune <app> --docker` to create a minimal context containing:

- Only the dependencies needed for that specific app
- A pruned lockfile
- Shared packages (like `db`, `redis-streams`)

This results in:
- Faster builds (only rebuild what changed)
- Smaller images (only include necessary dependencies)
- Better layer caching

## Development vs Production

For development, continue using:
```bash
bun run dev
```

This Docker setup is optimized for production deployments.

## Accessing Services

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- PostgreSQL: localhost:5432
- Redis: localhost:6379

## Troubleshooting

### Migrations fail

If migrations fail, check:
1. DATABASE_URL is correctly set
2. PostgreSQL is healthy: `docker-compose ps postgres`
3. Run migrations manually: `docker-compose run migrator`

### Service won't start

Check dependencies:
```bash
docker-compose ps
```

View specific service logs:
```bash
docker-compose logs <service-name>
```

### Rebuild from scratch

```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

## Production Deployment

For production, consider:

1. Use Docker secrets or external secret management
2. Set up proper health checks
3. Configure resource limits
4. Use a reverse proxy (nginx) in front of services
5. Set up monitoring and logging
6. Use managed database services instead of containerized postgres
