// serviceController.js
import { createService, getAllServices, getServiceById, updateService, deleteService } from '../models/serviceModel.js';
// generateID is not needed here as service_id is AUTO_INCREMENT

// CREATE Service
const createServiceController = async (req, res) => {
  try {
    console.log(req.body);
    const serviceData = {
      ...req.body,
      // The database schema indicates service_id is AUTO_INCREMENT,
      // so we should not provide it here.
      // Adjust field names to match model and DB:
      SKU: req.body.SKU, // Maps to stock_keepers_unit in DB
      sales_information: req.body.sales_information, // Maps to sales_info in DB
      purchase_information: req.body.purchase_information, // Maps to purchase_info in DB
      preferred_vendor: req.body.purchase_information.vendor, // Assuming this is the vendor ID
    };

    // Validate required fields (using adjusted field names)
    if (!serviceData.service_name || !serviceData.SKU || !serviceData.item_group ||
        !serviceData.sales_information || !serviceData.purchase_information || !serviceData.preferred_vendor ||
        !serviceData.default_tax_rates) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const result = await createService(serviceData);
    // The newly created ID is in result.insertId
    return res.status(201).json({ message: "Service created successfully", service_id: result.insertId });
  } catch (error) {
    console.error("Error creating service:", error);
    // Handle specific database errors if needed (e.g., UNIQUE constraint on service_name)
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: "A service with this name already exists." });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// READ All Services
const getAllServicesController = async (req, res) => {
  try {
    const services = await getAllServices();
    return res.status(200).json({ services });
  } catch (error) {
    console.error("Error fetching services:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// READ Service by ID
const getServiceByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await getServiceById(id);

    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    return res.status(200).json({ service });
  } catch (error) {
    console.error("Error fetching service:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// UPDATE Service
const updateServiceController = async (req, res) => {
  try {
    const { id } = req.params; // service_id
    const existing = await getServiceById(id);

    if (!existing) {
      return res.status(404).json({ error: "Service not found" });
    }

    const updatedData = {
      ...req.body,
      // Adjust field names to match model and DB:
      SKU: req.body.SKU, // Maps to stock_keepers_unit in DB
      sales_information: req.body.sales_information, // Maps to sales_info in DB
      purchase_information: req.body.purchase_information, // Maps to purchase_info in DB
      preferred_vendor: req.body.purchase_information.vendor, // Assuming this is the vendor ID
    };

    // Basic validation for update - ensure required fields are present if they are being updated
    if (!updatedData.service_name || !updatedData.SKU || !updatedData.item_group ||
        !updatedData.sales_information || !updatedData.purchase_information || !updatedData.preferred_vendor ||
        !updatedData.default_tax_rates) {
      return res.status(400).json({ error: "Missing required fields for update." });
    }

    const result = await updateService(id, updatedData);

    if (result.affectedRows === 0) {
      return res.status(200).json({ message: "Service found, but no changes applied (data might be the same)." });
    }

    return res.status(200).json({ message: "Service updated successfully" });
  } catch (error) {
    console.error("Error updating service:", error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: "A service with this name already exists." });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// DELETE Service
const deleteServiceController = async (req, res) => {
  try {
    const { id } = req.params; // service_id
    const existing = await getServiceById(id);

    if (!existing) {
      return res.status(404).json({ error: "Service not found" });
    }

    const result = await deleteService(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Service not found or already deleted." });
    }

    return res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("Error deleting service:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export {
  createServiceController,
  getAllServicesController,
  getServiceByIdController,
  updateServiceController,
  deleteServiceController
};
