import { addCustomer, updateCustomer, getAllCustomers, getCustomerById, getAllCustomersDetails, importCustomerData } from "../models/customerModel.js";

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

      const {
          salutation,
          firstName: first_name,
          lastName: last_name,
          email: primary_email,
          country_code,
          phoneNumber: primary_phone_number,
          secondaryPhoneNumber,
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
          customerStatus: customer_status,
          payment_terms
      } = req.body;

      // Validate state is not empty
      if (!customer_address.state) {
          return res.status(400).json({ error: "State is required in the address" });
      }

      const updatedData = {
          salutation,
          first_name,
          last_name,
          primary_email,
          country_code,
          primary_phone_number,
          secondary_phone_number: secondaryPhoneNumber ? secondaryPhoneNumber : null,
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
          customer_status,
          payment_terms
      };

      console.log("Updated data:", updatedData);

      const { cid } = req.params;
      await updateCustomer(cid, updatedData);  // Await the async call

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
 * Controller function for fetchAllCustomerDetails() to be executed at /all-customer-details
 * @param   {Request}  req The request received from the client in an endpoint
 * @param   {Response} res The response sent to the client in that endpoint
 * @returns {Promise<void>}
 */
const fetchAllCustomerDetails = async (req, res) => {
    try {
        const customers = await getAllCustomersDetails();
        res.status(200).json({ customers });
    } catch (error) {
        console.error("Error fetching all customer details:", error);
        res.status(500).json({ error: "Failed to fetch all customer details." });
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

      // Ensure `other_contacts` is properly handled
      if (typeof customer.other_contacts === "string") {
          customer.other_contacts = JSON.parse(customer.other_contacts); // Parse if it's a string
      }

      res.status(200).json({ customer });
  } catch (error) {
      console.error("Error fetching customer details:", error);
      res.status(500).json({ error: "Failed to fetch customer details." });
  }
};

/**
 * Controller function for importCustomerData() to be executed at /import-customers
 */
const importCustomers = async (req, res) => {
    try {
        const { customers } = req.body;
        if (!customers || customers.length === 0) {
            return res.status(400).json({ error: "No customer data provided" });
        }

        await importCustomerData(customers);
        res.status(200).json({ message: "Customers imported successfully!" });
    } catch (error) {
        console.error("Error importing customers:", error);
        res.status(500).json({ error: "Failed to import customers." });
    }
};

export { createCustomer, updateCustomerDetails, fetchAllCustomers, fetchAllCustomerDetails, customerDetailsByID, importCustomers };
