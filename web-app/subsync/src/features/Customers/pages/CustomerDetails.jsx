import { useParams } from "react-router-dom";

import DisplayCustomer from "../components/DisplayCustomer.jsx";

import { Skeleton } from "@/components/ui/skeleton.jsx";

import { useGetCustomerByIdQuery } from "@/features/Customers/customerApi.js";

function CustomerDetails() {
  const { id } = useParams();

  const {
    data: currentCustomer,
    isLoading: loading,
    isError,
    error: fetchError,
  } = useGetCustomerByIdQuery(id);

  if (loading) return <SkeletonLoader />;

  if (isError) {
    const errorMessage = fetchError?.data?.message || fetchError?.message || 'An unknown error occurred while fetching customer details.';
    return <ErrorMessage message={errorMessage} />;
  }

  if (!currentCustomer) return <p className="container mx-auto py-4 px-2 sm:px-2 lg:px-6">No customer data available.</p>;

  return (
    <div className="container mx-auto py-4 px-2 sm:px-2 lg:px-6">
      <DisplayCustomer
        customerDetails={{
          ...currentCustomer,
          phone_with_country_code: currentCustomer.primaryPhoneNumber,
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

export default CustomerDetails;
