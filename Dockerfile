# Step 1: Build the React application using Nx
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package descriptors and lockfile
COPY package.json package-lock.json ./

# Install workspace dependencies
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Build the production shell bundle
RUN npx nx build shell

# Step 2: Serve the application using Nginx
FROM nginx:alpine

# Install gettext package for envsubst utility
RUN apk add --no-cache gettext

# Copy static assets from the builder stage
COPY --from=builder /app/dist/apps/shell /usr/share/nginx/html

# Copy Nginx configuration template
COPY nginx.conf.template /etc/nginx/nginx.conf.template

# Default backend service URL (override at runtime via environment variable)
ENV BACKEND_URL=http://backend:8000

EXPOSE 80

# Substitute environment variables in Nginx configuration and run Nginx
CMD ["/bin/sh", "-c", "envsubst '${BACKEND_URL}' < /etc/nginx/nginx.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]
