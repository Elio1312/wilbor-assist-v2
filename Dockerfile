FROM node:22-alpine AS builder

# Install pnpm
RUN npm install -g pnpm@10.4.1

WORKDIR /app

# Copy all source files
COPY . .

# Install all dependencies (including dev for build)
RUN pnpm install --no-frozen-lockfile

# Build the application
RUN pnpm run build

# Production stage
FROM node:22-alpine AS production

RUN npm install -g pnpm@10.4.1

WORKDIR /app

# Copy package files and patches
COPY package.json pnpm-lock.yaml ./
COPY patches/ ./patches/

# Install ALL dependencies (vite is required at runtime due to external packages)
RUN pnpm install --no-frozen-lockfile

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Copy drizzle configuration and schema for database migrations
COPY drizzle.config.ts ./
COPY drizzle/ ./drizzle/

# Set environment
ENV NODE_ENV=production
ENV PORT=8000

EXPOSE 8000

CMD ["node", "dist/index.js"]
