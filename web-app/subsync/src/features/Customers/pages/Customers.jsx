import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Eye, FileDown, FileUp, UserPlus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.jsx";
import { Button } from "@/components/ui/button.jsx";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu.jsx";
import GenericTable from "../../../components/layouts/GenericTable.jsx";
import Pagination from "../../../components/layouts/Pagination.jsx";
import useFetchData from "@/Common/useFetchData.js";
import SearchFilterForm from "../../../components/layouts/SearchFilterForm.jsx";
import { saveAs } from "file-saver";
import * as Papa from "papaparse";
import "jspdf-autotable";
import { toast } from "react-toastify";
import axios from "axios";

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

function Customers() {
  const [sortBy, setSortBy] = useState("customer_id");
  const [order, setOrder] = useState("asc");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [file, setFile] = useState(null);
  const [importData, setImportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { data = [], error, loading: fetchLoading, totalPages = 0 } = useFetchData(
    `${import.meta.env.VITE_API_URL}/all-customers`,
    { sort: sortBy, order, currentPage }
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handleSearch = (e) => {
    if (e.key === "Enter") setCurrentPage(1);
  };

  const fetchCustomersAndExport = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/all-customer-details`);
      if (!response.ok) throw new Error("Failed to fetch customer data");
      const data = await response.json();
      if (!data.customers || !Array.isArray(data.customers)) throw new Error("Invalid customer data received!");
      if (data.customers.length === 0) throw new Error("No customer data available to export!");

      const formattedData = data.customers.map((c) => ({
        "Customer ID": c.customer_id || "",
        "Salutation": c.salutation || "",
        "First Name": c.first_name || "",
        "Last Name": c.last_name || "",
        "Display Name": c.display_name || "",
        "Company Name": c.company_name || "",
        "Phone Number": `${c.country_code || ""}${c.primary_phone_number || ""}`,
        "Email": c.primary_email || "",
        "GSTIN": c.gst_in || "",
        "GST Treatment": c.gst_treatment || "",
        "Tax Preference": c.tax_preference || "",
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
      setFile(selectedFile);
      parseCSV(selectedFile);
    }
  };

  const parseCSV = (file) => {
    Papa.parse(file, {
      complete: (result) => {
        const formatted = result.data.map((row) => ({
          salutation: row["Salutation"] || "",
          first_name: row["First Name"] || "",
          last_name: row["Last Name"] || "",
          primary_email: row["Email"] || "",
          primary_phone_number: row["Phone Number"] || "",
          company_name: row["Company Name"] || "",
          display_name: row["Display Name"] || "",
          gst_in: row["GSTIN"] || "",
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
        setImportData(formatted);
      },
      header: true,
      skipEmptyLines: true,
    });
  };

  const handleImport = async () => {
    if (importData.length === 0) return toast.error("No data to import!");
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/import-customers`, { customers: importData });
      if (res.status !== 200) throw new Error("Import failed!");
      toast.success("Customers Imported Successfully!");
      setImportData([]);
    } catch (err) {
      toast.error(err.message || "Error importing customers.");
    } finally {
      setLoading(false);
    }
  };

  const renderActions = (id) => (
    <div className="flex items-center">
      <Link to={`${id}`}>
        <Button variant="ghost" size="icon">
          <Eye className="w-4 h-4" />
        </Button>
      </Link>
    </div>
  );

  const filteredData = data.filter((c) => {
    const term = search.toLowerCase();
    return (
      c.customer_id.toString().toLowerCase().includes(term) ||
      c.salutation.toLowerCase().includes(term) ||
      c.first_name.toLowerCase().includes(term) ||
      c.last_name?.toLowerCase().includes(term) ||
      c.display_name.toLowerCase().includes(term) ||
      c.company_name.toLowerCase().includes(term) ||
      c.primary_phone_number.toString().toLowerCase().includes(term) ||
      c.primary_email.toLowerCase().includes(term) ||
      c.gst_in?.toLowerCase().includes(term) ||
      c.customer_status.toLowerCase().includes(term)
    );
  });

  const modifiedData = filteredData.map((c) => ({
    ...c,
    phone_with_country_code: `${c.country_code || ""}${c.primary_phone_number}`,
    actions: renderActions(c.customer_id),
  }));

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
              <UserPlus/> Add
            </Button>
          </Link>

          <Button className="sm:w-auto" onClick={handleImportButtonClick}>
            <FileDown /> Import
          </Button>

          <div className="flex flex-col md:flex-row gap-2 sm:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <FileUp /> Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={fetchCustomersAndExport}>Export as CSV</DropdownMenuItem>
                <DropdownMenuItem onClick={() => console.log("Export PDF")}>Export as PDF</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileChange} style={{ display: "none" }} />
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {(fetchLoading || loading) ? (
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
