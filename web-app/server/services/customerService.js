import { generateID } from "../middlewares/generateID.js";
import { getCurrentTime } from "../middlewares/time.js";
import logger from "../utils/logger.js";
import {
    BadRequestError,
    NotFoundError,
    ConflictError,
    ValidationError,
    NoContentError,
    InternalServerError
} from '../utils/appErrors.js';
import { createCustomerSchema, updateCustomerSchema } from '../utils/validationSchemas.js';

import {
    createCustomer as createCustomerModel,
    updateCustomer as updateCustomerModel,
    getPaginatedCustomers as getPaginatedCustomersModel,
    getCustomerById as getCustomerByIdModel,
    getAllCustomers as getAllCustomersModel,
    importCustomers as importCustomersModel
} from "../models/customerModel.js";

/**
 * Orchestrates the creation of a new customer.
 * @param   {Object}          customerData The object containing customer details.
 * @returns {Promise<string>} The ID of the newly inserted customer.
 * @throws {AppError} If validation fails or creation encounters an error.
 */
const createCustomer = async (customerData) => {
    try {
        logger.info('Attempting to create a new customer.');

        const { error, value } = createCustomerSchema.validate(customerData, { abortEarly: false, stripUnknown: true });
        if (error) {
            throw new ValidationError('Validation failed for customer creation.', error.details);
        }

        const customerId = generateID();
        const currentTime = getCurrentTime();

        const dataForModel = {
            customer_id: customerId,
            salutation: value.salutation,
            first_name: value.firstName,
            last_name: value.lastName,
            primary_email: value.email,
            primary_phone_number: value.phoneNumber,
            secondary_phone_number: value.secondaryPhoneNumber || null,
            customer_address: JSON.stringify(value.address),
            other_contacts: JSON.stringify(value.contactPersons || []),
            company_name: value.companyName,
            display_name: value.displayName,
            gst_in: value.gstin,
            currency_code: value.currencyCode,
            gst_treatment: value.gst_treatment,
            tax_preference: value.tax_preference,
            exemption_reason: value.exemption_reason || null,
            payment_terms: JSON.stringify(value.payment_terms || { term_name: "Due on Receipt", days: 0, is_default: true }),
            notes: value.notes || null,
            customer_status: value.customerStatus || 'Active',
            created_at: currentTime,
            updated_at: currentTime,
        };

        const result = await createCustomerModel(dataForModel);
        logger.info(`Customer created successfully with ID: ${customerId}`);
        return customerId;
    } catch (error) {
        logger.error(`Error in customerService.createCustomer: ${error.message}`, { stack: error.stack, details: error.details });
        if (error instanceof AppError) {
            throw error;
        }
        if (error.message.includes("duplicate entry")) {
             throw new ConflictError("A customer with this unique identifier (email or phone number) already exists.");
        }
        throw new InternalServerError(`Failed to create customer: ${error.message || "An unexpected error occurred."}`);
    }
};

/**
 * Orchestrates the update of an existing customer's details.
 * @param   {string}     customerId  The ID of the customer to update.
 * @param   {Object}     updatedData The object containing the new customer details.
 * @returns {Promise<Object>} The result of the update operation.
 * @throws {AppError} If validation fails or update encounters an error.
 */
const updateCustomer = async (customerId, updatedData) => {
    try {
        logger.info(`Attempting to update customer with ID: ${customerId}`);
        if (!customerId) {
            throw new BadRequestError("Customer ID is required for update.");
        }

        const { error, value } = updateCustomerSchema.validate(updatedData, { abortEarly: false, stripUnknown: true });
        if (error) {
            throw new ValidationError('Validation failed for customer update.', error.details);
        }

        const effectiveCurrencyCode = typeof value.currencyCode === 'object' && value.currencyCode !== null
            ? value.currencyCode.value
            : value.currencyCode;

        const dataForModel = {
            salutation: value.salutation,
            first_name: value.firstName,
            last_name: value.lastName,
            primary_email: value.email,
            primary_phone_number: value.phoneNumber,
            secondary_phone_number: value.secondaryPhoneNumber || null,
            customer_address: JSON.stringify(value.address),
            other_contacts: JSON.stringify(value.contactPersons || []),
            company_name: value.companyName,
            display_name: value.displayName,
            gst_in: value.gstin,
            currency_code: effectiveCurrencyCode,
            gst_treatment: value.gst_treatment,
            tax_preference: value.tax_preference,
            exemption_reason: value.exemption_reason || null,
            payment_terms: JSON.stringify(value.payment_terms || { term_name: "Due on Receipt", days: 0, is_default: true }),
            notes: value.notes || null,
            customer_status: value.customerStatus || 'Active',
            updated_at: getCurrentTime(),
        };

        const result = await updateCustomerModel(customerId, dataForModel);
        logger.info(`Customer ID ${customerId} updated successfully.`);
        return result;
    } catch (error) {
        logger.error(`Error in customerService.updateCustomer for ID ${customerId}: ${error.message}`, { stack: error.stack, details: error.details });
        if (error instanceof AppError) {
            throw error;
        }
        if (error.message.includes("Customer not found")) {
            throw new NotFoundError("Customer not found.");
        }
        if (error.message.includes("No changes made")) {
            throw new NoContentError("No changes were made to customer details.");
        }
        if (error.message.includes("duplicate entry")) {
             throw new ConflictError("A customer with this unique identifier (email or phone number) already exists.");
        }
        throw new InternalServerError(`Failed to update customer: ${error.message || "An unexpected error occurred."}`);
    }
};

/**
 * Fetches a paginated list of customer details.
 * @param {Object} options - Options for filtering and pagination.
 * @returns {Promise<{ totalPages: number, customers: Array<Object> }>} Paginated customer data.
 * @throws {AppError} If fetching customers fails.
 */
const getPaginatedCustomers = async (options) => {
    try {
        logger.info('Fetching paginated customers with options:', options);
        if (options.page < 1 || options.limit < 1 || isNaN(options.page) || isNaN(options.limit)) {
            throw new BadRequestError("Pagination page and limit must be positive integers.");
        }

        const result = await getPaginatedCustomersModel(options);
        logger.info(`Fetched ${result.customers.length} customers for page ${options.page}. Total pages: ${result.totalPages}`);
        return result;
    } catch (error) {
        logger.error(`Error in customerService.getPaginatedCustomers: ${error.message}`, { stack: error.stack, details: error.details });
        if (error instanceof AppError) {
            throw error;
        }
        throw new InternalServerError(`Failed to retrieve customers: ${error.message || "An unexpected error occurred."}`);
    }
};

/**
 * Fetches all customer details.
 * @returns {Promise<Array<Object>>} An array of all customer objects.
 * @throws {AppError} If fetching all customer details fails.
 */
const getAllCustomers = async () => {
    try {
        logger.info('Fetching all customers.');
        const customers = await getAllCustomersModel();
        logger.info(`Fetched a total of ${customers.length} customers.`);
        return customers;
    } catch (error) {
        logger.error(`Error in customerService.getAllCustomers: ${error.message}`, { stack: error.stack, details: error.stack });
        if (error instanceof AppError) {
            throw error;
        }
        throw new InternalServerError(`Failed to retrieve all customer details: ${error.message || "An unexpected error occurred."}`);
    }
};

/**
 * Fetches a single customer's details by their ID.
 * @param   {string}     customerId The ID of the customer to fetch.
 * @returns {Promise<Object|null>} The customer object if found, otherwise null.
 * @throws {AppError} If fetching customer by ID fails.
 */
const getCustomerById = async (customerId) => {
    try {
        logger.info(`Fetching customer by ID: ${customerId}`);
        if (!customerId) {
            throw new BadRequestError("Customer ID is required.");
        }
        const customer = await getCustomerByIdModel(customerId);
        if (!customer) {
            logger.info(`Customer with ID ${customerId} not found.`);
            return null;
        }
        logger.info(`Successfully fetched customer with ID: ${customerId}`);
        return customer;
    } catch (error) {
        logger.error(`Error in customerService.getCustomerById for ID ${customerId}: ${error.message}`, { stack: error.stack, details: error.stack });
        if (error instanceof AppError) {
            throw error;
        }
        throw new InternalServerError(`Failed to retrieve customer by ID: ${error.message || "An unexpected error occurred."}`);
    }
};

/**
 * Imports multiple customers in bulk.
 * @param {Array<Object>} customers - An array of customer objects to be inserted.
 * @throws {AppError} If the import operation fails.
 */
const importCustomers = async (customers) => {
    try {
        logger.info(`Attempting to import ${customers.length} customers.`);
        if (!customers || !Array.isArray(customers) || customers.length === 0) {
            throw new BadRequestError("No customer data provided for import.");
        }

        const validatedValues = customers.map(customer => {
            const { error, value } = createCustomerSchema.validate(customer, { abortEarly: false, stripUnknown: true });
            if (error) {
                throw new ValidationError(`Validation failed for one or more imported customers: ${value.email || 'unknown'}`, error.details);
            }

            const currentTime = getCurrentTime();
            return [
                generateID(),
                value.salutation || null,
                value.firstName || null,
                value.lastName || null,
                value.email || null,
                value.phoneNumber || null,
                value.secondaryPhoneNumber || null,
                JSON.stringify(value.address || {}),
                JSON.stringify(value.contactPersons || []),
                value.companyName || null,
                value.displayName || null,
                value.gstin || null,
                value.currencyCode || "INR",
                value.gst_treatment || "iGST",
                value.tax_preference || "Taxable",
                value.exemption_reason || null,
                JSON.stringify(value.payment_terms || { term_name: "Due on Receipt", days: 0, is_default: true }),
                value.notes || null,
                value.customerStatus || "Active",
                currentTime,
                currentTime,
            ];
        });

        const result = await importCustomersModel(validatedValues);
        logger.info(`Successfully imported ${customers.length} customers.`);
        return result;
    } catch (error) {
        logger.error(`Error in customerService.importCustomers: ${error.message}`, { stack: error.stack, details: error.details });
        if (error instanceof AppError) {
            throw error;
        }
        if (error.message.includes("duplicate entry")) {
             throw new ConflictError("One or more imported customers already exist (duplicate email or phone number if those fields are unique).");
        }
        throw new InternalServerError(`Failed to import customers: ${error.message || "An unexpected error occurred."}`);
    }
};

export {
    createCustomer,
    updateCustomer,
    getPaginatedCustomers,
    getAllCustomers,
    getCustomerById,
    importCustomers
};
