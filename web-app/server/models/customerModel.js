import appDB from "../db/subsyncDB.js";
import logger from "../utils/logger.js";

/**
 * Inserts a new customer record into the database.
 * @param   {Object}          customerData The object containing customer details, prepared by the service layer.
 * @returns {Promise<number>} The ID of the newly inserted customer (database `insertId` if applicable, though UUID is now primary key).
 * @throws {Error} If the database operation encounters an error.
 */
async function createCustomer(customerData) {
    try {
        const [result] = await appDB.query(
            `INSERT INTO customers (
                customer_id, salutation, first_name, last_name, primary_email,
                primary_phone_number, secondary_phone_number, customer_address, other_contacts,
                company_name, display_name, gst_in, currency_code, gst_treatment, tax_preference,
                exemption_reason, payment_terms, notes, customer_status, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            [
                customerData.customer_id, customerData.salutation, customerData.first_name, customerData.last_name,
                customerData.primary_email,
                customerData.primary_phone_number,
                customerData.secondary_phone_number,
                customerData.customer_address, customerData.other_contacts,
                customerData.company_name, customerData.display_name,
                customerData.gst_in, customerData.currency_code, customerData.gst_treatment,
                customerData.tax_preference, customerData.exemption_reason,
                customerData.payment_terms, customerData.notes, customerData.customer_status,
                customerData.created_at, customerData.updated_at,
            ]
        );

        if (result.affectedRows > 0) {
            return result;
        } else {
            throw new Error("Failed to create customer. No rows affected.");
        }
    } catch (error) {
        logger.error("Database error in createCustomer:", { message: error.message, code: error.code, stack: error.stack });
        if (error.code === 'ER_DUP_ENTRY') {
            throw new Error(`Database operation failed: duplicate entry.`);
        } else if (error.code === 'ER_BAD_NULL_ERROR') {
            throw new Error(`Database operation failed: required field missing or null.`);
        }
        throw new Error(`Database error: ${error.message || "An unexpected database error occurred."}`);
    }
}

/**
 * Updates an existing customer's details in the database.
 * @param   {string}     customerId  The ID of the customer to update.
 * @param   {Object}     updatedData The object containing the new customer details, prepared by the service layer.
 * @returns {Promise<Object>} The result of the database update operation.
 * @throws {Error} If database operation encounters an error.
 */
async function updateCustomer(customerId, updatedData) {
    try {
        const [result] = await appDB.query(
            `UPDATE customers SET
                salutation = ?, first_name = ?, last_name = ?, primary_email = ?,
                primary_phone_number = ?, secondary_phone_number = ?, customer_address = ?, other_contacts = ?,
                company_name = ?, display_name = ?, gst_in = ?, currency_code = ?, gst_treatment = ?,
                tax_preference = ?, exemption_reason = ?, payment_terms = ?, notes = ?, customer_status = ?,
                updated_at = ?
            WHERE customer_id = ?`,
            [
                updatedData.salutation, updatedData.first_name, updatedData.last_name, updatedData.primary_email,
                updatedData.primary_phone_number,
                updatedData.secondary_phone_number,
                updatedData.customer_address, updatedData.other_contacts,
                updatedData.company_name, updatedData.display_name,
                updatedData.gst_in, updatedData.currency_code, updatedData.gst_treatment,
                updatedData.tax_preference, updatedData.exemption_reason,
                updatedData.payment_terms, updatedData.notes, updatedData.customer_status,
                updatedData.updated_at, customerId
            ]
        );

        if (result.affectedRows === 0) {
            const [existingCustomer] = await appDB.query("SELECT customer_id FROM customers WHERE customer_id = ?", [customerId]);
            if (existingCustomer.length === 0) {
                throw new Error("Customer not found.");
            } else {
                throw new Error("No changes made to customer details.");
            }
        }

        return result;
    } catch (error) {
        logger.error("Database error in updateCustomer:", { message: error.message, code: error.code, stack: error.stack });
        if (error.code === 'ER_DUP_ENTRY') {
            throw new Error(`Database operation failed: duplicate entry.`);
        }
        throw new Error(`Database error: ${error.message || "An unexpected database error occurred."}`);
    }
}

/**
 * Fetches a paginated list of customer details based on search, sort, and order criteria.
 * @param {Object} options - Options for filtering and pagination.
 * @returns {Promise<{ totalPages: number, customers: Array<Object> }>} Paginated customer data.
 * @throws {Error} If fetching customers fails.
 */
const getPaginatedCustomers = async ({ search = "", sort = "display_name", order = "asc", page = 1, limit = 10 }) => {
    const offset = (page - 1) * limit;
    const searchQuery = `%${search}%`;

    try {
        const [customers] = await appDB.query(
            `SELECT customer_id, salutation, first_name, last_name, display_name, company_name, primary_phone_number, primary_email, customer_status
             FROM customers
             WHERE (
                display_name LIKE ? OR
                first_name LIKE ? OR
                last_name LIKE ? OR
                company_name LIKE ? OR
                primary_phone_number LIKE ? OR
                primary_email LIKE ? OR
                customer_id LIKE ?
             )
             ORDER BY ?? ${order.toUpperCase()}
             LIMIT ? OFFSET ?`,
            [searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, sort, parseInt(limit), parseInt(offset)]
        );

        const [[{ total }]] = await appDB.query(
            `SELECT COUNT(*) as total FROM customers WHERE (
                display_name LIKE ? OR
                first_name LIKE ? OR
                last_name LIKE ? OR
                company_name LIKE ? OR
                primary_phone_number LIKE ? OR
                primary_email LIKE ? OR
                customer_id LIKE ?
            )`,
            [searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, searchQuery]
        );

        const totalPages = Math.ceil(total / limit);
        return { customers, totalPages };
    } catch (error) {
        logger.error("Database error in getPaginatedCustomers:", { message: error.message, code: error.code, stack: error.stack });
        throw new Error(`Database error: ${error.message || "Failed to fetch paginated customers."}`);
    }
};

/**
 * Fetches all customer details from the database without pagination.
 * @returns {Promise<Array<Object>>} An array of all customer objects.
 * @throws {Error} If fetching all customer details fails.
 */
const getAllCustomers = async () => {
    try {
        const [customers] = await appDB.query("SELECT * FROM customers;");
        return customers;
    } catch (error) {
        logger.error("Database error in getAllCustomers:", { message: error.message, code: error.code, stack: error.stack });
        throw new Error(`Database error: ${error.message || "Failed to fetch all customer details."}`);
    }
};

/**
 * Fetches a single customer's details by their ID.
 * @param   {string}     customerId The ID of the customer to fetch.
 * @returns {Promise<Object|null>} The customer object if found, otherwise null.
 * @throws {Error} If fetching customer by ID fails.
 */
const getCustomerById = async (customerId) => {
    try {
        const [result] = await appDB.query(
            `SELECT * FROM customers WHERE customer_id = ?`,
            [customerId]
        );
        if (result.length > 0) {
            if (typeof result[0].customer_address === "string") {
                result[0].customer_address = JSON.parse(result[0].customer_address);
            }
            if (typeof result[0].other_contacts === "string") {
                result[0].other_contacts = JSON.parse(result[0].other_contacts);
            }
             if (typeof result[0].payment_terms === "string") {
                result[0].payment_terms = JSON.parse(result[0].payment_terms);
            }
            return result[0];
        }
        return null;
    } catch (error) {
        logger.error("Database error in getCustomerById:", { message: error.message, code: error.code, stack: error.stack });
        throw new Error(`Database error: ${error.message || "Failed to fetch customer details by ID."}`);
    }
};

/**
 * Imports multiple customers in bulk into the database.
 * @param {Array<Array>} values - An array of arrays, where each inner array is a row of customer data to be inserted.
 * @throws {Error} If the import operation fails.
 */
const importCustomers = async (values) => {
    if (!values || values.length === 0) {
        throw new Error("No customer data provided for import.");
    }

    const query = `
        INSERT INTO customers (
            customer_id, salutation, first_name, last_name, primary_email, primary_phone_number,
            secondary_phone_number, customer_address, other_contacts, company_name, display_name,
            gst_in, currency_code, gst_treatment, tax_preference, exemption_reason, payment_terms,
            notes, customer_status, created_at, updated_at
        )
        VALUES ?
    `;

    try {
        const [result] = await appDB.query(query, [values]);
        return result;
    } catch (error) {
        logger.error("Database error in importCustomers:", { message: error.message, code: error.code, stack: error.stack });
        if (error.code === 'ER_DUP_ENTRY') {
            throw new Error("Database operation failed: duplicate entry during bulk import.");
        }
        throw new Error(`Database error: ${error.message || "An unexpected database error occurred."}`);
    }
};

export {
    createCustomer,
    updateCustomer,
    getPaginatedCustomers,
    getCustomerById,
    getAllCustomers,
    importCustomers
};
