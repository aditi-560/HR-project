# Frontend Dockerfile - Multi-stage build
FROM node:18-alpine AS builder


WORKDIR /app


COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application files
COPY . .


RUN npm run build


FROM nginx:alpine


COPY nginx.conf /etc/nginx/conf.d/default.conf


COPY --from=builder /app/dist /usr/share/nginx/html


EXPOSE 80


HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
