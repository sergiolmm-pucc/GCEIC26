# ==========================================
# Stage 1: Build & Compile
# ==========================================
FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm@10.27.0

WORKDIR /app

# Copy package configuration
COPY package.json pnpm-lock.yaml tsconfig.json ./

# Install dependencies (including devDependencies for build)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY src ./src

# Compile TypeScript to JavaScript
RUN pnpm run build

# Install only production dependencies (clean build environment)
RUN rm -rf node_modules && pnpm install --prod --frozen-lockfile

# ==========================================
# Stage 2: Production Runtime
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3333

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 fastify

# Copy compiled code and production node_modules from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER fastify

EXPOSE 3333

CMD ["node", "dist/server.js"]
