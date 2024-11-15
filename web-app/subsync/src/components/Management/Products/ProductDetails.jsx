import React from "react";
import { useParams } from "react-router-dom";

export default function ProductDetails() {
  const { id } = useParams();

  // Fetch customer details using the `id` or display relevant details
  return (
    <div>
      <h1>Product Details</h1>
      <p>Product ID: {id}</p>
      {/* Add more details or edit functionality here */}
    </div>
  );
}
