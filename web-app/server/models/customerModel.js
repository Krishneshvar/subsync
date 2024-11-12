import appDB from "../db/subsyncDB.js";

async function getCustomers() {
    try {
        const [rows] = await appDB.query("SELECT * FROM customers;");
        return rows; // returns the array of customer records
    }
    catch (error) {
        console.error("Error fetching customers from database:", error.message);
        throw new Error("Database query failed"); // Re-throw a generic error for the controller to handle
    }
}

async function addCustomer(customer) {
    const { name, email, phone, address } = customer;
    const [result] = await appDB.query("INSERT INTO customers (cname, email, phone, address) VALUES (?, ?, ?, ?);", [name, email, phone, address]);
    return result.affectedRows > 0;
}

export { getCustomers, addCustomer };
