import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import TrainerHeader from "./trainer-header.jsx"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TrainerCalendar = () => {
    const navigate = useNavigate();
    const [userSessions, setUserSessions] = useState([]);
    const userDataString = localStorage.getItem('userData');
    const userData = JSON.parse(userDataString);

    useEffect(() => {
        const fetchUserSessions = async () => {
            try {
                const un = userData.data[0].username
                const response = await axios.get('http://localhost:3000/user-sessions', {
                    params: {un}
                });
                setUserSessions(response.data);
            } catch (error) {
                console.error('Error fetching user sessions:', error);
            }
        };

        fetchUserSessions();
    }, []);

    const handleDateClick = (e) => {
        const date = e.dateStr;
        console.log(date);
        navigate(`/availability`, { state: { date } });
    }
  
    return (
        <div>
            <TrainerHeader />
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                dateClick={handleDateClick}
            />
            <div>
                Your Sessions:
                {userSessions.map(session => (
                    <div key={session.id}>
                        <p>User Name: {session.user_name}</p>
                        <p>Session Date: {new Date(session.session_date).toLocaleDateString()}</p>
                        <p>Start Time: {session.start_time}</p>
                        <p>End Time: {session.end_time}</p>
                    </div>
                ))}
            </div>
        </div>
        
    );
};

export default TrainerCalendar;
