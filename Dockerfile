## Stage 1 (frontend build)

FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Dependency installation
COPY frontend/package*.json ./
RUN npm install --include=dev

# Build-time variables
ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

ARG VERSION
ENV VITE_VERSION=${VERSION}

# Build
COPY frontend .
RUN npm run build

## Stage 2 (backend build)

FROM node:20-alpine AS backend-builder

WORKDIR /app/backend

# Dependency installation
COPY backend/package*json ./
RUN npm install

# Build
COPY backend .
RUN npm run build

## Stage 3 (deploy)

FROM node:20-alpine AS prod

WORKDIR /app

COPY --from=backend-builder /app/backend/dist ./
COPY --from=backend-builder /app/backend/node_modules ./node_modules
COPY --from=frontend-builder /app/frontend/dist ./build

CMD ["node", "src/server.js"]