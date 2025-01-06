import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import Table from "react-bootstrap/Table";
import { Button, FormControl } from "react-bootstrap";

export default function DisplayCustomer({ customerDetails, subscriptions, chartData }) {
  const navigate = useNavigate();

  // Local state for editing fields
  const [editableDetails, setEditableDetails] = useState(customerDetails);
  const [otherContacts, setOtherContacts] = useState(customerDetails.other_contacts || []);

  // Handle field changes
  const handleFieldChange = (field, value) => {
    setEditableDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field, value) => {
    setEditableDetails((prev) => ({
      ...prev,
      customer_address: { ...prev.customer_address, [field]: value },
    }));
  };

  const handleContactChange = (index, field, value) => {
    setOtherContacts((prev) =>
      prev.map((contact, i) =>
        i === index ? { ...contact, [field]: value } : contact
      )
    );
  };

  const handleCompanyFieldChange = (field, value) => {
    setEditableDetails((prev) => ({ ...prev, [field]: value }));
  };

  const saveChanges = () => {
    const updatedTimestamp = new Date().toISOString();
    setEditableDetails((prev) => ({ ...prev, updated_at: updatedTimestamp }));

    console.log("Updated Customer Details:", editableDetails);
    console.log("Updated Other Contacts:", otherContacts);
    // Save changes via an API call or state management solution
  };

  const renderEditableField = (label, field, value, handleChange) => (
    <div className="mb-4">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <FormControl
        type="text"
        value={value || ""}
        onChange={(e) => handleChange(field, e.target.value)}
        className="text-lg"
      />
    </div>
  );

  const renderEditableContactsTable = () => (
    <Table striped bordered size="sm" responsive>
      <thead>
        <tr>
          <th>Salutation</th>
          <th>Name</th>
          <th>Email</th>
          <th>Phone Number</th>
        </tr>
      </thead>
      <tbody>
        {otherContacts.map((contact, index) => (
          <tr key={index}>
            <td>
              <FormControl
                type="text"
                value={contact.salutation || ""}
                onChange={(e) =>
                  handleContactChange(index, "salutation", e.target.value)
                }
              />
            </td>
            <td>
              <FormControl
                type="text"
                value={contact.name || ""}
                onChange={(e) =>
                  handleContactChange(index, "name", e.target.value)
                }
              />
            </td>
            <td>
              <FormControl
                type="email"
                value={contact.email || ""}
                onChange={(e) =>
                  handleContactChange(index, "email", e.target.value)
                }
              />
            </td>
            <td>
              <FormControl
                type="text"
                value={contact.phone_number || ""}
                onChange={(e) =>
                  handleContactChange(index, "phone_number", e.target.value)
                }
              />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
      <AccordionItem value="customer-details">
        <AccordionTrigger className="bg-blue-500 text-white rounded-lg p-4 hover:bg-blue-600 transition-colors">
          <h2 className="text-2xl font-bold">Customer Details</h2>
        </AccordionTrigger>
        <AccordionContent>
          <Card>
            <CardContent className="pt-4">
              <div>
                <h3 className="text-lg font-bold pb-2"><u>Customer</u></h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                  {renderEditableField("Customer ID", "customer_id", editableDetails.customer_id, handleFieldChange)}
                  {renderEditableField("Salutation", "salutation", editableDetails.salutation, handleFieldChange)}
                  {renderEditableField("First Name", "first_name", editableDetails.first_name, handleFieldChange)}
                  {renderEditableField("Last Name", "last_name", editableDetails.last_name, handleFieldChange)}
                  {renderEditableField("Email", "primary_email", editableDetails.primary_email, handleFieldChange)}
                  {renderEditableField("Phone Number", "primary_phone_number", editableDetails.primary_phone_number, handleFieldChange)}
                </div>
                <div>
                  <h3 className="text-lg font-bold pb-2"><u>Address</u></h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                    {renderEditableField("Street Address", "street_address", editableDetails.customer_address.street_address, handleAddressChange)}
                    {renderEditableField("City", "city", editableDetails.customer_address.city, handleAddressChange)}
                    {renderEditableField("State", "state", editableDetails.customer_address.state, handleAddressChange)}
                    {renderEditableField("Pin Code", "pin_code", editableDetails.customer_address.pin_code, handleAddressChange)}
                    {renderEditableField("Country", "country", editableDetails.customer_address.country, handleAddressChange)}
                  </div>
                </div>
                <div className="p-2">
                  <h3 className="text-lg font-bold pb-2"><u>Other Contacts</u></h3>
                  {renderEditableContactsTable()}
                </div>
                <div>
                  <h3 className="text-lg font-bold pb-2"><u>Company</u></h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                    {renderEditableField("Company Name", "company_name", editableDetails.company_name, handleCompanyFieldChange)}
                    {renderEditableField("Display Name", "display_name", editableDetails.display_name, handleCompanyFieldChange)}
                    {renderEditableField("GSTIN", "gst_in", editableDetails.gst_in, handleCompanyFieldChange)}
                    {renderEditableField("Currency Code", "currency_code", editableDetails.currency_code, handleCompanyFieldChange)}
                    {renderEditableField("GST Treatment", "gst_treatment", editableDetails.gst_treatment, handleCompanyFieldChange)}
                    {renderEditableField("Tax Preference", "tax_preference", editableDetails.tax_preference, handleCompanyFieldChange)}
                    {editableDetails.tax_preference !== "Taxable" &&
                      renderEditableField("Exemption Reason", "exemption_reason", editableDetails.exemption_reason, handleCompanyFieldChange)}
                  </div>
                </div>
                <div className="w-full flex flex-row justify-between pt-4">
                  <div className="flex gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Created At</p>
                      <p className="text-lg">{editableDetails.created_at}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Updated At</p>
                      <p className="text-lg">{editableDetails.updated_at}</p>
                    </div>
                  </div>
                  <Button onClick={saveChanges}>Save Changes</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
