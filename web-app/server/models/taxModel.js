import appDB from "../db/subsyncDB.js";
import { getCurrentTime } from "../middlewares/time.js";
import { generateID } from "../middlewares/generateID.js";

/**
 * Fetch all taxes from the JSON column
 */
async function getTaxes() {
    try {
        const [rows] = await appDB.query("SELECT tax_rates FROM taxes LIMIT 1");

        if (rows.length === 0 || !rows[0].tax_rates) {
            console.log("No tax rates found.");
            return [];
        }

        console.log("Fetched tax_rates from DB:", rows[0].tax_rates);

        // Ensure we are parsing a string, not an object
        const taxRates = typeof rows[0].tax_rates === "string" ? JSON.parse(rows[0].tax_rates) : rows[0].tax_rates;

        return taxRates;
    } catch (error) {
        console.error("Error fetching taxes from database:", error.message);
        throw new Error("Database query failed");
    }
}

/**
 * Add a new tax to the JSON array
 */
async function addTax(tax) {
    const { taxName, taxType, taxRate } = tax;

    if (!taxName || !taxType || taxRate === undefined || taxRate === null) {
        throw new Error("Tax Name, Tax Type, and Tax Rate are required fields.");
    }

    try {
        const taxId = generateID("TID");
        const currentTime = getCurrentTime();

        // Fetch existing tax rates
        const [rows] = await appDB.query("SELECT tax_rates FROM taxes LIMIT 1");

        let taxRates = [];

        if (rows.length) {
            if (rows[0].tax_rates) {
                try {
                    taxRates = JSON.parse(rows[0].tax_rates);
                } catch (error) {
                    console.error("Error parsing tax_rates:", error.message);
                    throw new Error("Invalid tax_rates format in database.");
                }
            }
        } else {
            // Ensure table has at least one row
            await appDB.query("INSERT INTO taxes (tax_rates) VALUES ('[]')");
        }

        // Add new tax entry
        const newTax = {
            tax_id: taxId,
            tax_name: taxName,
            tax_type: taxType,
            tax_rate: parseFloat(taxRate), // Ensure it's stored as a number
            created_at: currentTime,
            updated_at: currentTime
        };

        taxRates.push(newTax);

        // Update database
        await appDB.query("UPDATE taxes SET tax_rates = ? WHERE 1=1", [JSON.stringify(taxRates)]);

        return newTax;
    } catch (error) {
        console.error("Error adding tax to database:", error.message);
        throw new Error("Database query failed");
    }
}

/**
 * Update an existing tax inside the JSON array
 */
async function updateTax(tax) {
    const { taxId, taxName, taxType, taxRate } = tax;

    if (!taxId || !taxName || !taxType || !taxRate) {
        throw new Error("Tax ID, Tax Name, Tax Type, and Tax Rate are required fields.");
    }

    try {
        // Fetch existing tax rates
        const [rows] = await appDB.query("SELECT tax_rates FROM taxes LIMIT 1");
        if (!rows.length || !rows[0].tax_rates) {
            throw new Error("No tax records found.");
        }

        let taxRates = JSON.parse(rows[0].tax_rates);

        // Find and update tax
        const index = taxRates.findIndex(t => t.tax_id === taxId);
        if (index === -1) throw new Error("Tax ID not found.");

        taxRates[index] = { ...taxRates[index], tax_name: taxName, tax_type: taxType, tax_rate: taxRate, updated_at: getCurrentTime() };

        // Update database
        await appDB.query("UPDATE taxes SET tax_rates = ? WHERE 1=1", [JSON.stringify(taxRates)]);
        
        return taxRates[index];
    } catch (error) {
        console.error("Error updating tax in database:", error.message);
        throw new Error("Database query failed");
    }
}

/**
 * Remove a tax from the JSON array
 */
async function removeTax(taxId) {
    if (!taxId) {
        throw new Error("Tax ID is required.");
    }

    try {
        // Fetch existing tax rates
        const [rows] = await appDB.query("SELECT tax_rates FROM taxes LIMIT 1");
        if (!rows.length || !rows[0].tax_rates) {
            throw new Error("No tax records found.");
        }

        let taxRates = rows[0].tax_rates;

        if (!Array.isArray(taxRates)) {
            throw new Error("Invalid tax_rates format in database.");
        }

        const newTaxRates = taxRates.filter(t => t.tax_id !== taxId);

        if (newTaxRates.length === taxRates.length) {
            throw new Error("Tax ID not found.");
        }

        // Update database
        await appDB.query("UPDATE taxes SET tax_rates = ? WHERE 1=1", [JSON.stringify(newTaxRates)]);

        return true;
    } catch (error) {
        console.error("Error deleting tax from database:", error.message);
        throw new Error("Database query failed");
    }
}

export { getTaxes, addTax, updateTax, removeTax };
