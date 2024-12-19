import appDB from "../db/subsyncDB.js";
import { getCurrentTime } from "../middlewares/time.js";

async function getCustomers(searchType, search, sort, order, page = 1, limit = 10) {
    try {
        const validColumns = [
            "customer_id", "salutation", "first_name", "last_name", "primary_email", "primary_phone_number",
            "company_name", "display_name", "gst_in"
        ];
        if (searchType && !validColumns.includes(searchType)) {
            throw new Error("Invalid search type field");
        }
        if (sort && !validColumns.includes(sort)) {
            throw new Error("Invalid sort field");
        }

        let baseQuery = "SELECT * FROM customers";
        let countQuery = "SELECT COUNT(*) as totalCount FROM customers";
        const queryParams = [];
        const countParams = [];

        if (searchType && search) {
            const filter = ` WHERE ${searchType} LIKE ?`;
            baseQuery += filter;
            countQuery += filter;
            queryParams.push(`%${search}%`);
            countParams.push(`%${search}%`);
        }

        if (sort && order) {
            baseQuery += ` ORDER BY ${sort} ${order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'}`;
        }

        const offset = (page - 1) * limit;
        baseQuery += ` LIMIT ? OFFSET ?`;
        queryParams.push(limit, offset);

        console.log("Executing SQL query:", baseQuery);
        console.log("With parameters:", queryParams);

        const [dataArray] = await appDB.query(baseQuery, queryParams);
        const [[{ totalCount }]] = await appDB.query(countQuery, countParams);

        return { dataArray, totalCount };
    } catch (error) {
        console.error("Error fetching customers from database:", error.message);
        throw new Error("Database query failed");
    }
}

async function getCustomerDetails(id) {
    try {
        // Fetch customer data
        const [data] = await appDB.query("SELECT * FROM customers WHERE id = ?", [id]);

        // Fetch subscriptions for this customer
        const [subscriptions] = await appDB.query("SELECT * FROM subscriptions WHERE customers_id = ?", [id]);

        // Return both customer data and subscriptions
        return { customer: data, subscriptions: subscriptions };
    } catch (error) {
        console.error("Error fetching customer details from database:", error.message);
        throw new Error("Database query failed");
    }
}

//GST Validation Regex
function isValidGSTIN(gstno) {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[Z]{1}[A-Z0-9]{1}$/;
    return gstRegex.test(gstno);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhoneNumber(phoneNumber) {
    const phoneRegex = /^[0-9]{10}$/; // Adjust this regex for country-specific formats if needed
    return phoneRegex.test(phoneNumber);
}

async function addCustomer(customer) {
    const { customerName, email, phoneNumber, address, gstno } = customer;

    if (!customerName || !address) {
        throw new Error("Name and address are required.");
    }

    if (!isValidGSTIN(gstno)) {
        throw new Error("Invalid GSTIN format.");
    }

    // Email Validation
    if (!isValidEmail(email)) {
        throw new Error("Invalid email address format.");
    }

    // Phone Number Validation
    if (!isValidPhoneNumber(phoneNumber)) {
        throw new Error("Invalid phone number. It must be a 10-digit number.");
    }
    

    try {
        const currentTime = getCurrentTime();

        const [result] = await appDB.query(
            "INSERT INTO customers (cname, email, phone_number, address, gstno, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?);",
            [customerName, email, phoneNumber, address, gstno, currentTime, currentTime]
        );

        if (result.affectedRows > 0) {
            // Return the inserted ID
            return result.insertId;
        } else {
            throw new Error("Failed to add customer. No rows affected.");
        }
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            throw new Error("A customer with this email or phone number already exists.");
        } else if (error.code === 'ER_BAD_NULL_ERROR') {
            throw new Error("One or more fields cannot be null.");
        } else {
            console.error("Database error:", error);
            throw new Error("An unexpected error occurred while adding the customer.");
        }
    }
}

export { getCustomers, addCustomer, getCustomerDetails };
