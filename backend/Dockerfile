# Backend Dockerfile
FROM node:18-alpine


WORKDIR /app


COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .


EXPOSE 9000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:9000/api/auth/me', (r) => {process.exit(r.statusCode === 401 ? 0 : 1)})"


CMD ["npm", "start"]
