# Stage 1: Build the project
FROM --platform=linux/amd64 node:lts-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the Nuxt.js project
RUN npm run build

# Stage 2: Create the production image
FROM --platform=linux/amd64 node:lts-alpine

# Set the working directory
WORKDIR /app

# Copy only the build output and package.json/package-lock.json to the production image
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.output ./.output

# Install only production dependencies
RUN npm install --only=production

# Expose the port that the application will run on
EXPOSE 3000

# Specify the command to run the application
CMD ["node", ".output/server/index.mjs"]
