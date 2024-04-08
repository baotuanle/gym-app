import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./../index.css"

const TrainerHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userData');

    navigate('/login'); 
  };

  const handleDash = () => {
    navigate('/trainer-dashboard');
  };

  const handleSchedule= () => {
    navigate('/trainer-calendar');
  };

  const handleEquipment= () => {
    navigate('/equipment-all');
  };

  return (
    <div className="header-container">
      <div className="logo">Fitness App</div>
      <div className="nav-buttons">
        <button onClick={handleDash}>Home</button>
        <button onClick={handleSchedule}>Schedule</button>
        <button onClick={handleEquipment}>Equipment</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default TrainerHeader;
