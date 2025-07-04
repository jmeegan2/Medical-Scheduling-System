#!/bin/bash

# Docker build and run script for Node.js backend

echo "Building Node.js backend Docker image..."
docker build -t hospital-backend .

echo "Starting backend container..."
docker run -d --name hospital-backend -p 5001:5001 \
  -e MONGO_URI="$MONGO_URI" \
  -e NODE_ENV=production \
  hospital-backend

echo "Backend is running at http://localhost:5001"
echo "To stop the container: docker stop hospital-backend"
echo "To remove the container: docker rm hospital-backend"
echo "To view logs: docker logs hospital-backend" 