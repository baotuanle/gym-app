import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminHeader from './admin-header.jsx';

const Rooms = () => {
  const [classes, setClasses] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetchClassesAndRooms();
  }, []);

  const fetchClassesAndRooms = async () => {
    try {
      const classesResponse = await axios.get('http://localhost:3000/classes');
      setClasses(classesResponse.data);
      const roomsResponse = await axios.get('http://localhost:3000/get-rooms');
      setRooms(roomsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getRoomName = (classId) => {
    const selectedClass = classes.find(classData => classData.class_id === classId);
    const selectedRoom = rooms.find(room => room.class_id === selectedClass.class_id);
    return selectedRoom ? selectedRoom.room_name : 'Not Selected';
  };

  const handleSelectRoom = async (classId, roomId) => {
    try {
      await axios.put(`http://localhost:3000/take-class`, { classId, roomId });
      fetchClassesAndRooms();
      
    } catch (error) {
      console.error('Error selecting room:', error);
      if (error.response && error.response.status === 400) {
        alert("Room is taken");
      }
    }
  };

  const handleRemoveRoom = async (classId) => {
    try {
      await axios.put(`http://localhost:3000/remove-room`, { classId });
      fetchClassesAndRooms();
    } catch (error) {
      console.error('Error removing room from class:', error);
    }
  };

  return (
    <div>
      <AdminHeader></AdminHeader>

      <div className="class-container">
        {classes.map((classData) => (
          <div className="class-item" key={classData.class_id}>
            <p className="class-name">{classData.class_name}</p>
            <p className="class-details">Date: {new Date(classData.class_date).toLocaleDateString('en-US')}</p>
            <p className="class-details">Start Time: {classData.class_time}</p>
            <p className="class-details">End Time: {classData.class_endtime}</p>
            <p className="class-details">Selected Room: {getRoomName(classData.class_id)}</p>
            <div>
              <select value={classData.room_id || ''} onChange={(e) => handleSelectRoom(classData.class_id, e.target.value)}>
                <option value="">-- Select Room --</option>
                {rooms.map(room => (
                  <option key={room.room_id} value={room.room_id}>{room.room_name}</option>
                ))}
              </select>
              {getRoomName(classData.class_id) !== 'Not Selected' && (
                <button onClick={() => handleRemoveRoom(classData.class_id)}>Remove Room</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rooms;
