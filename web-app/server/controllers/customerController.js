import { addCustomer, updateCustomer, getAllCustomers, getCustomerById } from "../models/customerModel.js";

/**
 * Controller function for addCustomer() to be executed at /create-customer
 * @param   {Request}  req The request received from the client in an endpoint
 * @param   {Response} res The response sent to the client in that endpoint
 * @returns {Promise<void>}
 */
const createCustomer = async (req, res) => {
    try {
        console.log("Received Data", req.body)
        addCustomer(req.body);
        

        res.status(201).json({ message: 'Customer created successfully!' });
    } catch (error) {
        console.error("Customer creation error:", error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Controller function for updateCustomer() to be executed at /update-customer/:cid
 * @param   {Request}  req The request received from the client in an endpoint
 * @param   {Response} res The response sent to the client in that endpoint
 * @returns {Promise<void>}
 */
const updateCustomerDetails = async (req, res) => {
    try {
      console.log("Request body received:", req.body);
  
      // Destructure fields with camelCase to snake_case mapping
      const {
        salutation,
        firstName: first_name,
        lastName: last_name,
        email: primary_email,
        phoneNumber: primary_phone_number,
        address: customer_address,
        companyName: company_name,
        displayName: display_name,
        gstin: gst_in,
        currencyCode: currency_code,
        gst_treatment,
        tax_preference,
        exemption_reason,
        notes,
        contactPersons: other_contacts,
      } = req.body;
  
      // Construct updatedData
      const updatedData = {
        salutation,
        first_name,
        last_name,
        primary_email,
        primary_phone_number,
        customer_address,
        company_name,
        display_name,
        gst_in,
        currency_code: currency_code.value || currency_code,
        gst_treatment,
        tax_preference,
        exemption_reason,
        notes,
        other_contacts,
      };
  
      console.log("Updated data:", updatedData);
  
      // Update the customer
      const { cid } = req.params;
      await updateCustomer(cid, updatedData);
  
      res.status(200).json({ message: "Customer updated successfully!" });
    } catch (error) {
      console.error("Customer update error:", error);
      res.status(500).json({ error: error.message });
    }
  };
  


/**
 * Controller function for getAllcustomers() to be executed at /all-customers
 * @param   {Request}  req The request received from the client in an endpoint
 * @param   {Response} res The response sent to the client in that endpoint
 * @returns {Promise<void>}
 */
const fetchAllCustomers = async (req, res) => {
    try {
      const { search = "", sort = "display_name", order = "asc", page = 1, limit = 10 } = req.query;
      const { customers, totalPages } = await getAllCustomers({ search, sort, order, page: parseInt(page), limit: parseInt(limit) });
  
      res.status(200).json({ customers, totalPages });
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ error: "Failed to fetch customers from the database." });
    }
};  

/**
 * Controller function for getCustomerById() to be executed at /customer/:cid
 * @param   {Request}  req The request received from the client in an endpoint
 * @param   {Response} res The response sent to the client in that endpoint
 * @returns {Promise<*>}
 */
const customerDetailsByID = async (req, res) => {
    try {
        const customer = await getCustomerById(req.params.cid); 
        if (!customer) {
            return res.status(404).json({ error: "Customer not found." });
        }

        res.status(200).json({ customer });
    } catch (error) {
        console.error("Error fetching customer details:", error);
        res.status(500).json({ error: "Failed to fetch customer details." });
    }
};

export { createCustomer, updateCustomerDetails, fetchAllCustomers, customerDetailsByID };
