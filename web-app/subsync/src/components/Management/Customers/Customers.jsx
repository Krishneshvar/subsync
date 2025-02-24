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

  const fetchAllCustomerDetails = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/all-customer-details`);
      const result = await response.json();
      return result.customers;
    } catch (error) {
      console.error("Error fetching all customer details:", error);
      return [];
    }
  };

  const exportToCSV = async () => {
    const allCustomers = await fetchAllCustomerDetails();
    const csvData = allCustomers.map(customer => ({
      CID: customer.customer_id,
      Salutation: customer.salutation,
      Name: customer.first_name,
      "Last Name": customer.last_name,
      "Primary Email": customer.primary_email,
      "Primary Phone Number": customer.primary_phone_number,
      "Company Name": customer.company_name,
      "Display Name": customer.display_name,
      "GST IN": customer.gst_in,
      "Currency Code": customer.currency_code,
      "GST Treatment": customer.gst_treatment,
      "Tax Preference": customer.tax_preference,
      "Exemption Reason": customer.exemption_reason,
      "Customer Status": customer.customer_status,
      "Created At": customer.created_at,
      "Updated At": customer.updated_at,
      "Address Line": customer.customer_address.addressLine,
      City: customer.customer_address.city,
      State: customer.customer_address.state,
      Country: customer.customer_address.country,
      "Zip Code": customer.customer_address.zipCode,
      Notes: customer.notes,
      "Other Contacts": customer.other_contacts.map(contact => 
        `${contact.salutation} ${contact.first_name} ${contact.last_name} (${contact.email}, ${contact.phone_number})`
      ).join("; ")
    }));
  
    const csvContent = [
      Object.keys(csvData[0]).join(","),
      ...csvData.map(row => Object.values(row).join(","))
    ].join("\n");
  
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "customer_details.csv");
  };
  
  const exportToPDF = async () => {
    const allCustomers = await fetchAllCustomerDetails();
    if (allCustomers.length === 0) return;
  
    // Dynamically generate headers from the keys of the first customer object
    const headers = Object.keys(allCustomers[0]).map(key => ({
      key,
      label: key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
    }));
  
    const doc = new jsPDF();
    const tableColumn = headers.map(header => header.label);
    const tableRows = [];
  
    allCustomers.forEach(customer => {
      const customerData = [
        customer.customer_id,
        customer.salutation,
        customer.first_name,
        customer.last_name,
        customer.primary_email,
        customer.primary_phone_number,
        customer.company_name,
        customer.display_name,
        customer.gst_in,
        customer.currency_code,
        customer.gst_treatment,
        customer.tax_preference,
        customer.exemption_reason,
        customer.customer_status,
        customer.created_at,
        customer.updated_at,
        customer.customer_address.addressLine,
        customer.customer_address.city,
        customer.customer_address.state,
        customer.customer_address.country,
        customer.customer_address.zipCode,
        customer.notes,
        customer.other_contacts.map(contact => 
          `${contact.salutation} ${contact.first_name} ${contact.last_name} (${contact.email}, ${contact.phone_number})`
        ).join("; ")
      ];
      tableRows.push(customerData);
    });
  
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 },
      theme: 'striped',
      headStyles: { fillColor: [22, 160, 133] },
      margin: { top: 20 },
    });
  
    doc.save("customer_details.pdf");
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