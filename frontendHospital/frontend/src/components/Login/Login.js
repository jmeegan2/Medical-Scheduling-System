import React, { useState } from 'react';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('Logging in...');

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
    }
  };

  return (
    <div className="login-container">
      <h1>GeeksforGeeks</h1>
      <h3>Enter your login credentials</h3>

      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="button-container">
          <button type="submit">Submit</button>
        </div>
      </form>

      <p className="register-link">
        Not registered?
        <a href="#" style={{ textDecoration: "none" }}>
          Create an account
        </a>
      </p>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default Login; 