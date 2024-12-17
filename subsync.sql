-- Create the database
CREATE DATABASE subsync;

-- Connect to the subsync database
USE subsync;

-- Create the Customers table
CREATE TABLE Customer (
    customer_id VARCHAR(50) PRIMARY KEY,
    salutation ENUM('Mr.', 'Ms.', 'Mrs.') NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    customer_address VARCHAR(255),
    source VARCHAR(100),
    notes TEXT,
    phone_numbers JSON, 
    emails JSON
);

CREATE TABLE Company (
    company_id INT AUTO_INCREMENT PRIMARY KEY,
    display_name VARCHAR(150) NOT NULL,
    company_name VARCHAR(150) NOT NULL,
    gst_id VARCHAR(50),
    customer_id VARCHAR(50),
    currency_code CHAR(3) NOT NULL,
    payment_reminder JSON,
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id) ON DELETE CASCADE
);

-- Create the Services table
CREATE TABLE Service (
    service_id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(150) NOT NULL,                         
    rate DECIMAL(10,2) NOT NULL,                            
    tax_name VARCHAR(100),                                  
    description TEXT,                                        
    tax_percentage DECIMAL(5,2),                            
    intra_inter_state_tax_details JSON,                     
    source_reference_id VARCHAR(100),                       
    status ENUM('Active', 'Inactive') NOT NULL,            
    usage_unit VARCHAR(50),                               
    service_group VARCHAR(100),                            
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
