// Equipment.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './header';
import TrainerHeader from './trainer-header';
import "./../index.css"

const Equipment = () => {
  const [equipmentData, setEquipmentData] = useState([]);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    fetchEquipmentData();
    determineUserType();
  }, []);

  const fetchEquipmentData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/equipment-monitoring');
      setEquipmentData(response.data);
    } catch (error) {
      console.error('Error fetching equipment data:', error);
    }
  };

  const determineUserType = async () => {
    try {
      const userDataString = localStorage.getItem('userData');
      console.log('userDataString:', userDataString); 
      const userData = JSON.parse(userDataString);
      const userType = userData.data[0].email_address.includes('@trainer.com') ? 'trainer' : 'user';
      setUserType(userType);
    } catch (error) {
      console.error('Error determining user type:', error);
    }
  };
  
  return (
    <div className="container">
      {userType === 'trainer' ? <TrainerHeader /> : <Header />}
      <h2>Equipment</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {equipmentData.map((equipment) => (
            <tr key={equipment.id}>
              <td>{equipment.name}</td>
              <td>{equipment.isfunctional ? 'Functional' : 'Under Maintenance'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Equipment;
