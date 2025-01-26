import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "react-bootstrap";
import { Eye } from 'lucide-react';
import GenericTable from "../../Common/GenericTable";
import Pagination from "../../Common/Pagination";
import useFetchData from "../../Common/useFetchData";

const headers = [
  { key: "customer_id", label: "CID" },
  { key: "salutation", label: "Salutation" },
  { key: "first_name", label: "Name" },
  { key: "display_name", label: "Display Name" },
  { key: "company_name", label: "Company Name" },
  { key: "primary_phone_number", label: "Phone Number" },
  { key: "primary_email", label: "Email" },
  { key: "customer_status", label: "Status" },
  { key: "actions", label: "View" },
];

export default function Customers() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { username } = useParams();

  const { data = [], error, loading, totalPages = 0 } = useFetchData(
    `${import.meta.env.VITE_API_URL}/all-customers`,
    {
      searchType: "display_name",  // You can adjust this as needed
      search,
      sort: "customer_id",
      order: "asc",
      currentPage,
    }
  );

  // Reset to the first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setSearch(e.target.value);
      setCurrentPage(1); // Reset page when search changes
    }
  };

  // Render actions for each customer
  const renderActions = (customerId) => (
    <div className="flex align-center">
      <Link to={`${customerId}`}>
        <Button className="bg-transparent text-gray-500 shadow-none">
          <Eye />
        </Button>
      </Link>
    </div>
  );

  // Map through data to add action buttons to each customer
  const modifiedData = (data || []).map((customer) => ({
    ...customer,
    actions: renderActions(customer.customer_id),
  }));

  return (
    <div className="container shadow-lg rounded-lg mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="w-full md:w-auto">
          <input
            type="text"
            className="form-control"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
        <Link to={`add`} className="w-full md:w-auto">
          <Button className="w-full md:w-auto bg-blue-500 text-white">
            Add Customer
          </Button>
        </Link>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex justify-center items-center my-8">
          <Spinner animation="border" role="status" variant="primary">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      ) : modifiedData.length > 0 ? (
        <>
          <GenericTable
            headers={headers}
            data={modifiedData}
            primaryKey="customer_id"
          />

          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </>
      ) : (
        <Alert>
          <AlertTitle>Info</AlertTitle>
          <AlertDescription>No customers available</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
