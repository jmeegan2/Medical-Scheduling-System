import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login/Login';
import SignUp from './components/SignUp/SignUp';

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
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
