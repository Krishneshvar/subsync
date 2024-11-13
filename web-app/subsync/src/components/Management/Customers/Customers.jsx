import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Table, Container, Alert, Spinner, Button, Form, InputGroup } from 'react-bootstrap'
import axios from 'axios'
import CustomerRow from './CustomerRow'
import CustomerFilters from './CustomerFilters'
import CustomerPagination from './CustomerPagination'
import { Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react'

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

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [error, setError] = useState(null)
  const [loadingCustomers, setLoadingCustomers] = useState(true)
  const [filterBy, setFilterBy] = useState("Name")
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("Name")
  const [order, setOrder] = useState("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const getKey = (label) => {
    const header = headers.find(h => h.label === label)
    return header ? header.key : null
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      setLoadingCustomers(true)
      const fetchCustomers = async () => {
        try {
          setError(null)
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/all-customers`, {
            params: {
              searchType: getKey(filterBy),
              search: search,
              sort: getKey(sortBy),
              order: order,
              page: currentPage,
            },
            withCredentials: true,
          })
          setCustomers(response.data.customers)
          setTotalPages(response.data.totalPages)
        } catch (err) {
          console.error("Error fetching customers:", err)
          setError("Failed to load customers. Please try again later.")
        } finally {
          setLoadingCustomers(false)
        }
      }

      fetchCustomers()
    }, 300)

    return () => clearTimeout(handler)
  }, [filterBy, search, sortBy, order, currentPage])

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      setSearch(e.target.value)
      setCurrentPage(1)
    }
  }

  return (
    <Container fluid className="py-4 px-4 md:px-6 lg:px-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Customer List</h2>
      
      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <CustomerFilters
          filterBy={filterBy}
          setFilterBy={setFilterBy}
          search={search}
          setSearch={setSearch}
          handleSearch={handleSearch}
          sortBy={sortBy}
          setSortBy={setSortBy}
          order={order}
          setOrder={setOrder}
          headers={headers}
        />

        <Link to="add">
          <Button variant="primary" className="w-full md:w-auto">
            Add Customer
          </Button>
        </Link>
      </div>

      {loadingCustomers ? (
        <div className="flex justify-center items-center my-8">
          <Spinner animation="border" role="status" variant="primary">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      ) : customers.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <Table hover responsive className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {headers.map(header => (
                  <th key={header.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {header.label}
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {
                customers.map((customer) => (
                  <CustomerRow key={customer.cid} customer={customer} />
                ))
              }
            </tbody>
          </Table>

          <CustomerPagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </div>
      ) : (
        <Alert variant="info">No customers available</Alert>
      )}
    </Container>
  )
}
