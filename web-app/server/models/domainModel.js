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
        if (!domain.customer_id || !domain.domain_name || !domain.registration_date || !domain.registered_with) {
            throw new Error("All required fields must be provided.");
        }

        const currentTime = getCurrentTime();
        
        // Execute SQL query
        const [result] = await appDB.query(
            "INSERT INTO domains (customer_id, customer_name, domain_name, registration_date, registered_with, other_provider, description, mail_service_provider, other_mail_service_details, created_at, updated_at) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
            [
                domain.customer_id, domain.customer_name, domain.domain_name, domain.registration_date,
                domain.registered_with, domain.other_provider || "", domain.description || "", 
                domain.mail_service_provider || "", domain.other_mail_service_details || "", currentTime, currentTime
            ]
        );

        // Add name servers if provided
        if (domain.name_servers && domain.name_servers.length > 0) {
            const nameServerValues = domain.name_servers.map(ns => [result.insertId, ns]);
            await appDB.query(
                "INSERT INTO domain_name_servers (domain_id, name_server) VALUES ?",
                [nameServerValues]
            );
        }

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
    const { domain_name, registration_date, registered_with, other_provider, description, mail_service_provider, other_mail_service_details, name_servers } = updatedData;
    
    console.log("Updated data received:", updatedData);
    
    // Validation
    if (!domain_name || !registration_date || !registered_with) {
        throw new Error("All required fields must be provided.");
    }

    try {
        const currentTime = getCurrentTime();
        const [result] = await appDB.query(
            `UPDATE domains 
             SET domain_name = ?, registration_date = ?, registered_with = ?, 
                 other_provider = ?, description = ?, mail_service_provider = ?, other_mail_service_details = ?, updated_at = ? 
             WHERE domain_id = ?;`,
            [
                domain_name, registration_date, registered_with, 
                other_provider || "", description || "", 
                mail_service_provider || "", other_mail_service_details || "", currentTime, domainId
            ]
        );

        // Update name servers
        if (name_servers) {
            // Delete existing name servers
            await appDB.query("DELETE FROM domain_name_servers WHERE domain_id = ?", [domainId]);
            
            // Add new name servers
            if (name_servers.length > 0) {
                const nameServerValues = name_servers.map(ns => [domainId, ns]);
                await appDB.query(
                    "INSERT INTO domain_name_servers (domain_id, name_server) VALUES ?",
                    [nameServerValues]
                );
            }
        }

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
            `SELECT d.*, GROUP_CONCAT(dns.name_server) as name_servers
             FROM domains d
             LEFT JOIN domain_name_servers dns ON d.domain_id = dns.domain_id
             WHERE (
                d.domain_name LIKE ? OR
                d.customer_name LIKE ? OR
                d.registered_with LIKE ? OR
                d.description LIKE ?
             )
             GROUP BY d.domain_id
             ORDER BY ${sort} ${order.toUpperCase()} 
             LIMIT ? OFFSET ?`,
            [searchQuery, searchQuery, searchQuery, searchQuery, parseInt(limit), parseInt(offset)]
        );

        // Convert name_servers string to array
        domains.forEach(domain => {
            domain.name_servers = domain.name_servers ? domain.name_servers.split(',') : [];
        });

        const [[{ total }]] = await appDB.query(
            `SELECT COUNT(DISTINCT d.domain_id) as total 
             FROM domains d 
             WHERE (
                d.domain_name LIKE ? OR
                d.customer_name LIKE ? OR
                d.registered_with LIKE ? OR
                d.description LIKE ?
             )`,
            [searchQuery, searchQuery, searchQuery, searchQuery]
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
        const [domain] = await appDB.query(
            `SELECT d.*, GROUP_CONCAT(dns.name_server) as name_servers
             FROM domains d
             LEFT JOIN domain_name_servers dns ON d.domain_id = dns.domain_id
             WHERE d.domain_id = ?
             GROUP BY d.domain_id`,
            [domainId]
        );
        
        if (domain[0]) {
            domain[0].name_servers = domain[0].name_servers ? domain[0].name_servers.split(',') : [];
        }
        
        return domain[0];
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
        INSERT INTO domains (customer_id, domain_name, registration_date, registered_with, other_provider, name_server, description) 
        VALUES ?
    `;

    const values = domains.map(domain => [
        domain.customer_id,
        domain.customer_name || "",
        domain.domain_name,
        domain.registration_date,
        domain.registered_with,
        domain.other_provider || "",
        domain.name_server || "",
        domain.description || ""
    ]);

    await appDB.query(query, [values]);
};

export { addDomain, updateDomain, getAllDomains, getDomainById, importDomainData };
