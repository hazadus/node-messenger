FROM node:18-alpine AS base

WORKDIR /app

# Copy backend stuff - we need backend source because we reuse some types
# from the backend in the frontend.
COPY ./backend/src ./backend/src
COPY ./backend/package.json ./backend/package-lock.json*  ./backend/

# Copy frontend stuff
COPY ./frontend/package.json  ./frontend/
COPY ./frontend/package-lock.json*  ./frontend/
COPY ./frontend/src ./frontend/src
COPY ./frontend/public ./frontend/public
COPY ./frontend/next.config.js ./frontend/
COPY ./frontend/tsconfig.json ./frontend/
COPY ./frontend/.env ./frontend/

# Install backend dependencies
WORKDIR /app/backend
RUN npm ci
RUN npx prisma generate --schema=src/prisma/schema.prisma

# Install frontend dependencies
WORKDIR /app/frontend
RUN npm ci

# Environment variables must be present at build time
# https://github.com/vercel/next.js/discussions/14030
ARG ENV_VARIABLE
ENV ENV_VARIABLE=${ENV_VARIABLE}
ARG NEXT_PUBLIC_ENV_VARIABLE
ENV NEXT_PUBLIC_ENV_VARIABLE=${NEXT_PUBLIC_ENV_VARIABLE}

# Uncomment the following line to disable telemetry at build time
ENV NEXT_TELEMETRY_DISABLED 1

# Build Prisma client
RUN npx prisma generate --schema=src/prisma/schema.prisma

# Build and start Next.js app
RUN npm run build
CMD ["npm", "run", "start"]
