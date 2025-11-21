# Stage 1: Dependencies
FROM node:24-alpine AS deps
WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci --no-audit --no-fund

# Stage 2: Build Next.js
FROM node:24-alpine AS builder
WORKDIR /app/frontend

# Copy dependencies
COPY --from=deps /app/frontend/node_modules ./node_modules

# Copy all frontend files correctly (IMPORTANT!)
COPY frontend/ .   

RUN npm run build

# Stage 3: Runner
FROM node:24-alpine AS runner
WORKDIR /app/frontend

ENV NODE_ENV=production

COPY --from=builder /app/frontend/.next ./.next
COPY --from=builder /app/frontend/node_modules ./node_modules
COPY --from=builder /app/frontend/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
