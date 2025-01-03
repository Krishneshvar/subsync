import appDB from "../db/subsyncDB.js";
import { getCurrentTime } from "../middlewares/time.js";
import { generateID } from "../middlewares/customerIDGen.js";
import { isValidGSTIN, isValidEmail, isValidPhoneNumber } from "../middlewares/validations.js";

async function addCustomer(customer) {
    try {
        // Validate fields
        if (!customer.salutation || !customer.firstName || !customer.lastName || !customer.email || !customer.phoneNumber || !customer.address ||
            !customer.companyName || !customer.displayName || !customer.gstin || !customer.currencyCode || !customer.gst_treatment || !customer.tax_preference) {
            throw new Error("All required fields must be provided.");
        }
    
        // Validate GSTIN format
        if (!isValidGSTIN(customer.gstin)) {
            throw new Error("Invalid GSTIN format.");
        }
    
        // Email Validation
        if (!isValidEmail(customer.email)) {
            throw new Error("Invalid email address format.");
        }
    
        // Phone Number Validation
        if (!isValidPhoneNumber(customer.phoneNumber)) {
            throw new Error("Invalid phone number. It must be a 13-digit number.");
        }

        const currentTime = getCurrentTime();
        const cid = generateID();
        const customerAddress = JSON.stringify(customer.address);
        const otherContacts = JSON.stringify(customer.contactPersons);

        const [result] = await appDB.query(
            "INSERT INTO customers (customer_id, salutation, first_name, last_name, primary_email, primary_phone_number, customer_address, " +
            "other_contacts, company_name, display_name, gst_in, currency_code, gst_treatment, tax_preference, exemption_reason, " +
            "notes, created_at, updated_at) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
            [
                cid, customer.salutation, customer.firstName, customer.lastName, customer.email, customer.phoneNumber,
                customerAddress, otherContacts, customer.companyName, customer.displayName, customer.gstin,
                customer.currencyCode, customer.gst_treatment, customer.tax_preference, customer.exemption_reason || "",
                customer.notes || "", currentTime, currentTime,
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
            "WHERE customer_id = ?;", [
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

const getAllCustomers = async ({ search = "", sort = "display_name", order = "asc", page = 1, limit = 10 }) => {
    const offset = (page - 1) * limit;
    const searchQuery = `%${search}%`;

    try {
      const [customers] = await appDB.query(  // Changed 'db' to 'appDB'
            `SELECT customer_id, salutation, first_name, display_name, company_name, primary_phone_number, primary_email
             FROM customers 
             WHERE display_name LIKE ? 
             ORDER BY ?? ${order.toUpperCase()} 
             LIMIT ? OFFSET ?`, 
            [searchQuery, sort, parseInt(limit), parseInt(offset)]
        );

        // Query to count total records for pagination
        const [[{ total }]] = await appDB.query(  // Changed 'db' to 'appDB'
            `SELECT COUNT(*) as total FROM customers WHERE display_name LIKE ?`,
            [searchQuery]
        );

        const totalPages = Math.ceil(total / limit);
        return({customers, totalPages});
    } catch (error) {
      console.error("Error fetching customers:", error);
      throw error;
    }
};

// Fetch a single customer by ID
const getCustomerById = async (customerId) => {
    try {
        const [result] = await appDB.query(
            `SELECT * FROM customers WHERE customer_id = ?`,
            [customerId]
        );
        return result[0];
    } catch (error) {
        console.error("Error fetching customer by ID:", error);
        throw error;
    }
};

// Export the functions
export { addCustomer, updateCustomer, getAllCustomers, getCustomerById };
