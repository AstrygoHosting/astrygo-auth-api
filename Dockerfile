# ============================
# Stage 1: Build (TypeScript + Prisma)
# ============================
FROM node:20-alpine AS builder

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy TS source and tsconfig
COPY tsconfig.json ./
COPY src ./src

# Build TypeScript to dist
RUN npm run build

# ============================
# Stage 2: Runtime (Production)
# ============================
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=production
ENV PORT=4002

# Copy only production dependencies + built files
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY package*.json ./

EXPOSE 4002

CMD ["node", "dist/server.js"]
