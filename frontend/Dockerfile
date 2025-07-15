# Use official Node.js image as build environment
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the frontend source code
COPY . .

# Build the React app
RUN npm run build

# -------------------
# Serve with nginx
# -------------------
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx config (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
