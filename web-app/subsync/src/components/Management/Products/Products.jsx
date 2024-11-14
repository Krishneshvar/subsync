import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Spinner } from "react-bootstrap"
import GenericTable from '../../Common/GenericTable'
import SearchFilterForm from '../../Common/SearchFilterForm'
import useFetchData from '../../Common/useFetchData'
import Pagination from '../../Common/Pagination'

const headers = [
  { key: 'sid', label: 'ID' },
  { key: 'sname', label: 'Name' },
  { key: 'description', label: 'Description' },
  { key: 'validity', label: 'Validity' },
  { key: 'price', label: 'Price' },
  { key: 'created_at', label: 'Created At' },
  { key: 'updated_at', label: 'Updated At' }
]

function Products() {
  const [filterBy, setFilterBy] = useState("sname");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("sname");
  const [order, setOrder] = useState("asc"); // Default to ascending
  const [currentPage, setCurrentPage] = useState(1);

  const { data: dataArray = [], error, loading, totalPages } = useFetchData(
    `${import.meta.env.VITE_API_URL}/all-products`,
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

  console.log("Products Data:", dataArray);

  return (
    <div className="container shadow-lg rounded-lg mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
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
        <Link to="add" className="w-full md:w-auto">
          <Button className="w-full md:w-auto bg-gradient-to-l from-cyan-500 to-blue-500 text-white">
            <Plus className="mr-2 h-4 w-4" /> Add Product
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
          <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
        </>
      ) : (
        <Alert>
          <AlertTitle>Info</AlertTitle>
          <AlertDescription>No products available</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export default Products
