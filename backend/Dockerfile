###############################
# DEPS – Production dependencies
###############################
FROM node:24-alpine AS deps
WORKDIR /app/backend

# Copy manifest
COPY backend/package.json ./

# Install ONLY production dependencies
RUN npm install --production --no-audit --no-fund


###################################
# BUILDER – Needs devDependencies
###################################
FROM node:24-alpine AS builder
WORKDIR /app/backend

# Copy full package.json (dev deps needed)
COPY backend/package.json ./

# Install ALL dependencies (including dev)
RUN npm install --no-audit --no-fund

# Copy source
COPY backend/ .

# Build TS
RUN npm run build


###################################
# RUNNER – Only prod deps + built app
###################################
FROM node:24-alpine AS runner
WORKDIR /app/backend

ENV NODE_ENV=production
ENV PORT=3001

# Copy production node_modules only
COPY --from=deps /app/backend/node_modules ./node_modules

# Copy built output
COPY --from=builder /app/backend/dist ./dist
COPY backend/package.json ./

EXPOSE 3001
CMD ["node", "dist/server.js"]
