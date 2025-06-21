import express from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import { validateLogin } from '../controllers/loginController.js';

import { createCustomer, updateCustomerDetails, fetchAllCustomers,fetchAllCustomerDetails, customerDetailsByID , importCustomers} from '../controllers/customerController.js';
import { getPaymentTerms, getPaymentTerm, createPaymentTerm, updatePaymentTermById, deletePaymentTermById, setDefaultPaymentTerm } from '../controllers/paymentTermsController.js';
import { createDomain, updateDomainDetails, fetchAllDomains, domainDetailsByID, importDomains } from '../controllers/domainController.js';
import { createServiceController, getAllServicesController, getServiceByIdController, updateServiceController, deleteServiceController } from '../controllers/serviceController.js';
import { createVendorController, getAllVendorsController, getVendorByIdController, updateVendorController, deleteVendorController } from "../controllers/vendorController.js";
import { createItemGroupController, getAllItemGroupsController, getItemGroupByIdController, updateItemGroupController, deleteItemGroupController } from "../controllers/itemGroupController.js";
import { getSubscriptionsController, createSubscription } from '../controllers/subscriptionController.js';
import { getAllTaxes, createTax, editTax, deleteTax } from '../controllers/taxController.js';
import { getGSTSettingsController, updateGSTSettingsController } from '../controllers/gstSettingsController.js';

const router = express.Router();

// Login
router.post('/login/user', validateLogin);

// Customers
router.post('/create-customer', isAuthenticated, createCustomer);
router.get('/all-customers', isAuthenticated, fetchAllCustomers);
router.get('/customer/:cid', isAuthenticated, customerDetailsByID);
router.get('/all-customer-details', isAuthenticated, fetchAllCustomerDetails);
router.put('/update-customer/:cid', isAuthenticated, updateCustomerDetails);
router.post('/import-customers', isAuthenticated, importCustomers);

// Payment Terms
router.get('/payment-terms', isAuthenticated, getPaymentTerms);
router.get('/payment-terms/:id', isAuthenticated, getPaymentTerm);
router.post('/payment-terms', isAuthenticated, createPaymentTerm);
router.put('/payment-terms/:id', isAuthenticated, updatePaymentTermById);
router.delete('/payment-terms/:id', isAuthenticated, deletePaymentTermById);
router.put('/payment-terms/:id/default', isAuthenticated, setDefaultPaymentTerm )

//Domain
router.post('/create-domain', isAuthenticated, createDomain);
router.put('/update-domain/:did', isAuthenticated, updateDomainDetails);
router.get('/all-domains', isAuthenticated, fetchAllDomains);
router.get('/all-domain-details', isAuthenticated, domainDetailsByID);
router.post('/import-domains', isAuthenticated, importDomains);

// Services
router.get('/all-services', isAuthenticated, getAllServicesController);
router.post('/create-service', isAuthenticated, createServiceController);
router.get('/service/:id', isAuthenticated, getServiceByIdController);
router.put('/update-service/:id', isAuthenticated, updateServiceController);
router.delete('/delete-service/:id', isAuthenticated, deleteServiceController);

// Vendors
router.post('/create-vendor', isAuthenticated, createVendorController);
router.get('/get-vendor/:id', isAuthenticated, getVendorByIdController);
router.get('/all-vendors', isAuthenticated, getAllVendorsController);
router.put('/update-vendor/:id', isAuthenticated, updateVendorController);
router.delete('/delete-vendor/:id', isAuthenticated, deleteVendorController);

// Item Groups
router.post('/create-item-group', isAuthenticated, createItemGroupController);
router.get('/get-item-group/:id', isAuthenticated, getItemGroupByIdController);
router.get('/all-item-groups', isAuthenticated, getAllItemGroupsController);
router.put('/update-item-group/:id', isAuthenticated, updateItemGroupController);
router.delete('/delete-item-group/:id', isAuthenticated, deleteItemGroupController);

// Subscriptions
router.get('/all-subscriptions', isAuthenticated, getSubscriptionsController);
router.post('/add-subscription', isAuthenticated, createSubscription);

// Taxes Rates
router.get('/all-taxes', isAuthenticated, getAllTaxes);
router.post('/add-tax', isAuthenticated, createTax);
router.post('/update-tax', isAuthenticated, editTax);
router.post('/delete-tax/:taxId', isAuthenticated, deleteTax);

// GST Settings
router.get('/get-gst-settings', isAuthenticated, getGSTSettingsController);
router.post('/update-gst-settings', isAuthenticated, updateGSTSettingsController);

export default router;
