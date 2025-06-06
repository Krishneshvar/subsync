import appDB from "../db/subsyncDB.js";
import { getCurrentTime } from "../middlewares/time.js";
import { generateID } from "../middlewares/generateID.js";

// Fetch all taxes
async function getTaxes() {
    const [rows] = await appDB.query("SELECT tax_rates FROM taxes LIMIT 1");
    if (!rows.length || !rows[0].tax_rates) return [];
    let taxRates = rows[0].tax_rates;
    if (Buffer.isBuffer(taxRates)) taxRates = taxRates.toString("utf8");
    if (typeof taxRates === "string") taxRates = JSON.parse(taxRates);
    return Array.isArray(taxRates) ? taxRates : [];
}

// Add a new tax
async function addTax({ taxName, taxType, taxRate }) {
    if (!taxName || !taxType || taxRate === undefined || taxRate === null)
        throw new Error("Tax Name, Tax Type, and Tax Rate are required fields.");

    const taxId = generateID("TID");
    const currentTime = getCurrentTime();

    // Ensure at least one row exists
    await appDB.query("INSERT IGNORE INTO taxes (tax_rates, default_tax_preference, gst_settings) VALUES ('[]', '{}', '{}')");

    const taxRates = await getTaxes();
    const newTax = {
        tax_id: taxId,
        tax_name: taxName,
        tax_type: taxType,
        tax_rate: parseFloat(taxRate),
        created_at: currentTime,
        updated_at: currentTime
    };
    taxRates.push(newTax);
    await appDB.query("UPDATE taxes SET tax_rates = ? WHERE 1=1", [JSON.stringify(taxRates)]);
    return newTax;
}

// Update a tax
async function updateTax({ taxId, taxName, taxType, taxRate }) {
    if (!taxId || !taxName || !taxType || taxRate === undefined || taxRate === null)
        throw new Error("Tax ID, Tax Name, Tax Type, and Tax Rate are required fields.");

    const taxRates = await getTaxes();
    const idx = taxRates.findIndex(t => t.tax_id === taxId);
    if (idx === -1) throw new Error("Tax ID not found.");

    taxRates[idx] = {
        ...taxRates[idx],
        tax_name: taxName,
        tax_type: taxType,
        tax_rate: parseFloat(taxRate),
        updated_at: getCurrentTime()
    };
    await appDB.query("UPDATE taxes SET tax_rates = ? WHERE 1=1", [JSON.stringify(taxRates)]);
    return taxRates[idx];
}

// Remove a tax
async function removeTax(taxId) {
    if (!taxId) throw new Error("Tax ID is required.");
    const taxRates = await getTaxes();
    const newTaxRates = taxRates.filter(t => t.tax_id !== taxId);
    if (newTaxRates.length === taxRates.length) throw new Error("Tax ID not found.");
    await appDB.query("UPDATE taxes SET tax_rates = ? WHERE 1=1", [JSON.stringify(newTaxRates)]);
    return true;
}

// Get default tax preference
async function getDefaultTaxPreference() {
    const [rows] = await appDB.query("SELECT default_tax_preference FROM taxes LIMIT 1");
    if (!rows.length || !rows[0].default_tax_preference) return null;
    let pref = rows[0].default_tax_preference;
    if (Buffer.isBuffer(pref)) pref = pref.toString("utf8");
    if (typeof pref === "string") pref = JSON.parse(pref);
    return pref;
}

// Set default tax preference
async function setDefaultTaxPreference(defaultTax) {
    if (!defaultTax || !defaultTax.tax_id) throw new Error("A valid tax object is required.");
    await appDB.query("UPDATE taxes SET default_tax_preference = ? WHERE 1=1", [JSON.stringify(defaultTax)]);
    return true;
}

export { getTaxes, addTax, updateTax, removeTax, getDefaultTaxPreference, setDefaultTaxPreference };
