CREATE DATABASE health;

\c health;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username varchar(255) UNIQUE NOT NULL,
    email_address varchar(255) UNIQUE NOT NULL,
    userpassword TEXT NOT NULL, 
    age INTEGER,
    weight REAL,
    height REAL,
    fitness_goal TEXT,
    role varchar(255) DEFAULT 'user',
    bmi text,
    achivements text,
    exercises jsonb[]
);

CREATE TABLE trainers (
    id SERIAL PRIMARY KEY,
    username varchar(255) UNIQUE NOT NULL,
    email_address varchar(255) UNIQUE NOT NULL,
    userpassword TEXT NOT NULL,
    role varchar(255) DEFAULT 'trainer',
    availability JSONB[]
);

CREATE TABLE administrators (
    adminid SERIAL PRIMARY KEY,
    email_address varchar(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role varchar(255) DEFAULT 'admin'
);

CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    user_name TEXT NOT NULL,
    trainer_name TEXT NOT NULL,
    session_date DATE NOT NULL,
    start_time TIME NOT NULL,	
    end_time TIME NOT NULL,
    booked BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_name) REFERENCES users(username),
    FOREIGN KEY (trainer_name) REFERENCES trainers(username)
);

CREATE TABLE billings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    payment_status BOOL DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE equipment_monitoring (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    isFunctional BOOLEAN
);

CREATE TABLE classes (
    class_id SERIAL PRIMARY KEY,
    class_name VARCHAR(255) NOT NULL,
    class_date DATE NOT NULL,
    class_time TIME NOT NULL,
    class_endtime TIME NOT NULL,
    participant JSONB[]
);

CREATE TABLE rooms (
    room_id SERIAL PRIMARY KEY,
    room_name VARCHAR(255) NOT NULL,
    class_id INT,
    isTaken BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (class_id) REFERENCES classes(class_id)
);
