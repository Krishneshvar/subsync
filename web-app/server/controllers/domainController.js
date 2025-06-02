import { addDomain, updateDomain, getAllDomains, getDomainById, importDomainData } from "../models/domainModel.js";

/**
 * Controller function for addDomain() to be executed at /create-domain
 */
const createDomain = async (req, res) => {
    try {
        console.log("Received Data", req.body);
        await addDomain(req.body);
        res.status(201).json({ message: 'Domain created successfully!' });
    } catch (error) {
        console.error("Domain creation error:", error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Controller function for updateDomain() to be executed at /update-domain/:did
 */
const updateDomainDetails = async (req, res) => {
    try {
        console.log("Request body received:", req.body);
        const { did } = req.params;
        await updateDomain(did, req.body);
        const updatedDomain = await getDomainById(did); // after update
        res.json(updatedDomain);
    } catch (error) {
        console.error("Domain update error:", error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Controller function for getAllDomains() to be executed at /all-domains
 */
const fetchAllDomains = async (req, res) => {
    try {
        const { search = "", sort = "name", order = "asc", page = 1, limit = 10 } = req.query;
        const { domains, totalPages } = await getAllDomains({ search, sort, order, page: parseInt(page), limit: parseInt(limit) });
        res.status(200).json({ domains, totalPages });
    } catch (error) {
        console.error("Error fetching domains:", error);
        res.status(500).json({ error: "Failed to fetch domains from the database." });
    }
};

/**
 * Controller function for getAllDomainDetails() to be executed at /all-domain-details
 */
const fetchAllDomainDetails = async (req, res) => {
    try {
        const domains = await getAllDomainDetails();
        res.status(200).json({ domains });
    } catch (error) {
        console.error("Error fetching all domain details:", error);
        res.status(500).json({ error: "Failed to fetch all domain details." });
    }
};

/**
 * Controller function for getDomainById() to be executed at /domain/:did
 */
const domainDetailsByID = async (req, res) => {
    try {
        const domain = await getDomainById(req.params.did);
        if (!domain) {
            return res.status(404).json({ error: "Domain not found." });
        }
        res.status(200).json({ domain });
    } catch (error) {
        console.error("Error fetching domain details:", error);
        res.status(500).json({ error: "Failed to fetch domain details." });
    }
};

/**
 * Controller function for importDomainData() to be executed at /import-domains
 */
const importDomains = async (req, res) => {
    try {
        const { domains } = req.body;
        if (!domains || domains.length === 0) {
            return res.status(400).json({ error: "No domain data provided" });
        }
        await importDomainData(domains);
        res.status(200).json({ message: "Domains imported successfully!" });
    } catch (error) {
        console.error("Error importing domains:", error);
        res.status(500).json({ error: "Failed to import domains." });
    }
};

export { createDomain, updateDomainDetails, fetchAllDomains, fetchAllDomainDetails, domainDetailsByID, importDomains };