import React, { useState } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Save } from "lucide-react";
import Subscriptions from "./Subscriptions";
import SubscriptionExpenses from "./SubscriptionExpenses";

export default function DisplayCustomer({ customerDetails, subscriptions, chartData }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editableDetails, setEditableDetails] = useState(customerDetails[0] || {});

  const renderDetails = (label, value, isEditable = false) => {
    const displayValue = editableDetails[value];
  
    const safeDisplayValue = () => {
      if (typeof displayValue === "object" && displayValue !== null) {
        return JSON.stringify(displayValue); // Convert objects to strings
      }
      return displayValue || "N/A"; // Default to "N/A" for undefined/null
    };
  
    return (
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        {isEditing && isEditable ? (
          <Input
            type="text"
            value={displayValue || ""}
            onChange={(e) => setEditableDetails({ ...editableDetails, [value]: e.target.value })}
            className="mt-1"
          />
        ) : (
          <p className="text-lg">{safeDisplayValue()}</p>
        )}
      </div>
    );
  };  

  const handleUpdate = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/customer/${editableDetails.cid}`, {
        method: "PUT", // or "PATCH" based on your API
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editableDetails),
      });

      if (!response.ok) {
        throw new Error(`Failed to update customer details: ${response.statusText}`);
      }

      const updatedCustomer = await response.json();
      console.log("Updated customer details:", updatedCustomer);

      // Assuming the API returns the updated details:
      setEditableDetails(updatedCustomer);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating customer details:", error.message);
    }
  };

  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
      <AccordionItem value="customer-details">
        <AccordionTrigger className="bg-blue-500 text-primary-foreground rounded-lg p-4">
          <h2 className="text-2xl font-bold">Customer Details</h2>
        </AccordionTrigger>
        <AccordionContent>
          <Card>
            <CardContent className="grid gap-4 md:grid-cols-2 pt-4">
              {editableDetails ? (
                <>
                  <h2>Customer:</h2>
                  {renderDetails("Customer ID", "customer_id")}
                  {renderDetails("Salutation", "salutation", true)}
                  {renderDetails("First Name", "first_name", true)}
                  {renderDetails("Last Name", "last_name", true)}
                  {renderDetails("Email", "primary_email", true)}
                  {renderDetails("Phone Number", "primary_phone_number", true)}
                  {renderDetails("Address", "customer_address", true)}
                  {renderDetails("Other Contacts", "other_contacts", true)}
                  {renderDetails("Notes", "customer_address", true)}

                  <h2>Company:</h2>
                  {renderDetails("Company Name", "company_name", true)}
                  {renderDetails("Display Name", "display_name", true)}
                  {renderDetails("GSTIN", "gst_in", true)}
                  {renderDetails("Currency Code", "currency_code", true)}
                  {renderDetails("Place of Suply", "place_of_supply", true)}
                  {renderDetails("GST Treatment", "gst_treatment", true)}
                  {renderDetails("Tax Preference", "tax_preference", true)}
                  {renderDetails("Exemption Reason", "exemption_reason", true)}
                  {renderDetails("Custom Fields", "custom_fields", true)}
                  {renderDetails("Created At", "created_at")}
                  {renderDetails("Updated At", "updated_at")}

                  <Button
                    size="lg"
                    className="w-48"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isEditing) {
                        handleUpdate();
                      } else {
                        setIsEditing(true);
                      }
                    }}
                  >
                    {isEditing ? (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        <span>Update</span>
                      </>
                    ) : (
                      <>
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Edit customer details</span>
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <p className="text-gray-500">Customer details not available.</p>
              )}
            </CardContent>
          </Card>
        </AccordionContent>
      </AccordionItem>

      <Subscriptions subscriptions={subscriptions} />
      <SubscriptionExpenses chartData={chartData} />
    </Accordion>
  );
}
