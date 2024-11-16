import { getProducts, addProduct, getProductDetails } from "../models/productModel.js";

const createProduct = async (req, res) => {
  try {
    const { productName, description, validity, price } = req.body;
    
    const product = {
      productName,
      description,
      validity,
      price,
    };

    const success = await addProduct(product);
    
    if (success) {
      res.status(201).json({ message: "Product added successfully!" });
    } else {
      res.status(400).json({ error: "Failed to add product." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductsController = async (req, res) => {
  try {
    const { searchType, search, sort, order, page = 1 } = req.query;
    console.log("Controller received query params:", { searchType, search, sort, order, page });

    const limit = 10;
    const { dataArray, totalCount } = await getProducts(searchType, search, sort, order, page, limit);

    if (dataArray.length === 0) {
        return res.status(404).json({ message: "No products found." });
    }

    const totalPages = Math.ceil(totalCount / limit);
    res.set('x-total-count', totalCount);

    res.status(200).json({
      dataArray,
      currentPage: parseInt(page, 10),
      totalPages,
      totalCount
    });
  } catch (error) {
    console.error("Error in getCustomersController:", error.message);
    if (error.message.includes("Invalid")) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Failed to retrieve products. Please try again later." });
  }
};

const getProductDetailsController = async (req, res) => {
  const { id } = req.params;

  try {
      // Get customer and subscriptions details
      const { product, subscriptions } = await getProductDetails(id);
      
      // Send both customer and subscriptions data in the response
      res.status(200).json({ product, subscriptions });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

export { getProductsController, createProduct, getProductDetailsController };
