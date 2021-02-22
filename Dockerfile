# alpine version should match the version in .nvmrc as closely as possible
FROM node:12.19.0-alpine@sha256:c8b5faa496b3eaaaee30e278abee431ec7dfec03e07ca0fc6ee39e31f36e5021 as builder

ARG NPMRC

# Install git
RUN apk add --update git

# Fetch dependencies
ADD . /tmp
WORKDIR /tmp
RUN echo "$NPMRC" > .npmrc && yarn install && rm -f .npmrc

# Build the dist dir containing the static files
RUN ["npm", "run", "build", "--", "--prod",  "--output-hashing=all"]

FROM node:12.15.0-alpine@sha256:c8b5faa496b3eaaaee30e278abee431ec7dfec03e07ca0fc6ee39e31f36e5021

# Install tooling
RUN apk add openssl curl ca-certificates

# Install nginx repo
RUN printf "%s%s%s\n" "http://nginx.org/packages/alpine/v" `egrep -o '^[0-9]+\.[0-9]+' /etc/alpine-release` "/main" | tee -a /etc/apk/repositories

# Install nginx key
RUN curl -o /tmp/nginx_signing.rsa.pub https://nginx.org/keys/nginx_signing.rsa.pub

# Check key
RUN openssl rsa -pubin -in /tmp/nginx_signing.rsa.pub -text -noout

# Move key to storage
RUN mv /tmp/nginx_signing.rsa.pub /etc/apk/keys/

# Install nginx
RUN apk add --update nginx && \
    rm -rf /var/cache/apk/*
RUN mkdir -p /run/nginx

# Stream the nginx logs to stdout and stderr
RUN ln -sf /dev/stdout /var/log/nginx/access.log && \
    ln -sf /dev/stderr /var/log/nginx/error.log

# Add nginx config
ADD nginx.conf /etc/nginx/nginx.conf

WORKDIR /app

# Copy node_modules from builder to app dir
COPY --from=builder /tmp/dist ./dist

# Start web server and expose http
EXPOSE 80
CMD ["nginx"]
