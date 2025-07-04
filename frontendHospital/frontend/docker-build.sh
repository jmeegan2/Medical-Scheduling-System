#!/bin/bash

# Docker build and run script for React frontend

echo "Building React frontend Docker image..."
docker build -t hospital-frontend .

echo "Starting frontend container..."
docker run -d --name hospital-frontend -p 3000:80 hospital-frontend

echo "Frontend is running at http://localhost:3000"
echo "To stop the container: docker stop hospital-frontend"
echo "To remove the container: docker rm hospital-frontend" 