import appDB from "../db/subsyncDB.js";

/**
 * Creates a new item group in the database.
 * @param {Object} itemGroup - The item group object containing item_group_name.
 * @returns {Promise<Object>} The result of the database insert operation.
 */
const createItemGroup = async (itemGroup) => {
    const query = `
        INSERT INTO item_groups (item_group_name)
        VALUES (?);
    `;
    const values = [itemGroup.item_group_name];
    const [result] = await appDB.execute(query, values);
    return result; // result.insertId will contain the new item_group_id
};

/**
 * Retrieves all item groups from the database.
 * @returns {Promise<Array>} An array of item group objects.
 */
const getAllItemGroups = async () => {
    const query = `SELECT item_group_id, item_group_name, created_at FROM item_groups ORDER BY item_group_name ASC;`;
    const [rows] = await appDB.execute(query);
    return rows;
};

/**
 * Retrieves a single item group by its ID.
 * @param {number} itemGroupId - The ID of the item group to retrieve.
 * @returns {Promise<Object|undefined>} The item group object if found, otherwise undefined.
 */
const getItemGroupById = async (itemGroupId) => {
    const query = `SELECT item_group_id, item_group_name, created_at FROM item_groups WHERE item_group_id = ?;`;
    const [rows] = await appDB.execute(query, [itemGroupId]);
    return rows[0]; // Returns the first row if found, otherwise undefined
};

/**
 * Updates an existing item group's details.
 * @param {number} itemGroupId - The ID of the item group to update.
 * @param {Object} updatedData - Object containing the new item_group_name.
 * @returns {Promise<Object>} The result of the database update operation.
 */
const updateItemGroup = async (itemGroupId, updatedData) => {
    const query = `
        UPDATE item_groups SET
                               item_group_name = ?,
                               created_at = CURRENT_TIMESTAMP
        WHERE item_group_id = ?;
    `;
    const values = [updatedData.item_group_name, itemGroupId];
    const [result] = await appDB.execute(query, values);
    return result; // result.affectedRows will indicate if a row was updated
};

/**
 * Deletes an item group by its ID.
 * @param {number} itemGroupId - The ID of the item group to delete.
 * @returns {Promise<Object>} The result of the database delete operation.
 */
const deleteItemGroup = async (itemGroupId) => {
    const query = `DELETE FROM item_groups WHERE item_group_id = ?;`;
    const [result] = await appDB.execute(query, [itemGroupId]);
    return result; // result.affectedRows will indicate if a row was deleted
};

export {
    createItemGroup,
    getAllItemGroups,
    getItemGroupById,
    updateItemGroup,
    deleteItemGroup
};
