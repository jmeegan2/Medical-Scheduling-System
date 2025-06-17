import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login/Login';
import SignUp from './components/SignUp/SignUp';
import Home from './pages/Home';
import { ProtectedRoute } from './routes/ProtectedRoute';
import AuthProvider from './provider/authProvider';

function App() {
  useEffect(() => {
    // Test backend connection
    fetch('http://localhost:5001')
      .then(response => response.text())
      .then(data => {
        console.log('Backend connection test:', data);
      })
      .catch(error => {
        console.error('Error connecting to backend:', error);
      });
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/home" element={<Home />} />
            </Route>

            {/* Default route - redirect to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
