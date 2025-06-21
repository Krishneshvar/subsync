import appDB from "../db/subsyncDB.js";

// Fetch GST settings
async function getGSTSettings() {
    try {
        const [rows] = await appDB.query("SELECT * from gst_settings ");
        console.log(rows);
    } catch (error) {
        console.error("Error fetching GST settings:", error.message);
        throw new Error("Database query failed");
    }
}

// Update GST settings
async function updateGSTSettings(newSettings) {
    try {
        // Ensure gst_settings is stored as a JSON string
        const jsonString = JSON.stringify(newSettings);

        // Check if a row exists in the `taxes` table
        const [rows] = await appDB.query("SELECT COUNT(*) AS count FROM taxes");
        if (rows[0].count === 0) {
            await appDB.query("INSERT INTO taxes (tax_rates, default_tax_preference, gst_settings) VALUES ('[]', '{}', '{}')");
        }        

        // Update gst_settings with a JSON string
        await appDB.query("UPDATE taxes SET gst_settings = ? WHERE 1=1", [jsonString]);

        return true;
    } catch (error) {
        console.error("Error updating GST settings:", error.message);
        throw new Error("Database update failed");
    }
}

export { getGSTSettings, updateGSTSettings };
