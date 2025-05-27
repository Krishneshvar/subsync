import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button.jsx"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.jsx"
import { Spinner } from "react-bootstrap"
import GenericTable from '../../components/layouts/GenericTable.jsx'
import SearchFilterForm from '../../components/layouts/SearchFilterForm.jsx'
import useFetchData from '@/Common/useFetchData.js'
import Pagination from '../../components/layouts/Pagination.jsx'

const headers = [
  { key: 'sub_id', label: 'Subscription ID' },
  { key: 'customer_id', label: 'Customer ID' },
  { key: 'service_id', label: 'Product ID' },
  { key: 'amount', label: 'Price' },
  { key: 'start_date', label: 'Start Date' },
  { key: 'end_date', label: 'End Date' },
  { key: 'status', label: 'Status' }
]

function Subscriptions() {
  const [filterBy, setFilterBy] = useState("sub_id");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("sub_id");
  const [order, setOrder] = useState("asc"); // Default to ascending
  const [currentPage, setCurrentPage] = useState(1);
  const { username } = useParams();

  const { data: dataArray = [], error, loading, totalPages } = useFetchData(
    `${import.meta.env.VITE_API_URL}/all-subscriptions`,
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
          <Button className="w-full md:w-auto bg-blue-500 text-white">
            <Plus className="mr-2 h-4 w-4" /> Add Subscription
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
          <GenericTable
            headers={headers}
            data={dataArray}
            actions={true}
            basePath={`/${username}/dashboard/subscriptions`}
            primaryKey="sub_id"
          />

          <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
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

export default Subscriptions
