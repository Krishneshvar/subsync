import appDB from "../db/subsyncDB.js";
import { getCurrentTime } from "../middlewares/time.js";
import { generateID } from "../middlewares/generateID.js";
import { isValidGSTIN, isValidEmail, isValidPhoneNumber } from "../middlewares/validations.js";

/**
 * Creates a new vendor in the database.
 * @param {Object} vendor - The vendor object containing all vendor details.
 * @returns {Promise<Object>} The result of the database insert operation.
 */
const createVendor = async (vendor) => {
    try {
        // Defensive: extract .value for select fields if needed
        const currencyCode =
            typeof vendor.currencyCode === "object"
                ? vendor.currencyCode.value
                : vendor.currencyCode;

        // Defensive: extract .value for address country/state if needed
        const address = {
            ...vendor.address,
            country:
                vendor.address && typeof vendor.address.country === "object"
                    ? vendor.address.country.value
                    : vendor.address?.country,
            state:
                vendor.address && typeof vendor.address.state === "object"
                    ? vendor.address.state.value
                    : vendor.address?.state,
        };

        // Validate required fields (use extracted values)
        if (
            !vendor.salutation ||
            !vendor.firstName ||
            !vendor.lastName ||
            !vendor.email ||
            !vendor.phoneNumber ||
            !address ||
            !address.state ||
            !vendor.companyName ||
            !vendor.displayName ||
            !vendor.gstin ||
            !currencyCode ||
            !vendor.gst_treatment ||
            !vendor.tax_preference
        ) {
            throw new Error("All required fields must be provided.");
        }

        if (!isValidGSTIN(vendor.gstin)) {
            throw new Error("Invalid GSTIN format.");
        }

        if (!isValidEmail(vendor.email)) {
            throw new Error("Invalid email address format.");
        }

        if (!isValidPhoneNumber(vendor.phoneNumber)) {
            throw new Error("Invalid primary phone number format.");
        }

        if (vendor.secondaryPhoneNumber && !isValidPhoneNumber(vendor.secondaryPhoneNumber)) {
            throw new Error("Invalid secondary phone number format.");
        }

        const currentTime = getCurrentTime();
        const vid = generateID("VID");

        // Serialize JSON fields
        const vendorAddress = JSON.stringify(address);
        const otherContacts = JSON.stringify(vendor.contactPersons || []);
        const paymentTerms = JSON.stringify(vendor.payment_terms || { term_name: "Due on Receipt", days: 0, is_default: true });

        const query = `
            INSERT INTO vendors (
                vendor_id, salutation, first_name, last_name, primary_email, country_code,
                primary_phone_number, secondary_phone_number, vendor_address, other_contacts,
                company_name, display_name, gst_in, currency_code, gst_treatment,
                tax_preference, exemption_reason, payment_terms, notes, vendor_status,
                created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            vid,
            vendor.salutation,
            vendor.firstName,
            vendor.lastName,
            vendor.email,
            vendor.country_code,
            vendor.phoneNumber,
            vendor.secondaryPhoneNumber || null,
            vendorAddress,
            otherContacts,
            vendor.companyName,
            vendor.displayName,
            vendor.gstin,
            currencyCode,
            vendor.gst_treatment,
            vendor.tax_preference,
            vendor.exemption_reason || "",
            paymentTerms,
            vendor.notes || "",
            vendor.vendorStatus || "Active",
            currentTime,
            currentTime
        ];

        const [result] = await appDB.execute(query, values);
        return result;
    } catch (error) {
        // Always throw a string error message
        throw new Error(error.message || "Error creating vendor.");
    }
};

/**
 * Retrieves all vendors from the database.
 * @param {Object} params - Query parameters for filtering and pagination
 * @returns {Promise<{vendors: Array, totalPages: number}>} Array of vendor objects and total pages
 */
const getAllVendors = async ({ search = "", sort = "display_name", order = "asc", page = 1, limit = 10 } = {}) => {
    const offset = (page - 1) * limit;
    const searchQuery = `%${search}%`;

    try {
        const [vendors] = await appDB.query(
            `SELECT vendor_id, salutation, first_name, last_name, display_name, company_name, 
                    primary_phone_number, primary_email, vendor_status
             FROM vendors 
             WHERE (
                display_name LIKE ? OR
                first_name LIKE ? OR
                last_name LIKE ? OR
                company_name LIKE ? OR
                primary_phone_number LIKE ? OR
                primary_email LIKE ? OR
                vendor_id LIKE ?
             )
             ORDER BY ?? ${order.toUpperCase()} 
             LIMIT ? OFFSET ?`,
            [searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, sort, parseInt(limit), parseInt(offset)]
        );

        const [[{ total }]] = await appDB.query(
            `SELECT COUNT(*) as total FROM vendors WHERE (
                display_name LIKE ? OR
                first_name LIKE ? OR
                last_name LIKE ? OR
                company_name LIKE ? OR
                primary_phone_number LIKE ? OR
                primary_email LIKE ? OR
                vendor_id LIKE ?
            )`,
            [searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, searchQuery]
        );

        const totalPages = Math.ceil(total / limit);
        return { vendors, totalPages };
    } catch (error) {
        console.error("Error fetching vendors:", error);
        throw error;
    }
};

/**
 * Retrieves a single vendor by its ID.
 * @param {string} vendorId - The ID of the vendor to retrieve.
 * @returns {Promise<Object|undefined>} The vendor object if found, otherwise undefined.
 */
const getVendorById = async (vendorId) => {
    const query = `SELECT * FROM vendors WHERE vendor_id = ?`;
    const [rows] = await appDB.execute(query, [vendorId]);
    return rows[0];
};

/**
 * Updates an existing vendor's details.
 * @param {string} vendorId - The ID of the vendor to update.
 * @param {Object} updatedData - Object containing the updated vendor details.
 * @returns {Promise<Object>} The result of the database update operation.
 */
const updateVendor = async (vendorId, updatedData) => {
    try {
        const {
            salutation, first_name, last_name, primary_email, country_code, primary_phone_number,
            secondary_phone_number, vendor_address, company_name, display_name, gst_in,
            currency_code, gst_treatment, other_contacts, tax_preference, exemption_reason,
            payment_terms, notes, vendor_status
        } = updatedData;

        // Validation
        if (!salutation || !first_name || !last_name || !primary_email || !primary_phone_number ||
            !vendor_address || !company_name || !display_name || !gst_in || !currency_code ||
            !gst_treatment || !tax_preference) {
            throw new Error("All required fields must be provided.");
        }

        if (!isValidGSTIN(gst_in)) {
            throw new Error("Invalid GSTIN format.");
        }
        if (!isValidEmail(primary_email)) {
            throw new Error("Invalid email address format.");
        }
        if (!isValidPhoneNumber(primary_phone_number)) {
            throw new Error("Invalid primary phone number format.");
        }
        if (secondary_phone_number && !isValidPhoneNumber(secondary_phone_number)) {
            throw new Error("Invalid secondary phone number format.");
        }

        const currentTime = getCurrentTime();

        // Serialize JSON fields
        const serializedAddress = JSON.stringify(vendor_address);
        const serializedContacts = JSON.stringify(other_contacts);
        const serializedPaymentTerms = JSON.stringify(payment_terms) || JSON.stringify({ term_name: "Due on Receipt", days: 0, is_default: true });

        const query = `
            UPDATE vendors SET
                salutation = ?, first_name = ?, last_name = ?, primary_email = ?, country_code = ?,
                primary_phone_number = ?, secondary_phone_number = ?, vendor_address = ?, other_contacts = ?,
                company_name = ?, display_name = ?, gst_in = ?, currency_code = ?, gst_treatment = ?,
                tax_preference = ?, exemption_reason = ?, payment_terms = ?, notes = ?, vendor_status = ?,
                updated_at = ?
            WHERE vendor_id = ?
        `;

        const values = [
            salutation, first_name, last_name, primary_email, country_code,
            Number(primary_phone_number), secondary_phone_number ? Number(secondary_phone_number) : null,
            serializedAddress, serializedContacts, company_name, display_name, gst_in,
            currency_code, gst_treatment, tax_preference, exemption_reason || "",
            serializedPaymentTerms, notes || "", vendor_status || "Active",
            currentTime, vendorId
        ];

        const [result] = await appDB.execute(query, values);
        return result;
    } catch (error) {
        console.error("Error updating vendor:", error);
        throw error;
    }
};

/**
 * Deletes a vendor by its ID.
 * @param {string} vendorId - The ID of the vendor to delete.
 * @returns {Promise<Object>} The result of the database delete operation.
 */
const deleteVendor = async (vendorId) => {
    const query = `DELETE FROM vendors WHERE vendor_id = ?`;
    const [result] = await appDB.execute(query, [vendorId]);
    return result;
};

export {
    createVendor,
    getAllVendors,
    getVendorById,
    updateVendor,
    deleteVendor
};
