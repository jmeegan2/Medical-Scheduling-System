import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../provider/authProvider';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const { setToken, token } = useAuth();  

  const handleLogout = () => {
    setToken(null); // This will trigger the useEffect in AuthProvider to remove the token
    navigate('/login');
  };

  const handleLoadAppointments = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/appointments/getAll', {
        headers: {
          Authorization: token,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  return (
    <div className="home-container">
      <h1>Home Screen</h1>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
      <button onClick={handleLoadAppointments} className="load-appointments-button">
        Load Appointments
      </button>
    </div>
  );
}

export default Home; 