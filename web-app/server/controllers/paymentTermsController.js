import {
    getAllPaymentTerms,
    getPaymentTermById,
    addPaymentTerm,
    updatePaymentTerm,
    deletePaymentTerm,
    updateDefaultPaymentTerm
} from '../models/paymentTermsModel.js';

export const getPaymentTerms = async (req, res) => {
    try {
        const paymentTerms = await getAllPaymentTerms();
        res.json(paymentTerms);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getPaymentTerm = async (req, res) => {
    try {
        const { id } = req.params;
        const paymentTerm = await getPaymentTermById(id);
        if (!paymentTerm) {
            return res.status(404).json({ error: 'Payment term not found' });
        }
        res.json(paymentTerm);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createPaymentTerm = async (req, res) => {
    try {
        const { termName, days } = req.body;
        if (!termName || !days) {
            return res.status(400).json({ error: 'Term name and days are required' });
        }
        const termId = await addPaymentTerm(termName, days);
        res.status(201).json({ termId, message: 'Payment term created successfully' });
    } catch (error) {
        if (error.message === 'Payment term name already exists') {
            return res.status(409).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

export const updatePaymentTermById = async (req, res) => {
    try {
        const { id } = req.params;
        const { termName, days } = req.body;
        if (!termName || !days) {
            return res.status(400).json({ error: 'Term name and days are required' });
        }
        await updatePaymentTerm(id, termName, days);
        res.json({ message: 'Payment term updated successfully' });
    } catch (error) {
        if (error.message === 'Payment term not found') {
            return res.status(404).json({ error: error.message });
        }
        if (error.message === 'Payment term name already exists') {
            return res.status(409).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

export const deletePaymentTermById = async (req, res) => {
    try {
        const { id } = req.params;
        await deletePaymentTerm(id);
        res.json({ message: 'Payment term deleted successfully' });
    } catch (error) {
        if (error.message === 'Payment term not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
}; 

export const setDefaultPaymentTerm = async (req, res) => {
    try {
        const {id} = req.params;
        await updateDefaultPaymentTerm(id);
        res.json({message: 'Default Payment Terms Updated!'});
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false, 
            message: 'Error in setting default payment terms'
        })
    }
}