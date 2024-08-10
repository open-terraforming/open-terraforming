FROM node:20.9.0-alpine AS build-server

# Initialization
RUN mkdir -p /app/server
RUN mkdir -p /app/shared
WORKDIR /app/server

# Dependencies
COPY server/package.json .
COPY server/package-lock.json .
RUN npm ci

# Source code
COPY server/tsconfig.json .
COPY server/src ./src
COPY shared/src ../shared/src

# Application build
RUN npm run build

FROM node:20.9.0-alpine AS build-server-depts

# Initialization
RUN mkdir -p /app/server
WORKDIR /app/server

# Dependencies
COPY server/package.json .
COPY server/package-lock.json .
COPY docker/removeDevDependencies.js .
RUN npm install

FROM node:20.9.0-alpine AS build-client

# Initialization
RUN mkdir -p /app/client
RUN mkdir -p /app/shared
WORKDIR /app/client

# Dependencies
COPY client/package.json .
COPY client/package-lock.json .
RUN npm ci

COPY client/tsconfig.json .
COPY client/vite.config.mjs .
COPY client/src ./src
COPY shared/src ../shared/src

# Application build
RUN npm run build

FROM node:20.9.0-alpine

# Options
ENV PORT=80
ENV OT_SLOTS=100
ENV OT_FAST_BOTS=true
ENV OT_CACHE_PATH=/data/.cache
ENV OT_STORAGE_PATH=/data/storage
ENV OT_STATIC_PATH=./client

# Copy build results
WORKDIR /app
COPY --from=build-server-depts /app/server/node_modules ./node_modules
COPY --from=build-server /app/server/dist ./dist
COPY --from=build-client /app/client/dist ./client
COPY --from=build-server /app/server/package.json .

# Data volume
RUN mkdir -p /data && chown node:node /data
VOLUME [ "/data" ]

# Start the application
EXPOSE $PORT
CMD [ "node", "./dist/server/src/index.js" ]
