# Use a Node.js base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app/server

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your Node.js app runs on
EXPOSE 3000

# Command to run the application using the "dev" script, which should use nodemon.
CMD ["npm", "run", "dev"]