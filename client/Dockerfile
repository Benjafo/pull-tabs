FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application files
COPY . .

# Make start script executable
RUN chmod +x start.sh

# Build and start the production server at runtime
CMD ["./start.sh"]