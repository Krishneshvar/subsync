-- --- create database -----
CREATE DATABASE IF NOT EXISTS ocs_srms;
USE ocs_srms;

-- --- create Customers table -----
CREATE TABLE customers (
    -- personal details
    customer_id VARCHAR(36) PRIMARY KEY,
    salutation ENUM('Mr.', 'Ms.', 'Mrs.', 'Dr.') NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    primary_email VARCHAR(255) NOT NULL,
    primary_phone_number VARCHAR(15) NOT NULL,
    secondary_phone_number VARCHAR(15),

    -- company info
    company_name VARCHAR(128) NOT NULL,
    display_name VARCHAR(128) NOT NULL,
    gst_in VARCHAR(15) NOT NULL,
    currency_code CHAR(3) NOT NULL DEFAULT 'INR',
    gst_treatment ENUM('iGST', 'CGST & SGST', 'No GST', 'Zero Tax', 'SEZ') NOT NULL,
    tax_preference ENUM('Taxable', 'Tax Exempt') NOT NULL DEFAULT 'Taxable',
    exemption_reason TEXT,

    -- address and contacts
    customer_address JSON NOT NULL,
    other_contacts JSON,
    notes TEXT,

    -- payment and status
    payment_terms JSON NOT NULL,
    customer_status ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',

    -- timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- indexes
    INDEX idx_company_name (company_name),
    INDEX idx_display_name (display_name),
    INDEX idx_primary_phone (primary_phone_number),
    INDEX idx_primary_email (primary_email),
    INDEX idx_name (salutation, first_name, last_name),
    INDEX idx_customer_status (customer_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --- create Payment Terms table -----
CREATE TABLE payment_terms (
    term_id INT AUTO_INCREMENT PRIMARY KEY,
    term_name VARCHAR(50) NOT NULL,
    days INT NOT NULL,
    is_default BOOLEAN DEFAULT false,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_term_name (term_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --- create Vendors table -----
CREATE TABLE IF NOT EXISTS vendors (
    -- personal details
    vendor_id VARCHAR(20) PRIMARY KEY,
    salutation ENUM('Mr.', 'Ms.', 'Mrs.', 'Dr.') NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    primary_email VARCHAR(100) NOT NULL,
    country_code VARCHAR(5) NOT NULL DEFAULT '+91',
    primary_phone_number VARCHAR(15) NOT NULL,
    secondary_phone_number VARCHAR(15),

    -- company info
    company_name VARCHAR(100) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    gst_in VARCHAR(15) NOT NULL,
    currency_code CHAR(3) NOT NULL DEFAULT 'INR',
    gst_treatment ENUM('iGST', 'CGST & SGST', 'No GST', 'Zero Tax', 'SEZ') NOT NULL,
    tax_preference ENUM('Taxable', 'Tax Exempt') NOT NULL DEFAULT 'Taxable',
    exemption_reason TEXT,

    -- address and contacts
    vendor_address JSON NOT NULL,
    other_contacts JSON,
    notes TEXT,

    -- payment and status
    -- payment_terms JSON NOT NULL,
    vendor_status ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',

    -- timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- indexes
    UNIQUE KEY unique_gst_in (gst_in),
    UNIQUE KEY unique_email (primary_email),
    UNIQUE KEY unique_phone (primary_phone_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --- create Domains Table linked with Customers -----
CREATE TABLE IF NOT EXISTS domains (
    domain_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id VARCHAR(15) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    domain_name VARCHAR(255) UNIQUE NOT NULL,
    registration_date DATE NOT NULL,
    registered_with ENUM('OCS', 'Direct Customer', 'Winds', 'Others') NOT NULL,
    mail_service_provider ENUM('ResellerClub', 'Google Workspace', 'Business Email', 'Microsoft 365', 'Others') NOT NULL DEFAULT 'Others',
    other_provider VARCHAR(255) DEFAULT NULL,
    other_mail_service_details VARCHAR(255) DEFAULT NULL,
    name_server VARCHAR(255),
    description TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --- create Domain Name Servers table -----
CREATE TABLE domain_name_servers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    domain_id INT NOT NULL,
    name_server VARCHAR(255) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (domain_id) REFERENCES domains(domain_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --- create Services table -----
CREATE TABLE IF NOT EXISTS services (
    service_id INT AUTO_INCREMENT PRIMARY KEY,
    service_name VARCHAR(255) UNIQUE NOT NULL,
    stock_keepers_unit VARCHAR(50) NOT NULL,
    tax_preference ENUM('Taxable', 'Tax Exempt') NOT NULL DEFAULT 'Taxable',
    item_group VARCHAR(255) NOT NULL,
    sales_info JSON NOT NULL,
    purchase_info JSON NOT NULL,
    preferred_vendor VARCHAR(20),
    default_tax_rates JSON NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_preferred_vendor
        FOREIGN KEY (preferred_vendor)
        REFERENCES vendors(vendor_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --- create Item Groups table -----
CREATE TABLE IF NOT EXISTS item_groups (
    item_group_id INT AUTO_INCREMENT PRIMARY KEY,
    item_group_name VARCHAR(255) UNIQUE NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --- create Tax details table -----
CREATE TABLE taxes (
    tax_rates JSON,
    default_tax_preference JSON,
    gst_settings JSON
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --- create GST Settings table -----
CREATE TABLE gst_settings (
    tax_reg_num_label VARCHAR(10) NOT NULL,
    gst_in VARCHAR(15) NOT NULL,
    business_legal_name VARCHAR(20) NOT NULL,
    business_trade_name VARCHAR(20) NOT NULL,
    gst_reg_date DATE NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --- create Users table -----
CREATE TABLE users (
    username VARCHAR(32) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(60) NOT NULL,
    role VARCHAR(32) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------
-- -------------------------
-- --- Default values: -----

INSERT INTO payment_terms (term_name, days, is_default) VALUES
("Due on Receipt", 0, true),
("15 days after Receipt", 15, false),
("30 days after Receipt", 30, false),
("60 days after Receipt", 60, false);

INSERT INTO item_groups (item_group_name) VALUES ("Domain");

INSERT INTO users (username, name, password, role, email) VALUES
("admin", "Admin", "$2a$15$y1RbuEkAaGOvDwetY0avf.4u8wSCTvGG.Eyu75RcAjJiToTcHf9ki", "admin", "admin@admin.com"),
("krish", "Krishneshvar", "$2a$15$I83qxVHp6NbK/lEbe/VOc.pS/oIHR8dp2u9Caaz3S3v03gixYmtBW", "user", "krishjn07@gmail.com"),
("athish", "Athish", "$2a$15$f2blQpjXNFixBh5zel7FLu4j4SJ0fjlZPmNMySDoaSeo1RxQ3aqf.", "user", "hathish2503@gmail.com");
