import React from "react";
import { useParams } from "react-router-dom";

export default function SubscriptionDetails() {
  const { id } = useParams();

  // Fetch customer details using the `id` or display relevant details
  return (
    <div>
      <h1>Subscription Details</h1>
      <p>Subscription ID: {id}</p>
      {/* Add more details or edit functionality here */}
    </div>
  );
}
