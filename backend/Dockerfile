FROM node:18-slim AS base

# These libs are needed by `npx prisma generate` to work properly
RUN apt-get update && apt-get install -y openssl libssl-dev

WORKDIR /app

COPY ./prisma/schema.prisma ./backend/prisma/schema.prisma
COPY ./backend/src ./backend/src
COPY ./backend/package.json  ./backend/
COPY ./backend/package-lock.json  ./backend/

# Install backend dependencies
WORKDIR /app/backend
RUN npm ci
RUN npx prisma generate --schema=./prisma/schema.prisma
RUN npm install -g ts-node tslib '@types/node'

CMD ["ts-node", "src/server.ts"]
