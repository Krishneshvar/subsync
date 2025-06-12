import Joi from 'joi';
import { BadRequestError } from '../utils/appErrors.js';
import logger from '../utils/logger.js';

/**
 * Regex function to validate GST number
 * @param   {string}  gstno The GST number to be validated
 * @returns {boolean}       The result of validation
 */
function isValidGSTIN(gstno) {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[Z]{1}[A-Z0-9]{1}$/;
    return gstRegex.test(gstno);
}

/**
 * Regex function to validate Email address
 * @param   {string}  email The email address to be validated
 * @returns {boolean}       The result of validation
 */
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

/**
 * Regex function to validate phone number.
 * @param   {string}  phoneNumber The phone number to be validated.
 * @returns {boolean}             The result of validation.
 */
function isValidPhoneNumber(phoneNumber) {
    const phoneRegex = /^\+?[0-9]{10,14}$/;
    return phoneRegex.test(phoneNumber);
}

/**
 * Generic Joi validation middleware.
 * @param {Joi.Schema} schema - Joi schema to validate against.
 * @param {string} property - 'body', 'params', or 'query' to specify which part of the request to validate.
 */
const validate = (schema, property) => (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
        abortEarly: false,
        allowUnknown: false
    });

    if (error) {
        const errorMessage = error.details.map(detail => detail.message).join(', ');
        logger.warn(`Validation Error for ${req.method} ${req.originalUrl} (${property}): ${errorMessage}`);
        return next(new BadRequestError(errorMessage));
    }
    req[property] = value;
    next();
};

export const validateBody = (schema) => validate(schema, 'body');
export const validateParams = (schema) => validate(schema, 'params');
export const validateQuery = (schema) => validate(schema, 'query');

export { isValidGSTIN, isValidEmail, isValidPhoneNumber };
