FROM nginx:alpine-slim

# Copy pre-built site (built by CI or locally via npm run build && npm run pdf)
COPY public/ /usr/share/nginx/html/

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
