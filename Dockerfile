# --- Stage 1: Build ---
# Vite >=7 requires Node.js 20.19+ or 22.12+; use latest LTS (22) for compatibility
FROM node:22-alpine AS build

# Set working directory
WORKDIR /app

# Add common compatibility libs for some native dependencies / esbuild
RUN apk add --no-cache libc6-compat

# Install dependencies first (leverages layer cache)
COPY package*.json ./
# Prefer deterministic clean install
RUN npm ci

# Copy application source
COPY . .

# Build the production bundle (Vite outputs to /app/dist by default)
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
