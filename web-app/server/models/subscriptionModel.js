import appDB from "../db/subsyncDB.js";
import getCurrentTime from "../middlewares/time.js";

async function getSubscriptions(searchType, search, sort, order, page = 1, limit = 10) {
  try {
    const validColumns = ["sub_id", "customer_id", "service_id", "amount", "start_date", "end_date", "status"];
    if (searchType && !validColumns.includes(searchType)) {
      throw new Error("Invalid search type field");
    }
    if (sort && !validColumns.includes(sort)) {
      throw new Error("Invalid sort field");
    }

    let baseQuery = "SELECT * FROM subscriptions";
    let countQuery = "SELECT COUNT(*) as totalCount FROM subscriptions";
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
    console.error("Error fetching products from database:", error.message);
    throw new Error("Database query failed");
  }
}

async function addSubscription(subscription) {
  const { customer_id, service_id, amount, start_date, end_date, status } = subscription; // Include domains

  // Basic validation for required fields
  if (!customer_id || !service_id || !amount || !start_date || !end_date || !status) {
    throw new Error("Customer ID, service ID, amount, start date, end date, and status are required fields.");
  }

  try {
    const currentTime = getCurrentTime();

    const [result] = await appDB.query(
      "INSERT INTO subscriptions (customer_id, service_id, amount, start_date, end_date, status) VALUES (?, ?, ?, ?, ?, ?);",
      [customer_id, service_id, amount, start_date, end_date, status]
    );

    if (result.affectedRows > 0) {
      return true;
    } else {
      throw new Error("Failed to add subscription. No rows affected.");
    }
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error("A subscription with this customer ID and service ID already exists.");
    } else if (error.code === 'ER_BAD_NULL_ERROR') {
      throw new Error("One or more fields cannot be null.");
    } else {
      console.error("Database error:", error);
      throw new Error("An unexpected error occurred while adding the subscription.");
    }
  }
}

export { getSubscriptions, addSubscription };
