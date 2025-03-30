import appDB from "../db/subsyncDB.js";
import { getCurrentTime } from "../middlewares/time.js";

/**
 * Function to add a domain into the database
 * @param   {Object} domain The object with domain details
 * @returns {Promise<number>}
 */
async function addDomain(domain) {
    try {
        // Validate required fields
        if (!domain.customer_id || !domain.domain_name || !domain.registration_date || !domain.expiry_date || !domain.registered_with) {
            throw new Error("All required fields must be provided.");
        }

        const currentTime = getCurrentTime();
        
        // Execute SQL query
        const [result] = await appDB.query(
            "INSERT INTO domains (customer_id,customer_name, domain_name, registration_date, expiry_date, registered_with, other_provider, name_server, description, created_at, updated_at) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
            [
                domain.customer_id, domain.customer_name,domain.domain_name, domain.registration_date, domain.expiry_date, 
                domain.registered_with, domain.other_provider || "", domain.name_server || "", 
                domain.description || "", currentTime, currentTime
            ]
        );

        // Check result
        if (result.affectedRows > 0) {
            return result.insertId;
        } else {
            throw new Error("Failed to add domain. No rows affected.");
        }
    } catch (error) {
        console.error("Database error:", error);
        throw new Error("An unexpected error occurred while adding the domain.");
    }
}

/**
 * Function to edit/update a domain's details in the database
 * @param   {number} domainId The ID of the domain to be updated
 * @param   {Object} updatedData The object containing the new domain details
 * @returns {Promise<*>}
 */
async function updateDomain(domainId, updatedData) {
    const { domain_name, registration_date, expiry_date, registered_with, other_provider, name_server, description } = updatedData;
    
    console.log("Updated data received:", updatedData);
    
    // Validation
    if (!domain_name || !registration_date || !expiry_date || !registered_with) {
        throw new Error("All required fields must be provided.");
    }

    try {
        const currentTime = getCurrentTime();
        const [result] = await appDB.query(
            `UPDATE domains 
             SET domain_name = ?, registration_date = ?, expiry_date = ?, registered_with = ?, 
                 other_provider = ?, name_server = ?, description = ?, updated_at = ? 
             WHERE domain_id = ?;`,
            [
                domain_name, registration_date, expiry_date, registered_with, 
                other_provider || "", name_server || "", description || "", 
                currentTime, domainId
            ]
        );

        if (result.affectedRows > 0) {
            return domainId;
        } else {
            throw new Error("Failed to update domain. No rows affected.");
        }
    } catch (error) {
        console.error("Database error:", error);
        throw new Error("An unexpected error occurred while updating the domain.");
    }
}

/**
 * Function to get all domains with pagination
 * @param {string} search The string to be searched in the database
 * @param {string} sort The field that is to be sorted
 * @param {string} order The order in which the given field is to be sorted
 * @param {Number} page The page of data to be displayed
 * @param {Number} limit The number of data to be displayed per page
 * @returns {Promise<{totalPages: number, domains: *}>}
 */
const validSortColumns = ["customer_name", "domain_name", "registration_date", "expiry_date", "registered_with", "name_server", "description"];

const getAllDomains = async ({ search = "", sort = "domain_name", order = "asc", page = 1, limit = 10 }) => {
    const offset = (page - 1) * limit;
    const searchQuery = `%${search}%`;

    // Ensure `sort` is a valid column, otherwise fallback to "domain_name"
    if (!validSortColumns.includes(sort)) {
        sort = "domain_name";
    }

    try {
        const [domains] = await appDB.query(
            `SELECT * FROM domains WHERE domain_name LIKE ? 
             ORDER BY ${sort} ${order.toUpperCase()} 
             LIMIT ? OFFSET ?`,
            [searchQuery, parseInt(limit), parseInt(offset)]
        );

        const [[{ total }]] = await appDB.query(
            `SELECT COUNT(*) as total FROM domains WHERE domain_name LIKE ?`,
            [searchQuery]
        );

        const totalPages = Math.ceil(total / limit);
        return { domains, totalPages };
    } catch (error) {
        console.error("Error fetching domains:", error);
        throw error;
    }
};


/**
 * Fetch a single domain by given ID
 * @param   {number} domainId The ID of the domain to be fetched
 * @returns {Promise<*>}
 */
const getDomainById = async (domainId) => {
    try {
        const [result] = await appDB.query(
            `SELECT * FROM domains WHERE domain_id = ?`,
            [domainId]
        );
        console.log(result);
        return result[0];
    } catch (error) {
        console.error("Error fetching domain by ID:", error);
        throw error;
    }
};

/**
 * Import multiple domains in bulk
 * @param {Array} domains - Array of domain objects to be inserted
 */
const importDomainData = async (domains) => {
    const query = `
        INSERT INTO domains (customer_id, domain_name, registration_date, expiry_date, registered_with, other_provider, name_server, description) 
        VALUES ?
    `;

    const values = domains.map(domain => [
        domain.customer_id,
        domain.customer_name || "",
        domain.domain_name,
        domain.registration_date,
        domain.expiry_date,
        domain.registered_with,
        domain.other_provider || "",
        domain.name_server || "",
        domain.description || ""
    ]);

    await appDB.query(query, [values]);
};

export { addDomain, updateDomain, getAllDomains, getDomainById, importDomainData };
