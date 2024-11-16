import appDB from "../db/subsyncDB.js";
import { getCurrentTime } from "../middlewares/time.js";

async function getProducts(searchType, search, sort, order, page = 1, limit = 10) {
  try {
    const validColumns = ["sid", "sname", "description", "validity", "price", "created_at", "updated_at"];
    if (searchType && !validColumns.includes(searchType)) {
      throw new Error("Invalid search type field");
    }
    if (sort && !validColumns.includes(sort)) {
      throw new Error("Invalid sort field");
    }

    let baseQuery = "SELECT * FROM services";
    let countQuery = "SELECT COUNT(*) as totalCount FROM services";
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

async function addProduct(product) {
  const { productName, description, validity, price } = product;

  // Basic validation for required fields
  if (!productName || !description || !validity || !price) {
    throw new Error("All fields (Name, Description, Validity, Price) are required.");
  }

  try {
    const currentTime = getCurrentTime();

    const [result] = await appDB.query(
      "INSERT INTO services (sname, description, validity, price, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?);",
      [productName, description, validity, price, currentTime, currentTime]
    );

    if (result.affectedRows > 0) {
      return true;
    } else {
      throw new Error("Failed to add product. No rows affected.");
    }
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      throw new Error("A product with this name already exists.");
    } else if (error.code === "ER_BAD_NULL_ERROR") {
      throw new Error("One or more fields cannot be null.");
    } else {
      console.error("Database error:", error);
      throw new Error("An unexpected error occurred while adding the product.");
    }
  }
}

async function getProductDetails(id) {
  try {
      // Fetch customer data
      const [data] = await appDB.query("SELECT * FROM services WHERE sid = ?", [id]);

      // Fetch subscriptions for this customer
      const [subscriptions] = await appDB.query("SELECT * FROM subscriptions WHERE service_id = ?", [id]);

      // Return both customer data and subscriptions
      return { product: data, subscriptions: subscriptions };
  } catch (error) {
      console.error("Error fetching customer details from database:", error.message);
      throw new Error("Database query failed");
  }
}

export { getProducts, addProduct, getProductDetails };
