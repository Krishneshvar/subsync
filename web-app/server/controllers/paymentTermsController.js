import * as paymentTermService from '../services/paymentTermsService.js';
import logger from '../utils/logger.js';

export const getPaymentTerms = async (req, res, next) => {
    try {
        const paymentTerms = await paymentTermService.getAllPaymentTerms();
        res.status(200).json({ success: true, data: paymentTerms });
    } catch (error) {
        logger.error('Controller Error: Failed to get payment terms', { error });
        next(error);
    }
};

export const getPaymentTerm = async (req, res, next) => {
    try {
        const { id } = req.params;
        const term = await paymentTermService.getPaymentTermById(id);
        res.status(200).json({ success: true, data: term });
    } catch (error) {
        logger.error(`Controller Error: Failed to get payment term by ID ${req.params.id}`, { error });
        next(error);
    }
};

export const createPaymentTerm = async (req, res, next) => {
    try {
        const { termName, days } = req.body;
        const newTerm = await paymentTermService.createPaymentTerm(termName, days);
        res.status(201).json({ success: true, message: 'Payment term added successfully', data: newTerm });
    } catch (error) {
        logger.error('Controller Error: Failed to create payment term', { error });
        next(error);
    }
};

export const updatePaymentTermById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { termName, days } = req.body;
        const result = await paymentTermService.updatePaymentTerm(id, termName, days);
        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        logger.error(`Controller Error: Failed to update payment term by ID ${req.params.id}`, { error });
        next(error);
    }
};

export const deletePaymentTermById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await paymentTermService.deletePaymentTerm(id);
        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        logger.error(`Controller Error: Failed to delete payment term by ID ${req.params.id}`, { error });
        next(error);
    }
};

export const setDefaultPaymentTermController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await paymentTermService.setDefaultPaymentTerm(id);
        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        logger.error(`Controller Error: Failed to set default payment term by ID ${req.params.id}`, { error });
        next(error);
    }
};
