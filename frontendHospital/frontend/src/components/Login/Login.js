import React, { useState } from 'react';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Login successful!');
        console.log('Login successful:', data);
        localStorage.setItem('token', data.token);
      } else {
        setMessage(data.msg || 'Login failed. Please check your credentials.');
        console.error('Login failed:', data);
      }
    } catch (error) {
      console.error('Network error during login:', error);
      setMessage('Network error. Please ensure the backend server is running and accessible.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Welcome Back</h1>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="text"
              id="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

          {message && (
            <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <div className="register-link">
            Don't have an account? <a href="#">Sign up</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 