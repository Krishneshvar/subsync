import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import Table from 'react-bootstrap/Table';
import { Button } from "react-bootstrap";
import Subscriptions from "./Subscriptions";
import SubscriptionExpenses from "./SubscriptionExpenses";

export default function DisplayCustomer({ customerDetails, subscriptions, chartData }) {
  const navigate = useNavigate();

   console.log(customerDetails);


  const renderDetails = (label, value) => (
    <div className="mb-4">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-lg">{value}</p>
    </div>
  );

  const renderObjectDetails = (label, object) => {
    if (typeof object !== "object" || object === null) {
      return <p>{object ?? "N/A"}</p>;
    }

    return (
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        {Object.entries(object).map(([key, value]) => (
          <div key={key} className="pl-4 border-l-2 border-gray-300">
            <p className="text-sm font-medium text-gray-500">{key}</p>
            {typeof value === "object" && value !== null ? (
              renderObjectDetails(value)
            ) : (
              <p className="text-lg">{value ?? "N/A"}</p>
            )}
          </div>
        ))}
      </div>
    );
  };

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
                <h3 className="text-lg font-bold pb-2"><u> Customer </u></h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                  {renderDetails("Customer ID", customerDetails.customer_id)}
                  {renderDetails("Salutation", customerDetails.salutation)}
                  {renderDetails("First Name", customerDetails.first_name)}
                  {renderDetails("Last Name", customerDetails.last_name)}
                  {renderDetails("Email", customerDetails.primary_email)}
                  {renderDetails("Phone Number", customerDetails.primary_phone_number)}
                </div>
                <div>
                  <h3 className="text-lg font-bold pb-2"><u> Address </u></h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                    {renderDetails("Street Address", customerDetails.customer_address.city)}
                    {renderDetails("City", customerDetails.customer_address.city)}
                    {renderDetails("State", customerDetails.customer_address.state)}
                    {renderDetails("Pin Code", customerDetails.customer_address.pin_code)}
                    {renderDetails("Country", customerDetails.customer_address.country)}
                  </div>
                </div>
                <div className="p-2">
                  <h3 className="text-lg font-bold pb-2"><u> Other Contacts </u></h3>
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
                    {customerDetails.other_contacts &&
                      customerDetails.other_contacts.map((contact, index) => (                        
                            <tr>
                              <td>{renderDetails("", contact.salutation)}</td>
                              <td>{renderDetails("", contact.name)}</td>
                              <td>{renderDetails("", contact.email)}</td>
                              <td>{renderDetails("", contact.phone_number)}</td>
                            </tr>
                    ))}
                    </tbody>
                  </Table>
                </div>

                <div>
                  <h3 className="text-lg font-bold pb-2"><u> Notes </u></h3>
                  {renderDetails("", customerDetails.notes)}
                </div>

                <div className="pt-4">
                  <h3 className="text-lg font-bold pb-2"><u> Company </u></h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                    {renderDetails("Company Name", customerDetails.company_name)}
                    {renderDetails("Display Name", customerDetails.display_name)}
                    {renderDetails("GSTIN", customerDetails.gst_in)}
                    {renderDetails("Currency Code", customerDetails.currency_code)}
                    {renderDetails("GST Treatment", customerDetails.gst_treatment)}
                    {renderDetails("Tax Preference", customerDetails.tax_preference)}
                    {(customerDetails.tax_preference == "Taxable") ? (
                      null
                    ) : (renderDetails("Exemption Reason", customerDetails.exemption_reason))}
                  </div>
                  <div className="w-full flex flex-row justify-between pt-4">
                    <div className="flex gap-4">
                      {renderDetails("Created At", customerDetails.created_at)}
                      {renderDetails("Updated At", customerDetails.updated_at)}
                    </div>
                  </div>
                  {/* Edit Button reroutes to add customer for edit */}
                  <Link
                   to={`/john_doe/dashboard/customers/${customerDetails.customer_id}/edit`}
                   state={{editableCustomerId: customerDetails.customer_id}}
                   className="w-full md:w-auto"
                   >
                   <Button className="w-full md:w-auto bg-blue-500 text-white">
                    Edit Customer
                   </Button>
                 </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </AccordionContent>
      </AccordionItem>

      <Subscriptions subscriptions={subscriptions} />
      <SubscriptionExpenses chartData={chartData} />
    </Accordion>
  );
}
