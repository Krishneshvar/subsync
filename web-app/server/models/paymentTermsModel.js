import appDB from "../db/subsyncDB.js";
import logger from '../utils/logger.js';

export const findAllPaymentTerms = async () => {
    try {
        const [rows] = await appDB.query('SELECT * FROM payment_terms ORDER BY term_name');
        return rows;
    } catch (error) {
        logger.error('Database Error: Failed to fetch payment terms', { error });
        throw error;
    }
};

export const findPaymentTermById = async (termId) => {
    try {
        const [rows] = await appDB.query('SELECT * FROM payment_terms WHERE term_id = ?', [termId]);
        return rows[0];
    } catch (error) {
        logger.error(`Database Error: Failed to fetch payment term with ID ${termId}`, { error });
        throw error;
    }
};

export const insertPaymentTerm = async (termName, days) => {
    try {
        const [result] = await appDB.query(
            'INSERT INTO payment_terms (term_name, days) VALUES (?, ?)',
            [termName, days]
        );
        return result.insertId;
    } catch (error) {
        logger.error('Database Error: Failed to add payment term', { error });
        throw error;
    }
};

export const updatePaymentTermInDb = async (termId, termName, days) => {
    try {
        const [result] = await appDB.query(
            'UPDATE payment_terms SET term_name = ?, days = ? WHERE term_id = ?',
            [termName, days, termId]
        );
        return result.affectedRows;
    } catch (error) {
        logger.error(`Database Error: Failed to update payment term with ID ${termId}`, { error });
        throw error;
    }
};

export const deletePaymentTermFromDb = async (termId) => {
    try {
        const [result] = await appDB.query('DELETE FROM payment_terms WHERE term_id = ?', [termId]);
        return result.affectedRows;
    } catch (error) {
        logger.error(`Database Error: Failed to delete payment term with ID ${termId}`, { error });
        throw error;
    }
};

export const updateDefaultPaymentTermInDb = async (termId) => {
    let connection;
    try {
        connection = await appDB.getConnection();
        await connection.beginTransaction();

        await connection.query('UPDATE payment_terms SET is_default = FALSE');

        const [result] = await connection.query(
            'UPDATE payment_terms SET is_default = TRUE WHERE term_id = ?',
            [termId]
        );

        await connection.commit();
        return result.affectedRows;
    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        logger.error(`Database Error: Failed to set default payment term with ID ${termId}`, { error });
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
};
