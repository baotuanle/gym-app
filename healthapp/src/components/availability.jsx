import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TrainerHeader from "./trainer-header.jsx"
import { useLocation, useNavigate } from 'react-router-dom';

const Availability = () => {
  const location = useLocation();
  const { date } = location.state;

  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrainerAvailability();
  }, []);

  const handleSaveAvailability = async () => {
    const test = localStorage.getItem('userData');
    const userData = JSON.parse(test);
    try {
      await axios.post('http://localhost:3000/saveAvailability', {
        date,
        startTime,
        endTime,
        userId: userData.data[0].id,
      });
      navigate('/trainer-calendar');
    } catch (error) {
      console.error('Error saving availability:', error);
    }
  };

  const fetchTrainerAvailability = async () => {
    try {
      const response = await axios.get('http://localhost:3000/trainer-availability');
      if (response.data) {
        const allAvailabilityEvents = [];
        response.data.forEach(trainerData => {
          const availability = trainerData.availability.filter(item => item.date === date);
          if (availability.length > 0) {
            const trainer = trainerData.username;
            const availabilityEvents = availability.map((item) => ({
              title: `Trainer: ${trainer}`,
              start: item.startTime,
              end: item.endTime,
            }));
            allAvailabilityEvents.push(...availabilityEvents);
          }
        });
        setEvents(allAvailabilityEvents);
      }
    } catch (error) {
      console.error('Error fetching trainer availability:', error);
    }
  };

  return (
    <div>
      <TrainerHeader></TrainerHeader>
      <h1 className='avail'>Set Availability for {date}</h1>
      <div>
        <label>Start Time:</label>
        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
      </div>
      <div>
        <label>End Time:</label>
        <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
      </div>
      <button onClick={handleSaveAvailability}>Save Availability</button>
      <div>
        {events.map((event, index) => (
          <div key={index}>
            <p>{event.title}</p>
            <p>Start Time: {event.start}</p>
            <p>End Time: {event.end}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Availability;
