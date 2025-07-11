# syntax=docker/dockerfile:1
# ------------
# Build a minimal Node.js image that ships only the CLI and its prod deps
# ------------
FROM node:20-alpine AS base

# Create app directory
WORKDIR /app

# Install only production dependencies first for better layer caching
COPY package*.json ./
RUN npm install --production --ignore-scripts --no-audit --no-fund

# Copy source (wrapper plus transitive files, if any)
COPY bin ./bin

# Make the CLI entrypoint executable
RUN chmod +x ./bin/csp-eval.js

# Default command
ENTRYPOINT ["node", "bin/csp-eval.js"]
CMD ["--help"]

