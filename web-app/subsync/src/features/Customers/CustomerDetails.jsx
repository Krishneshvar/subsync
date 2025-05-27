import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DisplayCustomer from "./DisplayCustomer.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";

export default function CustomerDetails() {
  const { id } = useParams();
  const [customerDetails, setCustomerDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCustomerDetails(id) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/customer/${id}`);
        if (!response.ok) throw new Error("Failed to fetch customer details");

        const data = await response.json();
        setCustomerDetails(data.customer);
        console.log("data.customer details:", data.customer);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchCustomerDetails(id);
  }, [id]);

  if (loading) return <SkeletonLoader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="container mx-auto py-4 px-2 sm:px-2 lg:px-6">
      <DisplayCustomer
        customerDetails={{
          ...customerDetails,
          phone_with_country_code: `${customerDetails.country_code}${customerDetails.primary_phone_number}`,
        }}
      />
    </div>
  );
}

const SkeletonLoader = () => (
  <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <Skeleton className="h-12 w-3/4 mb-4" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-full mb-2" />
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <p className="text-red-500">Error: {message}</p>
  </div>
);
