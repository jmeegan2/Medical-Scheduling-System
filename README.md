# Hospital Doctor Administration System

A web application for managing hospital appointments and doctor administration tasks.

## Features

- User authentication system
- Appointment management
- View and track appointment status
- Secure API endpoints
- Modern React-based frontend

## Tech Stack

- Frontend: React.js
- Backend: Node.js/Express (running on port 5001)
- Authentication: JWT-based token system

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone [repository-url]
```

2. Install frontend dependencies
```bash
cd frontendHospital/frontend
npm install
```

3. Install backend dependencies
```bash
cd [backend-directory]
npm install
```

### Running the Application

You can run both the frontend and backend servers from the base directory:

```bash
npm run dev
```

This will start:
- Backend server on http://localhost:5001
- Frontend development server on http://localhost:3000


## Usage

1. Log in to the system using your credentials
2. View and manage appointments from the home screen
3. Use the "Load Appointments" button to fetch current appointments
4. Log out when finished using the system

## API Endpoints

- `GET /api/appointments/getAll` - Fetch all appointments
- Authentication required for all endpoints

## Security

- JWT token-based authentication
- Protected API routes
- Secure session management
