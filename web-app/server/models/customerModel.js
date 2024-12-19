import appDB from "../db/subsyncDB.js";
import { getCurrentTime } from "../middlewares/time.js";

// GST Validation Regex
function isValidGSTIN(gstno) {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[Z]{1}[A-Z0-9]{1}$/;
    return gstRegex.test(gstno);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhoneNumber(phoneNumber) {
    const phoneRegex = /^[0-9]{10}$/; // Adjust this regex for country-specific formats if needed
    return phoneRegex.test(phoneNumber);
}

async function addCustomer(customer) {
    const {
        salutation, first_name, last_name, primary_email, primary_phone_number,
        customer_address, company_name, display_name, gst_in, currency_code, place_of_supply,
        gst_treatment, tax_preference, exemption_reason, custom_fields, notes
    } = customer;

    // Validation for required fields
    if (!salutation || !first_name || !last_name || !primary_email || !primary_phone_number || !customer_address ||
        !company_name || !display_name || !gst_in || !currency_code || !place_of_supply || !gst_treatment || !tax_preference) {
        throw new Error("All required fields must be provided.");
    }

    // Validate GSTIN format
    if (!isValidGSTIN(gst_in)) {
        throw new Error("Invalid GSTIN format.");
    }

    // Email Validation
    if (!isValidEmail(primary_email)) {
        throw new Error("Invalid email address format.");
    }

    // Phone Number Validation
    if (!isValidPhoneNumber(primary_phone_number)) {
        throw new Error("Invalid phone number. It must be a 10-digit number.");
    }

    try {
        const currentTime = getCurrentTime();

        const [result] = await appDB.query(
            "INSERT INTO customers (salutation, first_name, last_name, primary_email, primary_phone_number, customer_address, " +
            "company_name, display_name, gst_in, currency_code, place_of_supply, gst_treatment, tax_preference, exemption_reason, " +
            "custom_fields, notes, created_at, updated_at) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
            [
                salutation, first_name, last_name, primary_email, primary_phone_number, JSON.stringify(customer_address),
                company_name, display_name, gst_in, currency_code, place_of_supply, gst_treatment, tax_preference,
                exemption_reason, JSON.stringify(custom_fields), notes, currentTime, currentTime
            ]
        );

        if (result.affectedRows > 0) {
            return result.insertId;
        } else {
            throw new Error("Failed to add customer. No rows affected.");
        }
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            throw new Error("A customer with this email or phone number already exists.");
        } else if (error.code === 'ER_BAD_NULL_ERROR') {
            throw new Error("One or more fields cannot be null.");
        } else {
            console.error("Database error:", error);
            throw new Error("An unexpected error occurred while adding the customer.");
        }
    }
}

async function updateCustomer(customerId, updatedData) {
    const { salutation, first_name, last_name, primary_email, primary_phone_number, customer_address,
            company_name, display_name, gst_in, currency_code, place_of_supply, gst_treatment,
            tax_preference, exemption_reason, custom_fields, notes } = updatedData;

    // Validation for required fields (same as before)
    if (!salutation || !first_name || !last_name || !primary_email || !primary_phone_number || !customer_address ||
        !company_name || !display_name || !gst_in || !currency_code || !place_of_supply || !gst_treatment || !tax_preference) {
        throw new Error("All required fields must be provided.");
    }

    // Validate GSTIN, email, phone as before
    if (!isValidGSTIN(gst_in)) {
        throw new Error("Invalid GSTIN format.");
    }
    if (!isValidEmail(primary_email)) {
        throw new Error("Invalid email address format.");
    }
    if (!isValidPhoneNumber(primary_phone_number)) {
        throw new Error("Invalid phone number. It must be a 10-digit number.");
    }

    try {
        const currentTime = getCurrentTime();
        const [result] = await appDB.query(
            "UPDATE customers SET salutation = ?, first_name = ?, last_name = ?, primary_email = ?, primary_phone_number = ?, " +
            "customer_address = ?, company_name = ?, display_name = ?, gst_in = ?, currency_code = ?, place_of_supply = ?, " +
            "gst_treatment = ?, tax_preference = ?, exemption_reason = ?, custom_fields = ?, notes = ?, updated_at = ? " +
            "WHERE id = ?;", [
                salutation, first_name, last_name, primary_email, primary_phone_number, JSON.stringify(customer_address),
                company_name, display_name, gst_in, currency_code, place_of_supply, gst_treatment, tax_preference,
                exemption_reason, JSON.stringify(custom_fields), notes, currentTime, customerId
            ]
        );

        if (result.affectedRows > 0) {
            return customerId;  // Return the customer ID if the update was successful
        } else {
            throw new Error("Failed to update customer. No rows affected.");
        }
    } catch (error) {
        console.error("Database error:", error);
        throw new Error("An unexpected error occurred while updating the customer.");
    }
}


export { addCustomer };
