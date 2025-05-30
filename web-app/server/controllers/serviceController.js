// src/controllers/serviceController.js
const {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
} = require("../models/serviceModel");

const { v4: uuidv4 } = require("uuid");

// CREATE
async function createServiceController(req, res) {
  try {
    const service = {
      service_id: `SERV-${uuidv4().slice(0, 8).toUpperCase()}`,
      ...req.body,
    };

    if (!service.service_name || !service.SKU || !service.item_group || !service.sales_information || !service.purchase_information || !service.preferred_vendor || !service.default_tax_rates) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await createService(service);
    return res.status(201).json({ message: "Service created successfully", service_id: service.service_id });
  } catch (error) {
    console.error("Error creating service:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// READ - All
async function getAllServicesController(req, res) {
  try {
    const services = await getAllServices();
    return res.status(200).json({ services });
  } catch (error) {
    console.error("Error fetching services:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// READ - One
async function getServiceByIdController(req, res) {
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

// UPDATE
async function updateServiceController(req, res) {
  try {
    const { id } = req.params;
    const existing = await getServiceById(id);

    if (!existing) {
      return res.status(404).json({ error: "Service not found" });
    }

    const result = await updateService(id, req.body);
    return res.status(200).json({ message: "Service updated successfully" });
  } catch (error) {
    console.error("Error updating service:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// DELETE
async function deleteServiceController(req, res) {
  try {
    const { id } = req.params;
    const existing = await getServiceById(id);

    if (!existing) {
      return res.status(404).json({ error: "Service not found" });
    }

    const result = await deleteService(id);
    return res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("Error deleting service:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default { createServiceController, getAllServicesController, getServiceByIdController, updateServiceController, deleteServiceController };
