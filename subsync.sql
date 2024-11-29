-- Create the database
CREATE DATABASE subsync;

-- Connect to the subsync database
USE subsync;

-- Create the Customers table
CREATE TABLE customers (
    cid SERIAL PRIMARY KEY,
    cname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE,
    address TEXT NOT NULL,
    domains JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create the Services table
CREATE TABLE services (
    sid SERIAL PRIMARY KEY,
    sname VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    validity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create the Subscriptions table
CREATE TABLE subscriptions (
    sub_id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customers(cid) ON DELETE CASCADE,
    service_id INT REFERENCES services(sid) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    start_date DATE NOT NULL,
    end_date TIMESTAMP NOT NULL,
    status VARCHAR(16)
);

-- Create the Reminders table
CREATE TABLE reminders (
    rid SERIAL PRIMARY KEY,
    subscription_id INT REFERENCES subscriptions(sub_id) ON DELETE CASCADE,
    reminder_date DATE NOT NULL,
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create the Users table
CREATE TABLE users (
    username VARCHAR(32) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
