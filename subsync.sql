-- Create the database
CREATE DATABASE ocs_srms;

-- Connect to the subsync database
USE ocs_srms;

-- Create the Customers table
CREATE TABLE customers (
    customer_id VARCHAR(15) PRIMARY KEY,
    salutation ENUM('Mr.', 'Ms.', 'Mrs.', 'Dr.') NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    primary_email TEXT NOT NULL,
    primary_phone_number BIGINT NOT NULL,
    customer_address JSON NOT NULL,
    other_contacts JSON,
    notes TEXT,

    company_name VARCHAR(128) NOT NULL,
    display_name VARCHAR(128) NOT NULL,
    gst_in VARCHAR(15) UNIQUE NOT NULL,
    currency_code CHAR(3) NOT NULL,
    gst_treatment ENUM('iGST', 'CGST & SGST', 'No GST') NOT NULL,
    tax_preference ENUM('Taxable', 'Tax Exempt') NOT NULL,
    exemption_reason TEXT,

    customer_status ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create the Domains Table Associated with Customers
CREATE TABLE IF NOT EXISTS domains (
    domain_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id VARCHAR(15) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    domain_name VARCHAR(255) UNIQUE NOT NULL,
    registration_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    registered_with ENUM('OCS', 'Direct Customer', 'Winds', 'Others') NOT NULL,
    other_provider VARCHAR(255) DEFAULT NULL,
    name_server VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
);


-- Create the Users table
CREATE TABLE users (
    username VARCHAR(32) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

select * from customers;
