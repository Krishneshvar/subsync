import express from 'express';
import multer from 'multer';
import { validateLogin } from '../controllers/loginController.js';
import { getCustomersController, createCustomer } from '../controllers/customerController.js';
import { getProductsController, createProduct } from '../controllers/productController.js';
import { getSubscriptionsController, createSubscription } from '../controllers/subscriptionController.js';

const upload = multer();
const router = express.Router();

// Login
router.post('/login/user', validateLogin);

// Customers
router.get('/all-customers', getCustomersController);
router.post('/add-customer', upload.single('pfp'), createCustomer);

// Products
router.get('/all-products', getProductsController);
router.post('/add-product', createProduct);

// Subscriptions
router.get('/all-subscriptions', getSubscriptionsController);
router.post('/add-subscription', createSubscription);

export default router;
