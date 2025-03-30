import express from 'express';
import { validateLogin } from '../controllers/loginController.js';
import { createCustomer, updateCustomerDetails, fetchAllCustomers,fetchAllCustomerDetails, customerDetailsByID , importCustomers} from '../controllers/customerController.js';
import { createDomain, updateDomainDetails, fetchAllDomains, domainDetailsByID, importDomains } from '../controllers/domainController.js';

import { getProductsController, createProduct, getProductDetailsController } from '../controllers/productController.js';
import { getSubscriptionsController, createSubscription } from '../controllers/subscriptionController.js';

const router = express.Router();

// Login
router.post('/login/user', validateLogin);

// Customers
router.post('/create-customer', createCustomer);
router.put('/update-customer/:cid', updateCustomerDetails);
router.get('/all-customers', fetchAllCustomers);
router.get('/customer/:cid', customerDetailsByID);
router.get('/all-customer-details', fetchAllCustomerDetails);
router.post("/import-customers", importCustomers);

//Domain
router.post('/create-domain', createDomain);
router.put('/update-domain/:did', updateDomainDetails);
router.get('/all-domains', fetchAllDomains);
router.get('/all-domain-details', domainDetailsByID);
router.post('/import-domains', importDomains);

// Products
router.get('/all-products', getProductsController);
router.post('/add-product', createProduct);
router.get('/product/:id', getProductDetailsController);

// Subscriptions
router.get('/all-subscriptions', getSubscriptionsController);
router.post('/add-subscription', createSubscription);

export default router;
