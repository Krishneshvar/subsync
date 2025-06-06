import { Eye, FileUp, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.jsx";
import { Button } from "@/components/ui/button.jsx";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu.jsx";

import api from "@/lib/axiosInstance.js";
import GenericTable from "@/components/layouts/GenericTable.jsx";
import Pagination from "@/components/layouts/Pagination.jsx";
import SearchFilterForm from "@/components/layouts/SearchFilterForm.jsx";
import useFetchData from "@/hooks/useFetchData.js";
import AddVendorModal from "@/features/Services/components/AddVendorModal";

const headers = [
  { key: "display_name", label: "Display Name" },
  { key: "company_name", label: "Company Name" },
  { key: "primary_phone_number", label: "Phone Number" },
  { key: "primary_email", label: "Email" },
  { key: "vendor_status", label: "Status" },
  { key: "actions", label: "View/Edit" },
];

function Vendors() {
  const [sortBy, setSortBy] = useState("vendor_id");
  const [order, setOrder] = useState("asc");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const { data = [], error, loading: fetchLoading, totalPages = 0 } = useFetchData(
    `${import.meta.env.VITE_API_URL}/all-vendors`,
    { search, sort: sortBy, order, currentPage, refreshKey }
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handleSearch = (e) => {
    if (e.key === "Enter") setCurrentPage(1);
  };

  const fetchVendorsAndExport = async () => {
    try {
      const response = await api.get(`/all-vendors`);
      const vendors = Array.isArray(response.data) ? response.data : response.data.vendors;
      if (!vendors || !Array.isArray(vendors)) throw new Error("Invalid vendor data received!");
      if (vendors.length === 0) throw new Error("No vendor data available to export!");

      // Format for CSV
      const formattedData = vendors.map((v) => ({
        "Vendor ID": v.vendor_id || "",
        "Display Name": v.display_name || "",
        "Company Name": v.company_name || "",
        "Phone Number": v.primary_phone_number || "",
        "Email": v.primary_email || "",
        "Status": v.vendor_status || "",
      }));

      // Use PapaParse for CSV
      const csv = await import("papaparse").then(Papa => Papa.unparse(formattedData));
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      await import("file-saver").then(({ saveAs }) =>
        saveAs(blob, `vendors_export_${new Date().toISOString()}.csv`)
      );
      toast.success("CSV file downloaded successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to generate CSV file.");
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

  const filteredData = data.filter((v) => {
    const term = search.toLowerCase();
    return (
      (v.vendor_id?.toString().toLowerCase().includes(term) || "") ||
      (v.display_name?.toLowerCase().includes(term) || "") ||
      (v.company_name?.toLowerCase().includes(term) || "") ||
      (v.primary_phone_number?.toString().toLowerCase().includes(term) || "") ||
      (v.primary_email?.toLowerCase().includes(term) || "") ||
      (v.vendor_status?.toLowerCase().includes(term) || "")
    );
  });

  const modifiedData = filteredData.map((v) => ({
    ...v,
    actions: renderActions(v.vendor_id),
  }));

  const handleAddVendor = () => setShowAddModal(true);
  const handleVendorAdded = () => {
    setShowAddModal(false);
    setRefreshKey(prev => prev + 1); // trigger table refresh
    toast.success("Vendor added successfully!");
  };

  return (
    <div className="container p-6 rounded-lg shadow-lg">
      <h1 className="w-full text-3xl font-bold mb-2">Vendors</h1>
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
          <AddVendorModal
            isEditing={false}
            editableVendor={null}
            onVendorAdded={handleVendorAdded}
            isOpen={showAddModal}
            setIsOpen={setShowAddModal}
            trigger={
              <Button className="w-full sm:w-auto" onClick={() => setShowAddModal(true)}>
                <UserPlus /> Add
              </Button>
            }
          />
          <Button className="w-full sm:w-auto" onClick={fetchVendorsAndExport}>
            <FileUp /> Export
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <span />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={fetchVendorsAndExport}>Export as CSV</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
          <GenericTable headers={headers} data={modifiedData} primaryKey="vendor_id" />
          <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
        </>
      ) : (
        <Alert>
          <AlertTitle>Info</AlertTitle>
          <AlertDescription>No vendors available</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export default Vendors;
