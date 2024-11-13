import appDB from "../db/subsyncDB.js";
import getCurrentTime from "../middlewares/time.js";

async function getCustomers(searchType, search, sort, order, page = 1, limit = 10) {
    try {
        let baseQuery = "SELECT * FROM customers";
        let countQuery = "SELECT COUNT(*) as totalCount FROM customers";
        const queryParams = [];
        const countParams = [];

        // Dynamic filtering for both base query and count query
        if (searchType && search) {
            const filter = ` WHERE ${searchType} LIKE ?`;
            baseQuery += filter;
            countQuery += filter;
            queryParams.push(`%${search}%`);
            countParams.push(`%${search}%`);
        }

        // Dynamic sorting
        if (sort && order) {
            baseQuery += ` ORDER BY ${sort} ${order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'}`;
        }

        // Pagination
        const offset = (page - 1) * limit;
        baseQuery += ` LIMIT ? OFFSET ?`;
        queryParams.push(limit, offset);

        console.log("Executing SQL query:", baseQuery); // Debug SQL query
        console.log("With parameters:", queryParams); // Debug parameters

        const [customers] = await appDB.query(baseQuery, queryParams);
        const [[{ totalCount }]] = await appDB.query(countQuery, countParams);

        return { customers, totalCount };
    } catch (error) {
        console.error("Error fetching customers from database:", error.message);
        throw new Error("Database query failed");
    }
}

async function addCustomer(customer) {
    const { customerName, email, phoneNumber, address, domains } = customer; // Include domains

    // Basic validation for required fields
    if (!customerName || !email || !phoneNumber || !address) {
        throw new Error("Name, email, phone number, and address are required fields.");
    }

    try {
        const currentTime = getCurrentTime();

        const [result] = await appDB.query(
            "INSERT INTO customers (cname, email, phone, address, domains, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?);",
            [customerName, email, phoneNumber, address, domains, currentTime, currentTime] // Add domains and currentTime to the values array
        );

        if (result.affectedRows > 0) {
            return true;
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

export { getCustomers, addCustomer };
