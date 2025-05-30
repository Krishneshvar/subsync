import express from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import { validateLogin } from '../controllers/loginController.js';
import { createCustomer, updateCustomerDetails, fetchAllCustomers,fetchAllCustomerDetails, customerDetailsByID , importCustomers} from '../controllers/customerController.js';
import { createDomain, updateDomainDetails, fetchAllDomains, domainDetailsByID, importDomains } from '../controllers/domainController.js';

import { getProductsController, createProduct, getProductDetailsController } from '../controllers/productController.js';
import { getSubscriptionsController, createSubscription } from '../controllers/subscriptionController.js';

import { getAllTaxes, createTax, editTax, deleteTax } from '../controllers/taxController.js';
import { getGSTSettingsController, updateGSTSettingsController } from '../controllers/gstSettingsController.js';
import { getPaymentTerms, getPaymentTerm, createPaymentTerm, updatePaymentTermById, deletePaymentTermById } from '../controllers/paymentTermsController.js';

const router = express.Router();

// Login
router.post('/login/user', validateLogin);

// Customers
router.post('/create-customer',isAuthenticated, createCustomer);
router.put('/update-customer/:cid',isAuthenticated, updateCustomerDetails);
router.get('/all-customers',isAuthenticated, fetchAllCustomers);
router.get('/customer/:cid',isAuthenticated, customerDetailsByID);
router.get('/all-customer-details',isAuthenticated, fetchAllCustomerDetails);
router.post("/import-customers",isAuthenticated, importCustomers);

//Domain
router.post('/create-domain',isAuthenticated, createDomain);
router.put('/update-domain/:did',isAuthenticated, updateDomainDetails);
router.get('/all-domains',isAuthenticated, fetchAllDomains);
router.get('/all-domain-details',isAuthenticated, domainDetailsByID);
router.post('/import-domains',isAuthenticated, importDomains);

// Services
router.get('/all-products', isAuthenticated, getProductsController);
router.post('/add-product', isAuthenticated, createProduct);
router.get('/product/:id', isAuthenticated, getProductDetailsController);

// Subscriptions
router.get('/all-subscriptions', isAuthenticated, getSubscriptionsController);
router.post('/add-subscription', isAuthenticated, createSubscription);

// Taxes Rates
router.get('/all-taxes', isAuthenticated, getAllTaxes);
router.post('/add-tax', isAuthenticated, createTax);
router.post('/update-tax', isAuthenticated, editTax);
router.post('/delete-tax/:taxId', isAuthenticated, deleteTax);

// GST Settings
router.get("/get-gst-settings", isAuthenticated, getGSTSettingsController);
router.post("/update-gst-settings", isAuthenticated, updateGSTSettingsController);

// Payment Terms
router.get('/payment-terms',isAuthenticated, getPaymentTerms);
router.get('/payment-terms/:id',isAuthenticated, getPaymentTerm);
router.post('/payment-terms',isAuthenticated, createPaymentTerm);
router.put('/payment-terms/:id',isAuthenticated, updatePaymentTermById);
router.delete('/payment-terms/:id',isAuthenticated,  deletePaymentTermById);

export default router;
