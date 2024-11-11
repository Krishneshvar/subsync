import { getCustomers } from "../models/customerModel.js";

const getCustomersController = async (req, res) => {
    try {
        const customers = await getCustomers();

        // Check if customers array is empty and handle it
        if (customers.length === 0) {
            return res.status(404).json({ message: "No customers found." });
        }

        // Send the customers as a JSON response
        res.status(200).json(customers);
    }
    catch (error) {
        console.error("Error in getCustomersController:", error.message);
        
        // Send a 500 Internal Server Error response
        res.status(500).json({ message: "Failed to retrieve customers. Please try again later." });
    }
};

export { getCustomersController };
