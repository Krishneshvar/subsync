import { getCustomers, addCustomer } from "../models/customerModel.js";

const getCustomersController = async (req, res) => {
    try {
        const { searchType, search, sort, order, page = 1 } = req.query;
        const limit = 10; // Set your limit per page
        const { customers, totalCount } = await getCustomers(searchType, search, sort, order, page, limit);

        if (customers.length === 0) {
            return res.status(404).json({ message: "No customers found." });
        }

        // Calculate total pages
        const totalPages = Math.ceil(totalCount / limit);

        // Set x-total-count header for frontend compatibility
        res.set('x-total-count', totalCount);

        // Send response with pagination metadata
        res.status(200).json({
            customers,
            currentPage: parseInt(page, 10),
            totalPages,
            totalCount
        });
    } catch (error) {
        console.error("Error in getCustomersController:", error.message);
        
        if (error.message.includes("Invalid")) {
            return res.status(400).json({ message: error.message });
        }

        res.status(500).json({ message: "Failed to retrieve customers. Please try again later." });
    }
};

async function createCustomer(req, res) {
    try {
        // Extract form data and the uploaded file
        const { customerName, email, phoneNumber, address, domains } = req.body;
        const pfp = req.file;  // Handle profile picture if you plan to store it later
        const domainArray = domains ? domains.split(',').map(domain => domain.trim()) : [];

        const customer = { customerName, email, phoneNumber, address, domains: JSON.stringify(domainArray) }; // Include pfp only if you want to store it later
        const success = await addCustomer(customer);

        if (success) {
            res.status(201).json({ message: "Customer added successfully!" });
        } else {
            res.status(400).json({ error: "Failed to add customer." });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export { getCustomersController, createCustomer };
