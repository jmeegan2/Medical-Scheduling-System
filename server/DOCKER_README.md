# Docker Setup for Node.js Backend

This directory contains Docker configuration for the hospital doctor admin backend API.

## Prerequisites

1. **MongoDB**: You need a MongoDB instance running
   - Local MongoDB: `mongodb://localhost:27017/hospital_portal_db`
   - MongoDB Atlas: Your cloud MongoDB connection string
   - Docker MongoDB: Use the full-stack docker-compose setup

2. **Environment Variables**: Create a `.env` file with:
   ```bash
   MONGO_URI=your_mongodb_connection_string
   PORT=5001
   NODE_ENV=production
   ```

## Quick Start

### Option 1: Using Docker Compose (Recommended)
```bash
# Set your MongoDB URI
export MONGO_URI="your_mongodb_connection_string"

# Build and start the backend
docker-compose up --build

# Run in background
docker-compose up -d --build

# Stop the service
docker-compose down
```

### Option 2: Using the build script
```bash
# Set your MongoDB URI
export MONGO_URI="your_mongodb_connection_string"

# Make script executable (if not already)
chmod +x docker-build.sh

# Build and run
./docker-build.sh
```

### Option 3: Manual Docker commands
```bash
# Build the image
docker build -t hospital-backend .

# Run the container
docker run -d --name hospital-backend -p 5001:5001 \
  -e MONGO_URI="your_mongodb_connection_string" \
  hospital-backend

# Stop and remove
docker stop hospital-backend
docker rm hospital-backend
```

## Development Mode

For development with hot reloading:

1. Uncomment the `backend-dev` service in `docker-compose.yml`
2. Comment out the `backend` service
3. Run: `docker-compose up --build`

Or use the development Dockerfile directly:
```bash
docker build -f Dockerfile.dev -t hospital-backend-dev .
docker run -d --name hospital-backend-dev -p 5001:5001 \
  -v $(pwd):/app -e MONGO_URI="your_mongodb_connection_string" \
  hospital-backend-dev
```

## API Endpoints

Once running, your API will be available at:
- **Health Check**: `http://localhost:5001/`
- **Auth Routes**: `http://localhost:5001/api/auth`
- **Users**: `http://localhost:5001/api/users`
- **Patients**: `http://localhost:5001/api/patients`
- **Appointments**: `http://localhost:5001/api/appointments`

## Configuration

- **Port**: 5001 (configurable via PORT environment variable)
- **Database**: MongoDB (configurable via MONGO_URI)
- **Health Check**: Automatic health monitoring
- **Security**: Runs as non-root user
- **Logs**: Access with `docker logs hospital-backend`

## Troubleshooting

1. **Database connection fails**: Check your MONGO_URI
2. **Port already in use**: Change the port mapping in docker-compose.yml
3. **Container won't start**: Check logs with `docker logs hospital-backend`
4. **Health check fails**: Ensure MongoDB is accessible

## Next Steps

This backend container is designed to work with the frontend container. See the main project README for full stack setup. 