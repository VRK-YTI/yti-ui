# alpine version should match the version in .nvmrc as closely as possible
FROM node:8.11.4-alpine as builder

ARG NPMRC

# Fetch dependencies
ADD . /tmp
WORKDIR /tmp
RUN echo "$NPMRC" > .npmrc && yarn install && rm -f .npmrc

# Build the dist dir containing the static files
RUN ["npm", "run", "build", "--", "--prod",  "--output-hashing=all"]

# Install git
RUN apk add --update git

FROM node:8.11.4-alpine

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
