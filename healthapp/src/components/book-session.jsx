import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from "./header.jsx"
import "./../index.css"


const Book = () => {
  const location = useLocation();
  const { date } = location.state;

  const [events, setEvents] = useState([]);
  const [bookingInfo, setBookingInfo] = useState(null);
  const [isSessionBooked, setIsSessionBooked] = useState(false);
  const [joiningInfo, setJoiningInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [classesResponse, availabilityResponse] = await Promise.all([
        axios.get('http://localhost:3000/get-classes', { params: { date: date } }),
        axios.get('http://localhost:3000/trainer-availability')
      ]);

      if (classesResponse.data && availabilityResponse.data) {
        const classEvents = classesResponse.data.map(classData => ({
          title: classData.class_name,
          start: classData.class_time,
          end: classData.class_endtime
        }));

        const allAvailabilityEvents = [];
        availabilityResponse.data.forEach(trainerData => {
          const availability = trainerData.availability.filter(item => item.date === date);
          if (availability.length > 0) {
            const trainer = trainerData.username;
            const availabilityEvents = availability.map((item) => ({
              title: `Trainer: ${trainer}`,
              start: item.startTime,
              end: item.endTime,
              trainerUsername: trainer,
            }));
            allAvailabilityEvents.push(...availabilityEvents);
          }
        });

        setEvents([...classEvents, ...allAvailabilityEvents]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  

  const handleBooking = (trainer, startTime, endTime) => {
    console.log(isSessionBooked)
    if (!isSessionBooked) {
      setBookingInfo({ trainer, startTime, endTime });
    } else {
      alert('This session is already booked.');
      navigate('/user-calendar');
    }
  };

  const handleCancel = () => {
    setBookingInfo(null);
    setJoiningInfo(null);
  };

  const handleCancelBooking = async () => {
    try {
      const userDataString = localStorage.getItem('userData');
      const userData = JSON.parse(userDataString);
      const { trainer, startTime, endTime } = bookingInfo;
  
      const response = await axios.delete('http://localhost:3000/cancel-session', {
        data: {
          user_name: userData.data[0].username,
          trainer_name: trainer,
          session_date: date,
          start_time: startTime,
          end_time: endTime,
        }
      });
  
      console.log('Session cancelled:', response.data);
  
      setBookingInfo(null);
      setIsSessionBooked(false);
      navigate('/user-calendar');

    } catch (error) {
      console.error('Error cancelling session:', error);
      if (error.response && error.response.status === 403) {
        alert(error.response.data.message);
      } else {
        alert('An error occurred while cancelling the session');
      }
    }
  };

  const handleConfirmBooking = async () => {
    try {
      const userDataString = localStorage.getItem('userData');
      const userData = JSON.parse(userDataString);
      const { trainer, startTime, endTime } = bookingInfo;
  
      const response = await axios.post('http://localhost:3000/book-session', {
        user_name: userData.data[0].username,
        trainer_name: trainer,
        session_date: date,
        start_time: startTime,
        end_time: endTime,
      });
  
      console.log('Booking confirmed:', response.data);
  
      setIsSessionBooked(true);
  
      navigate('/user-calendar');
    } catch (error) {
      console.error('Error confirming booking:', error);
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message);
      } else {
        alert('An error occurred while booking the session');
      }
    }
  };

  const joinClass = async (title, startTime, endTime) => {
    try {
      setJoiningInfo({ title, startTime, endTime });
    } catch (error) {
      console.error('Error fetching enrolled classes:', error);
      alert('An error occurred while fetching enrolled classes');
    }
  };
  

  const handleJoin = async () => {
    try {
      console.log(joiningInfo)
      const userDataString = localStorage.getItem('userData');
      const userData = JSON.parse(userDataString);
      const { title, startTime, endTime } = joiningInfo;
      
      const response = await axios.get('http://localhost:3000/check', { params: { user_name: userData.data[0].username, title, startTime, endTime, date } });
      if (response.data.isEnrolled) {
        alert('You are already enrolled in this class.');
      } else {
        const response = await axios.post('http://localhost:3000/join-class', {
        user_name: userData.data[0].username,
        className: title,
        session_date: date,
        start_time: startTime,
        end_time: endTime,
      });
  
      console.log('Joining class confirmed:', response.data);
  
      navigate('/user-calendar');
      }

      
    } catch (error) {
      console.error('Error confirming join:', error);
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message);
      } else {
        alert('An error occurred while joining the class');
      }
    }
  };


  return (
    <div>
      {bookingInfo ? (
        <div>
          <h2>Confirm Booking</h2>
          <p>Trainer: {bookingInfo.title}</p>
          <p>Start Time: {bookingInfo.startTime}</p>
          <p>End Time: {bookingInfo.end}</p>
          {isSessionBooked ? (
            <p>Session is already booked</p>
          ) : (
            <>
              <button onClick={handleConfirmBooking}>Confirm Booking</button>
              <button onClick={handleCancelBooking}>Cancel Booking</button>
              <button onClick={handleCancel}>Cancel</button>
            </>
          )}
        </div>
      ) : joiningInfo ? (
        <div>
          <h2>Join Class</h2>
          <p>Class Name: {joiningInfo.class_name}</p>
          <p>Start Time: {joiningInfo.startTime}</p>
          <p>End Time: {joiningInfo.endTime}</p>
          <button onClick={handleJoin}>Join Class</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      ) : (
        <div>
          <Header></Header>
          {events.map((event, index) => (
            <div key={index}>
              <p>{event.title}</p>
              <p>Start Time: {event.start}</p>
              <p>End Time: {event.end}</p>
              {event.trainerUsername ? (
                <button onClick={() => handleBooking(event.trainerUsername, event.start, event.end)}>Book Session</button>
              ) : (
                <button onClick={() => joinClass(event.title, event.start, event.end, date)}>Join Class</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Book;
