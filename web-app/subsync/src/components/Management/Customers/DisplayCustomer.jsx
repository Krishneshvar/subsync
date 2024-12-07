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

  const renderDetails = (label, value, isEditable = false) => (
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      {isEditing && isEditable ? (
        <Input
          type="text"
          value={editableDetails[value] || ""}
          onChange={(e) => setEditableDetails({ ...editableDetails, [value]: e.target.value })}
          className="mt-1"
        />
      ) : (
        <p className="text-lg">{editableDetails[value] || "N/A"}</p>
      )}
    </div>
  );

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
        <AccordionTrigger className="bg-gradient-to-r from-blue-500 to-cyan-500 text-primary-foreground rounded-lg p-4">
          <h2 className="text-2xl font-bold">Customer Details</h2>
        </AccordionTrigger>
        <AccordionContent>
          <Card>
            <CardContent className="grid gap-4 md:grid-cols-2 pt-4">
              {editableDetails ? (
                <>
                  {renderDetails("Customer ID", "cid")}
                  {renderDetails("Name", "cname", true)}
                  {renderDetails("Email", "email", true)}
                  {renderDetails("Phone Number", "phone", true)}
                  {renderDetails("Address", "address", true)}
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
