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
    emails JSON NOT NULL,
    phone_numbers JSON NOT NULL,
    customer_address JSON NOT NULL,
    notes TEXT,

    company_name VARCHAR(128) NOT NULL,
    display_name VARCHAR(128) NOT NULL,
    gst_in VARCHAR(15) NOT NULL,
    currency_code CHAR(3) NOT NULL,
    place_of_supply TEXT NOT NULL,
    gst_treatment ENUM('iGST', 'CGST & SGST', 'No GST') NOT NULL,
    tax_preference ENUM('Taxable', 'Tax Exempt') NOT NULL,
    exemption_reason TEXT,

    custom_fields JSON
);

-- Create the Users table
CREATE TABLE users (
    username VARCHAR(32) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
