import { getCustomers, addCustomer, getCustomerDetails } from "../models/customerModel.js";
import multer from "multer";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const upload = multer({ dest: 'uploads/' });

const createCustomer = async (req, res) => {
    try {
        const { customerName, email, phoneNumber, address, domains, filePath } = req.body;
        const domainArray = domains ? domains.split(',').map((d) => d.trim()) : [];

        if (!filePath) {
            return res.status(400).json({ error: 'Profile picture file path is required.' });
        }

        const customer = {
            customerName,
            email,
            phoneNumber,
            address,
            domains: JSON.stringify(domainArray),
        };

        const customerId = await addCustomer(customer);

        // Rename the file with customerId
        const uploadDir = path.join(__dirname, '../uploads');
        const oldFilePath = path.join(uploadDir, filePath);
        const newFilePath = path.join(uploadDir, `${customerId}${path.extname(filePath)}`);

        await fs.rename(oldFilePath, newFilePath);

        res.status(201).json({ message: 'Customer created successfully!' });
    } catch (error) {
        console.error("Customer creation error:", error);
        res.status(500).json({ error: error.message });
    }
};

const getCustomersController = async (req, res) => {
    try {
        const { searchType, search, sort, order, page = 1 } = req.query;
        console.log("Controller received query params:", { searchType, search, sort, order, page });

        const limit = 10;
        const { dataArray, totalCount } = await getCustomers(searchType, search, sort, order, page, limit);

        if (dataArray.length === 0) {
            return res.status(404).json({ message: "No customers found." });
        }

        const totalPages = Math.ceil(totalCount / limit);
        res.set('x-total-count', totalCount);

        res.status(200).json({
            dataArray,
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

const getCustomerDetailsController = async (req, res) => {
    const { id } = req.params;

    try {
        // Get customer and subscriptions details
        const { customer, subscriptions } = await getCustomerDetails(id);
        
        // Send both customer and subscriptions data in the response
        res.status(200).json({ customer, subscriptions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const uploadProfilePicture = async (req, res) => {
    try {
        await new Promise((resolve, reject) => {
            upload.single('profilePicture')(req, res, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        const uniqueFilename = `${Date.now()}-${req.file.originalname}`;
        const uploadDir = path.join(__dirname, '../uploads');
        
        await fs.mkdir(uploadDir, { recursive: true });
        
        const filePath = path.join(uploadDir, uniqueFilename);
        
        await fs.rename(req.file.path, filePath);

        res.status(201).json({ filePath: uniqueFilename, message: 'File uploaded successfully.' });
    } catch (err) {
        console.error("File upload error:", err);
        res.status(500).json({ error: err.message });
    }
};

export { getCustomersController, createCustomer, getCustomerDetailsController, uploadProfilePicture };
