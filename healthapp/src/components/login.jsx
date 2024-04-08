import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import "./../index.css"

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  function handleRegister() {
    navigate('/register');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();


    const user = {
      email_address: email,
      password
    };


    try {
      const response = await axios.post('http://localhost:3000/login', user);

      localStorage.setItem('userData', JSON.stringify(response.data));
      console.log(response.data.data[0])
      if (response.data.data[0].email_address.includes("@trainer.com")) {
        navigate('/trainer-dashboard');
      }
      else if (response.data.data[0].email_address.includes("@admin.com")) {
        navigate('/admin-dashboard');
      } 
      else {
        navigate('/');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('Invalid Email address or password');
      } else {
        console.error('An error occurred:', error);
        alert('An error occurred while logging in');
      }
    }
  };

  return (
    <div>
        <form onSubmit={handleSubmit}>
          <div className='formContainer'>
            <h2 className='login-title'>Login</h2>
            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}  />
      
            <label>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Login</button>
            <button onClick={handleRegister}>Register</button>
          </div>
        </form>
    </div>
  );
};


export default Login;
