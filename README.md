# Jubelio Fullstack (monorepo)

## Prereqs
- Docker & Docker Compose
- Node (optional for local dev)

## Build & run (production, docker-compose)
### build images
docker compose build --no-cache

### bring up
docker compose up -d

### logs
docker compose logs -f

### stop
docker compose down

### running migration
```docker exec -it jubelio_api npx knex migrate:latest```

### running seeder
```docker exec -it jubelio_api npx knex seed:run```