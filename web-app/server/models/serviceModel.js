// src/models/serviceModel.js
import appDB from "../db/subsyncDB.js";

// CREATE
const createService = async (service) => {
  const query = `
    INSERT INTO services (
      service_name, stock_keepers_unit,
      tax_preference, item_group,
      sales_info, purchase_info,
      preferred_vendor, default_tax_rates
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    service.service_name,
    service.SKU,
    service.tax_preference || 'Taxable',
    parseInt(service.item_group, 10), // Ensure item_group is stored as an integer ID
    JSON.stringify(service.sales_information),
    JSON.stringify(service.purchase_information),
    parseInt(service.preferred_vendor, 10), // Ensure preferred_vendor is stored as an integer ID
    JSON.stringify(service.default_tax_rates),
  ];

  const [result] = await appDB.execute(query, values);
  return result; // result.insertId will contain the newly generated service_id
}

// READ - All (MODIFIED TO JOIN TABLES FOR DISPLAY NAMES)
const getAllServices = async () => {
  const query = `
    SELECT
        s.service_id,
        s.service_name,
        s.stock_keepers_unit,
        s.tax_preference,
        s.item_group AS item_group_id, -- Keep ID for internal use
        ig.item_group_name, -- Join to get the name
        s.sales_info,
        s.purchase_info,
        s.preferred_vendor AS preferred_vendor_id, -- Keep ID for internal use
        v.vendor_name AS preferred_vendor_name, -- Join to get the name
        s.default_tax_rates,
        s.created_at,
        s.updated_at
    FROM
        services s
    LEFT JOIN
        item_groups ig ON s.item_group = ig.item_group_id
    LEFT JOIN
        vendors v ON s.preferred_vendor = v.vendor_id
    ORDER BY s.created_at DESC;
  `;
  const [rows] = await appDB.execute(query);
  return rows;
}

// READ - One
const getServiceById = async (service_id) => {
  const query = `
    SELECT
        s.service_id,
        s.service_name,
        s.stock_keepers_unit,
        s.tax_preference,
        s.item_group AS item_group_id,
        ig.item_group_name,
        s.sales_info,
        s.purchase_info,
        s.preferred_vendor AS preferred_vendor_id,
        v.vendor_name AS preferred_vendor_name,
        s.default_tax_rates,
        s.created_at,
        s.updated_at
    FROM
        services s
    LEFT JOIN
        item_groups ig ON s.item_group = ig.item_group_id
    LEFT JOIN
        vendors v ON s.preferred_vendor = v.vendor_id
    WHERE s.service_id = ?`;
  const [rows] = await appDB.execute(query, [service_id]);
  return rows[0];
}

// UPDATE
const updateService = async (service_id, updatedData) => {
  const query = `
    UPDATE services SET
                      service_name = ?,
                      stock_keepers_unit = ?,
                      tax_preference = ?,
                      item_group = ?,
                      sales_info = ?,
                      purchase_info = ?,
                      preferred_vendor = ?,
                      default_tax_rates = ?,
                      updated_at = CURRENT_TIMESTAMP
    WHERE service_id = ?
  `;

  const values = [
    updatedData.service_name,
    updatedData.SKU,
    updatedData.tax_preference,
    parseInt(updatedData.item_group, 10), // Convert to integer
    JSON.stringify(updatedData.sales_information),
    JSON.stringify(updatedData.purchase_information),
    parseInt(updatedData.preferred_vendor, 10), // Convert to integer
    JSON.stringify(updatedData.default_tax_rates),
    service_id,
  ];

  const [result] = await appDB.execute(query, values);
  return result;
}

// DELETE
const deleteService = async (service_id) => {
  const [result] = await appDB.execute(`DELETE FROM services WHERE service_id = ?`, [service_id]);
  return result;
}

export { createService, getAllServices, getServiceById, updateService, deleteService };
