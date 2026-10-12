#
# PRE-BUILD STAGE
#
FROM node:24.13.0-alpine3.23@sha256:cd6fb7efa6490f039f3471a189214d5f548c11df1ff9e5b181aa49e22c14383e AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY datamodel-ui/package.json ./datamodel-ui/
COPY common-ui ./common-ui
COPY package.json package-lock.json ./

RUN npm ci --no-audit --no-fund

#
# BUILD STAGE
#

# Rebuild the source code only when needed
FROM node:24.13.0-alpine3.23@sha256:cd6fb7efa6490f039f3471a189214d5f548c11df1ff9e5b181aa49e22c14383e AS builder

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
COPY datamodel-ui ./datamodel-ui
COPY --from=deps /app/datamodel-ui/node_modules ./datamodel-ui/node_modules
COPY --from=deps /app/common-ui ./common-ui
COPY --from=deps /app/node_modules ./node_modules
WORKDIR /app/datamodel-ui

# Removing env.local when running locally
RUN if [ -f ".env.local" ]; then \
    echo ".env.local found!"; \
    rm .env.local; \
    echo ".env.local removed."; \
fi

# Create version.txt
RUN echo "$VERSION" > public/version.txt

RUN npm run build && npm install --production --ignore-scripts --prefer-offline

#
# INSTALL STAGE
#

FROM node:24.13.0-alpine3.23@sha256:cd6fb7efa6490f039f3471a189214d5f548c11df1ff9e5b181aa49e22c14383e AS runner
WORKDIR /app/datamodel-ui

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# for testing during dev:
RUN apk add curl bash

# Allow process to run on port 80 for compatibility with earlier versions of
# the application.
RUN apk add libcap && setcap 'cap_net_bind_service=+ep' /usr/local/bin/node

COPY --from=builder --chown=nextjs:nodejs /app/datamodel-ui/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/datamodel-ui/.next/static ./datamodel-ui/.next/static

COPY --from=builder /app/datamodel-ui/next-i18next.config.js ./datamodel-ui
COPY --from=builder /app/datamodel-ui/public ./datamodel-ui/public
COPY --from=builder --chown=nextjs:nodejs /app/datamodel-ui/.next ./.next
COPY --from=builder /app/datamodel-ui/.env ./datamodel-ui

# COPY --from=builder /app/datamodel-ui/junit.xml ./
# COPY --from=builder /app/datamodel-ui/coverage ./coverage

USER nextjs

# listen on privileged port for compatibilty with older versions of the
# application
EXPOSE 80

# https://nextjs.org/telemetry
ENV NEXT_TELEMETRY_DISABLED 1

ENV PORT 80

CMD ["node", "datamodel-ui/server.js"]
