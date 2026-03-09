# Builder stage: generate static HTML from JSON Resume
FROM node:22-alpine AS builder

ENV PUPPETEER_SKIP_DOWNLOAD=true

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --include=dev

# Copy source files and build HTML only (PDF is generated in CI)
COPY . .
RUN npm run build

# Place built artifacts in _site/
RUN mkdir -p _site && \
    cp public/index.html _site/index.html
# PDF is added by CI via COPY --from=context or build-arg
COPY public/resume.pdf* _site/

# Nginx stage
FROM nginx:alpine-slim

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
