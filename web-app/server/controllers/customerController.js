import { getCustomers, addCustomer } from "../models/customerModel.js";
import multer from "multer";
import path from "path";

// Configure multer for image file uploads
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
        cb(null, 'uploads/profile_pictures'); // Set the folder for storing profile pictures
        },
        filename: (req, file, cb) => {
        const ext = path.extname(file.originalname); // Get the original file extension
        cb(null, `${req.body.customerId}${ext}`); // Use customer ID as filename
        }
    });
  
  const fileFilter = (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  };
  
  const upload = multer({ storage, fileFilter });
  
  const createCustomer = async (req, res) => {
    try {
      upload.single('profilePicture')(req, res, async (err) => {
        if (err) return res.status(400).json({ error: err.message });
  
        const { customerName, email, phoneNumber, address, domains } = req.body;
        const domainArray = domains ? domains.split(',').map(domain => domain.trim()) : [];
        
        // Assuming customerId is generated and available in the response (or query the DB for the inserted row)
        const customer = {
          customerName,
          email,
          phoneNumber,
          address,
          domains: JSON.stringify(domainArray),
          profilePicture: req.file ? req.file.filename : null // Save filename if uploaded
        };
  
        const success = await addCustomer(customer);
        
        if (success) {
          res.status(201).json({ message: "Customer added successfully!" });
        } else {
          res.status(400).json({ error: "Failed to add customer." });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

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

export { getCustomersController, createCustomer, upload };
