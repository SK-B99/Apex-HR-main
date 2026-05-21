# Use official Node.js image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project
COPY . .

# Build the NestJS project
RUN npm run build

# Expose the default NestJS port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"]
