const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const { Pool } = require('pg'); 

require('dotenv').config(); 

const app = express();
const port = 3000;



app.use(cors());

app.use(bodyParser.json());

const connection = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to pgadmin:', err);
    return;
  }
  console.log('Connected to pgadmin');
});

app.post('/register', (req, res) => {
  const { username, email_address, password, age, weight, height, fitnessGoal, bmi } = req.body;


  const sql = 'INSERT INTO users (username, email_address, userpassword, age, weight, height, fitness_goal, bmi) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
  const values = [username, email_address, password, age, weight, height, fitnessGoal, bmi];

  connection.query(sql, values, (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        console.error('Error registering user:', err);
        res.status(400).json({ error: 'Email address is already in use' });
      } else {
        console.error('Error registering user:', err);
        res.status(500).json({ error: 'An error occurred while registering user' });
      }
      return;
    }
    console.log('User registered successfully:', result);
    res.status(200).json({ message: 'User registered successfully' });
  });
});

app.post('/login', (req, res) => {
  const { email_address, password } = req.body;
  const values = [email_address, password];

  if (email_address.includes("@trainer.com")) {
    const sql = "SELECT * FROM trainers WHERE email_address = $1 AND userpassword = $2";
    connection.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'An error occurred during login' });
        return;
      }
  
      if (result.rows.length > 0) {
        console.log('User logged in successfully:', result.rows);
        res.status(200).json({ data: result.rows});
      } else {
        console.log('Invalid email or password');
        res.status(401).json({ error: 'Invalid email or password' });
      }
    });
  }

  else if (email_address.includes("@admin.com")) {
    const sql = "SELECT * FROM administrators WHERE email_address = $1 AND password = $2";
    connection.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'An error occurred during login' });
        return;
      }
  
      if (result.rows.length > 0) {
        console.log('User logged in successfully:', result.rows);
        res.status(200).json({ data: result.rows});
      } else {
        console.log('Invalid email or password');
        res.status(401).json({ error: 'Invalid email or password' });
      }
    });
  }

  else {
    const sql = "SELECT * FROM users WHERE email_address = $1 AND userpassword = $2";
    connection.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'An error occurred during login' });
        return;
      }
  
      if (result.rows.length > 0) {
        console.log('User logged in successfully:', result.rows);
        res.status(200).json({ data: result.rows});
      } else {
        console.log('Invalid email or password');
        res.status(401).json({ error: 'Invalid email or password' });
      }
    });
  }

  
});

app.get('/getUser', (req, res) => {
  const { email_address, password } = req.query;


  const sql = "SELECT * FROM users WHERE email_address = $1 AND userpassword = $2";
  const values = [email_address, password];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error fetching user data:', err);
      res.status(500).json({ error: 'An error occurred while fetching user data' });
      return;
    }

    if (result.rows.length > 0) {
      const userData = result.rows;
      res.status(200).json(userData);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  });
});

app.put('/updateUser', (req, res) => {
  const { email_address, ...updatedData } = req.body;

  const sql = `UPDATE users SET age = $1, height = $2, weight = $3, fitness_goal = $4, bmi = $5  WHERE email_address = $6`;
  const values = [updatedData.age, updatedData.height, updatedData.weight, updatedData.fitness_goal, updatedData.bmi, email_address];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error updating user data:', err);
      res.status(500).json({ error: 'An error occurred while updating user data' });
      return;
    }

    console.log('User data updated successfully:', result);
    res.status(200).json({ message: 'User data updated successfully' });
  });
});

app.post('/addAchievement', async (req, res) => {
  const { email_address, achievement } = req.body;

  try {
    await connection.query('UPDATE users SET achievements = array_append(achievements, $1) WHERE email_address = $2', [`{${achievement}}`, email_address]);
    res.status(200).json({ message: 'Achievement added successfully' });
  } catch (error) {
    console.error('Error adding achievement:', error);
    res.status(500).json({ error: 'An error occurred while adding achievement' });
  }
});

app.delete('/deleteAchievement', (req, res) => {
  const { email_address, index } = req.body;

  const query = 'UPDATE users SET achievements = achievements[1:$1-1] || achievements[$1+1:] WHERE email_address = $2'; //slices array before and after index we want to remove
  const values = [index, email_address];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('Error deleting achievement:', err);
      res.status(500).json({ error: 'An error occurred while deleting achievement' });
      return;
    }

    console.log('Achievement deleted successfully:', result);
    res.status(200).json({ message: 'Achievement deleted successfully' });
  });
});

app.post('/addExercise', async (req, res) => {
  const { email_address, exercise } = req.body;
  try {
    const exerciseString = JSON.stringify(exercise);
    await connection.query('UPDATE users SET exercises = array_append(exercises, $1) WHERE email_address = $2', [exerciseString, email_address]);
    res.status(200).json({ message: 'Exercise added successfully' });
  } catch (error) {
    console.error('Error adding exercise:', error);
    res.status(500).json({ error: 'An error occurred while adding exercise' });
  }
});

app.delete('/deleteExercise', (req, res) => {
  const { email_address, index } = req.body;

  const query = 'UPDATE users SET exercises = exercises[1:$1-1] || exercises[$1+1:] WHERE email_address = $2';
  const values = [index, email_address];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('Error deleting exercise:', err);
      res.status(500).json({ error: 'An error occurred while deleting exercise' });
      return;
    }

    console.log('exercise deleted successfully:', result);
    res.status(200).json({ message: 'exercise deleted successfully' });
  });
});

app.get('/searchUsers', async (req, res) => {
  const { search } = req.query;
  try {
    const result = await connection.query('SELECT * FROM users WHERE username ILIKE $1', [`%${search}%`]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ error: 'An error occurred while searching users' });
  }
});

app.post('/saveAvailability', async (req, res) => {
  try {
    const { date, startTime, endTime, userId } = req.body;

    await connection.query(
      'UPDATE trainers SET availability = array_append(availability, $1) WHERE id = $2', 
      [{ date, startTime, endTime }, userId]
    );    
    res.status(200).json({ message: 'Availability saved successfully' });
  } catch (error) {
    console.error('Error saving availability:', error);
    res.status(500).json({ message: 'An error occurred while saving availability' });
  }
});

app.get('/trainer-availability', async (req, res) => {
  try {
    const result = await connection.query('SELECT username, availability FROM trainers');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting trainer availability:', error);
    res.status(500).json({ error: 'An error occurred while etting trainer availability' });
  }
});

app.post('/book-session', async (req, res) => {
  try {
    const { user_name, trainer_name, session_date, start_time, end_time } = req.body;


    const existingSessionQuery = `
      SELECT * FROM sessions
      WHERE trainer_name = $1
      AND session_date = $2
      AND start_time = $3
      AND end_time = $4
      AND booked = TRUE;
    `;
    const existingSessionResult = await connection.query(existingSessionQuery, [trainer_name, session_date, start_time, end_time]);
    if (existingSessionResult.rows.length > 0) {
      return res.status(400).json({ message: 'Session is already booked' });
    }


    const query = `
    INSERT INTO sessions (user_name, trainer_name, session_date, start_time, end_time, booked)
    VALUES ($1, $2, $3, $4, $5, TRUE)
    RETURNING *;
  `;

    const result = await connection.query(query, [user_name, trainer_name, session_date, start_time, end_time]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error booking session:', error);
    res.status(500).json({ message: 'An error occurred while booking session' });
  }
});

app.delete('/cancel-session', async (req, res) => {
  try {
    const { user_name, trainer_name, session_date, start_time, end_time } = req.body;
    const currentUser = user_name; 
    const sessionQuery = `
      SELECT user_name
      FROM sessions
      WHERE trainer_name = $1
      AND session_date = $2
      AND start_time = $3
      AND end_time = $4
    `;
    const sessionResult = await connection.query(sessionQuery, [trainer_name, session_date, start_time, end_time]);
    
    if (sessionResult.rows.length === 0) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const sessionUserName = sessionResult.rows[0].user_name;
    console.log(sessionUserName)

    if (currentUser !== sessionUserName) {
      return res.status(403).json({ message: 'You are not authorized to cancel this session' });
    }

    const deleteQuery = `
      DELETE FROM sessions
      WHERE user_name = $1 
      AND trainer_name = $2
      AND session_date = $3
      AND start_time = $4
      AND end_time = $5
    `;
    
    await connection.query(deleteQuery, [user_name, trainer_name, session_date, start_time, end_time]);

    res.status(200).json({ message: 'Session cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling session:', error);
    res.status(500).json({ message: 'An error occurred while cancelling the session' });
  }
});

app.get('/user-sessions', async (req, res) => {
  try {
      const { un } = req.query; 

      const query = `
      SELECT * FROM sessions
      WHERE user_name = $1 OR trainer_name = $1;
  `;
  

      const result = await connection.query(query, [un]);

      res.json(result.rows);
  } catch (error) {
      console.error('Error fetching user sessions:', error);
      res.status(500).json({ error: 'An error occurred while fetching user sessions' });
  }
});

app.get('/equipment-monitoring', async (req, res) => {
  try {
    const query = 'SELECT * FROM equipment_monitoring ORDER BY id';

    const result = await connection.query(query);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching equipment monitoring data:', error);
    res.status(500).json({ error: 'An error occurred while fetching equipment monitoring data' });
  }
});

app.put('/isFunctional', async (req, res) => {
  const { isFunctional, id } = req.body;

  try {
    await connection.query('UPDATE equipment_monitoring SET isfunctional = $1 WHERE id = $2', [isFunctional, id]);
    res.status(200).json({ message: 'Equipment status updated successfully' });
  } catch (error) {
    console.error('Error updating equipment status:', error);
    res.status(500).json({ error: 'An error occurred while updating equipment status' });
  }
});


app.get('/get-classes', async (req, res) => {
  try {
    const { date } = req.query; 
    const dateOnly = date.split('T')[0]; 

    const query = {
      text: 'SELECT * FROM classes WHERE class_date = $1',
      values: [dateOnly],
    };

    const result = await connection.query(query);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching classes for the specified date:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.post('/join-class', async (req, res) => {
  try {
    const { user_name, className, session_date, start_time, end_time } = req.body;
    
    const participant = JSON.stringify(user_name);

    await connection.query(
      'UPDATE classes SET participant = array_append(participant, $1) WHERE class_name = $2 AND class_date = $3 AND class_time = $4 AND class_endtime = $5',
      [participant, className, session_date, start_time, end_time]
    );
    res.status(200).send('User joined the class successfully.');
  } catch (error) {
    console.error('Error joining class:', error);
    res.status(500).send('An error occurred while joining the class.');
  }
});



app.get('/user-classes', async (req, res) => {
  try {
    const { un } = req.query; 

    const username = JSON.stringify(un);

    const query = `
      SELECT * FROM classes
      WHERE $1 = ANY (participant);
    `;

    const result = await connection.query(query, [username]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching user sessions:', error);
    res.status(500).json({ error: 'An error occurred while fetching user sessions' });
  }
});

app.get('/check', async (req, res) => {
  try {
    const { user_name, title, startTime, endTime, date } = req.query;

    const query = `
      SELECT * FROM classes
      WHERE class_name = $1 AND class_date = $2 AND class_time = $3 AND class_endtime = $4;
    `;

    const result = await connection.query(query, [title, date, startTime, endTime]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const enrolledUsers = result.rows[0].participant;
    let isEnrolled = false;
    if (enrolledUsers) {
      isEnrolled = enrolledUsers.includes(user_name);
    }

    res.json({ isEnrolled });
  } catch (error) {
    console.error('Error checking enrollment:', error);
    res.status(500).json({ error: 'An error occurred while checking enrollment' });
  }
});


app.delete('/cancel-class', async (req, res) => {
  try {
    const { user_name, class_name, class_date, class_time, class_endtime } = req.body;
    const currentUser = user_name; 
    const classQuery = `
      SELECT participant
      FROM classes
      WHERE class_name = $1
      AND class_date = $2
      AND class_time = $3
      AND class_endtime = $4
    `;
    const classResult = await connection.query(classQuery, [class_name, class_date, class_time, class_endtime]);

    if (classResult.rows.length === 0) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const participants = classResult.rows[0].participant;

    if (!participants.includes(currentUser)) {
      return res.status(403).json({ message: 'You are not authorized to cancel this class' });
    }

    const updatedParticipants = participants.filter(user => user !== currentUser);

    const updateQuery = `
      UPDATE classes
      SET participant = $1
      WHERE class_name = $2 
      AND class_date = $3
      AND class_time = $4
      AND class_endtime = $5
    `;
    await connection.query(updateQuery, [updatedParticipants, class_name, class_date, class_time, class_endtime]);

    res.status(200).json({ message: 'User removed from class successfully' });
  } catch (error) {
    console.error('Error removing user from class:', error);
    res.status(500).json({ message: 'An error occurred while removing user from class' });
  }
});

app.get('/classes', async (req, res) => {
  try {

    const query = {
      text: 'SELECT * FROM classes'
    };
    const result = await connection.query(query);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching classes for the specified date:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/update-class', async (req, res) => {
  try {
    console.log(req.body)
    const { class_id, class_name, class_date, class_time, class_endtime } = req.body;

    const updateQuery = `
      UPDATE classes
      SET class_name = $1, class_date = $2, class_time = $3, class_endtime = $4
      WHERE class_id = $5
    `;
    await connection.query(updateQuery, [class_name, class_date, class_time, class_endtime, class_id]);

    res.status(200).json({ message: 'Class session updated successfully' });
  } catch (error) {
    console.error('Error updating class session:', error);
    res.status(500).json({ message: 'An error occurred while updating class session' });
  }
});

app.post('/create-bill', async (req, res) => {
  const { userId, amount } = req.body;
  const query = 'INSERT INTO billings (user_id, amount) VALUES ($1, $2) RETURNING *';
  try {
    const { rows } = await connection.query(query, [userId, amount]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creating billing record:', error);
    res.status(500).send('An error occurred while creating the billing record.');
  }
});

app.delete('/cancel-bill', async (req, res) => {
  const { userId } = req.body; 
  try {
    const { rows } = await connection.query('DELETE FROM billings WHERE id = $1 RETURNING *', [userId]);
    if (rows.length === 0) {
      res.status(404).send('Billing record not found.');
    } else {
      res.json({ message: 'Billing record deleted successfully.' });
    }
  } catch (error) {
    console.error('Error deleting billing record:', error);
    res.status(500).send('An error occurred while deleting the billing record.');
  }
});


app.put('/update-bill', async (req, res) => {
  const { userId, amount } = req.body;
  const query = 'UPDATE billings SET amount = $2 WHERE id = $1 RETURNING *';
  try {
    const { rows } = await connection.query(query, [userId, amount]);
    if (rows.length === 0) {
      res.status(404).send('Billing record not found.');
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.error('Error updating billing record:', error);
    res.status(500).send('An error occurred while updating the billing record.');
  }
});

app.get('/get-user-billings', async (req, res) => {
  const { userId } = req.query;
  try {
    const { rows } = await connection.query('SELECT * FROM billings WHERE user_id = $1', [userId]);
    if (rows.length === 0) {
      res.status(404).send('Billing record not found.');
    } else {
      res.json(rows);
    }
  } catch (error) {
    console.error('Error fetching billing record:', error);
    res.status(500).send('An error occurred while fetching the billing record.');
  }
});

app.get('/get-all-billings', async (req, res) => {
  try {
    const { rows } = await connection.query('SELECT * FROM billings');
    
    res.json(rows);
    
  } catch (error) {
    console.error('Error fetching billing record:', error);
    res.status(500).send('An error occurred while fetching the billing record.');
  }
});

app.post('/update-payment', (req, res) => {
  const { billingId } = req.body;

  const query = 'UPDATE billings SET payment_status = true WHERE id = $1';
  connection.query(query, [billingId], (err, result) => {
    if (err) {
      console.error('Error updating payment status:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    console.log('Payment status updated successfully');
    res.status(200).json({ message: 'Payment status updated successfully' });
  });
});

app.get('/get-rooms', async (req, res) => {
  try {
    const { rows } = await connection.query('SELECT * FROM rooms');
    
    res.json(rows);
    
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).send('An error occurred while fetching rooms.');
  }
});

app.put('/take-class', async (req, res) => {
  const { classId, roomId } = req.body;

  try {
    const checkTakenQuery = 'SELECT isTaken FROM rooms WHERE room_id = $1';
    const { rows } = await connection.query(checkTakenQuery, [roomId]);

    if (rows.length === 0) {
      res.status(404).json({ error: 'Room not found' });
      return;
    }

    const isTaken = rows[0].istaken;
    if (isTaken) {
      res.status(400).json({ error: 'The room is already taken' });
      return;
    }

    const updateQuery = 'UPDATE rooms SET class_id = $1, isTaken = true WHERE room_id = $2';
    await connection.query(updateQuery, [classId, roomId]);

    res.status(200).json({ message: 'Room selected for the class successfully.' });
  } catch (error) {
    console.error('Error selecting room for class:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/remove-room', async (req, res) => {
  const { classId } = req.body;

  try {
    const updateQuery = 'UPDATE rooms SET class_id = NULL, isTaken = false WHERE class_id = $1';
    await connection.query(updateQuery, [classId]);
    res.status(200).json({ message: 'Room removed from the class successfully.' });
  } catch (error) {
    console.error('Error removing room from class:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
