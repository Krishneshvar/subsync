import { getTaxes, addTax, updateTax, removeTax } from "../models/taxModel.js";

const getAllTaxes = async (req, res) => {
    try {
        const taxes = await getTaxes();
        res.status(200).json({ taxes });
    } catch (error) {
        console.error("Error fetching taxes:", error.message);
        res.status(500).json({ error: "Failed to fetch taxes" });
    }
};

const createTax = async (req, res) => {
    try {
        const tax = req.body;
        const result = await addTax(tax);
        res.status(201).json({ message: "Tax added successfully", result });
    } catch (error) {
        console.error("Error adding tax:", error.message);
        res.status(500).json({ error: "Failed to add tax" });
    }
};

const editTax = async (req, res) => {
    try {
        const tax = req.body;
        const result = await updateTax(tax);
        res.status(200).json({ message: "Tax updated successfully", result });
    } catch (error) {
        console.error("Error updating tax:", error.message);
        res.status(500).json({ error: "Failed to update tax" });
    }
};

const deleteTax = async (req, res) => {
    try {
        const { taxId } = req.params;

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
