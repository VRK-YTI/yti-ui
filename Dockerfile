#
# PRE-BUILD STAGE
#
FROM node:16.10.0-alpine3.12 AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

#
# BUILD STAGE
#

# Rebuild the source code only when needed
FROM node:16.10.0-alpine3.12 AS builder

ENV NEXT_TELEMETRY_DISABLED 1

# REWRITE_PROFILE is passed onto nextjs build to determine API proxying
#   empty/none = no rewrites (production)
#   docker = rewrite API calls to another container (compose)
#   local = rewrite API calls to a port on localhost (dev)
ARG REWRITE_PROFILE=none
ENV REWRITE_PROFILE $REWRITE_PROFILE

WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN yarn build && yarn install --production --ignore-scripts --prefer-offline

#
# INSTALL STAGE
#

FROM node:16.10.0-alpine3.12 AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# for testing during dev:
RUN apk add curl

# Allow process to run on port 80 for compatibility with earlier versions of
# the application.
RUN apk add libcap && setcap 'cap_net_bind_service=+ep' /usr/local/bin/node

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/next-i18next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

# listen on privileged port for compatibilty with older versions of the
# application
EXPOSE 80

# https://nextjs.org/telemetry
ENV NEXT_TELEMETRY_DISABLED 1

CMD ["yarn", "start", "-p", "80"]
