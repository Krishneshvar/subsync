import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ProductDetails() {
  const { id } = useParams();
  const [productDetails, setProductDetails] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProductDetails(id) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/product/${id}`);
        if (!response.ok) throw new Error("Failed to fetch product details");

        const data = await response.json();
        setProductDetails(data.product);
        setSubscriptions(data.subscriptions);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchProductDetails(id);
  }, [id]);

  const renderDetails = (label, value) => (
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-lg">{value || "N/A"}</p>
    </div>
  );

  const renderSubscription = (subscription) => (
    <Card key={subscription.sub_id} className="bg-gray-50">
      <CardContent className="p-4">
        {[
          { label: "Subscription ID", value: subscription.sub_id },
          { label: "Customer ID", value: subscription.customer_id },
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

  if (loading) return <SkeletonLoader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="container mx-auto py-4 px-2 sm:px-2 lg:px-6">
      <Accordion type="single" collapsible className="w-full space-y-4">
        <AccordionItem value="product-details">
          <AccordionTrigger className="bg-gradient-to-r from-blue-500 to-cyan-500 text-primary-foreground rounded-lg p-4">
            <div className="flex justify-between items-center w-full">
              <h2 className="text-2xl font-bold">Product Details</h2>
              <Button
                variant=""
                size="icon"
                className="bg-transparent border-none shadow-none"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Edit product details");
                }}
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit product details</span>
              </Button>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="grid gap-4 md:grid-cols-2 pt-4">
                {productDetails ? (
                  <>
                    {[
                      { label: "Product ID", value: productDetails[0]?.sid },
                      { label: "Product Name", value: productDetails[0]?.sname },
                      { label: "Description", value: productDetails[0]?.description },
                      { label: "Price", value: `₹${productDetails[0]?.price}` }, // Fixed formatting
                      { label: "Validity", value: productDetails[0]?.validity },
                      { label: "Created At", value: productDetails[0]?.created_at ? new Date(productDetails[0].created_at).toLocaleString() : "" },
                      { label: "Updated At", value: productDetails[0]?.updated_at ? new Date(productDetails[0].updated_at).toLocaleString() : "" },
                    ].map(({ label, value }) => renderDetails(label, value))}
                  </>
                ) : (
                  <p className="text-gray-500">Product details not available.</p>
                )}
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

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
                  <p className="text-gray-500">No subscriptions found for this product.</p>
                )}
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

const SkeletonLoader = () => (
  <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <Skeleton className="h-12 w-3/4 mb-4" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-full mb-2" />
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <p className="text-red-500">Error: {message}</p>
  </div>
);
