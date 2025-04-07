## Stage 1 (frontend build)

FROM node:18 AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./

RUN npm install

COPY frontend .

RUN npm run build

## Stage 2 (backend build)

FROM node:18 AS backend-builder

WORKDIR /app/backend

COPY backend/package*json ./

RUN npm install

COPY backend .

RUN npm run build

## Stage 3 (deploy)

FROM node:18-alpine AS prod

WORKDIR /app

COPY --from=backend-builder /app/backend/dist ./

COPY --from=backend-builder /app/backend/node_modules ./node_modules

COPY --from=frontend-builder /app/frontend/dist ./build

WORKDIR /app

CMD ["node", "src/server.js"]