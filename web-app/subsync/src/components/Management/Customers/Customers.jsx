import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Dropdown } from "react-bootstrap";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "react-bootstrap";
import { Eye } from 'lucide-react';
import { FaSearch } from 'react-icons/fa'; // Import the search icon
import GenericTable from "../../Common/GenericTable";
import Pagination from "../../Common/Pagination";
import useFetchData from "../../Common/useFetchData";
import { saveAs } from 'file-saver';
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const headers = [
  { key: "customer_id", label: "CID" },
  { key: "salutation", label: "Salutation" },
  { key: "first_name", label: "Name" },
  { key: "display_name", label: "Display Name" },
  { key: "company_name", label: "Company Name" },
  { key: "primary_phone_number", label: "Phone Number" },
  { key: "primary_email", label: "Email" },
  { key: "customer_status", label: "Status" },
  { key: "actions", label: "View/Edit" },
];

export default function Customers() {
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

  const exportToCSV = () => {
    const csvData = data.map(customer => ({
      CID: customer.customer_id,
      Salutation: customer.salutation,
      Name: customer.first_name,
      "Display Name": customer.display_name,
      "Company Name": customer.company_name,
      "Phone Number": customer.primary_phone_number,
      Email: customer.primary_email,
      Status: customer.customer_status,
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(","),
      ...csvData.map(row => Object.values(row).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "customers.csv");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [headers.map(header => header.label)],
      body: data.map(customer => [
        customer.customer_id,
        customer.salutation,
        customer.first_name,
        customer.display_name,
        customer.company_name,
        customer.primary_phone_number,
        customer.primary_email,
        customer.customer_status,
      ]),
    });
    doc.save("customers.pdf");
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

  // Filter data based on search term
  const filteredData = data.filter(customer => {
    const searchTerm = search.toLowerCase();
    return (
      customer.customer_id.toString().includes(searchTerm) ||
      customer.salutation.toLowerCase().includes(searchTerm) ||
      customer.first_name.toLowerCase().includes(searchTerm) ||
      customer.display_name.toLowerCase().includes(searchTerm) ||
      customer.company_name.toLowerCase().includes(searchTerm) ||
      customer.primary_phone_number.toString().toLowerCase().includes(searchTerm) || // Convert to string
      customer.primary_email.toLowerCase().includes(searchTerm) ||
      customer.customer_status.toLowerCase().includes(searchTerm)
    );
  });

  // Map through data to add action buttons to each customer
  const modifiedData = (filteredData || []).map((customer) => ({
    ...customer,
    actions: renderActions(customer.customer_id),
  }));

  return (
    <div className="container shadow-lg rounded-lg mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="w-full md:w-auto relative">
          {/* <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /> */}
          <input
            type="text"
            className="form-control p-2 pl-12 rounded-md border border-gray-300"
            placeholder="🔍| Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
        <div className="flex gap-2">
          <Dropdown>
            <Dropdown.Toggle className="bg-blue-500 text-white">
              Export
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={exportToCSV}>Export as CSV</Dropdown.Item>
              <Dropdown.Item onClick={exportToPDF}>Export as PDF</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <Link to={`add`} className="w-full md:w-auto">
          <Button className="w-full md:w-auto bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
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