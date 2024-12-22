import { addCustomer, updateCustomer, getAllCustomers, getCustomerById } from "../models/customerModel.js"; // Import the correct function
import appDB from "../db/subsyncDB.js"; // Import the connection pool

// Add Customer
const createCustomer = async (req, res) => {
    try {
        const { salutation, first_name, last_name, primary_email, primary_phone_number, customer_address,
                company_name, display_name, gst_in, currency_code, place_of_supply, gst_treatment,
                tax_preference, exemption_reason, custom_fields, notes } = req.body;

        // Validate required fields
        if (!salutation || !first_name || !last_name || !primary_email || !primary_phone_number || !customer_address ||
            !company_name || !display_name || !gst_in || !currency_code || !place_of_supply || !gst_treatment || !tax_preference) {
            return res.status(400).json({ error: 'All required fields must be provided.' });
        }

        const customer = {
            salutation, first_name, last_name, primary_email, primary_phone_number, customer_address,
            company_name, display_name, gst_in, currency_code, place_of_supply, gst_treatment,
            tax_preference, exemption_reason, custom_fields, notes
        };

        const customerId = await addCustomer(customer);

        res.status(201).json({ message: 'Customer created successfully!' });
    } catch (error) {
        console.error("Customer creation error:", error);
        res.status(500).json({ error: error.message });
    }
};

// Update Customer
const updateCustomerDetails = async (req, res) => {
    const { cid } = req.params;
    try {
        const { salutation, first_name, last_name, primary_email, primary_phone_number, customer_address,
                company_name, display_name, gst_in, currency_code, place_of_supply, gst_treatment,
                tax_preference, exemption_reason, custom_fields, notes } = req.body;

        const updatedData = {
            salutation, first_name, last_name, primary_email, primary_phone_number, customer_address,
            company_name, display_name, gst_in, currency_code, place_of_supply, gst_treatment,
            tax_preference, exemption_reason, custom_fields, notes
        };

        // Update customer
        await updateCustomer(cid, updatedData);

        res.status(200).json({ message: 'Customer updated successfully!' });
    } catch (error) {
        console.error("Customer update error:", error);
        res.status(500).json({ error: error.message });
    }
};

// Fetch all customers
const fetchAllCustomers = async (req, res) => {  // Correct function definition
    const { search = "", sort = "display_name", order = "asc", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const searchQuery = `%${search}%`;

    try {
        // Query to fetch filtered and paginated customers
        const [customers] = await appDB.query(  // Changed 'db' to 'appDB'
            `SELECT customer_id, display_name, company_name, primary_phone_number, primary_email
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
        res.status(200).json({ customers, totalPages });
    } catch (error) {
        console.error("Error fetching customers:", error);
        res.status(500).json({ error: "Failed to fetch customers from the database." });
    }
};

const customerDetailsByID = async (req, res) => {
    try {
        const customer = await getCustomerById(req.params.cid); // Use req.params.cid
        if (!customer) {
            return res.status(404).json({ error: "Customer not found." });
        }
        res.status(200).json({ customer });
    } catch (error) {
        console.error("Error fetching customer details:", error);
        res.status(500).json({ error: "Failed to fetch customer details." });
    }
};

// Export the functions correctly
export { createCustomer, updateCustomerDetails, fetchAllCustomers, customerDetailsByID };
