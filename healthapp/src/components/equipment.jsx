import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminHeader from './admin-header';

const Equipment = () => {
  const [equipmentData, setEquipmentData] = useState([]);

  useEffect(() => {
    fetchEquipmentData();
  }, []);

  const fetchEquipmentData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/equipment-monitoring');
      setEquipmentData(response.data);
    } catch (error) {
      console.error('Error fetching equipment data:', error);
    }
  };

  const handleMaintenanceClick = async (equip_id, currentStatus) => {
    try {   
      const newStatus = !currentStatus;  
      await axios.put(`http://localhost:3000/isFunctional`, { isFunctional: newStatus, id: equip_id });
      fetchEquipmentData();
    } catch (error) {
      console.error('Error updating equipment status:', error);
    }
  };
  

  return (
    <div>
      <AdminHeader />
      <h2>Equipment Monitoring</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
            {equipmentData.map((equipment) => (
                <tr key={equipment.id}>
                <td>{equipment.name}</td>
                <td>{equipment.isfunctional ? 'Functional' : 'Under Maintenance'}</td>
                <td>
                    <button onClick={() => handleMaintenanceClick(equipment.id, equipment.isfunctional)}>
                    Set Functionality
                    </button>
                </td>
                </tr>
            ))}
            </tbody>
      </table>
    </div>
  );
};

export default Equipment;
