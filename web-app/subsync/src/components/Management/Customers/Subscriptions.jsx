import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export default function Subscriptions({ subscriptions }) {
  const renderSubscription = (subscription) => (
    <Card key={subscription.sub_id} className="bg-gray-50">
      <CardContent className="p-4">
        {[
          { label: "Subscription ID", value: subscription.sub_id },
          { label: "Product ID", value: subscription.service_id },
          { label: "Price", value: subscription.amount },
          { label: "Start Date", value: new Date(subscription.start_date).toLocaleString() },
          { label: "End Date", value: new Date(subscription.end_date).toLocaleString() },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="text-lg mb-2">{value}</p>
          </div>
        ))}
        <p className="text-sm font-medium text-gray-500">Status</p>
        <Badge
          variant={subscription.status === "active" ? "success" : "secondary"}
          className={
            subscription.status === "active"
              ? "bg-success text-white py-1 px-2"
              : subscription.status === "reminded"
              ? "bg-warning text-white py-1 px-2"
              : subscription.status === "warned"
              ? "bg-danger text-white py-1 px-2"
              : "bg-secondary text-white py-1 px-2"
          }
        >
          {subscription.status}
        </Badge>
      </CardContent>
    </Card>
  );

  return (
    <AccordionItem value="subscriptions">
      <AccordionTrigger className="bg-gradient-to-r from-blue-500 to-cyan-500 text-primary-foreground rounded-lg p-4">
        <h2 className="text-xl font-bold">Subscriptions</h2>
      </AccordionTrigger>
      <AccordionContent>
        <Card>
          <CardContent className="pt-4">
            {subscriptions.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {subscriptions.map(renderSubscription)}
              </div>
            ) : (
              <p className="text-gray-500">No subscriptions found for this customer.</p>
            )}
          </CardContent>
        </Card>
      </AccordionContent>
    </AccordionItem>
  );
}
