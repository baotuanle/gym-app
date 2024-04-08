import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import "./../index.css"

const RegisterUser = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState('');
  const [bmi, setBmi] = useState('');

  const navigate = useNavigate();

  function handleLogin() {
    navigate("/login");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();


  const user = {
    username: username,
    email_address: email,
    password,
    age,
    weight,
    height,
    fitnessGoal,
    bmi,
  };


    try {
      const response = await axios.post('http://localhost:3000/register', user, {
      });
      console.log('User registered successfully:', response.data);
      localStorage.setItem('userData', JSON.stringify(response.data));
      navigate('/login');
    } catch (error) {
        if (error.response && error.response.status === 400) {
            alert('Email address or username is already taken');
          } else {
            console.error('An error occurred:', error);
            alert('An error occurred while registering user');
          }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className='formContainer'>
          <h2>Register User</h2>
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}  />
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <label>Age:</label>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
          <label>Weight (kg):</label>
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
          <label>Height (m):</label>
          <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
          <label>Fitness Goal:</label>
          <input type="text" value={fitnessGoal} onChange={(e) => setFitnessGoal(e.target.value)} />
          <label>BMI (%):</label>
          <input type="text" value={bmi} onChange={(e) => setBmi(e.target.value)} />
          <button onClick={(handleLogin)}>Login</button>
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  );
};

export default RegisterUser;
