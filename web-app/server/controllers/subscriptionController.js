import { getSubscriptions, addSubscription } from "../models/subscriptionModel.js";

const createSubscription = async (req, res) => {
  try {
    const { customerID, productID } = req.body;
    
    const subscription = {
      customerID,
      productID
    };

    const success = await addSubscription(subscription);
    
    if (success) {
      res.status(201).json({ message: "Subscription added successfully!" });
    } else {
      res.status(400).json({ error: "Failed to add subscription." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message || "An unexpected error occurred." });
  }
};

const getSubscriptionsController = async (req, res) => {
  try {
    const { searchType, search, sort, order, page = 1 } = req.query;
    console.log("Controller received query params:", { searchType, search, sort, order, page });

    const limit = 10;
    const { dataArray, totalCount } = await getSubscriptions(searchType, search, sort, order, page, limit);

    if (dataArray.length === 0) {
        return res.status(404).json({ message: "No subscriptions found." });
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
    res.status(500).json({ message: "Failed to retrieve subscriptions. Please try again later." });
  }
};

export { getSubscriptionsController, createSubscription };
