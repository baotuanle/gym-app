import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./../index.css"

const Header = () => {
  const navigate = useNavigate();

  const handleProfile = () => {
    navigate('/profile');
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    navigate('/login'); 
  };

  const handleDash = () => {
    navigate('/');
  };

  const handleSchedule= () => {
    navigate('/user-calendar');
  };

  const handleEquipment= () => {
    navigate('/equipment-all');
  };

  const handleBillings = () => {
    navigate('/user-billings')
  }

  return (
    <div className="header-container">
      <div className="logo">Fitness App</div>
      <div className="nav-buttons">
        <button onClick={handleDash}>Home</button>
        <button onClick={handleProfile}>Profile</button>
        <button onClick={handleSchedule}>Schedule</button>
        <button onClick={handleEquipment}>Equipment</button>
        <button onClick={handleBillings}>Billings</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Header;
