INSERT INTO users (username, email_address, userpassword, age, weight, height, fitness_goal, role, bmi, achivements, exercises) 
VALUES 
    ('test', 'test@gmail.com', '123213', 24, 1111, 981, 'GET SAM SULEK BODY', 'user', '50', '{}', '{}'),
    ('teatat', 'afafa@gmail.com', '1242154215', 12, 12, 211, '12', 'user', '10', NULL, NULL),
    ('aaaaaa', 'aa@gmail.com', '112121', 1212, 12, 121, '1212', 'user', '20', NULL, NULL),
    ('awdwa', 'awdawd@gmail.com', '24141', 12, 12, 2112, 'Be not fat', 'user', '30', NULL, NULL),
    ('chaewon', 'chaewon@gmail.com', '12345', 24, 35, 123, 'TEST', 'user', '10', NULL, NULL),
    ('liz', 'liz@gmail.com', '12345', 24, 214, 124, '1241', 'user', '190', NULL, NULL),
    ('agaag', 'agag@gmail.com', '123213', 12, 123, 12, '12', 'user', '12', NULL, NULL),
    ('3eawheah', 'eedf@gmail.com', '123213', 12, 12, 12, '12', 'user', '12', NULL, NULL);

INSERT INTO trainers (username, email_address, userpassword, role, availability) 
VALUES 
    ('johndoe', 'johndoe@trainer.com', '12345', 'trainer', '{}'),
    ('bowesflex', 'bowes@trainer.com', '12345', 'trainer', '{}');

INSERT INTO administrators (email_address, password, role) 
VALUES 
    ('test@admin.com', '12345', 'admin');

--wont include sessions for video demonstration purposes
--wont include billings for video demonstration purposes

INSERT INTO equipment_monitoring (name, isFunctional) 
VALUES 
    ('Smith Machine', false),
    ('Leg Press Machine', true),
    ('Cable Machine', true),
    ('Rowing Machine', false),
    ('Treadmill', false);

INSERT INTO classes (class_name, class_date, class_time, class_endtime, participant) 
VALUES 
    ('Yoga Class', '2024-04-02', '09:00:00', '11:00:00', '{}'),
    ('Zumba Class', '2024-04-02', '15:30:00', '16:30:00', '{}'),
    ('Pilates Class', '2024-04-03', '11:00:00', '12:00:00', '{}'),
    ('Spin Class', '2024-04-04', '18:00:00', '19:00:00', '{}');

INSERT INTO rooms (room_name, class_id, isTaken) 
VALUES 
    ('Room A', NULL, false),
    ('Room B', NULL, false),
    ('Room D', NULL, false),
    ('Room C', NULL, false);
