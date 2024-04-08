import React, { useEffect, useState } from 'react';
import "./../index.css"
import AdminHeader from "./admin-header.jsx"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import adminImage from 'C:/Users/baole/Desktop/comp3005_final_project/healthapp/src/assets/230105-LE-SSERAFIM-Weverse-Update-Kim-Chaewon-First-Love-Film-Photo-documents-1.jpeg';

const AdminDashboard = () => { 

  return (
    <div>
      <AdminHeader></AdminHeader>
      <div style={ { display: 'flex', justifyContent: 'center'} }>Face Reveal</div>
      <img src={adminImage} alt="Admin Image" style={{ width: '300px', height: '200px' }} />
    </div>  
  );
};

export default AdminDashboard;
