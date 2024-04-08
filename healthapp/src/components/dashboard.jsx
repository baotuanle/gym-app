import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './header.jsx';
import './../index.css';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [newAchievement, setNewAchievement] = useState('');
  const [newExercise, setNewExercise] = useState({
    name: '',
    sets: '',
    reps: '',
    weight: ''
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const userDataString = localStorage.getItem('userData');
    const userData = JSON.parse(userDataString);
    if (!userData) {
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
    } catch (error) {
      console.log('Error fetching user data', error);
    }
  };

  const handleAddAchievement = async () => {
    if (newAchievement.trim() !== '') {
      try {
          await axios.post('http://localhost:3000/addAchievement', {
          email_address: userData[0].email_address,
          achievement: newAchievement
        });
        fetchUserData();
      } catch (error) {
        console.error('Error adding achievement:', error);
      }
    }
  };

  const handleDeleteAchievement = async (index) => {
    try {
      await axios.delete('http://localhost:3000/deleteAchievement', {
        data: {
          email_address: userData[0].email_address,
          index: index
        }
      });
      fetchUserData();
    } catch (error) {
      console.error('Error deleting achievement:', error);
    }
  };

  const handleNewAchievementChange = (e) => {
    setNewAchievement(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExercise(prevExercise => ({
      ...prevExercise,
      [name]: value
    }));
  };

  const handleAddExercise = async () => {
    if (newExercise.name.trim() !== '') {
      try {
          await axios.post('http://localhost:3000/addExercise', {
          email_address: userData[0].email_address,
          exercise: newExercise
        });
        fetchUserData();
      } catch (error) {
        console.error('Error adding exercise:', error);
      }
    }
  };

  const handleDeleteExercise = async (index) => {
    try {
      await axios.delete('http://localhost:3000/deleteExercise', {
        data: {
          email_address: userData[0].email_address,
          index: index
        }
      });
      fetchUserData();
    } catch (error) {
      console.error('Error deleting exercise:', error);
    }
  };

  return (
    <div className='dashboard-container'>
      <Header></Header>
      {userData && (
        <div className='flex-container'>
          <div className='health-statistics'>
            <h2>Health Statistics</h2>
            <div>Age: {userData[0].age}</div>
            <div>Height: {userData[0].height + " m"}</div>
            <div>Weight: {userData[0].weight + " kg"}</div>
            <div>Fitness Goal: {userData[0].fitness_goal}</div>
            <div>BMI: {userData[0].bmi + " %"} </div>
          </div>

          <div className='achievements'>
            <h2>Achievements</h2>
            <div>
              <input type="text" value={newAchievement} onChange={handleNewAchievementChange} placeholder="Add new achievement"/>
              <button onClick={handleAddAchievement}>Add</button>
            </div>
            {userData[0].achievements && userData[0].achievements.map((achievement, index) => (
              <div className="achievement-item" key={index}>
                <span className="achievement-text">{achievement.slice(1, -1)}</span>
                <button className="achieve-delete" onClick={() => handleDeleteAchievement(index+1)}>Delete</button>
              </div>
            ))}
          </div>

          <div className='exercises'>
            <h2>Exercises</h2>
            <button onClick={handleAddExercise}>Add Exercise</button>
            <div className="add-exercise">
              <input type="text" placeholder="Name" name="name" value={newExercise.name} onChange={handleInputChange} />
              <input type="number" placeholder="Sets" name="sets" value={newExercise.sets} onChange={handleInputChange} />
              <input type="number" placeholder="Reps" name="reps" value={newExercise.reps} onChange={handleInputChange} />
              <input type="text" placeholder="Weight" name="weight" value={newExercise.weight} onChange={handleInputChange} />
            </div>
            {userData[0].exercises && userData[0].exercises.map((exercise, index) => (
              <div className="exercise-item" key={index}>
                <span className="exercise-text">{exercise.name} - Sets: {exercise.sets} Reps: {exercise.reps} Weight: {exercise.weight}</span>
                <button className="exercise-delete" onClick={() => handleDeleteExercise(index+1)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
