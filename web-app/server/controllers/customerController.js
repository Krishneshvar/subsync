import * as customerService from "../services/customerService.js";
import logger from "../utils/logger.js";
import { NotFoundError } from '../utils/appErrors.js';

/**
 * Handles the creation of a new customer.
 * @param   {Request}  req The Express request object.
 * @param   {Response} res The Express response object.
 * @returns {Promise<void>}
 */
const createCustomer = async (req, res, next) => {
    try {
        logger.info("Received request to create customer.", { body: req.body });
        const customerId = await customerService.createCustomer(req.body);
        res.status(201).json({ message: 'Customer created successfully!', customerId });
    } catch (error) {
        next(error);
    }
};

/**
 * Handles the update of an existing customer's details.
 * @param   {Request}  req The Express request object.
 * @param   {Response} res The Express response object.
 * @returns {Promise<void>}
 */
const updateCustomer = async (req, res, next) => {
    try {
        logger.info("Received request to update customer.", { params: req.params, body: req.body });
        const { id } = req.params;

        await customerService.updateCustomer(id, req.body);
        res.status(200).json({ message: "Customer updated successfully!" });
    } catch (error) {
        next(error);
    }
};

/**
 * Fetches a paginated list of customers.
 * @param   {Request}  req The Express request object.
 * @param   {Response} res The Express response object.
 * @returns {Promise<void>}
 */
const getPaginatedCustomers = async (req, res, next) => {
    try {
        logger.info("Received request for paginated customers.", { query: req.query });
        const { search = "", sort = "display_name", order = "asc", page = "1", limit = "10" } = req.query;

        const options = {
            search,
            sort,
            order,
            page: parseInt(page),
            limit: parseInt(limit)
        };

        const { customers, totalPages } = await customerService.getPaginatedCustomers(options);
        res.status(200).json({ customers, totalPages });
    } catch (error) {
        next(error);
    }
};

/**
 * Fetches all customer details (non-paginated).
 * @param   {Request}  req The Express request object.
 * @param   {Response} res The Express response object.
 * @returns {Promise<void>}
 */
const getAllCustomers = async (req, res, next) => {
    try {
        logger.info("Received request for all customers.");
        const customers = await customerService.getAllCustomers();
        res.status(200).json({ customers });
    } catch (error) {
        next(error);
    }
};

/**
 * Fetches a single customer's details by ID.
 * @param   {Request}  req The Express request object.
 * @param   {Response} res The Express response object.
 * @returns {Promise<void>}
 */
const getCustomerById = async (req, res, next) => {
    try {
        logger.info("Received request to fetch customer by ID.", { params: req.params });
        const customer = await customerService.getCustomerById(req.params.id);
        if (!customer) {
            throw new NotFoundError("Customer not found.");
        }
        res.status(200).json({ customer });
    } catch (error) {
        next(error);
    }
};

/**
 * Handles the bulk import of customer data.
 * @param {Request}  req The Express request object.
 * @param {Response} res The Express response object.
 * @returns {Promise<void>}
 */
const importCustomers = async (req, res, next) => {
    try {
        logger.info("Received request for bulk customer import.", { bodySize: req.body.customers ? req.body.customers.length : 0 });
        const { customers } = req.body;

        await customerService.importCustomers(customers);
        res.status(200).json({ message: "Customers imported successfully!" });
    } catch (error) {
        next(error);
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
