FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application files
COPY . .

# Expose the Vite dev server port
EXPOSE 5173

# Start the development server
CMD ["npm", "run", "dev"]