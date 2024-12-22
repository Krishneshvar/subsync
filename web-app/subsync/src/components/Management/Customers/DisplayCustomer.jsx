import React from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import Subscriptions from "./Subscriptions";
import SubscriptionExpenses from "./SubscriptionExpenses";

export default function DisplayCustomer({ customerDetails, subscriptions, chartData }) {
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
                <h3 className="text-lg font-bold pb-2">Customer</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                  {renderDetails("Customer ID", customerDetails.customer_id)}
                  {renderDetails("Salutation", customerDetails.salutation)}
                  {renderDetails("First Name", customerDetails.first_name)}
                  {renderDetails("Last Name", customerDetails.last_name)}
                  {renderDetails("Email", customerDetails.primary_email)}
                  {renderDetails("Phone Number", customerDetails.primary_phone_number)}
                </div>
                <div>
                  <h3 className="text-lg font-bold pb-2">Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                    {renderDetails("Street Address", customerDetails.customer_address.street_address)}
                    {renderDetails("City", customerDetails.customer_address.city)}
                    {renderDetails("State", customerDetails.customer_address.state)}
                    {renderDetails("Pin Code", customerDetails.customer_address.pin_code)}
                    {renderDetails("Country", customerDetails.customer_address.country)}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold pb-2">Other Contacts</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                    {renderDetails("Salutation", customerDetails.other_contacts[0].salutation)}
                    {renderDetails("Name", customerDetails.other_contacts[0].name)}
                    {renderDetails("Email", customerDetails.other_contacts[0].email)}
                    {renderDetails("Phone Number", customerDetails.other_contacts[0].phone_number)}
                  </div>
                </div>
                {renderObjectDetails("Other Contacts", customerDetails.other_contacts)}
                {/* {renderDetails("Notes", customerDetails.notes)} */}
              </div>
                {/* <h3 className="">Company</h3>
                {renderDetails("Company Name", customerDetails.company_name)}
                {renderDetails("Display Name", customerDetails.display_name)}
                {renderDetails("GSTIN", customerDetails.gst_in)}
                {renderDetails("Currency Code", customerDetails.currency_code)}
                {renderDetails("Place of Supply", customerDetails.place_of_supply)}
                {renderDetails("GST Treatment", customerDetails.gst_treatment)}
                {renderDetails("Tax Preference", customerDetails.tax_preference)}
                {renderDetails("Exemption Reason", customerDetails.exemption_reason)}
                {renderObjectDetails("Custom Fields", customerDetails.custom_fields)}
                {renderDetails("Created At", customerDetails.created_at)}
                {renderDetails("Updated At", customerDetails.updated_at)} */}
            </CardContent>
          </Card>
        </AccordionContent>
      </AccordionItem>

      <Subscriptions subscriptions={subscriptions} />
      <SubscriptionExpenses chartData={chartData} />
    </Accordion>
  );
}
