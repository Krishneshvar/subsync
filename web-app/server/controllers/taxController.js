import { getTaxes, addTax, updateTax, removeTax } from "../models/taxModel.js";

/**
 * Get all taxes
 */
const getAllTaxes = async (req, res) => {
    try {
        const taxes = await getTaxes();
        res.status(200).json({ taxes });
    } catch (error) {
        console.error("Error fetching taxes:", error.message);
        res.status(500).json({ error: "Failed to fetch taxes" });
    }
};

/**
 * Create a new tax entry
 */
const createTax = async (req, res) => {
    try {
        const { taxName, taxType, taxRate } = req.body;

        // Fix validation for zero tax rate
        if (!taxName || !taxType || taxRate === undefined || taxRate === null) {
            return res.status(400).json({ error: "Missing required fields: taxName, taxType, taxRate" });
        }

        const result = await addTax({ taxName, taxType, taxRate });

        res.status(201).json({ message: "Tax added successfully", result });
    } catch (error) {
        console.error("Error adding tax:", error.message);
        res.status(500).json({ error: "Failed to add tax" });
    }
};

/**
 * Edit an existing tax entry
 */
const editTax = async (req, res) => {
    try {
        const { taxId, taxName, taxType, taxRate } = req.body;

        if (!taxId || !taxName || !taxType || !taxRate) {
            return res.status(400).json({ error: "Missing required fields: taxId, taxName, taxType, taxRate" });
        }

        const result = await updateTax({ taxId, taxName, taxType, taxRate });

        res.status(200).json({ message: "Tax updated successfully", result });
    } catch (error) {
        console.error("Error updating tax:", error.message);
        res.status(500).json({ error: "Failed to update tax" });
    }
};

/**
 * Delete a tax entry
 */
const deleteTax = async (req, res) => {
    try {
        const { taxId } = req.params; // ✅ Ensure taxId is coming from params

        if (!taxId) {
            return res.status(400).json({ error: "Tax ID is required" });
        }

        const deleted = await removeTax(taxId);

        if (!deleted) {
            return res.status(404).json({ error: "Tax not found" });
        }

        res.status(200).json({ message: "Tax deleted successfully" });
    } catch (error) {
        console.error("Error deleting tax:", error.message);
        res.status(500).json({ error: "Failed to delete tax" });
    }
};

export { getAllTaxes, createTax, editTax, deleteTax };
