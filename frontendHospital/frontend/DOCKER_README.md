# Docker Setup for React Frontend

This directory contains Docker configuration for the hospital doctor admin frontend.

## Quick Start

### Option 1: Using Docker Compose (Recommended)
```bash
# Build and start the frontend
docker-compose up --build

# Run in background
docker-compose up -d --build

# Stop the service
docker-compose down
```

### Option 2: Using the build script
```bash
# Make script executable (if not already)
chmod +x docker-build.sh

# Build and run
./docker-build.sh
```

### Option 3: Manual Docker commands
```bash
# Build the image
docker build -t hospital-frontend .

# Run the container
docker run -d --name hospital-frontend -p 3000:80 hospital-frontend

# Stop and remove
docker stop hospital-frontend
docker rm hospital-frontend
```

## Development Mode

For development with hot reloading:

1. Uncomment the `frontend-dev` service in `docker-compose.yml`
2. Comment out the `frontend` service
3. Run: `docker-compose up --build`

Or use the development Dockerfile directly:
```bash
docker build -f Dockerfile.dev -t hospital-frontend-dev .
docker run -d --name hospital-frontend-dev -p 3000:3000 -v $(pwd):/app hospital-frontend-dev
```

## Configuration

- **Production**: Uses nginx to serve built React app on port 80 (mapped to host port 3000)
- **Development**: Uses React dev server on port 3000 with hot reloading
- **Nginx Config**: Handles React Router client-side routing
- **Security**: Includes security headers and gzip compression

## Troubleshooting

1. **Port already in use**: Change the port mapping in docker-compose.yml
2. **Build fails**: Check that all dependencies are in package.json
3. **Container won't start**: Check logs with `docker logs hospital-frontend`

## Next Steps

This frontend container is designed to work with the backend container. See the main project README for full stack setup. 