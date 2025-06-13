import express from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import Joi from 'joi';

import { validateLogin, getUserDetails, logoutUser } from '../controllers/loginController.js';
import { createCustomer, updateCustomer, getPaginatedCustomers, getAllCustomers, getCustomerById, importCustomers } from '../controllers/customerController.js';
import { getPaymentTerms, getPaymentTerm, createPaymentTerm, updatePaymentTermById, deletePaymentTermById, setDefaultPaymentTermController } from '../controllers/paymentTermsController.js';
import { createDomain, updateDomainDetails, fetchAllDomains, domainDetailsByID, importDomains } from '../controllers/domainController.js';
import { createServiceController, getAllServicesController, getServiceByIdController, updateServiceController, deleteServiceController } from '../controllers/serviceController.js';
import { createItemGroupController, getAllItemGroupsController, getItemGroupByIdController, updateItemGroupController, deleteItemGroupController } from "../controllers/itemGroupController.js";
import { getSubscriptionsController, createSubscription } from '../controllers/subscriptionController.js';
import { getAllTaxes, createTax, editTax, deleteTax } from '../controllers/taxController.js';
import { getGSTSettingsController, updateGSTSettingsController } from '../controllers/gstSettingsController.js';

const router = express.Router();

// Login
router.post('/login/user', validateLogin);
router.get('/user/me', isAuthenticated, getUserDetails);
router.post('/logout', logoutUser);

// Customers
router.post('/customers', isAuthenticated, createCustomer);
router.get('/customers', isAuthenticated, getPaginatedCustomers);
router.get('/customers/all-details', isAuthenticated, getAllCustomers);
router.get('/customers/:id', isAuthenticated, getCustomerById);
router.put('/customers/:id', isAuthenticated, updateCustomer);
router.post('/customers/import', isAuthenticated, importCustomers);

// Payment Terms
router.get('/payment-terms', isAuthenticated, getPaymentTerms);
router.get('/payment-terms/:id', isAuthenticated, getPaymentTerm);
router.post('/payment-terms', isAuthenticated, createPaymentTerm);
router.put('/payment-terms/:id', isAuthenticated, updatePaymentTermById);
router.put('/payment-terms/:id/default', isAuthenticated, setDefaultPaymentTermController);
router.delete('/payment-terms/:id', isAuthenticated, deletePaymentTermById);

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
