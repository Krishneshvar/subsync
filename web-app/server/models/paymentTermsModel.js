import appDB from "../db/subsyncDB.js";

export const getAllPaymentTerms = async () => {
    try {
        const [rows] = await appDB.query('SELECT * FROM payment_terms ORDER BY term_name');
        return rows;
    } catch (error) {
        console.error('Error fetching payment terms:', error);
        throw new Error('Failed to fetch payment terms');
    }
};

export const getPaymentTermById = async (termId) => {
    try {
        const [rows] = await appDB.query('SELECT * FROM payment_terms WHERE term_id = ?', [termId]);
        return rows[0];
    } catch (error) {
        console.error('Error fetching payment term:', error);
        throw new Error('Failed to fetch payment term');
    }
};

export const addPaymentTerm = async (termName, days) => {
    try {
        const [result] = await appDB.query(
            'INSERT INTO payment_terms (term_name, days) VALUES (?, ?)',
            [termName, days]
        );
        return result.insertId;
    } catch (error) {
        console.error('Error adding payment term:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            throw new Error('Payment term name already exists');
        }
        throw new Error('Failed to add payment term');
    }
};

export const updatePaymentTerm = async (termId, termName, days) => {
    try {
        const [result] = await appDB.query(
            'UPDATE payment_terms SET term_name = ?, days = ? WHERE term_id = ?',
            [termName, days, termId]
        );
        if (result.affectedRows === 0) {
            throw new Error('Payment term not found');
        }
        return true;
    } catch (error) {
        console.error('Error updating payment term:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            throw new Error('Payment term name already exists');
        }
        throw new Error('Failed to update payment term');
    }
};

export const deletePaymentTerm = async (termId) => {
    try {
        const [result] = await appDB.query('DELETE FROM payment_terms WHERE term_id = ?', [termId]);
        if (result.affectedRows === 0) {
            throw new Error('Payment term not found');
        }
        return true;
    } catch (error) {
        console.error('Error deleting payment term:', error);
        throw new Error('Failed to delete payment term');
    }
}; 


export const updateDefaultPaymentTerm = async (termId) => {
    try {
        
        await appDB.query('UPDATE payment_terms SET is_default = 0');

        
        const [result] = await appDB.query(
            'UPDATE payment_terms SET is_default = 1 WHERE term_id = ?', 
            [termId]
        );

        return result;
    } catch (error) {
        console.error('Error setting default payment term:', error);
        throw error; 
    }
};
