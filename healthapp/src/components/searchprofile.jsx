// SearchProfile.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import "./../index.css"
import TrainerHeader from './trainer-header';

const SearchProfile = () => {
  const location = useLocation();
  const { user } = location.state; 

  return (
    <div>
      <TrainerHeader></TrainerHeader>
      <h2>{user.username}</h2>
      <p>Age: {user.age}</p>
      <p>Height: {user.height} m</p>
      <p>Weight: {user.weight} kg</p>
      <p>BMI: {user.bmi}%</p>
      <p>Fitness Goal: {user.fitness_goal}</p>
    </div>
  );
};

export default SearchProfile;
