import {
    getTaxes, addTax, updateTax, removeTax,
    getDefaultTaxPreference, setDefaultTaxPreference
} from "../models/taxModel.js";

/**
 * Get all taxes
 */
const getAllTaxes = async (req, res) => {
    try {
        const taxes = await getTaxes();
        res.status(200).json({ taxes });
    } catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch taxes" });
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

        res.status(201).json({ message: "Tax added successfully", tax: result });
    } catch (error) {
        res.status(400).json({ error: error.message || "Failed to add tax" });
    }
};

/**
 * Edit an existing tax entry
 */
const editTax = async (req, res) => {
    try {
        const { taxId, taxName, taxType, taxRate } = req.body;

        if (!taxId || !taxName || !taxType || taxRate === undefined || taxRate === null) {
            return res.status(400).json({ error: "Missing required fields: taxId, taxName, taxType, taxRate" });
        }

        const result = await updateTax({ taxId, taxName, taxType, taxRate });

        res.status(200).json({ message: "Tax updated successfully", tax: result });
    } catch (error) {
        res.status(400).json({ error: error.message || "Failed to update tax" });
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

        await removeTax(taxId);

        res.status(200).json({ message: "Tax deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message || "Failed to delete tax" });
    }
};

/**
 * Get default tax preference
 */
const getDefaultTaxPref = async (req, res) => {
    try {
        const pref = await getDefaultTaxPreference();
        res.status(200).json({ defaultTaxPreference: pref });
    } catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch default tax preference" });
    }
};

/**
 * Set default tax preference
 */
const setDefaultTaxPref = async (req, res) => {
    try {
        const { tax } = req.body;
        if (!tax || !tax.tax_id) return res.status(400).json({ error: "A valid tax object is required" });
        await setDefaultTaxPreference(tax);
        res.status(200).json({ message: "Default tax preference updated" });
    } catch (error) {
        res.status(400).json({ error: error.message || "Failed to set default tax preference" });
    }
};

export { getAllTaxes, createTax, editTax, deleteTax, getDefaultTaxPref, setDefaultTaxPref };
