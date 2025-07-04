# Hospital Doctor Admin - Full Stack Docker Setup

This project is now fully containerized with Docker! 🐳

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   MongoDB       │
│   React App     │◄──►│   Node.js API   │◄──►│   Database      │
│   Port: 3000    │    │   Port: 5001    │    │   Port: 27017   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Option 1: One-Command Startup (Recommended)
```bash
./start-fullstack.sh
```

### Option 2: Manual Docker Compose
```bash
# Build and start all services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## 📱 Access Your Application

Once running, access your application at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **MongoDB**: localhost:27017

## 🔧 Services Overview

### Frontend (React)
- **Container**: `hospital-frontend`
- **Port**: 3000 → 80
- **Features**: 
  - React Router support
  - Nginx serving
  - Environment-based API configuration

### Backend (Node.js/Express)
- **Container**: `hospital-backend`
- **Port**: 5001 → 5001
- **Features**:
  - MongoDB connection
  - JWT authentication
  - RESTful API endpoints
  - Health checks

### Database (MongoDB)
- **Container**: `hospital-mongodb`
- **Port**: 27017 → 27017
- **Features**:
  - Persistent data storage
  - Automatic database initialization

## 🛠️ Development Commands

```bash
# Start all services
docker-compose up -d

# View logs for all services
docker-compose logs -f

# View logs for specific service
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f mongodb

# Stop all services
docker-compose down

# Restart a specific service
docker-compose restart backend

# Rebuild and start
docker-compose up --build -d

# Access container shell
docker-compose exec backend sh
docker-compose exec frontend sh
```

## 🔍 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Check what's using the port
   lsof -i :3000
   lsof -i :5001
   
   # Stop conflicting services
   docker-compose down
   ```

2. **MongoDB connection issues**
   ```bash
   # Check MongoDB logs
   docker-compose logs mongodb
   
   # Restart MongoDB
   docker-compose restart mongodb
   ```

3. **Frontend can't connect to backend**
   ```bash
   # Check backend logs
   docker-compose logs backend
   
   # Verify backend is running
   curl http://localhost:5001
   ```

4. **Build failures**
   ```bash
   # Clean and rebuild
   docker-compose down
   docker system prune -f
   docker-compose up --build
   ```

## 📁 Project Structure

```
hospitalDoctorAdmin/
├── docker-compose.yml          # Full-stack orchestration
├── start-fullstack.sh          # Quick startup script
├── frontendHospital/frontend/  # React frontend
│   ├── Dockerfile              # Frontend container
│   ├── nginx.conf              # Nginx configuration
│   └── docker-compose.yml      # Frontend-only setup
├── server/                     # Node.js backend
│   ├── Dockerfile              # Backend container
│   ├── healthcheck.js          # Health monitoring
│   └── docker-compose.yml      # Backend-only setup
└── README files
```

## 🔐 Environment Variables

The application uses these environment variables:

### Frontend
- `REACT_APP_API_URL`: Backend API URL (default: http://localhost:5001)

### Backend
- `MONGO_URI`: MongoDB connection string
- `PORT`: Server port (default: 5001)
- `NODE_ENV`: Environment (production/development)

### MongoDB
- `MONGO_INITDB_DATABASE`: Database name (hospital_portal_db)

## 🚀 Deployment

This Docker setup is production-ready! To deploy:

1. **Build images**: `docker-compose build`
2. **Push to registry**: Tag and push images
3. **Deploy**: Use docker-compose on your server
4. **Environment**: Set production environment variables

## 📊 Monitoring

- **Health checks**: Backend includes automatic health monitoring
- **Logs**: All services log to stdout/stderr
- **Metrics**: Can be extended with monitoring tools

## 🎉 Success!

Your hospital doctor admin application is now fully containerized and ready for development and deployment! 🏥 