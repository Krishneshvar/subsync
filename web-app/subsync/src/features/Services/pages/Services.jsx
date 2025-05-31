// src/features/Services/Services.jsx
import { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Plus, Eye, FileDown, FileUp, Trash2 } from 'lucide-react'; // Added Trash2 for delete icon
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.jsx";
import { Button } from "@/components/ui/button.jsx";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu.jsx";
import GenericTable from '../../../components/layouts/GenericTable.jsx';
import Pagination from '../../../components/layouts/Pagination.jsx';
import SearchFilterForm from '../../../components/layouts/SearchFilterForm.jsx';
import { saveAs } from "file-saver";
import * as Papa from "papaparse";
import { toast } from "react-toastify";
import api from '@/api/axiosInstance'; // Use your configured axios instance
import { useDispatch, useSelector } from 'react-redux'; // Import Redux hooks
import { fetchServices, deleteService } from '@/features/Services/serviceSlice.js'; // Import service thunks

// Define headers for the GenericTable
const headers = [
  { key: 'service_id', label: 'ID' },
  { key: 'service_name', label: 'Name' },
  { key: 'stock_keepers_unit', label: 'SKU' },
  { key: 'item_group_name', label: 'Item Group' }, // Display name from join
  { key: 'tax_preference', label: 'Tax Pref.' },
  { key: 'preferred_vendor_name', label: 'Vendor' }, // Display name from join
  { key: 'created_at', label: 'Created At' },
  { key: 'updated_at', label: 'Updated At' },
  { key: 'actions', label: 'Actions' }, // For View/Edit/Delete
];

function Services() {
  const dispatch = useDispatch();
  const { list: services, loading, error } = useSelector((state) => state.services);

  const [sortBy, setSortBy] = useState("created_at"); // Default sort by creation time
  const [order, setOrder] = useState("desc");
  const [search, setSearch] = useState(""); // For search filter
  const [currentPage, setCurrentPage] = useState(1);
  // const { username } = useParams(); // Only if username is part of base path, otherwise not needed

  const fileInputRef = useRef(null); // Ref for file input for import

  // Fetch services on component mount or when sort/order/page changes
  useEffect(() => {
    // For simplicity, fetching all data and then filtering/paginating client-side.
    // For large datasets, you'd pass sortBy, order, search, currentPage to fetchServices thunk
    // and implement server-side filtering/pagination.
    dispatch(fetchServices());
  }, [dispatch]); // Only re-fetch on dispatch change (effectively once)

  // Reset page to 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Handle search input change (e.g., on Enter key)
  const handleSearch = (e) => {
    // This function is for triggering search on Enter key,
    // the actual filtering happens in filteredServices below.
    // No need to set search state here if it's already bound to the input value.
  };

  // --- Data Filtering, Sorting, and Pagination (Client-Side) ---
  const filteredAndSortedServices = services
    .filter((service) => {
      const searchTerm = search.toLowerCase();
      return (
        service.service_name.toLowerCase().includes(searchTerm) ||
        service.stock_keepers_unit.toLowerCase().includes(searchTerm) ||
        service.item_group_name?.toLowerCase().includes(searchTerm) || // Check if exists
        service.preferred_vendor_name?.toLowerCase().includes(searchTerm) // Check if exists
        // Add other fields to search by as needed
      );
    })
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      return order === 'asc' ? aValue - bValue : bValue - aValue;
    });

  const itemsPerPage = 10; // Define items per page
  const totalFilteredPages = Math.ceil(filteredAndSortedServices.length / itemsPerPage);
  const paginatedServices = filteredAndSortedServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  // --- End Data Filtering, Sorting, and Pagination ---


  // --- Action Handlers ---

  const handleDeleteService = async (serviceId) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      await dispatch(deleteService(serviceId));
      // The slice will automatically update the list on fulfillment
    }
  };

  const renderActions = (serviceId) => (
    <div className="flex items-center gap-2">
      {/* Changed to link to /services/:id for viewing details */}
      <Link to={`${serviceId}`}>
        <Button variant="ghost" size="icon">
          <Eye className="w-4 h-4" />
        </Button>
      </Link>
      <Button variant="ghost" size="icon" onClick={() => handleDeleteService(serviceId)}>
        <Trash2 className="w-4 h-4 text-red-500" />
      </Button>
    </div>
  );

  const modifiedData = paginatedServices.map((service) => ({
    ...service,
    stock_keepers_unit: service.stock_keepers_unit, // Ensure correct mapping
    item_group_name: service.item_group_name || 'N/A', // Display name, fallback
    preferred_vendor_name: service.preferred_vendor_name || 'N/A', // Display name, fallback
    actions: renderActions(service.service_id),
  }));

  // --- CSV Export Logic ---
  const fetchServicesAndExport = async () => {
    try {
      // Fetch all services directly from the API for export, not just the paginated/filtered ones
      const response = await api.get("/all-services");
      if (!response.data || !Array.isArray(response.data.services)) { // Check for .services property
        throw new Error("Invalid service data received for export!");
      }
      const allServices = response.data.services;

      if (allServices.length === 0) {
        toast.info("No service data available to export!");
        return;
      }

      const formattedData = allServices.map((s) => ({
        "Service ID": s.service_id,
        "Service Name": s.service_name,
        "SKU": s.stock_keepers_unit,
        "Tax Preference": s.tax_preference,
        "Item Group Name": s.item_group_name || 'N/A', // Use the joined name
        "Sales Info (JSON)": s.sales_info ? JSON.stringify(s.sales_info) : '',
        "Purchase Info (JSON)": s.purchase_info ? JSON.stringify(s.purchase_info) : '',
        "Preferred Vendor Name": s.preferred_vendor_name || 'N/A', // Use the joined name
        "Default Tax Rates (JSON)": s.default_tax_rates ? JSON.stringify(s.default_tax_rates) : '',
        "Created At": s.created_at,
        "Updated At": s.updated_at,
      }));

      const csv = Papa.unparse(formattedData);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, `services_export_${new Date().toISOString().slice(0, 10)}.csv`);
      toast.success("CSV file downloaded successfully!");
    } catch (err) {
      console.error("Error exporting services:", err);
      toast.error(err.message || "Failed to generate CSV file.");
    }
  };

  // --- CSV Import Logic ---
  const handleImportButtonClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      Papa.parse(selectedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          // Assuming the imported CSV has columns matching the backend's expected payload
          // You might need to map CSV headers to your backend's expected JSON structure
          const importableData = result.data.map(row => ({
            service_name: row["Service Name"] || "",
            SKU: row["SKU"] || "",
            tax_preference: row["Tax Preference"] || "Taxable",
            // For item_group and preferred_vendor, you'd need to map names back to IDs if CSV contains names
            // For simplicity, this assumes CSV directly provides IDs or you'd need a lookup mechanism
            item_group: row["Item Group ID"] || "", // Assuming CSV provides ID, or needs lookup
            sales_information: JSON.parse(row["Sales Info (JSON)"] || '{}'),
            purchase_information: JSON.parse(row["Purchase Info (JSON)"] || '{}'),
            preferred_vendor: row["Preferred Vendor ID"] || "", // Assuming CSV provides ID, or needs lookup
            default_tax_rates: JSON.parse(row["Default Tax Rates (JSON)"] || '{}'),
          }));
          // This is a simplified example. In a real app, you'd validate and potentially
          // perform lookups for item_group and preferred_vendor names to their IDs.
          handleImport(importableData); // Directly call import after parsing
        },
        error: (err) => {
          toast.error(`Error parsing CSV: ${err.message}`);
        }
      });
    }
  };

  const handleImport = async (dataToImport) => {
    if (dataToImport.length === 0) {
      toast.error("No data to import from CSV!");
      return;
    }
    toast.info("Importing services...");
    try {
      // This assumes your backend has a /import-services endpoint
      // and expects an array of service objects.
      const res = await api.post(`${import.meta.env.VITE_API_URL}/import-services`, { services: dataToImport });
      if (res.status === 200 || res.status === 201) {
        toast.success("Services imported successfully!");
        dispatch(fetchServices()); // Re-fetch services to update the table
      } else {
        throw new Error(res.data.error || "Import failed!");
      }
    } catch (err) {
      console.error("Error during import:", err);
      toast.error(err.response?.data?.error || err.message || "Error importing services.");
    }
  };


  return (
    <div className="container p-6 rounded-lg shadow-lg">
      <h1 className="w-full text-3xl font-bold mb-2">Services</h1>
      <hr className="mb-4 border-blue-500 border-3 size-auto" />
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 w-full">
        <div className="flex flex-col sm:flex-row w-full items-center gap-3">
          <SearchFilterForm
            search={search}
            setSearch={setSearch}
            handleSearch={(e) => setSearch(e.target.value)} // Update search state directly
            sortBy={sortBy}
            setSortBy={setSortBy}
            order={order}
            setOrder={setOrder}
            headers={headers.filter(h => h.key !== 'actions').map(({ key, label }) => ({ key, label }))} // Exclude actions for sorting
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Link to={`add`}> {/* Link to add new service */}
            <Button className="w-full sm:w-auto">
              <Plus /> Add Service
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
                <DropdownMenuItem onClick={fetchServicesAndExport}>Export as CSV</DropdownMenuItem>
                {/* <DropdownMenuItem onClick={() => console.log("Export PDF")}>Export as PDF</DropdownMenuItem> */}
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

      {loading ? (
        <div className="flex justify-center items-center my-8">
          {/* Using Tailwind CSS spinner */}
          <span className="animate-spin w-6 h-6 border-4 border-t-transparent border-blue-500 rounded-full"></span>
        </div>
      ) : modifiedData.length > 0 ? (
        <>
          <GenericTable
            headers={headers}
            data={modifiedData}
            primaryKey="service_id" // Use service_id as primary key
          />
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalFilteredPages} // Use totalFilteredPages for client-side pagination
          />
        </>
      ) : (
        <Alert>
          <AlertTitle>Info</AlertTitle>
          <AlertDescription>No services available</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export default Services;
