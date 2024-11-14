import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Spinner } from "react-bootstrap"
import GenericTable from '../../Common/GenericTable'
import SearchFilterForm from '../../Common/SearchFilterForm'
import useFetchData from '../../Common/useFetchData'
import CustomerPagination from './CustomerPagination'

// Define headers to match database field names
const headers = [
  { key: 'cid', label: 'ID' },
  { key: 'cname', label: 'Name' },
  { key: 'domains', label: 'Domains' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone Number' },
  { key: 'address', label: 'Address' },
  { key: 'created_at', label: 'Created At' },
  { key: 'updated_at', label: 'Updated At' }
]

function getKeyLabel(label) {
  const key = headers.find(header => header.label === label)?.key;
  console.log(`Mapping label '${label}' to key '${key}'`);
  return key || null;
}

export default function Customers() {
  // Set filter and sort defaults to 'cname'
  const [filterBy, setFilterBy] = useState("cname");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("cname");
  const [order, setOrder] = useState("asc"); // Default to ascending
  const [currentPage, setCurrentPage] = useState(1);

  const { data: dataArray = [], error, loading, totalPages } = useFetchData(
    `${import.meta.env.VITE_API_URL}/all-customers`,
    {
        searchType: filterBy || "",
        search,
        sort: sortBy || "",
        order,
        currentPage,
    }
  );

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setCurrentPage(1);
      setSearch(e.target.value);  // Ensure search is triggered
    }
  };

  useEffect(() => {
    console.log("Order changed:", order); // Debugging line
    setCurrentPage(1); // Reset to first page whenever filter, sort, or order changes
  }, [filterBy, sortBy, order]);

  console.log("Customers Data:", dataArray);

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6 gap-4">
        <SearchFilterForm
          filterBy={filterBy}
          setFilterBy={setFilterBy}
          search={search}
          setSearch={setSearch}
          sortBy={sortBy}
          setSortBy={setSortBy}
          order={order}
          setOrder={setOrder}
          headers={headers.map(({ key, label }) => ({ key, label }))}
          onSearch={handleSearch}
        />
        <Link to="add">
          <Button className="w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Add Customer
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
      ) : dataArray && dataArray.length > 0 ? (
        <>
          {/* Render GenericTable only if data exists */}
          <GenericTable headers={headers} data={dataArray} actions={true} />
          <CustomerPagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
        </>
      ) : (
        <Alert>
          <AlertTitle>Info</AlertTitle>
          <AlertDescription>No customers available</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
