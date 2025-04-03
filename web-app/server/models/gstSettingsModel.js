import appDB from "../db/subsyncDB.js";

// Fetch GST settings
async function getGSTSettings() {
    try {
        const [rows] = await appDB.query("SELECT gst_settings FROM taxes LIMIT 1");

        if (!rows.length || !rows[0].gst_settings) {
            console.warn("GST settings not found, returning empty default.");
            return {
                taxRegistrationNumberLabel: "",
                gstin: "",
                businessLegalName: "",
                businessTradeName: "",
                gstRegisteredOn: ""
            }; // Return empty default instead of null
        }        

        console.log("Raw gst_settings from DB:", rows[0].gst_settings);

        let settings;
        try {
            settings = rows[0].gst_settings; // Ensure it's valid JSON
        } catch (error) {
            console.error("Error parsing gst_settings:", error.message, "Stored Value:", rows[0].gst_settings);
            throw new Error("Invalid gst_settings format in database.");
        }

        return settings;
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
