import { addCustomer, updateCustomer } from "../models/customerModel.js";

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

export { createCustomer, updateCustomerDetails };
