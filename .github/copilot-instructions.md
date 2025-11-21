# Jubelio Codebase Instructions

## Project Overview

**Jubelio** is a full-stack inventory & transaction management system using a monorepo structure with:
- **Backend**: Fastify + PostgreSQL (TimescaleDB) with JWT authentication
- **Frontend**: Next.js 14 with Zustand state management
- **Database**: TimescaleDB hypertables for time-series transaction data with materialized views for monthly summaries

### Key Architecture Patterns

#### Backend: Fastify + pg-promise
- **Entry**: `src/index.ts` exports `buildApp()` - the Fastify app factory
- **Server startup**: `src/server.ts` starts the app with `buildApp()` and listens on `PORT` (default 3001)
- **Database**: `src/db/pg.ts` uses `pg-promise` for queries; exports `db` and `withTx()` for transactions
- **Modules pattern**: Routes in `src/modules/{auth,items,transactions,imports}/` registered via `src/modules/index.ts` with prefixes
- **Auth**: JWT decorator in `src/middlewares/auth.ts` - add `fastify.addHook('onRequest', fastify.authenticate)` to protected routes

#### Database Structure
- **Tables**: `items` (master data), `transactions` (hypertable, time-series data)
- **Materialized View**: `mv_monthly_summary` aggregates monthly transaction totals
- **Migrations**: Numbered SQL files in `backend-migrations/` auto-run during Docker startup
- **Custom Pattern**: Transactions use `EXCLUSIVE` locks and refresh the materialized view via `REFRESH MATERIALIZED VIEW CONCURRENTLY`

#### Frontend: Next.js App Router
- **File structure**: `frontend/app/{page,layout,dashboard,import,items,summary,transactions}/` uses Next.js App Router
- **Empty lib directory**: `frontend/lib/` exists but is empty; add API/store utilities here as needed
- **State management**: Zustand (configured in package.json but not yet in codebase)
- **API base**: Set via `NEXT_PUBLIC_API_BASE` env var (default: `http://localhost:3001`)
- **Pages**: Currently only feature page stubs exist (`items/page.tsx`, `transactions/page.tsx`, `import/page.tsx`, `summary/page.tsx`)

## Developer Workflows

### Local Development
```bash
# Install dependencies
npm run install:all

# Start all services (backend + frontend)
npm run dev

# Backend alone: npm run dev --workspace backend
# Frontend alone: npm run dev --workspace frontend
```

### Testing & Linting
```bash
npm run test              # Run backend Jest tests (backend/src/tests/**/*.test.ts)
npm run lint              # Run ESLint across workspaces
npm run typecheck         # TypeScript check for frontend
```

### Docker Deployment
```bash
npm run docker:build      # Build both backend and frontend images
npm run docker:up         # Start full stack with postgres (watch: docker terminal for logs)
```

**Key endpoints**:
- Backend: http://localhost:3001 (health: `/health`, requires JWT except `/auth/login`)
- Frontend: http://localhost:3000
- Database: localhost:5432 (user: `admin`, password: `admin`)

## Code Patterns & Conventions

### Routes & Handlers
- **Route structure**: `fastify.{get,post,put,delete}(path, async (req, reply) => { ... })`
- **Error handling**: Use `reply.code(STATUS).send({ message })` for errors; return data directly on success
- **Authentication**: Add hook `fastify.addHook('onRequest', fastify.authenticate)` at top of route file (see `items.route.ts`)
- **Request body**: Cast as `(req.body as any)` and validate manually (no validation middleware yet)

### Database Operations
- **Query patterns**: Use `db.any()` (multiple rows), `db.one()` (exactly 1), `db.oneOrNone()` (0 or 1), `db.none()` (no result)
- **Transactions**: Wrap in `withTx(async (t) => { ... })` for ACID compliance; use `t` instead of `db` for queries
- **Concurrency safety**: Transactions on `transactions` table use `LOCK TABLE transactions IN EXCLUSIVE MODE` to prevent race conditions
- **View refresh**: After insert/update/delete on `transactions`, always call `await db.none("REFRESH MATERIALIZED VIEW CONCURRENTLY mv_monthly_summary")`

### SQL Modules
- **Pattern**: Each module exports `SQL` constant with parameterized queries
- **Examples**: `items.sql.ts`, `transactions.sql.ts` - keeps SQL separate from logic
- **Parameters**: Use `$1, $2, ...` for placeholders (pg-promise style, not named)

### Authentication
- **Method**: Basic credentials checked at `/auth/login` (hardcoded in `env.ts`: `BASIC_USER` + `BASIC_PASS`)
- **Token**: Returns JWT, which is verified by `fastify-jwt` plugin
- **Protected routes**: Add `fastify.addHook('onRequest', fastify.authenticate)` to enforce JWT

### Frontend: API Integration & State Management
- **API client**: Create in `frontend/lib/api.ts` - fetch wrapper with JWT bearer token handling
- **Store setup**: Use `frontend/lib/store.ts` for Zustand stores (auth, items, transactions)
- **Auth flow**: Login → store JWT in state/localStorage → include in all protected API requests as `Authorization: Bearer <token>`
- **Error handling**: Check response status; 401 → clear auth and redirect to login
- **API call pattern**:
  ```typescript
  // Example: frontend/lib/api.ts
  export async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const token = useAuthStore.getState().token; // Get from Zustand
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options?.headers,
      },
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  }
  ```
- **Store pattern**: Create separate stores for auth, items, transactions (e.g., `useAuthStore`, `useItemsStore`)
  - Auth store: holds JWT token, user email, login/logout methods
  - Feature stores: hold paginated lists, current item detail, loading/error state
- **Page components**: Fetch data on mount via `useEffect` + store actions, display from store state

## Environment Variables & Deployment

### Local Development Env
Set in shell or `.env.local` (not checked in):

**Backend**:
- `NODE_ENV=development` (enables Fastify logger)
- `PORT=3001`, `PG_HOST=localhost`, `PG_PORT=5432`, `PG_DB=jubelio`
- `PG_USER=admin`, `PG_PASSWORD=admin`
- `JWT_SECRET=devsecret` (default fallback in `config/env.ts`)
- `BASIC_USER=admin@demo.local`, `BASIC_PASS=admin123`
- `CORS_ORIGIN=*` (dev allows all origins)

**Frontend**:
- `NEXT_PUBLIC_API_BASE=http://localhost:3001` (exposed to client-side code)

### Docker Compose Setup
Production-like environment defined in `docker-compose.yml`:

**Database Service** (`jubelio_db`):
- TimescaleDB image: `timescale/timescaledb:latest-pg16`
- Healthcheck: `pg_isready` polls every 5s
- Auto-runs migrations from `backend-migrations/` on first start
- Volume: `dbdata` persists PostgreSQL data between restarts
- Port: `5432` exposed locally (change in production)

**Backend Service** (`jubelio_api`):
- Multi-stage Docker build (deps → builder → runner, ~70MB final)
- Depends on: `db` service healthy
- Healthcheck: `curl http://localhost:3001/health` every 10s
- Restart: `always` (auto-restart on crash)
- Environment: Overrides local dev with production values (see `docker-compose.yml`)

**Frontend Service** (`jubelio_web`):
- Multi-stage Docker build (Next.js optimized, ~200MB final)
- Depends on: `backend` service running
- Healthcheck: `curl http://localhost:3000` every 10s
- Restart: `always`
- Environment: Only `NEXT_PUBLIC_API_BASE` (baked into Next.js build)

### Docker Build & Run

**Local development with Docker**:
```bash
# Build images
npm run docker:build

# Start all services (backend, frontend, database)
npm run docker:up

# View logs (follow mode)
docker compose logs -f

# Stop services
docker compose down

# Clean up: remove containers, volumes, images
docker compose down -v
```

**Production deployment notes**:
- Change `docker-compose.yml` environment secrets (`JWT_SECRET`, `BASIC_USER`, `BASIC_PASS`)
- Update `CORS_ORIGIN` to your frontend domain
- Use external PostgreSQL (not localhost) for durability
- Reverse-proxy backend/frontend through Nginx/Traefik (port mapping)
- Use `docker compose up -d` for detached mode
- Monitor logs: `docker compose logs -f backend` or `docker compose logs -f frontend`

### Healthchecks
Each service has HTTP/shell healthchecks for container orchestration:
- **Backend**: `GET /health` (no auth required) - Fastify responds with `200 OK`
- **Frontend**: `curl http://localhost:3000` - returns HTML if running
- **Database**: `pg_isready -U admin -d jubelio` - polls PostgreSQL socket
- Failed checks after 3 retries → container marked unhealthy (Kubernetes/Swarm restarts)

## Workspace Structure Quick Reference

```
backend/              # Fastify server, TypeScript, pg-promise
├── src/index.ts      # App factory
├── src/server.ts     # Start server
├── src/config/env.ts # Environment parsing
├── src/db/pg.ts      # Database connection & transactions
├── src/modules/      # Route handlers (auth, items, transactions, imports)
└── src/tests/        # Jest E2E tests

frontend/             # Next.js 14 App Router
├── app/page.tsx      # Landing page (empty)
├── app/layout.tsx    # Global layout (empty)
└── app/{dashboard,import,items,summary,transactions}/  # Feature pages

backend-migrations/   # Numbered SQL migrations (auto-run on Docker startup)
```

## Build & Deployment Pipeline

### TypeScript Compilation

**Backend**:
- `npm run build --workspace backend` → compiles `src/**/*.ts` to `dist/` (ES2021 target)
- Output: `dist/index.js`, `dist/server.js`, `dist/db/pg.js`, etc.
- Used by: Docker runner image (multi-stage build), production Node.js execution

**Frontend**:
- `npm run build --workspace frontend` → Next.js builds to `.next/` with optimizations
- Output: Standalone `.next/` directory (prebuilt pages, CSS, JS chunks)
- Used by: Docker runner image, `npm start` production server

### Local vs. Docker Builds

| Task | Command | Environment |
|------|---------|-------------|
| Dev + Live reload | `npm run dev` | `NODE_ENV=development`, transpile-only |
| Build (no run) | `npm run build` | Production TypeScript output |
| Docker build | `npm run docker:build` | Multi-stage: deps + build + runner |
| Docker run | `npm run docker:up` | All env vars from `docker-compose.yml` |
| Lint/Type-check | `npm run lint`, `npm run typecheck` | Current source code |
| Test (backend) | `npm run test` | Jest in Node environment |

### Build Output Artifacts

**Backend Docker image**:
- Base: `node:24-alpine` (~170MB + app)
- Includes: `dist/`, `node_modules/` (prod only), startup script
- Entrypoint: `node dist/server.js`

**Frontend Docker image**:
- Base: `node:24-alpine` (~350MB + app)
- Includes: `.next/`, `node_modules/`, Next.js runtime
- Entrypoint: `npm start` (Next.js production server on port 3000)

## Common Tasks

**Add a new API endpoint**: Create handler in `src/modules/{feature}/{feature}.route.ts`, add SQL in `.sql.ts`, register in `src/modules/index.ts`

**Update database schema**: Add migration file `NNNX_{description}.sql` in `backend-migrations/`, Docker will run on startup

**Build for production**: `npm run build` (compiles TypeScript), `npm run docker:build` (creates images)

**Debug**: Backend logs via Fastify logger; frontend via browser console; database via `psql` or Prisma Studio equivalent

### Frontend-Specific Tasks

**Add a new page**: Create `frontend/app/{feature}/page.tsx` with layout/component, connect to Zustand store, call API via `fetchAPI()` wrapper

**Add a Zustand store**: Create `frontend/lib/stores/{feature}.ts`, export hook (e.g., `useItemsStore`), subscribe from page components via `useEffect`

**Implement CRUD UI**: 
1. Create store actions for list/create/update/delete that call `fetchAPI()` 
2. Page fetches data on mount: `useEffect(() => store.fetchItems(), [])`
3. Form submissions trigger store actions: `await store.createItem(data)`
4. Display store state: `const { items, loading } = useItemsStore()`

**Handle authentication**:
1. Create `useAuthStore` with login/logout, store JWT in state
2. Initialize store on app mount (check localStorage or session)
3. Redirect to login if 401 response via middleware/hook
4. Include JWT in all API requests via `fetchAPI()` bearer token injection

