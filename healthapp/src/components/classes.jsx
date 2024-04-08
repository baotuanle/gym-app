import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminHeader from './admin-header.jsx';

const Class = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [formData, setFormData] = useState({
    class_name: '',
    class_date: '',
    class_time: '',
    class_endtime: '',
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://localhost:3000/classes');
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const handleEditClick = (classData) => {
    setSelectedClass(classData);
    setFormData({
      class_id: classData.class_id,
      class_name: classData.class_name,
      class_date: classData.class_date,
      class_time: classData.class_time,
      class_endtime: classData.class_endtime,
    }); 
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/update-class`, formData);
      setSelectedClass(null);
      setFormData({
        class_name: '',
        class_date: '',
        class_time: '',
        class_endtime: '',
      });
      fetchClasses();
    } catch (error) {
      console.error('Error updating class:', error);
    }
  };
  

  return (
    <div>
      <AdminHeader></AdminHeader>
  
      {selectedClass && (
        <div className="edit-form-container">
          <h2>Edit Class</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Date:
              <input type="date" name="class_date" value={formData.class_date} onChange={handleInputChange} />
            </label>
            <label>
              Start Time:
              <input type="time" name="class_time" value={formData.class_time} onChange={handleInputChange} />
            </label>
            <label>
              End Time:
              <input type="time" name="class_endtime" value={formData.class_endtime} onChange={handleInputChange} />
            </label>
            <button type="submit">Update Class</button>
            <button onClick={() => setSelectedClass(null)}>Cancel</button> {/* Set selectedClass to null directly */}
          </form>
        </div>
      )}
  
      <div className="class-container">
        {classes.map((classData) => (
          <div className="class-item" key={classData.class_id}>
            <p className="class-name">{classData.class_name}</p>
            <p className="class-details">Date: {new Date(classData.class_date).toLocaleDateString('en-US')}</p>
            <p className="class-details">Start Time: {classData.class_time}</p>
            <p className="class-details">End Time: {classData.class_endtime}</p>
            <button className="edit-button" onClick={() => handleEditClick(classData)}>Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
  
};

export default Class;
