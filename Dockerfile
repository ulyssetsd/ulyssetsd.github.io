# Builder stage: Node.js to generate static HTML from JSON Resume
FROM node:22-slim AS builder

# Install Chromium dependencies for Puppeteer PDF generation
RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    fonts-liberation \
    fonts-noto-color-emoji \
    && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --include=dev

# Copy source files and build
COPY . .
RUN npm run build && npm run pdf

# Place built artifacts in _site/
RUN mkdir -p _site && \
    cp index.html _site/index.html && \
    cp resume.json _site/resume.json && \
    cp resume.pdf _site/resume.pdf

# Nginx stage
FROM nginx:alpine

# Remove default files
RUN rm -rf /usr/share/nginx/html/*

# Copy built site
COPY --from=builder /app/_site /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
