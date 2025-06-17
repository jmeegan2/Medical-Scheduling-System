import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../provider/authProvider';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const handleLogout = () => {
    setToken(null); // This will trigger the useEffect in AuthProvider to remove the token
    navigate('/login');
  };

  return (
    <div className="home-container">
      <h1>Home Screen</h1>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
}

export default Home; 