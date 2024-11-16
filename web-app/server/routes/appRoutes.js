import express from 'express';
import multer from 'multer';
import { validateLogin } from '../controllers/loginController.js';
import { getCustomersController, createCustomer, getCustomerDetailsController, uploadProfilePicture } from '../controllers/customerController.js';
import { getProductsController, createProduct, getProductDetailsController } from '../controllers/productController.js';
import { getSubscriptionsController, createSubscription } from '../controllers/subscriptionController.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Set your uploads directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// Initialize multer
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'profilePicture') {
            cb(null, true); // Accept the file
        } else {
            cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname)); // Reject other fields
        }
    },
});

// Login
router.post('/login/user', validateLogin);

// Customers
router.get('/all-customers', getCustomersController);
router.post('/upload-profile-picture', uploadProfilePicture);
router.post('/add-customer', createCustomer);
router.get('/customer/:id', getCustomerDetailsController);

// Products
router.get('/all-products', getProductsController);
router.post('/add-product', createProduct);
router.get('/product/:id', getProductDetailsController);

// Subscriptions
router.get('/all-subscriptions', getSubscriptionsController);
router.post('/add-subscription', createSubscription);
// router.get('/subscription/:id', getSubscriptionDetailsController);

export default router;
