import logger from "../utils/logger.js";
import { AppError, InternalServerError } from '../utils/appErrors.js';

/**
 * Centralized error handling middleware.
 * @param {Error} err - The error object.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 */
const errorHandler = (err, req, res, next) => {
    logger.error(`Error caught by centralized handler: ${err.message}`, {
        path: req.originalUrl,
        method: req.method,
        ip: req.ip,
        stack: err.stack,
        details: err.errors || null
    });

    let statusCode = err.statusCode || 500;
    let message = err.isOperational ? err.message : 'An unexpected error occurred. Please try again later.';
    let errors = err.errors || undefined;

    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token. Please log in again!';
    } else if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Your token has expired! Please log in again.';
    } else if (err.code === 'ER_DUP_ENTRY') {
        statusCode = 409;
        message = 'A record with this unique identifier (e.g., email or phone number) already exists.';
    } else if (err.code === 'ER_BAD_NULL_ERROR') {
        statusCode = 400;
        message = 'Required data is missing.';
    }
    // Add more specific database error handlers if needed (e.g., ER_NO_REFERENCED_ROW_2 for foreign key)

    if (statusCode === 204) {
        return res.status(204).send();
    }

    res.status(statusCode).json({
        status: `${statusCode}`.startsWith('4') ? 'fail' : 'error',
        message: message,
        ...(errors && { errors: errors })
    });
};

export default errorHandler;
