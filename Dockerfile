# Builder stage: use multi-arch Ruby base and install Jekyll deps
FROM ruby:3.3-slim AS builder

ENV JEKYLL_ENV=production

# Install build tools and libraries required by common Jekyll plugins
RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
	   build-essential git zlib1g-dev libffi-dev libyaml-dev \
	&& rm -rf /var/lib/apt/lists/*

# Set workdir
WORKDIR /app

# Install gems with caching
COPY Gemfile* ./
RUN gem install bundler \
	&& bundle config set without 'development test' \
	&& bundle install --jobs 4 --retry 3

# Copy site content and build
COPY . .
RUN bundle exec jekyll build --destination _site

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
