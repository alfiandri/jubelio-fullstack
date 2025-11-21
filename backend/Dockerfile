FROM node:24-alpine AS deps
WORKDIR /app/backend

COPY backend/package.json ./

RUN npm install --production --no-audit --no-fund

FROM node:24-alpine AS builder
WORKDIR /app/backend

COPY backend/package.json ./

RUN npm install --no-audit --no-fund

COPY backend/ .

RUN npm run build


FROM node:24-alpine AS runner
WORKDIR /app/backend

ENV NODE_ENV=production
ENV PORT=3001

COPY --from=deps /app/backend/node_modules ./node_modules

COPY --from=builder /app/backend/dist ./dist
COPY backend/package.json ./

EXPOSE 3001
CMD ["node", "dist/server.js"]
