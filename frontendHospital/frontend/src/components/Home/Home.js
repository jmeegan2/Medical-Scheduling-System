import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../provider/authProvider';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const { setToken, token } = useAuth();
  const [appointments, setAppointments] = useState([]);

  const handleLogout = () => {
    setToken(null);
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
      setAppointments(data);
      console.log(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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

      <div id="appointments-container">
        <h2>Appointments</h2>
        {appointments.length === 0 ? (
          <p>No appointments found</p>
        ) : (
          <ul id="appointments-list">
            {appointments.map((appointment) => (
              <li key={appointment._id} className="appointment-item">
                <div className="appointment-date">
                  <strong>Date:</strong> {formatDate(appointment.date)}
                </div>
                <div className="appointment-time">
                  <strong>Time:</strong> {appointment.time}
                </div>
                <div className="appointment-reason">
                  <strong>Reason:</strong> {appointment.reason}
                </div>
                <div className="appointment-status">
                  <strong>Status:</strong> {appointment.status}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Home; 