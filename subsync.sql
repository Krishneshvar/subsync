-- Create the database
CREATE DATABASE ocs_srms;

-- Connect to the subsync database
USE ocs_srms;

-- Create the Customers table
    CREATE TABLE customers (
        customer_id VARCHAR(15) PRIMARY KEY,
        salutation ENUM('Mr.', 'Ms.', 'Mrs.', 'Dr.') NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        primary_email VARCHAR(255) NOT NULL UNIQUE,
        country_code VARCHAR(5) NOT NULL DEFAULT '+91',
        primary_phone_number VARCHAR(15) NOT NULL,
        secondary_phone_number VARCHAR(15),
        
        -- Company Information
        company_name VARCHAR(128) NOT NULL,
        display_name VARCHAR(128) NOT NULL,
        gst_in VARCHAR(15) NOT NULL,
        currency_code CHAR(3) NOT NULL DEFAULT 'INR',
        gst_treatment ENUM('iGST', 'CGST & SGST', 'No GST', 'Zero Tax', 'SEZ') NOT NULL,
        tax_preference ENUM('Taxable', 'Tax Exempt') NOT NULL DEFAULT 'Taxable',
        exemption_reason TEXT,
        
        -- Address and Contacts
        customer_address JSON NOT NULL,
        other_contacts JSON,
        notes TEXT,
        
        -- Payment and Status
        payment_terms JSON NOT NULL,
        customer_status ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
        
        -- Timestamps
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        -- Indexes
        INDEX idx_company_name (company_name),
        INDEX idx_display_name (display_name),
        INDEX idx_primary_phone (primary_phone_number),
        INDEX idx_customer_status (customer_status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- JSON structures for Customers table fields
/*
customer_address JSON structure:
{
    "addressLine": "string",
    "city": "string",
    "state": "string",
    "country": "string",
    "zipCode": "string"
}

other_contacts JSON structure:
[
    {
        "salutation": "string",
        "designation": "string",
        "first_name": "string",
        "last_name": "string",
        "email": "string",
        "phone_number": "string",
        "country_code": "string"
    }
]

payment_terms JSON structure:
{
    "term_name": "string",
    "days": number,
    "is_default": boolean
}
*/ 

-- Create the Domains Table Associated with Customers
CREATE TABLE IF NOT EXISTS domains (
    domain_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id VARCHAR(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    domain_name VARCHAR(255) UNIQUE NOT NULL,
    registration_date DATE NOT NULL,
    registered_with ENUM('OCS', 'Direct Customer', 'Winds', 'Others') NOT NULL,
    mail_service_provider ENUM('ResellerClub', 'GWS', 'Business Email', 'Microsoft', 'Others') NOT NULL DEFAULT 'Others';
    other_provider VARCHAR(255) DEFAULT NULL,
    other_mail_service_details VARCHAR(255) DEFAULT NULL;
    name_server VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
);

-- Create the Tax details table
CREATE TABLE taxes (
    tax_rates JSON,
    default_tax_preference JSON,
    gst_settings JSON
);

CREATE TABLE gst_settings (
	tax_reg_num_label VARCHAR(10) NOT NULL,
    gst_in VARCHAR(15) NOT NULL,
    business_legal_name VARCHAR(20) NOT NULL,
    business_trade_name VARCHAR(20) NOT NULL,
    gst_reg_date DATE NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create the Users table
CREATE TABLE users (
    username VARCHAR(32) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE payment_terms (
    term_id INT AUTO_INCREMENT PRIMARY KEY,
    term_name VARCHAR(50) NOT NULL,
    days INT NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_term_name (term_name)
);

INSERT INTO payment_terms (term_name, days, is_default) VALUES
('Due on Receipt', 0, true),
('Net 15', 15, false),
('Net 30', 30, false),
('Net 45', 45, false),
('Net 60', 60, false);

SELECT * FROM customers;
