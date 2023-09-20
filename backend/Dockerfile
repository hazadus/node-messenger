FROM node:18-alpine AS base

WORKDIR /app

COPY ./backend/src ./backend/src
COPY ./backend/package.json  ./backend/
COPY ./backend/package-lock.json  ./backend/

# Install backend dependencies
WORKDIR /app/backend
RUN npm ci
RUN npx prisma generate --schema=src/prisma/schema.prisma
RUN npm install -g ts-node tslib '@types/node'

CMD ["ts-node", "src/server.ts"]
