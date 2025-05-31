import appDB from "../db/subsyncDB.js";

/**
 * Creates a new vendor in the database.
 * @param {Object} vendor - The vendor object containing vendor_name.
 * @returns {Promise<Object>} The result of the database insert operation.
 */
const createVendor = async (vendor) => {
    const query = `
        INSERT INTO vendors (vendor_name)
        VALUES (?);
    `;
    const values = [vendor.vendor_name];
    const [result] = await appDB.execute(query, values);
    return result; // result.insertId will contain the new vendor_id
};

/**
 * Retrieves all vendors from the database.
 * @returns {Promise<Array>} An array of vendor objects.
 */
const getAllVendors = async () => {
    const query = `SELECT vendor_id, vendor_name, created_at FROM vendors ORDER BY vendor_name ASC;`;
    const [rows] = await appDB.execute(query);
    return rows;
};

/**
 * Retrieves a single vendor by its ID.
 * @param {number} vendorId - The ID of the vendor to retrieve.
 * @returns {Promise<Object|undefined>} The vendor object if found, otherwise undefined.
 */
const getVendorById = async (vendorId) => {
    const query = `SELECT vendor_id, vendor_name, created_at FROM vendors WHERE vendor_id = ?;`;
    const [rows] = await appDB.execute(query, [vendorId]);
    return rows[0]; // Returns the first row if found, otherwise undefined
};

/**
 * Updates an existing vendor's details.
 * @param {number} vendorId - The ID of the vendor to update.
 * @param {Object} updatedData - Object containing the new vendor_name.
 * @returns {Promise<Object>} The result of the database update operation.
 */
const updateVendor = async (vendorId, updatedData) => {
    const query = `
        UPDATE vendors SET
            vendor_name = ?,
            created_at = CURRENT_TIMESTAMP -- Assuming created_at updates on modification, or add an updated_at column
        WHERE vendor_id = ?;
    `;
    const values = [updatedData.vendor_name, vendorId];
    const [result] = await appDB.execute(query, values);
    return result; // result.affectedRows will indicate if a row was updated
};

/**
 * Deletes a vendor by its ID.
 * @param {number} vendorId - The ID of the vendor to delete.
 * @returns {Promise<Object>} The result of the database delete operation.
 */
const deleteVendor = async (vendorId) => {
    const query = `DELETE FROM vendors WHERE vendor_id = ?;`;
    const [result] = await appDB.execute(query, [vendorId]);
    return result; // result.affectedRows will indicate if a row was deleted
};

export {
    createVendor,
    getAllVendors,
    getVendorById,
    updateVendor,
    deleteVendor
};
