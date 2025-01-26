import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import Table from "react-bootstrap/Table";
import { Button } from "react-bootstrap";
import Subscriptions from "./Subscriptions";
import SubscriptionExpenses from "./SubscriptionExpenses";

export default function DisplayCustomer({ customerDetails, subscriptions, chartData }) {
  const navigate = useNavigate();

  const renderDetails = (label, value, styles=null) => (
    <div className="mb-4">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className={`text-lg ${styles}`}>
        {typeof value === "object" && value !== null ? value.label || "N/A" : value ?? "N/A"}
      </p>
    </div>
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
              {/* Customer Details */}
              <h3 className="text-lg font-bold pb-2">
                <u>Customer</u>
              </h3>
              { customerDetails.customer_status === "Active" && 
                renderDetails("Customer Status", customerDetails.customer_status, "bg-green-500 text-white py-1 px-2 rounded-lg w-max")}
              { customerDetails.customer_status === "Inactive" && 
                renderDetails("Customer Status", customerDetails.customer_status, "bg-red-500 text-white py-1 px-2 rounded-lg w-max")}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                {renderDetails("Customer ID", customerDetails.customer_id)}
                {renderDetails("Salutation", customerDetails.salutation)}
                {renderDetails("First Name", customerDetails.first_name)}
                {renderDetails("Last Name", customerDetails.last_name)}
                {renderDetails("Email", customerDetails.primary_email)}
                {renderDetails("Phone Number", customerDetails.primary_phone_number)}
              </div>

              {/* Address */}
              <h3 className="text-lg font-bold pb-2">
                <u>Address</u>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                {renderDetails("Street Address", customerDetails.customer_address.addressLine)}
                {renderDetails("City", customerDetails.customer_address.city)}
                {renderDetails("State", customerDetails.customer_address.state)}
                {renderDetails("Pin Code", customerDetails.customer_address.zipCode)}
                {renderDetails("Country", customerDetails.customer_address.country)}
              </div>

              {/* Other Contacts */}
              <h3 className="text-lg font-bold pb-2">
                <u>Other Contacts</u>
              </h3>
              <Table striped bordered size="sm" responsive>
                <thead>
                  <tr>
                    <th>Salutation</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                  </tr>
                </thead>
                <tbody>
                  {customerDetails.other_contacts?.map((contact, index) => (
                    <tr key={index}>
                      <td>{contact.salutation ?? "N/A"}</td>
                      <td>{contact.first_name ?? "N/A"}</td>
                      <td>{contact.last_name ?? "N/A"}</td>
                      <td>{contact.email ?? "N/A"}</td>
                      <td>{contact.phone_number ?? "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Notes */}
              <h3 className="text-lg font-bold pb-2">
                <u>Notes</u>
              </h3>
              {renderDetails("", customerDetails.notes)}

              {/* Company Details */}
              <h3 className="text-lg font-bold pb-2">
                <u>Company</u>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                {renderDetails("Company Name", customerDetails.company_name)}
                {renderDetails("Display Name", customerDetails.display_name)}
                {renderDetails("GSTIN", customerDetails.gst_in)}
                {renderDetails("Currency Code", customerDetails.currency_code)}
                {renderDetails("GST Treatment", customerDetails.gst_treatment)}
                {renderDetails("Tax Preference", customerDetails.tax_preference)}
                {customerDetails.tax_preference !== "Taxable" &&
                  renderDetails("Exemption Reason", customerDetails.exemption_reason)}
              </div>

              {/* Timestamps */}
              <div className="flex gap-4 pt-4">
                {renderDetails("Created At", customerDetails.created_at)}
                {renderDetails("Updated At", customerDetails.updated_at)}
              </div>

              {/* Edit Button */}
              <Link
                to={'edit'}
                state={{ editableCustomerId: customerDetails.customer_id }}
                className="w-full md:w-auto"
              >
                <Button className="w-full md:w-auto bg-blue-500 text-white">Edit Customer</Button>
              </Link>
            </CardContent>
          </Card>
        </AccordionContent>
      </AccordionItem>

      <Subscriptions subscriptions={subscriptions} />
      <SubscriptionExpenses chartData={chartData} />
    </Accordion>
  );
}
