import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Dropdown } from "react-bootstrap";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "react-bootstrap";
import { Eye } from "lucide-react";
import GenericTable from "../../Common/GenericTable";
import Pagination from "../../Common/Pagination";
import useFetchData from "../../Common/useFetchData";
import SearchFilterForm from "../../Common/SearchFilterForm";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const headers = [
  { key: "customer_id", label: "CID" },
  { key: "salutation", label: "Salutation" },
  { key: "first_name", label: "Name" },
  { key: "display_name", label: "Display Name" },
  { key: "company_name", label: "Company Name" },
  { key: "phone_with_country_code", label: "Phone Number" },
  { key: "primary_email", label: "Email" },
  { key: "customer_status", label: "Status" },
  { key: "actions", label: "View/Edit" },
];

export default function Customers() {
  const [sortBy, setSortBy] = useState("customer_id");
  const [order, setOrder] = useState("asc");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { username } = useParams();

  const { data = [], error, loading, totalPages = 0 } = useFetchData(
    `${import.meta.env.VITE_API_URL}/all-customers`,
    {
      sort: "customer_id",
      order: "asc",
      currentPage,
    }
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setSearch(e.target.value);
      setCurrentPage(1);
    }
  };

  const renderActions = (customerId) => (
    <div className="flex align-center">
      <Link to={`${customerId}`}>
        <Button className="bg-transparent text-gray-500 shadow-none">
          <Eye />
        </Button>
      </Link>
    </div>
  );

  const filteredData = data.filter((customer) => {
    const searchTerm = search.toLowerCase();
    return (
      customer.customer_id.toString().includes(searchTerm) ||
      customer.salutation.toLowerCase().includes(searchTerm) ||
      customer.first_name.toLowerCase().includes(searchTerm) ||
      customer.display_name.toLowerCase().includes(searchTerm) ||
      customer.company_name.toLowerCase().includes(searchTerm) ||
      customer.primary_phone_number.toString().toLowerCase().includes(searchTerm) ||
      customer.primary_email.toLowerCase().includes(searchTerm) ||
      customer.customer_status.toLowerCase().includes(searchTerm)
    );
  });

  const modifiedData = (filteredData || []).map((customer) => ({
    ...customer,
    phone_with_country_code: `${customer.country_code || ""}${customer.primary_phone_number}`,
    actions: renderActions(customer.customer_id),
  }));

  return (
    <div className="container shadow-lg rounded-lg mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 w-full">
        <div className="flex flex-col sm:flex-row w-full items-center gap-3">
          <SearchFilterForm
            search={search}
            setSearch={setSearch}
            handleSearch={handleSearch}
            sortBy={sortBy}
            setSortBy={setSortBy}
            order={order}
            setOrder={setOrder}
            headers={headers.map(({ key, label }) => ({ key, label }))}
          />
        </div>

        {/* Export and Add Customer Button (Stacked on Small Screens) */}
        <div className="flex flex-col md:flex-row gap-2 w-full sm:w-auto">
          <Dropdown className="w-full sm:w-auto">
            <Dropdown.Toggle className="bg-blue-500 text-white p-2 w-full sm:w-auto">
              Export
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => console.log("Export CSV")}>Export as CSV</Dropdown.Item>
              <Dropdown.Item onClick={() => console.log("Export PDF")}>Export as PDF</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Link to={`add`}>
            <Button className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 whitespace-nowrap w-full sm:w-auto">
              Add Customer
            </Button>
          </Link>
        </div>
      </div>

      {/* Alerts for Errors */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Table and Pagination */}
      {loading ? (
        <div className="flex justify-center items-center my-8">
          <Spinner animation="border" role="status" variant="primary">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      ) : modifiedData.length > 0 ? (
        <>
          <GenericTable headers={headers} data={modifiedData} primaryKey="customer_id" />
          <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
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
