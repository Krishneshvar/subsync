import { saveAs } from "file-saver";
import { Eye, FileDown, FileUp, Plus, Trash2 } from 'lucide-react';
import * as Papa from "papaparse";
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import { useState, useEffect, useRef } from 'react';

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.jsx";
import { Button } from "@/components/ui/button.jsx";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu.jsx";

import api from '@/lib/axiosInstance.js';
import GenericTable from '@/components/layouts/GenericTable.jsx';
import Pagination from '@/components/layouts/Pagination.jsx';
import SearchFilterForm from '@/components/layouts/SearchFilterForm.jsx';
import { fetchServices, deleteService } from '@/features/Services/serviceSlice.js';

const headers = [
  { key: 'service_id', label: 'ID' },
  { key: 'service_name', label: 'Name' },
  { key: 'stock_keepers_unit', label: 'SKU' },
  { key: 'item_group_name', label: 'Item Group' },
  { key: 'tax_preference', label: 'Tax Pref.' },
  { key: 'preferred_vendor_name', label: 'Vendor' },
  { key: 'created_at', label: 'Created At' },
  { key: 'updated_at', label: 'Updated At' },
  { key: 'actions', label: 'Actions' },
];

function Services() {
  const dispatch = useDispatch();
  const { list: services, loading, error } = useSelector((state) => state.services);

  const [sortBy, setSortBy] = useState("service_name");
  const [order, setOrder] = useState("desc");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  // const { username } = useParams(); // Only if username is part of base path, otherwise not needed

  const fileInputRef = useRef(null);

  // Fetch services on component mount or when sort/order/page changes
  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Handle search input change (e.g., on Enter key)
  const handleSearch = (e) => {
    // This function is for triggering search on Enter key,
    // the actual filtering happens in filteredServices below.
    // No need to set search state here if it's already bound to the input value.
  };

  const filteredAndSortedServices = services
    .filter((service) => {
      const searchTerm = search.toLowerCase();
      return (
        service.service_name.toLowerCase().includes(searchTerm) ||
        service.stock_keepers_unit.toLowerCase().includes(searchTerm) ||
        service.item_group_name?.toLowerCase().includes(searchTerm) ||
        service.preferred_vendor_name?.toLowerCase().includes(searchTerm)
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

  const itemsPerPage = 10;
  const totalFilteredPages = Math.ceil(filteredAndSortedServices.length / itemsPerPage);
  const paginatedServices = filteredAndSortedServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDeleteService = async (serviceId) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      await dispatch(deleteService(serviceId));
    }
  };

  const renderActions = (serviceId) => (
    <div className="flex items-center gap-2">
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
    stock_keepers_unit: service.stock_keepers_unit,
    item_group_name: service.item_group_name || 'N/A',
    preferred_vendor_name: service.preferred_vendor_name || 'N/A',
    actions: renderActions(service.service_id),
  }));

  const fetchServicesAndExport = async () => {
    try {
      const response = await api.get("/all-services");
      if (!response.data || !Array.isArray(response.data.services)) {
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
        "Item Group Name": s.item_group_name || 'N/A',
        "Sales Info (JSON)": s.sales_info ? JSON.stringify(s.sales_info) : '',
        "Purchase Info (JSON)": s.purchase_info ? JSON.stringify(s.purchase_info) : '',
        "Preferred Vendor Name": s.preferred_vendor_name || 'N/A',
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

  const handleImportButtonClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      Papa.parse(selectedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const importableData = result.data.map(row => ({
            service_name: row["Service Name"] || "",
            SKU: row["SKU"] || "",
            tax_preference: row["Tax Preference"] || "Taxable",
            item_group: row["Item Group ID"] || "",
            sales_information: JSON.parse(row["Sales Info (JSON)"] || '{}'),
            purchase_information: JSON.parse(row["Purchase Info (JSON)"] || '{}'),
            preferred_vendor: row["Preferred Vendor ID"] || "",
            default_tax_rates: JSON.parse(row["Default Tax Rates (JSON)"] || '{}'),
          }));
          handleImport(importableData);
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
      const res = await api.post(`${import.meta.env.VITE_API_URL}/import-services`, { services: dataToImport });
      if (res.status === 200 || res.status === 201) {
        toast.success("Services imported successfully!");
        dispatch(fetchServices());
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
            handleSearch={(e) => setSearch(e.target.value)}
            sortBy={sortBy}
            setSortBy={setSortBy}
            order={order}
            setOrder={setOrder}
            headers={headers.filter(h => h.key !== 'actions').map(({ key, label }) => ({ key, label }))}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Link to={`add`}>
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
          <span className="animate-spin w-6 h-6 border-4 border-t-transparent border-blue-500 rounded-full"></span>
        </div>
      ) : modifiedData.length > 0 ? (
        <>
          <GenericTable
            headers={headers}
            data={modifiedData}
            primaryKey="service_id"
          />
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalFilteredPages}
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
