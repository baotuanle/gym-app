import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./../index.css"
import axios from 'axios';
import Header from "./header.jsx"

const Profile = () => {

  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedData, setUpdatedData] = useState({});

  useEffect(() => {
    fetchUserData()
  }, []);

  const fetchUserData = async () => {
    const userDataString = localStorage.getItem('userData');
    console.log('userDataString:', userDataString); 
    const userData = JSON.parse(userDataString);
    console.log('userData:', userData); 
    if (!userData) {
      console.log('User data not found');
      return;
    }

    try {
      const response = await axios.get('http://localhost:3000/getUser', {
        params: {
          email_address: userData.data[0].email_address,
          password: userData.data[0].userpassword,
        }
      });
      setUserData(response.data);
      setUpdatedData({
        age: response.data[0].age,
        height: response.data[0].height,
        weight: response.data[0].weight,
        fitness_goal: response.data[0].fitness_goal,
        bmi: response.data[0].bmi,
      });
      console.log(userData)
    } catch (error) {
      console.log('Error fetching user data', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData({ ...updatedData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUserData = { ...updatedData, email_address: userData[0].email_address };
      await axios.put('http://localhost:3000/updateUser', updatedUserData);
      setEditMode(false);
      fetchUserData()
    } catch (error) {
      console.log('Error updating user data', error);
    }
  };
  
  return (
    <div className="profile-container">
      <Header />
      {userData && (
        <div className="profile-content">
          <h2>Profile</h2>
          <div className="profile-info">
            <div><strong>Username:</strong> {userData[0].username}</div>
            <div><strong>Age:</strong> {userData[0].age}</div>
            <div><strong>Height:</strong> {userData[0].height} m</div>
            <div><strong>Weight:</strong> {userData[0].weight} kg</div>
            <div><strong>Fitness Goal:</strong> {userData[0].fitness_goal}</div>
            <div><strong>BMI:</strong> {userData[0].bmi} %</div>
          </div>
          {editMode ? (
            <form className='profile-form' onSubmit={handleSubmit}>
              <input type="text" name="age" value={updatedData.age} onChange={handleChange} placeholder="Age" />
              <input type="text" name="height" value={updatedData.height} onChange={handleChange} placeholder="Height" />
              <input type="text" name="weight" value={updatedData.weight} onChange={handleChange} placeholder="Weight" />
              <input type="text" name="fitness_goal" value={updatedData.fitness_goal} onChange={handleChange} placeholder="Fitness Goal" />
              <input type="text" name="bmi" value={updatedData.bmi} onChange={handleChange} placeholder="BMI" />
              <button type="submit">Save</button>
              <button onClick={() => setEditMode(false)}>Cancel</button>
            </form>
          ) : (
            <button className="edit-profile-btn" onClick={() => setEditMode(true)}>Edit Profile</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
