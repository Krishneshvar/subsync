/**
 * Base custom error class.
 */
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true; // distinguishes operational errors from programming errors
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * 400 Bad Request: The server cannot or will not process the request due to an apparent client error.
 */
class BadRequestError extends AppError {
    constructor(message = 'Bad Request') {
        super(message, 400);
    }
}

/**
 * 401 Unauthorized: Authentication is required and has failed or has not yet been provided.
 */
class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(message, 401);
    }
}

/**
 * 403 Forbidden: The request was valid, but the server is refusing action.
 */
class ForbiddenError extends AppError {
    constructor(message = 'Forbidden') {
        super(message, 403);
    }
}

/**
 * 404 Not Found: The requested resource could not be found.
 */
class NotFoundError extends AppError {
    constructor(message = 'Not Found') {
        super(message, 404);
    }
}

/**
 * 409 Conflict: Indicates that the request could not be processed because of conflict in the current state of the resource.
 */
class ConflictError extends AppError {
    constructor(message = 'Conflict') {
        super(message, 409);
    }
}

/**
 * 422 Unprocessable Entity: The server understands the content type of the request entity,
 * and the syntax of the request entity is correct, but it was unable to process the contained instructions.
 * Used for validation errors.
 */
class ValidationError extends AppError {
    constructor(message = 'Validation Error', errors = []) {
        super(message, 422);
        this.errors = errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
        }));
    }
}

/**
 * 204 No Content: The server successfully processed the request, and is not returning any content.
 * While not an "error" in the traditional sense, it's useful to handle cases where a success response
 * should have no body but needs to be explicitly signalled.
 */
class NoContentError extends AppError {
    constructor(message = 'No Content') {
        super(message, 204);
    }
}

/**
 * 500 Internal Server Error: A generic error message, given when an unexpected condition was encountered.
 */
class InternalServerError extends AppError {
    constructor(message = 'Internal Server Error') {
        super(message, 500);
    }
}

class CustomError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // Indicates operational errors (expected, handled)
        Error.captureStackTrace(this, this.constructor);
    }
}

export {
    AppError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ConflictError,
    ValidationError,
    NoContentError,
    InternalServerError
};
