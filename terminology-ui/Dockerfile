#
# PRE-BUILD STAGE
#
FROM node:18.16.0-alpine3.16@sha256:f47850733d8522489f57bfe86d790b1ee167a4b863d83d37572fb28cf10ec5e8 AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY terminology-ui/package.json ./terminology-ui/
COPY common-ui ./common-ui
COPY package.json package-lock.json ./

# Run ci in root to generate node_modules in needed folders
RUN npm ci

#
# BUILD STAGE
#

# Rebuild the source code only when needed
FROM node:18.16.0-alpine3.16@sha256:f47850733d8522489f57bfe86d790b1ee167a4b863d83d37572fb28cf10ec5e8 AS builder

ENV NEXT_TELEMETRY_DISABLED 1

# REWRITE_PROFILE is passed onto nextjs build to determine API proxying
#   empty/none = no rewrites (production)
#   docker = rewrite API calls to another container (compose)
#   local = rewrite API calls to a port on localhost (dev)
ARG REWRITE_PROFILE=none
ENV REWRITE_PROFILE $REWRITE_PROFILE
ARG SKIP_TESTS
ARG SKIP_COVERAGE
ARG VERSION

WORKDIR /app
COPY terminology-ui ./terminology-ui
COPY --from=deps /app/terminology-ui/node_modules ./terminology-ui/node_modules
COPY --from=deps /app/common-ui ./common-ui
COPY --from=deps /app/node_modules ./node_modules
WORKDIR /app/terminology-ui

# Removing env.local when running locally
RUN if [ -f ".env.local" ]; then \
    echo ".env.local found!"; \
    rm .env.local; \
    echo ".env.local removed."; \
fi

RUN if [ "$SKIP_TESTS" ]; then \
    echo "Skipping tests"; \
    mkdir -p coverage; \
  elif [ "$SKIP_COVERAGE" ]; then \
    echo "Running tests without coverage"; \
    npm run test:ci:no-coverage; \
    mkdir -p coverage; \
  else \
    echo "Running tests with coverage"; \
    npm run test:ci; \
  fi

# Create version.txt
RUN echo "$VERSION" > public/version.txt

RUN npm run build && npm install --production --ignore-scripts --prefer-offline

#
# INSTALL STAGE
#

FROM node:18.16.0-alpine3.16@sha256:f47850733d8522489f57bfe86d790b1ee167a4b863d83d37572fb28cf10ec5e8 AS runner
WORKDIR /app/terminology-ui

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# for testing during dev:
RUN apk add curl

# Allow process to run on port 80 for compatibility with earlier versions of
# the application.
RUN apk add libcap && setcap 'cap_net_bind_service=+ep' /usr/local/bin/node

COPY --from=builder /app/terminology-ui/next.config.js ./
COPY --from=builder /app/terminology-ui/next-i18next.config.js ./
COPY --from=builder /app/terminology-ui/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/terminology-ui/.next ./.next
COPY --from=builder /app/terminology-ui/node_modules /app/node_modules ./node_modules/
COPY --from=builder /app/terminology-ui/package.json ./package.json
COPY --from=builder /app/terminology-ui/junit.xml ./
COPY --from=builder /app/terminology-ui/coverage ./coverage
COPY --from=builder /app/terminology-ui/.env ./
COPY --from=builder /app/common-ui ../common-ui

USER nextjs

# listen on privileged port for compatibilty with older versions of the
# application
EXPOSE 80

# https://nextjs.org/telemetry
ENV NEXT_TELEMETRY_DISABLED 1

CMD ["npm", "start", "--", "--port", "80"]
