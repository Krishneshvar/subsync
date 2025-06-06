# Use a Node.js base image for building
FROM node:18-alpine as builder

WORKDIR /app/subsync

COPY package*.json ./
RUN npm install

COPY . .

# Build the React Vite app
# Environment variables prefixed with VITE_ are automatically exposed to the client-side code
# during the build process if they are present during the build.
RUN npm run build

# Use a lightweight web server to serve the static files
FROM nginx:alpine

# Copy the built React app from the builder stage
COPY --from=builder /app/subsync/dist /usr/share/nginx/html/ 
# Optional: Copy a custom Nginx configuration if you need specific routing or proxying
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for Nginx
EXPOSE 80

# Command to start Nginx
CMD ["nginx", "-g", "daemon off;"]