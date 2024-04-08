import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Header from "./header.jsx"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserCalendar = () => {
    const navigate = useNavigate();
    const [userSessions, setUserSessions] = useState([]);
    const [joinedClasses, setJoinedClasses] = useState([]);
    const userDataString = localStorage.getItem('userData');
    const userData = JSON.parse(userDataString);

    useEffect(() => {
        const fetchUserSessions = async () => {
            try {
                const un = userData.data[0].username;
                const response = await axios.get('http://localhost:3000/user-sessions', { params: { un } });
                setUserSessions(response.data);
            } catch (error) {
                console.error('Error fetching user sessions:', error);
            }
        };

        const fetchJoinedClasses = async () => {
            try {
                const un = userData.data[0].username;
                const response = await axios.get('http://localhost:3000/user-classes', { params: { un } });
                setJoinedClasses(response.data);
            } catch (error) {
                console.error('Error fetching joined classes:', error);
            }
        };

        fetchUserSessions();
        fetchJoinedClasses();
    }, []);

    const handleDateClick = (e) => {
        const date = e.dateStr;
        console.log(date);
        navigate(`/book`, { state: { date } });
    }

    return (
        <div className='center-container'>
            <Header />
            <div className="calendar-container">
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    dateClick={handleDateClick}
                />
            </div>
            <div className="session-container">
                <h3>Your Sessions:</h3>
                {userSessions.map(session => (
                    <div key={session.id}>
                        <p>Trainer Name: {session.trainer_name}</p>
                        <p>Session Date: {new Date(session.session_date).toLocaleDateString()}</p>
                        <p>Start Time: {session.start_time}</p>
                        <p>End Time: {session.end_time}</p>
                    </div>
                ))}
            </div>
            <div className="user-class-container">
                <h3>Joined Classes:</h3>
                {joinedClasses.map(classInfo => (
                    <div key={classInfo.id}>
                        <p>Class Name: {classInfo.class_name}</p>
                        <p>Session Date: {new Date(classInfo.class_date).toLocaleDateString()}</p>
                        <p>Start Time: {classInfo.class_time}</p>
                        <p>End Time: {classInfo.class_endtime}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserCalendar;
