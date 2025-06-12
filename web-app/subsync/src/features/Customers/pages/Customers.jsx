import { saveAs } from "file-saver";
import { Eye, FileDown, FileUp, UserPlus } from "lucide-react";
import * as Papa from "papaparse";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useState, useEffect, useRef } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.jsx";
import { Button } from "@/components/ui/button.jsx";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu.jsx";

import api from "@/lib/axiosInstance.js";
import GenericTable from "@/components/layouts/GenericTable.jsx";
import Pagination from "@/components/layouts/Pagination.jsx";
import SearchFilterForm from "@/components/layouts/SearchFilterForm.jsx";

import {
  useGetPaginatedCustomersQuery,
  useImportCustomersMutation,
} from "@/features/Customers/customerApi.js";

import "jspdf-autotable";

const headers = [
  { key: "first_name", label: "Name" },
  { key: "display_name", label: "Display Name" },
  { key: "company_name", label: "Company Name" },
  { key: "primary_phone_number", label: "Phone Number" },
  { key: "primary_email", label: "Email" },
  { key: "customer_status", label: "Status" },
  { key: "actions", label: "View/Edit" },
];

function Customers() {
  const [sortBy, setSortBy] = useState("customer_id");
  const [order, setOrder] = useState("asc");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [importFile, setImportFile] = useState(null);
  const [parsedImportData, setParsedImportData] = useState([]);

  const {
    data: paginatedCustomersData,
    isLoading: fetchLoading,
    isError: fetchError,
    error: fetchErrorObject,
    refetch,
  } = useGetPaginatedCustomersQuery({ search, sort: sortBy, order, page: currentPage });

  const [importCustomers, { isLoading: isImporting }] = useImportCustomersMutation();

  const loading = fetchLoading || isImporting;

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setCurrentPage(1);
    }
  };

  const fetchCustomersAndExport = async () => {
    try {
      const response = await api.get(`/all-customer-details`);
      const data = response.data;

      if (!data.customers || !Array.isArray(data.customers)) {
        throw new Error("Invalid customer data received for export!");
      }
      if (data.customers.length === 0) {
        throw new Error("No customer data available to export!");
      }

      const formattedData = data.customers.map((c) => ({
        "Customer ID": c.customer_id || "",
        "Salutation": c.salutation || "",
        "First Name": c.first_name || "",
        "Last Name": c.last_name || "",
        "Display Name": c.display_name || "",
        "Company Name": c.company_name || "",
        "Phone Number": c.primary_phone_number || "",
        "Secondary Phone Number": c.secondary_phone_number || "",
        "Email": c.primary_email || "",
        "GSTIN": c.gst_in || "",
        "GST Treatment": c.gst_treatment || "",
        "Tax Preference": c.tax_preference || "",
        "Payment Terms": c.payment_terms?.term_name || "",
        "Exemption Reason": c.exemption_reason || "",
        "Currency Code": c.currency_code || "",
        "Address Line": c.customer_address?.addressLine || "",
        "City": c.customer_address?.city || "",
        "State": c.customer_address?.state || "",
        "Country": c.customer_address?.country || "",
        "Zip Code": c.customer_address?.zipCode || "",
        "Notes": c.notes || "",
        "Customer Status": c.customer_status || "Active",
      }));

      const csv = Papa.unparse(formattedData);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, `customers_export_${new Date().toISOString()}.csv`);
      toast.success("CSV file downloaded successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to generate CSV file.");
    }
  };

  const fileInputRef = useRef(null);

  const handleImportButtonClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setImportFile(selectedFile);
      parseCSV(selectedFile);
    }
  };

  const parseCSV = (file) => {
    Papa.parse(file, {
      complete: (result) => {
        const formatted = result.data.map((row) => ({
          customer_id: row["Customer ID"] || "",
          salutation: row["Salutation"] || "",
          first_name: row["First Name"] || "",
          last_name: row["Last Name"] || "",
          primary_email: row["Email"] || "",
          primary_phone_number: row["Phone Number"] || "",
          secondary_phone_number: row["Secondary Phone Number"] || "",
          company_name: row["Company Name"] || "",
          display_name: row["Display Name"] || "",
          gst_in: row["GSTIN"] || "",
          payment_terms: row["Payment Terms"] || "",
          gst_treatment: row["GST Treatment"] || "",
          tax_preference: row["Tax Preference"] || "",
          exemption_reason: row["Exemption Reason"] || "",
          currency_code: row["Currency Code"] || "INR",
          customer_address: {
            addressLine: row["Address Line"] || "",
            city: row["City"] || "",
            state: row["State"] || "",
            country: row["Country"] || "IN",
            zipCode: row["Zip Code"] || "",
          },
          other_contacts: [],
          notes: row["Notes"] || "",
          customer_status: row["Customer Status"] || "Active",
        }));
        setParsedImportData(formatted);
      },
      header: true,
      skipEmptyLines: true,
    });
  };

  const handleImport = async () => {
    if (parsedImportData.length === 0) {
      return toast.error("No data to import!");
    }
    try {
      await importCustomers({ customers: parsedImportData }).unwrap();
      toast.success("Customers Imported Successfully!");
      setParsedImportData([]);
      setImportFile(null);
      refetch();
    } catch (err) {
      console.error("Import error:", err);
      const errorMessage = err?.data?.message || err?.message || "Error importing customers.";
      toast.error(errorMessage);
    }
  };

  const renderActions = (id) => (
    <div className="flex items-center">
      <Link to={`${id}`}>
        <Button variant="ghost" size="icon" title="View/Edit Customer">
          <Eye className="w-4 h-4" />
        </Button>
      </Link>
    </div>
  );

  const modifiedData = paginatedCustomersData?.customers?.map((c) => ({
    ...c,
    primary_phone_number: c.primaryPhoneNumber,
    customer_id: c.customerId,
    first_name: c.firstName,
    display_name: c.displayName,
    company_name: c.companyName,
    primary_email: c.primaryEmail,
    customer_status: c.customerStatus,
    actions: renderActions(c.customerId),
  })) || [];

  const totalPages = paginatedCustomersData?.totalPages || 0;

  return (
    <div className="container p-6 rounded-lg shadow-lg">
      <h1 className="w-full text-3xl font-bold mb-2">Customers</h1>
      <hr className="mb-4 border-blue-500 border-3 size-auto" />
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

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Link to={`add`}>
            <Button className="w-full sm:w-auto">
              <UserPlus className="mr-2 h-4 w-4" /> Add
            </Button>
          </Link>

          <Button className="sm:w-auto" onClick={handleImportButtonClick} disabled={isImporting}>
            <FileDown className="mr-2 h-4 w-4" /> Import {isImporting ? "(..." : ""}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-full sm:w-auto">
                <FileUp className="mr-2 h-4 w-4" /> Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={fetchCustomersAndExport}>Export as CSV</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileChange} style={{ display: "none" }} />
        </div>
      </div>

      {fetchError && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{fetchErrorObject?.data?.message || fetchErrorObject?.message || 'Failed to load customers.'}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex justify-center items-center my-8">
          <span className="animate-spin w-6 h-6 border-4 border-t-transparent border-blue-500 rounded-full"></span>
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

export default Customers;
