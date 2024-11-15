import appDB from "../db/subsyncDB.js";
import { getCurrentTime, addDaysToTimestamp } from "../middlewares/time.js";

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
  const { customerID, productID } = subscription;

  // Validate required fields
  if (!customerID || !productID) {
    throw new Error("Customer ID and Product ID are required fields.");
  }

  console.log("Adding subscription for:", subscription); // Log the input

  try {
    const currentTime = getCurrentTime();
    console.log("Current time:", currentTime); // Log current time

    // Validate product
    const [productDetails] = await appDB.query("SELECT * FROM services WHERE sid = ?", [productID]);
    console.log("Product details:", productDetails); // Log product details

    if (!productDetails.length) {
      throw new Error("Invalid Product ID. Product not found.");
    }

    const endDate = addDaysToTimestamp(currentTime, productDetails[0].validity);
    console.log("Calculated end date:", endDate); // Log end date

    const [result] = await appDB.query(
      "INSERT INTO subscriptions (customer_id, service_id, amount, start_date, end_date, status) VALUES (?, ?, ?, ?, ?, ?);",
      [customerID, productID, productDetails[0].price, currentTime, endDate, "active"]
    );

    console.log("Insert result:", result); // Log insert result

    if (result.affectedRows === 0) {
      throw new Error("Failed to add subscription. No rows affected.");
    }

    return true;
  } catch (error) {
    console.error("Error in addSubscription:", error); // Log the error
    if (error.code === "ER_DUP_ENTRY") {
      throw new Error("A subscription with this Customer ID and Service ID already exists.");
    }
    throw new Error("An unexpected error occurred while adding the subscription.");
  }
}

export { getSubscriptions, addSubscription };
