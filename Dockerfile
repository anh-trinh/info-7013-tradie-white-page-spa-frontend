# --- Stage 1: Build ---
# Using lightweight Node image
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Install build dependencies first (better layer caching)
COPY package*.json ./
# If you ever add a .npmrc or similar, copy it here as well.
RUN npm install

# Copy the rest of the source
COPY . .

# Build the production bundle (Vite will output to /app/dist by default)
RUN npm run build

# --- Stage 2: Runtime (Nginx) ---
FROM nginx:stable-alpine

# Copy built assets from previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx config to support Vue Router history mode
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# (Optional) You could add a simple healthcheck here
# HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost/ || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
