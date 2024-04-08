import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./../index.css"

const AdminHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userData');
    navigate('/login'); 
  };

  const handleDash = () => {
    navigate('/admin-dashboard');
  };

  const handleEquipment= () => {
    navigate('/equipment');
  };

  const handleClass= () => {
    navigate('/classes');
  };

  const handleAdminBilling = () => {
    navigate('/admin-billing');
  };

  const handleRooms = () => {
    navigate('/rooms');
  };

  return (
    <div className="header-container">
      <div className="logo">Fitness App</div>
      <div className="nav-buttons">
        <button onClick={handleDash}>Home</button>
        <button onClick={handleClass}>Schedule</button>
        <button onClick={handleEquipment}>Equipment</button>
        <button onClick={handleAdminBilling}>Billings</button>
        <button onClick={handleRooms}>Rooms</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default AdminHeader;
