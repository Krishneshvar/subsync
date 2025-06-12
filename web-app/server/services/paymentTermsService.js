import * as paymentTermModel from '../models/paymentTerms.model.js';
import { NotFoundError, ConflictError, BadRequestError } from '../utils/appErrors.js';
import logger from '../utils/logger.js';

export const getAllPaymentTerms = async () => {
    logger.info('Fetching all payment terms');
    return await paymentTermModel.findAllPaymentTerms();
};

export const getPaymentTermById = async (termId) => {
    logger.info(`Fetching payment term with ID: ${termId}`);
    const term = await paymentTermModel.findPaymentTermById(termId);
    if (!term) {
        throw new NotFoundError(`Payment term with ID ${termId} not found`);
    }
    return term;
};

export const createPaymentTerm = async (termName, days) => {
    logger.info(`Creating payment term: ${termName} with ${days} days`);
    if (termName.toLowerCase() === 'due on receipt' && days !== 0) {
        throw new BadRequestError('For "Due on Receipt", days must be 0.');
    }
    if (termName.toLowerCase() !== 'due on receipt' && days === 0) {
        throw new BadRequestError('Days cannot be 0 unless the term name is "Due on Receipt".');
    }

    try {
        const insertId = await paymentTermModel.insertPaymentTerm(termName, days);
        return { id: insertId, term_name: termName, days };
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            throw new ConflictError(`Payment term name '${termName}' already exists`);
        }
        logger.error('Service Error: Failed to create payment term', { error });
        throw error;
    }
};

export const updatePaymentTerm = async (termId, termName, days) => {
    logger.info(`Updating payment term ID: ${termId}`);

    const existingTerm = await paymentTermModel.findPaymentTermById(termId);
    if (!existingTerm) {
        throw new NotFoundError(`Payment term with ID ${termId} not found`);
    }

    if (existingTerm.term_name.toLowerCase() === 'due on receipt' && days !== undefined && days !== 0) {
        throw new BadRequestError('The "Due on Receipt" term must always have 0 days.');
    }
     if (termName && termName.toLowerCase() === 'due on receipt' && days !== 0 && days !== undefined) {
        throw new BadRequestError('For "Due on Receipt", days must be 0.');
    }

    if (termName && termName.toLowerCase() !== 'due on receipt' && days !== undefined && days === 0) {
        throw new BadRequestError('Days cannot be 0 unless the term name is "Due on Receipt".');
    } else if (!termName && existingTerm.term_name.toLowerCase() !== 'due on receipt' && days !== undefined && days === 0) {'
        throw new BadRequestError('Days cannot be 0 unless the term name is "Due on Receipt".');
    }


    try {
        const updatedTermName = termName !== undefined ? termName : existingTerm.term_name;
        const updatedDays = days !== undefined ? days : existingTerm.days;

        const affectedRows = await paymentTermModel.updatePaymentTermInDb(termId, updatedTermName, updatedDays);
        if (affectedRows === 0) {
            throw new NotFoundError(`Payment term with ID ${termId} not found after update attempt`);
        }
        return { message: 'Payment term updated successfully' };
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY' && termName) {
            throw new ConflictError(`Payment term name '${termName}' already exists`);
        }
        logger.error('Service Error: Failed to update payment term', { error });
        throw error;
    }
};

export const deletePaymentTerm = async (termId) => {
    logger.info(`Deleting payment term ID: ${termId}`);

    const term = await paymentTermModel.findPaymentTermById(termId);
    if (!term) {
        throw new NotFoundError(`Payment term with ID ${termId} not found`);
    }
    if (term.is_default) {
        throw new BadRequestError('Cannot delete the default payment term.');
    }

    const affectedRows = await paymentTermModel.deletePaymentTermFromDb(termId);
    if (affectedRows === 0) {
        throw new NotFoundError(`Payment term with ID ${termId} not found for deletion`);
    }
    return { message: 'Payment term deleted successfully' };
};

export const setDefaultPaymentTerm = async (termId) => {
    logger.info(`Setting default payment term ID: ${termId}`);

    const term = await paymentTermModel.findPaymentTermById(termId);
    if (!term) {
        throw new NotFoundError(`Payment term with ID ${termId} not found`);
    }
    if (term.is_default) {
        return { message: 'Payment term is already the default' };
    }

    try {
        const affectedRows = await paymentTermModel.updateDefaultPaymentTermInDb(termId);
        if (affectedRows === 0) {
            throw new NotFoundError(`Payment term with ID ${termId} not found to set as default`);
        }
        return { message: 'Default payment term updated successfully' };
    } catch (error) {
        logger.error('Service Error: Failed to set default payment term', { error });
        throw error;
    }
};
