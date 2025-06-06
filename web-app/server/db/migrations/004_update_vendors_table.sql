-- Drop existing vendors table
DROP TABLE IF EXISTS vendors;

-- Create new vendors table with expanded fields
CREATE TABLE vendors (
    vendor_id VARCHAR(20) PRIMARY KEY,
    salutation VARCHAR(10) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    primary_email VARCHAR(100) NOT NULL,
    country_code VARCHAR(5) NOT NULL DEFAULT '+91',
    primary_phone_number BIGINT NOT NULL,
    secondary_phone_number BIGINT,
    vendor_address JSON NOT NULL,
    other_contacts JSON,
    company_name VARCHAR(100) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    gst_in VARCHAR(15) NOT NULL,
    currency_code VARCHAR(3) NOT NULL DEFAULT 'INR',
    gst_treatment VARCHAR(50) NOT NULL,
    tax_preference VARCHAR(20) NOT NULL DEFAULT 'Taxable',
    exemption_reason TEXT,
    payment_terms JSON,
    notes TEXT,
    vendor_status VARCHAR(20) NOT NULL DEFAULT 'Active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_gst_in (gst_in),
    UNIQUE KEY unique_email (primary_email),
    UNIQUE KEY unique_phone (primary_phone_number)
); 