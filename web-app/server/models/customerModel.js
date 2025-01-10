import appDB from "../db/subsyncDB.js";
import { getCurrentTime } from "../middlewares/time.js";
import { generateID } from "../middlewares/customerIDGen.js";
import { isValidGSTIN, isValidEmail, isValidPhoneNumber } from "../middlewares/validations.js";

/**
 * Function to add a customer into the database
 * @param   {Object}          customer The object with customer details
 * @returns {Promise<number>}
 */
async function addCustomer(customer) {
    try {
        if (!customer.salutation || !customer.firstName || !customer.lastName || !customer.email || !customer.phoneNumber || !customer.address ||
            !customer.companyName || !customer.displayName || !customer.gstin || !customer.currencyCode || !customer.gst_treatment || !customer.tax_preference) {
            throw new Error("All required fields must be provided.");
        }

        if (!isValidGSTIN(customer.gstin)) {
            throw new Error("Invalid GSTIN format.");
        }

        if (!isValidEmail(customer.email)) {
            throw new Error("Invalid email address format.");
        }

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

/**
 * Function to edit/update a customer's details in the database
 * @param   {string}     customerId  The ID of the customer, whose details are to be updated
 * @param   {Object}     updatedData The object containing the new customer details
 * @returns {Promise<*>}
 */
async function updateCustomer(customerId, updatedData) {
    const { salutation, first_name, last_name, primary_email, primary_phone_number, customer_address,
            company_name, display_name, gst_in, currency_code, place_of_supply, gst_treatment,otherContacts,
            tax_preference, exemption_reason, custom_fields, notes } = updatedData;

    if (!salutation || !first_name || !last_name || !primary_email || !primary_phone_number || !customer_address ||
        !company_name || !display_name || !gst_in || !currency_code || !gst_treatment || !tax_preference) {
        throw new Error("All required fields must be provided.");
    }

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
            "customer_address = ?, company_name = ?, display_name = ?, gst_in = ?, currency_code = ?, gst_treatment = ?, other_contacts = ? " +
            "tax_preference = ?, exemption_reason = ?, notes = ?, updated_at = ? " +
            "WHERE customer_id = ?;", [
                salutation, first_name, last_name, primary_email, primary_phone_number, JSON.stringify(customer_address),
                company_name, display_name, gst_in, currency_code, gst_treatment,otherContacts,  tax_preference,
                exemption_reason, notes, currentTime, customerId
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

/**
 * Function to get all customer details to be displayed
 * @param {string} search The string to be searched in the database
 * @param {string} sort   The field that is to be sorted
 * @param {string} order  The order in which the given field is to be sorted
 * @param {Number} page   The page of data to be displayed
 * @param {Number} limit  The number of data to be displayed in a page
 * @returns {Promise<{totalPages: number, customers: *}>}
 */
const getAllCustomers = async ({ search = "", sort = "display_name", order = "asc", page = 1, limit = 10 }) => {
    const offset = (page - 1) * limit;
    const searchQuery = `%${search}%`;

    try {
      const [customers] = await appDB.query(
            `SELECT customer_id, salutation, first_name, display_name, company_name, primary_phone_number, primary_email
             FROM customers 
             WHERE display_name LIKE ? 
             ORDER BY ?? ${order.toUpperCase()} 
             LIMIT ? OFFSET ?`, 
            [searchQuery, sort, parseInt(limit), parseInt(offset)]
        );

        const [[{ total }]] = await appDB.query(
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

/**
 * Fetch a single customer by given ID
 * @param   {string}     customerId The ID of the customer, whose details are to be fetched
 * @returns {Promise<*>}
 */
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

export { addCustomer, updateCustomer, getAllCustomers, getCustomerById };
