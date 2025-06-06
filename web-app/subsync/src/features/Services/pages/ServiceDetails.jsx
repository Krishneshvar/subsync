import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

import { Skeleton } from "@/components/ui/skeleton.jsx";

import DisplayService from "../components/DisplayService.jsx";
import { fetchServiceById, clearCurrentService } from "@/features/Services/serviceSlice.js";

function ServiceDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentService, loading, error } = useSelector((state) => state.services);

  useEffect(() => {
    if (id) {
      dispatch(fetchServiceById(id));
    }
    return () => {
        dispatch(clearCurrentService()); // Clear current service data when component unmounts
    };
  }, [id, dispatch]);

  if (loading) return <SkeletonLoader />;
  if (error) return <ErrorMessage message={error} />;

  if (!currentService) return <p>No service data available.</p>;

  return (
    <div className="container mx-auto py-4 px-2 sm:px-2 lg:px-6">
      <DisplayService
        serviceDetails={currentService}
      />
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
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-1/2 mb-4" />
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <p className="text-red-500">Error: {message}</p>
  </div>
);

export default ServiceDetails;
