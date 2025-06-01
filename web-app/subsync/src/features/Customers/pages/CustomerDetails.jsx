import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

import DisplayCustomer from "../components/DisplayCustomer.jsx";

import { Skeleton } from "@/components/ui/skeleton.jsx";

import { fetchCustomerById, clearCustomerState } from "@/features/Customers/customerSlice.js";

function CustomerDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentCustomer, loading, error } = useSelector((state) => state.customers);

  useEffect(() => {
    if (id) {
      dispatch(fetchCustomerById(id));
    }
    return () => {
        dispatch(clearCustomerState());
    };
  }, [id, dispatch]);

  if (loading) return <SkeletonLoader />;
  if (error) return <ErrorMessage message={error} />;

  if (!currentCustomer) return <p>No customer data available.</p>;

  return (
    <div className="container mx-auto py-4 px-2 sm:px-2 lg:px-6">
      <DisplayCustomer
        customerDetails={{
          ...currentCustomer,
          phone_with_country_code: `${currentCustomer.country_code}${currentCustomer.primary_phone_number}`,
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
