# Multi-stage build for minimal and performant Docker image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (needed for building and running)
RUN npm ci && npm cache clean --force

# Production stage
FROM node:18-alpine AS production

# Create app directory and non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S duck-facts -u 1001

WORKDIR /app

# Copy package files for production installation
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Copy application code
COPY --chown=duck-facts:nodejs . .

# Remove unnecessary files (keeping only production essentials)
RUN rm -rf __tests__ \
    .prettierrc.json \
    .prettierignore \
    eslint.config.mjs \
    jest.config.js \
    vercel.json

# Expose port
EXPOSE 3000

# Switch to non-root user
USER duck-facts

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/facts/random', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Start the application
CMD ["npm", "start"]