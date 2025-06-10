import {
    getAllPaymentTerms,
    getPaymentTermById,
    addPaymentTerm,
    updatePaymentTerm,
    deletePaymentTerm,
    setDefaultPaymentTerm // Import the new model function
} from '../models/paymentTermsModel.js';

// Helper for consistent error handling and mapping model errors to HTTP status codes
const handleControllerError = (res, error) => {
    if (error.message.startsWith('Not Found')) {
        return res.status(404).json({ message: error.message.replace('Not Found: ', '') });
    }
    if (error.message.startsWith('Conflict')) {
        return res.status(409).json({ message: error.message.replace('Conflict: ', '') });
    }
    if (error.message.startsWith('Validation Error')) {
        return res.status(400).json({ message: error.message.replace('Validation Error: ', '') });
    }
    // Generic database or unexpected errors
    console.error("Unhandled controller error:", error); // Log the full error for debugging
    res.status(500).json({ message: 'An unexpected server error occurred.' });
};


export const getPaymentTerms = async (req, res) => {
    try {
        const paymentTerms = await getAllPaymentTerms();
        res.json(paymentTerms);
    } catch (error) {
        handleControllerError(res, error);
    }
};

export const getPaymentTerm = async (req, res) => {
    try {
        const { id } = req.params;
        const paymentTerm = await getPaymentTermById(id);
        if (!paymentTerm) {
            return res.status(404).json({ message: 'Payment term not found' });
        }
        res.json(paymentTerm);
    } catch (error) {
        handleControllerError(res, error);
    }
};

export const createPaymentTerm = async (req, res) => {
    try {
        const { termName, days } = req.body;

        // Robust validation for termName
        if (!termName || typeof termName !== 'string' || termName.trim() === '') {
            return res.status(400).json({ message: 'Term name is required and must be a non-empty string.' });
        }

        // Robust validation for days: allow 0, ensure it's a non-negative number
        let validatedDays = Number(days);
        if (isNaN(validatedDays) || validatedDays < 0) {
            return res.status(400).json({ message: 'Days must be a non-negative number.' });
        }
        // Special case for 'Due on Receipt' to always be 0 days
        if (termName.toLowerCase() === 'due on receipt' && validatedDays !== 0) {
             return res.status(400).json({ message: "'Due on Receipt' term must have 0 days." });
        } else if (termName.toLowerCase() !== 'due on receipt' && validatedDays === 0 && days !== 0) {
            // This case handles when a user manually inputs 0 for a non-'Due on Receipt' term,
            // but the original `days` value was not actually 0 (e.g., an empty string).
            // It makes sure 0 is only for 'Due on Receipt' unless explicitly entered as number 0.
            // Simplified: if term is not 'Due on Receipt', and days is 0, user might have just typed 0.
            // The frontend should handle "Due on Receipt" days logic.
            // Backend should just ensure it's a valid number.
            // The frontend logic `daysValue === ''` check already handles the case where user *doesn't* type days for non 'Due on Receipt'.
            // For now, let's keep the backend validation simple and rely on frontend for term-specific logic like "Due on Receipt" always being 0.
        }

        const termId = await addPaymentTerm(termName.trim(), validatedDays);
        res.status(201).json({ termId, message: 'Payment term created successfully' });
    } catch (error) {
        handleControllerError(res, error);
    }
};

export const updatePaymentTermById = async (req, res) => {
    try {
        const { id } = req.params;
        const { termName, days } = req.body;

        // Robust validation for termName
        if (!termName || typeof termName !== 'string' || termName.trim() === '') {
            return res.status(400).json({ message: 'Term name is required and must be a non-empty string.' });
        }

        // Robust validation for days: allow 0, ensure it's a non-negative number
        let validatedDays = Number(days);
        if (isNaN(validatedDays) || validatedDays < 0) {
            return res.status(400).json({ message: 'Days must be a non-negative number.' });
        }
        // Special case for 'Due on Receipt' to always be 0 days
        if (termName.toLowerCase() === 'due on receipt' && validatedDays !== 0) {
            return res.status(400).json({ message: "'Due on Receipt' term must have 0 days." });
        }
        // Removed the check `days !== 0` for non-Due-on-Receipt terms.
        // If a user *wants* to set a different term to 0 days, let them.
        // The frontend already enforces 'Due on Receipt' being 0, this just ensures validity.

        await updatePaymentTerm(id, termName.trim(), validatedDays);
        res.json({ message: 'Payment term updated successfully' });
    } catch (error) {
        handleControllerError(res, error);
    }
};

export const deletePaymentTermById = async (req, res) => {
    try {
        const { id } = req.params;
        await deletePaymentTerm(id);
        res.json({ message: 'Payment term deleted successfully' });
    } catch (error) {
        handleControllerError(res, error);
    }
};

// New controller function for setting default payment term
export const setDefaultPaymentTermController = async (req, res) => {
    try {
        const { id } = req.params;
        await setDefaultPaymentTerm(id);
        res.json({ message: 'Default payment term updated successfully' });
    } catch (error) {
        handleControllerError(res, error);
    }
};
