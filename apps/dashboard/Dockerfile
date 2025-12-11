# Step 1 — Build the Vite app
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2 — Serve the static files using a production-grade web server
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Change nginx to listen on port 8080 instead of 80
RUN sed -i 's/listen\s\+80;/listen 8080;/' /etc/nginx/conf.d/default.conf

# Cloud Run expects the app to listen on this port
ENV PORT=8080
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]

