import {
    createItemGroup,
    getAllItemGroups,
    getItemGroupById,
    updateItemGroup,
    deleteItemGroup
} from '../models/itemGroupModel.js';

// CREATE Item Group
export const createItemGroupController = async (req, res) => {
    try {
        const { item_group_name } = req.body;

        if (!item_group_name) {
            return res.status(400).json({ error: "Item group name is required." });
        }

        // Check if item group already exists (optional, but good for uniqueness)
        const existingItemGroups = await getAllItemGroups();
        if (existingItemGroups.some(g => g.item_group_name.toLowerCase() === item_group_name.toLowerCase())) {
            return res.status(409).json({ error: "Item group with this name already exists." });
        }

        const result = await createItemGroup({ item_group_name });
        // result.insertId will contain the newly generated item_group_id
        return res.status(201).json({ message: "Item group created successfully", item_group_id: result.insertId });
    } catch (error) {
        console.error("Error creating item group:", error);
        // Handle specific database errors if needed, e.g., duplicate entry if UNIQUE constraint
        if (error.code === 'ER_DUP_ENTRY') { // MySQL specific error code for duplicate entry
            return res.status(409).json({ error: "An item group with this name already exists." });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// READ All Item Groups
export const getAllItemGroupsController = async (req, res) => {
    try {
        const itemGroups = await getAllItemGroups();
        return res.status(200).json(itemGroups); // Return array directly as per common API practice
    } catch (error) {
        console.error("Error fetching all item groups:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// READ Item Group by ID
export const getItemGroupByIdController = async (req, res) => {
    try {
        const { id } = req.params; // Assuming ID comes from URL parameter
        const itemGroup = await getItemGroupById(id);

        if (!itemGroup) {
            return res.status(404).json({ error: "Item group not found." });
        }

        return res.status(200).json(itemGroup);
    } catch (error) {
        console.error("Error fetching item group by ID:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// UPDATE Item Group
export const updateItemGroupController = async (req, res) => {
    try {
        const { id } = req.params;
        const { item_group_name } = req.body;

        if (!item_group_name) {
            return res.status(400).json({ error: "Item group name is required for update." });
        }

        const existingItemGroup = await getItemGroupById(id);
        if (!existingItemGroup) {
            return res.status(404).json({ error: "Item group not found." });
        }

        // Optional: Check if the new name already exists for a *different* item group
        const itemGroupsWithSameName = await getAllItemGroups();
        if (itemGroupsWithSameName.some(g => g.item_group_name.toLowerCase() === item_group_name.toLowerCase() && g.item_group_id !== parseInt(id))) {
            return res.status(409).json({ error: "Another item group with this name already exists." });
        }

        const result = await updateItemGroup(id, { item_group_name });

        if (result.affectedRows === 0) {
            // This might happen if the ID exists but no data was actually changed (e.g., same name provided)
            return res.status(200).json({ message: "Item group found, but no changes applied (name might be the same)." });
        }

        return res.status(200).json({ message: "Item group updated successfully." });
    } catch (error) {
        console.error("Error updating item group:", error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: "An item group with this name already exists." });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// DELETE Item Group
export const deleteItemGroupController = async (req, res) => {
    try {
        const { id } = req.params;

        const existingItemGroup = await getItemGroupById(id);
        if (!existingItemGroup) {
            return res.status(404).json({ error: "Item group not found." });
        }

        const result = await deleteItemGroup(id);

        if (result.affectedRows === 0) {
            // Should theoretically not happen if existingItemGroup check passed, but good for robustness
            return res.status(404).json({ error: "Item group not found or already deleted." });
        }

        return res.status(200).json({ message: "Item group deleted successfully." });
    } catch (error) {
        console.error("Error deleting item group:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
