# FROM nginx:1.23-alpine
# WORKDIR /usr/share/nginx/html
# RUN rm -rf ./*
# COPY --from=nodework /build .
# ENTRYPOINT ["nginx","-g","daemon off;"]


# # Stage 1: Build the application using Node.js and Yarn
# FROM node:16 AS nodework
# WORKDIR /app
# COPY package.json .
# COPY yarn.lock .
# ENV NODE_OPTIONS=--max-old-space-size=4096
# RUN yarn install
# COPY . .
# RUN yarn build

# # Stage 2: Serve the application with Nginx
# FROM nginx:alpine
# WORKDIR /usr/share/nginx/html
# RUN rm -rf ./*
# COPY --from=nodework /app/build .
# ENTRYPOINT ["nginx", "-g", "daemon off;"]
# Step 1: Build the application
FROM node:16-alpine AS nodework
WORKDIR /app

# Copy package.json and yarn.lock files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn

# Copy the rest of the application code
COPY . .

# Build the application
RUN yarn build

# Step 2: Serve the application with Nginx
FROM nginx:1.23-alpine
WORKDIR /usr/share/nginx/html

# Remove default Nginx static files
RUN rm -rf ./*

# Copy built files from the build stage
COPY --from=nodework /app/build .

# Expose port 80
EXPOSE 80

# Start Nginx server
ENTRYPOINT ["nginx", "-g", "daemon off;"]
