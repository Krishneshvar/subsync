import { useState, useEffect, useRef } from "react"; 
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
import * as Papa from "papaparse";
import "jspdf-autotable"; 
import { toast } from "react-toastify"; 

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
  const [file, setFile] = useState(null);
  const [importData, setImportData] = useState([]);

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

  const fetchCustomersAndExport = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/all-customer-details`);
        if (!response.ok) throw new Error("Failed to fetch customer data");

        const data = await response.json();

        console.log("Fetched API Response:", data); // Debugging Step

        // Ensure data is an array before calling map()
        if (!data.customers || !Array.isArray(data.customers)) {
          toast.error("Invalid customer data received!");
          console.error("API Response is not an array:", data);
          return;
        }
        

        if (data.length === 0) {
            toast.error("No customer data available to export!");
            console.error("Export Error: No customer data found.");
            return;
        }

        const formattedData = data.customers.map((customer) => ({
            "Customer ID": customer.customer_id || "",
            "Salutation": customer.salutation || "",
            "First Name": customer.first_name || "",
            "Last Name": customer.last_name || "",
            "Display Name": customer.display_name || "",
            "Company Name": customer.company_name || "",
            "Phone Number": `${customer.country_code || ""}${customer.primary_phone_number || ""}`,
            "Email": customer.primary_email || "",
            "GSTIN": customer.gst_in || "",
            "GST Treatment": customer.gst_treatment || "",
            "Tax Preference": customer.tax_preference || "",
            "Exemption Reason": customer.exemption_reason || "",
            "Currency Code": customer.currency_code || "INR",
            "Address Line": customer.customer_address?.addressLine || "",
            "City": customer.customer_address?.city || "",
            "State": customer.customer_address?.state || "",
            "Country": customer.customer_address?.country || "IN",
            "Zip Code": customer.customer_address?.zipCode || "",
            "Notes": customer.notes || "",
            "Customer Status": customer.customer_status || "Active",
        }));

        console.log("Formatted Data for CSV:", formattedData);

        const csv = Papa.unparse(formattedData);
        console.log("Generated CSV Content:", csv);

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, `customers_export_${new Date().toISOString()}.csv`);

        toast.success("CSV file downloaded successfully!");
    } catch (error) {
        console.error("CSV Export Error:", error);
        toast.error("Failed to generate CSV file.");
    }
};

  
  // Call this function for exporting CSV
  const handleExportCSV = () => {
    fetchCustomersAndExport();
  };
  
  // Create a ref to trigger the file input programmatically
  const fileInputRef = useRef(null);

  // Function to trigger file input when the button is clicked
  const handleImportButtonClick = () => {
    if (fileInputRef.current) {
      console.log("Opening File Input...")
      fileInputRef.current.click();
    }
  };

  // Function to handle file change and parse CSV
  const handleFileChange = (event) => {
    console.log("File Change Event Triggered", event);
    const selectedFile = event.target.files[0];
    console.log("Selected File:", selectedFile);
    if (selectedFile) {
      setFile(selectedFile);
      parseCSV(selectedFile);
    }
  };

  const parseCSV = (file) => {
    Papa.parse(file, {
      complete: (result) => {
        console.log("Parsed CSV Result:", result);
        const formattedData = result.data.map((row) => ({
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

        console.log("Formatted Data:", formattedData);

        setImportData(formattedData);
      },
      header: true,
      skipEmptyLines: true,
    });
  };

  const handleImport = async () => {
    if (importData.length === 0) {
      toast.error("No data to import!");
      return;
    }

    console.log("Data to import", importData);

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/import-customers`,
        { customers: importData }
      );

      if (response.status !== 200) {
        throw new Error("Import failed!");
      }

      toast.success("Customers Imported Successfully!");
      setImportData([]);
    } catch (error) {
      toast.error(error.message || "Error importing customers.");
    } finally {
      setLoading(false);
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
              <Dropdown.Item onClick={handleExportCSV}>
                Export as CSV
              </Dropdown.Item>
              <Dropdown.Item onClick={() => console.log("Export PDF")}>
                Export as PDF
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Button
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 whitespace-nowrap w-full sm:w-auto"
            onClick={handleImportButtonClick} // Trigger file input on button click
          >
            Import Customers
          </Button>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

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
