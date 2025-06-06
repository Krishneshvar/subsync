import {
    createVendor,
    getAllVendors,
    getVendorById,
    updateVendor,
    deleteVendor
} from '../models/vendorModel.js'; // Ensure this path is correct

// CREATE Vendor
export const createVendorController = async (req, res) => {
    try {
        const vendorData = req.body;

        // Pass the full vendor object to the model for validation and creation
        const result = await createVendor(vendorData);

        return res.status(201).json({ message: "Vendor created successfully", vendor_id: result.insertId });
    } catch (error) {
        console.error("Error creating vendor:", error);
        // Return the error message from the model (validation or DB error)
        return res.status(400).json({ error: error.message || "Internal Server Error" });
    }
};

// READ All Vendors
export const getAllVendorsController = async (req, res) => {
    try {
        const vendors = await getAllVendors();
        return res.status(200).json(vendors); // Return array directly as per common API practice
    } catch (error) {
        console.error("Error fetching all vendors:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// READ Vendor by ID
export const getVendorByIdController = async (req, res) => {
    try {
        const { id } = req.params; // Assuming ID comes from URL parameter
        const vendor = await getVendorById(id);

        if (!vendor) {
            return res.status(404).json({ error: "Vendor not found." });
        }

        return res.status(200).json(vendor);
    } catch (error) {
        console.error("Error fetching vendor by ID:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// UPDATE Vendor
export const updateVendorController = async (req, res) => {
    try {
        const { id } = req.params;
        const vendorData = req.body;

        const existingVendor = await getVendorById(id);
        if (!existingVendor) {
            return res.status(404).json({ error: "Vendor not found." });
        }

        // Optional: Check if the new name already exists for a *different* vendor
        const vendorsWithSameName = await getAllVendors();
        if (vendorsWithSameName.some(v => v.vendor_name.toLowerCase() === vendorData.vendor_name.toLowerCase() && v.vendor_id !== parseInt(id))) {
            return res.status(409).json({ error: "Another vendor with this name already exists." });
        }

        const result = await updateVendor(id, vendorData);

        if (result.affectedRows === 0) {
            // This might happen if the ID exists but no data was actually changed (e.g., same name provided)
            return res.status(200).json({ message: "Vendor found, but no changes applied (name might be the same)." });
        }

        return res.status(200).json({ message: "Vendor updated successfully." });
    } catch (error) {
        console.error("Error updating vendor:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// DELETE Vendor
export const deleteVendorController = async (req, res) => {
    try {
        const { id } = req.params;

        const existingVendor = await getVendorById(id);
        if (!existingVendor) {
            return res.status(404).json({ error: "Vendor not found." });
        }

        const result = await deleteVendor(id);

        if (result.affectedRows === 0) {
            // Should theoretically not happen if existingVendor check passed, but good for robustness
            return res.status(404).json({ error: "Vendor not found or already deleted." });
        }

        return res.status(200).json({ message: "Vendor deleted successfully." });
    } catch (error) {
        console.error("Error deleting vendor:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
