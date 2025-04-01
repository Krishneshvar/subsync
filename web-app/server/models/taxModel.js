import appDB from "../db/subsyncDB.js";
import { getCurrentTime, addDaysToTimestamp } from "../middlewares/time.js";
import { generateID } from "../middlewares/generateID.js";

async function getTaxes() {
    try {
        const [dataArray] = await appDB.query("SELECT * FROM taxes");
        return dataArray;
    } catch (error) {
        console.error("Error fetching taxes from database:", error.message);
        throw new Error("Database query failed");
    }
}

async function addTax(tax) {
    const { taxName, taxType, taxRate } = tax;

    // Validate required fields
    if (!taxName || !taxType || !taxRate) {
        throw new Error("Tax Name, Tax Type, and Tax Rate are required fields.");
    }

    try {
        const tid = generateID("TID");
        const currentTime = getCurrentTime();
        const query = `INSERT INTO taxes (tax_id, tax_name, tax_type, tax_rate, created_at) VALUES (?, ?, ?, ?, ?)`;
        const params = [tid, taxName, taxType, taxRate, currentTime];
        const [result] = await appDB.query(query, params);
        return result;
    } catch (error) {
        console.error("Error adding tax to database:", error.message);
        throw new Error("Database query failed");
    }
}

async function updateTax(tax) {
    const { taxId, taxName, taxType, taxRate } = tax;

    // Validate required fields
    if (!taxId || !taxName || !taxType || !taxRate) {
        throw new Error("Tax ID, Tax Name, Tax Type, and Tax Rate are required fields.");
    }

    try {
        const query = `UPDATE taxes SET tax_name = ?, tax_type = ?, tax_rate = ? WHERE tax_id = ?`;
        const params = [taxName, taxType, taxRate, taxId];
        const [result] = await appDB.query(query, params);
        return result;
    } catch (error) {
        console.error("Error updating tax in database:", error.message);
        throw new Error("Database query failed");
    }
}

async function removeTax(taxId) {
    if (!taxId) {
        throw new Error("Tax ID is required.");
    }

    try {
        const query = `DELETE FROM taxes WHERE tax_id = ?`;
        const [result] = await appDB.query(query, [taxId]);

        if (result.affectedRows === 0) {
            return false; // No record was deleted
        }

        return true; // Tax deleted successfully
    } catch (error) {
        console.error("Error deleting tax from database:", error.message);
        throw new Error("Database query failed");
    }
}

export { getTaxes, addTax, updateTax, removeTax };
