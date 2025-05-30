// src/models/serviceModel.js
const db = require("../config/db"); // This should be your MySQL connection or pool instance

// CREATE
async function createService(service) {
  const query = `
    INSERT INTO services (
      service_id, service_name, description, SKU,
      tax_preference, item_group,
      sales_information, purchase_information,
      preferred_vendor, default_tax_rates
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    service.service_id,
    service.service_name,
    service.description || null,
    service.SKU,
    service.tax_preference || 'Taxable',
    service.item_group,
    JSON.stringify(service.sales_information),
    JSON.stringify(service.purchase_information),
    service.preferred_vendor,
    JSON.stringify(service.default_tax_rates),
  ];

  const [result] = await db.execute(query, values);
  return result;
}

// READ - All
async function getAllServices() {
  const [rows] = await db.execute(`SELECT * FROM services ORDER BY created_at DESC`);
  return rows;
}

// READ - One
async function getServiceById(service_id) {
  const [rows] = await db.execute(`SELECT * FROM services WHERE service_id = ?`, [service_id]);
  return rows[0];
}

// UPDATE
async function updateService(service_id, updatedData) {
  const query = `
    UPDATE services SET
      service_name = ?,
      description = ?,
      SKU = ?,
      tax_preference = ?,
      item_group = ?,
      sales_information = ?,
      purchase_information = ?,
      preferred_vendor = ?,
      default_tax_rates = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE service_id = ?
  `;

  const values = [
    updatedData.service_name,
    updatedData.description || null,
    updatedData.SKU,
    updatedData.tax_preference,
    updatedData.item_group,
    JSON.stringify(updatedData.sales_information),
    JSON.stringify(updatedData.purchase_information),
    updatedData.preferred_vendor,
    JSON.stringify(updatedData.default_tax_rates),
    service_id,
  ];

  const [result] = await db.execute(query, values);
  return result;
}

// DELETE
async function deleteService(service_id) {
  const [result] = await db.execute(`DELETE FROM services WHERE service_id = ?`, [service_id]);
  return result;
}

export default { createService, getAllServices, getServiceById, updateService, deleteService };
