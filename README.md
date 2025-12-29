# Up-Site

A website uptime monitoring platform built with Turborepo, Next.js, Express, Prisma, and Redis streams. Monitor your websites, APIs, and endpoints with real-time status checks, alerts, and dashboards.

## Getting Started

### Prerequisites

- Node.js >=18
- Bun (recommended package manager)
- Docker & Docker Compose (for containerized setup)
- PostgreSQL and Redis (for local development, or use Docker)

### 1. Clone and Run Locally

1. **Clone the repository:**

   ```sh
   git clone https://github.com/your-org/up-site-ts.git
   cd up-site-ts
   ```

2. **Create a `.env` file in the root directory** with all required environment variables. Example:

   ```env
   # Database
   DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/upsite
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=yourpassword
   POSTGRES_DB=upsite

   # Redis
   REDIS_URL=redis://localhost:6379

   # JWT
   JWT_SECRET=your-secret-key

   # API
   NEXT_PUBLIC_API_URL=http://localhost:8080

   # Email (Resend)
   RESEND_API_KEY=your-resend-api-key
   ```

3. **Set up the database:**
   - Ensure PostgreSQL and Redis are running locally, or start them with Docker:
     ```sh
     docker run -d --name postgres -e POSTGRES_PASSWORD=yourpassword -e POSTGRES_DB=upsite -p 5432:5432 postgres:16
     docker run -d --name redis -p 6379:6379 redis:7
     ```
   - Run Prisma migrations:
     ```sh
     cd packages/db
     npx prisma migrate dev
     cd ../..
     ```

4. **Install dependencies:**

   ```sh
   bun install
   ```

5. **Start development servers:**

   ```sh
   bun run dev
   ```

   This will start all apps and packages in development mode.

6. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080

### 2. Start with Docker & Docker Compose

1. **Ensure Docker and Docker Compose are installed and running.**

2. **Create a `.env` file in the root directory** (see example in section 1).

3. **Build and start the stack:**

   ```sh
   ./docker-start.sh
   ```

   Or manually:

   ```sh
   docker-compose build
   docker-compose up -d
   ```

4. **Service startup order:**
   - Infrastructure (postgres, redis)
   - Migrator (runs Prisma migrations)
   - Backend services (server, producer, consumer, notifier, alert-worker)
   - Frontend (web)

5. **Access services:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - PostgreSQL: localhost:5432
   - Redis: localhost:6379

6. **View logs:**

   ```sh
   docker-compose logs -f
   ```

7. **Stop services:**
   ```sh
   docker-compose down
   ```

> For advanced Docker usage, troubleshooting, and production deployment tips, see [docker/README.md](docker/README.md).

## Project Structure

This Turborepo monorepo includes the following apps and packages:

### Apps

- `web`: Next.js frontend with dashboard and authentication
- `server`: Express.js backend API with user management and website monitoring
- `producer`: Redis stream producer for uptime checks
- `consumer`: Redis stream consumer for processing checks
- `notifier`: Email notification service using Resend
- `alert-worker`: Alert processing and notification worker
- `tests`: Test suite for the application

### Packages

- `db`: Prisma database client and schema
- `redis-streams`: Redis streams utilities
- `ui`: Shared React UI components
- `eslint-config`: ESLint configurations
- `typescript-config`: TypeScript configurations

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

## Testing

Run the test suite:

```sh
cd apps/tests
bun run test
```

## Development

### Build

```sh
bun run build
```

### Lint

```sh
bun run lint
```

### Type Checking

```sh
bun run check-types
```

### Format Code

```sh
bun run format
```

## Remote Caching

Turborepo supports remote caching with Vercel. To enable:

```sh
turbo login
turbo link
```

## Useful Links

- [Turborepo Documentation](https://turborepo.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Redis Streams](https://redis.io/docs/data-types/streams/)
