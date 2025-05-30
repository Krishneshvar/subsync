import appDB from "../db/subsyncDB.js";
import { getCurrentTime } from "../middlewares/time.js";
import { generateID } from "../middlewares/generateID.js";
import { isValidGSTIN, isValidEmail, isValidPhoneNumber } from "../middlewares/validations.js";

/**
 * Function to add a customer into the database
 * @param   {Object}          customer The object with customer details
 * @returns {Promise<number>}
 */
async function addCustomer(customer) {
    try {
        // Validate required fields
        if (!customer.salutation || !customer.firstName || !customer.lastName || !customer.email || !customer.phoneNumber || !customer.address ||
            !customer.address.state || !customer.companyName || !customer.displayName || !customer.gstin || !customer.currencyCode || !customer.gst_treatment || !customer.tax_preference) {
            throw new Error("All required fields must be provided.");
        }

        if (!isValidGSTIN(customer.gstin)) {
            throw new Error("Invalid GSTIN format.");
        }

        if (!isValidEmail(customer.email)) {
            throw new Error("Invalid email address format.");
        }

        if (!isValidPhoneNumber(customer.phoneNumber)) {
            throw new Error("Invalid primary phone number format.");
        }

        if (customer.secondaryPhoneNumber && !isValidPhoneNumber(customer.secondaryPhoneNumber)) {
            throw new Error("Invalid secondary phone number format.");
        }

        // Additional address validation
        if (!customer.address.state.trim()) {
            throw new Error("State cannot be empty in the address.");
        }

        const currentTime = getCurrentTime();
        const cid = generateID("CID");

        // Serialize JSON fields
        const customerAddress = JSON.stringify(customer.address);
        const otherContacts = JSON.stringify(customer.contactPersons) || JSON.stringify([]);
        const paymentTerms = JSON.stringify(customer.payment_terms) || JSON.stringify({ term_name: "Due on Receipt", days: 0, is_default: true });

        // Execute SQL query
        const [result] = await appDB.query(
            "INSERT INTO customers (customer_id, salutation, first_name, last_name, primary_email, country_code, primary_phone_number, secondary_phone_number, " +
            "customer_address, other_contacts, company_name, display_name, gst_in, currency_code, gst_treatment, tax_preference, exemption_reason, " +
            "payment_terms, notes, customer_status, created_at, updated_at) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
            [
                cid, customer.salutation, customer.firstName, customer.lastName, customer.email,
                customer.country_code,
                Number(customer.phoneNumber),
                customer.secondaryPhoneNumber ? Number(customer.secondaryPhoneNumber) : null,
                customerAddress, otherContacts, customer.companyName, customer.displayName, customer.gstin,
                customer.currencyCode, customer.gst_treatment, customer.tax_preference, customer.exemption_reason || "",
                paymentTerms, customer.notes || "", customer.customerStatus, currentTime, currentTime,
            ]
        );

        // Check result
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
    const {
        salutation, first_name, last_name, primary_email, country_code, primary_phone_number, secondary_phone_number,
        customer_address, company_name, display_name, gst_in, currency_code, gst_treatment, other_contacts,
        tax_preference, exemption_reason, payment_terms, notes, customer_status
    } = updatedData;

    console.log("Updated data received:", updatedData);

    // Validation
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
        throw new Error("Invalid primary phone number format.");
    }
    if (secondary_phone_number && !isValidPhoneNumber(secondary_phone_number)) {
        throw new Error("Invalid secondary phone number format.");
    }

    try {
        const currentTime = getCurrentTime();

        // Serialize JSON fields
        const serializedAddress = JSON.stringify(customer_address);
        const serializedContacts = JSON.stringify(other_contacts);
        const serializedPaymentTerms = JSON.stringify(payment_terms) || JSON.stringify({ term_name: "Due on Receipt", days: 0, is_default: true });

        // Convert phone numbers to proper format
        const formattedPrimaryPhone = Number(primary_phone_number);
        const formattedSecondaryPhone = secondary_phone_number ? Number(secondary_phone_number) : null;

        const [result] = await appDB.query(
            `UPDATE customers SET 
                salutation = ?, first_name = ?, last_name = ?, primary_email = ?, country_code = ?,
                primary_phone_number = ?, secondary_phone_number = ?, customer_address = ?, other_contacts = ?,
                company_name = ?, display_name = ?, gst_in = ?, currency_code = ?, gst_treatment = ?,
                tax_preference = ?, exemption_reason = ?, payment_terms = ?, notes = ?, customer_status = ?,
                updated_at = ?
            WHERE customer_id = ?`,
            [
                salutation, first_name, last_name, primary_email, country_code,
                formattedPrimaryPhone, formattedSecondaryPhone, serializedAddress, serializedContacts,
                company_name, display_name, gst_in, currency_code, gst_treatment,
                tax_preference, exemption_reason, serializedPaymentTerms, notes, customer_status,
                currentTime, customerId
            ]
        );

        if (result.affectedRows === 0) {
            throw new Error("Customer not found or no changes made.");
        }

        return result;
    } catch (error) {
        console.error("Error updating customer:", error);
        throw new Error("Failed to update customer details.");
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
            `SELECT customer_id, salutation, first_name, display_name, company_name, primary_phone_number, primary_email, customer_status
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
* Function to get all customer details to be displayed
* @returns {Promise<{ customers: *}>}
*/
const getAllCustomersDetails = async () => {
   try {
     const [customers] = await appDB.query("SELECT * FROM customers;");
     return customers;
   } catch (error) {
     console.error("Error fetching all customer Details:", error);
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
        console.log(result);
        return result[0];
    } catch (error) {
        console.error("Error fetching customer by ID:", error);
        throw error;
    }
};

/**
 * Import multiple customers in bulk
 * @param {Array} customers - Array of customer objects to be inserted
 */
 const importCustomerData = async (customers) => {
    const query = `
        INSERT INTO customers (salutation, first_name, last_name, primary_email, country_code, primary_phone_number, 
                               customer_address, company_name, display_name, gst_in, currency_code, gst_treatment, 
                               tax_preference, exemption_reason, notes, other_contacts, customer_status) 
        VALUES ?
    `;

    const values = customers.map(customer => [
        customer.salutation,
        customer.first_name,
        customer.last_name,
        customer.primary_email,
        customer.country_code,
        customer.primary_phone_number,
        JSON.stringify(customer.customer_address),
        customer.company_name,
        customer.display_name,
        customer.gst_in,
        customer.currency_code,
        customer.gst_treatment,
        customer.tax_preference,
        customer.exemption_reason,
        customer.notes,
        JSON.stringify(customer.other_contacts),
        customer.customer_status,
    ]);

    await db.query(query, [values]);
};


export { addCustomer, updateCustomer, getAllCustomers, getCustomerById, getAllCustomersDetails, importCustomerData };
