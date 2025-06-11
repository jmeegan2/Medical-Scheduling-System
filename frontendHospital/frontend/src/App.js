import React, { useEffect } from 'react';
import './App.css';
import Login from './components/Login/Login';

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
    <div className="App">
      <Login />
    </div>
  );
}

export default App;
