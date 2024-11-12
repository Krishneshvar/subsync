import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Table, Container, Alert, Spinner, Button, Stack } from 'react-bootstrap'
import axios from 'axios'

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const headers = [
    { key: 'cid', label: 'ID' },
    { key: 'cname', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone Number' },
    { key: 'address', label: 'Address' }
  ];

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/all-customers`, {
          withCredentials: true,
        })
        setCustomers(response.data)
      }
      catch (err) {
        console.error("Error fetching customers:", err)
        setError("Failed to load customers. Please try again later.")
      }
      finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  // Filter customers based on the search term, checking all fields
  const filteredCustomers = customers.filter(customer =>
    Object.values(customer).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    )
  }

  return (
    <Container className="py-2">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Customer List</h2>
      
      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

      <Stack direction="horizontal" className="flex justify-between items-center p-2" gap={3}>
        <div className="flex items-center gap-2 border-1 border-gray-300 p-2 rounded-full">
          <span className='material-symbols-outlined'>search</span>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm} // Bind input to searchTerm state
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term on change
            className="bg-transparent outline-none border-none"
          />
        </div>
        <div className="p-2 ms-auto">
          <Link to="add">
            <Button variant="primary" className="material-symbols-outlined p-2 rounded-full">
              person_add
            </Button>
          </Link>
        </div>
      </Stack>

      {
        filteredCustomers.length > 0 ? (
            <div className="overflow-x-auto">
            <Table striped bordered hover responsive className="w-full">
                <thead className="bg-gray-200">
                    <tr>
                      {
                        headers.map(header => (
                          <th key={header.key} className="px-4 py-2 text-left text-gray-700">
                              {header.label}
                          </th>
                        ))
                      }
                    </tr>
                </thead>
                <tbody>
                {
                    filteredCustomers.map((customer) => (
                        <tr key={customer.cid}>
                            <td className="px-4 py-2 border-b">{customer.cid}</td>
                            <td className="px-4 py-2 border-b">{customer.cname}</td>
                            <td className="px-4 py-2 border-b">
                              {typeof customer.domains === 'string' ? 
                                JSON.parse(customer.domains).join(', ') : 
                                Array.isArray(customer.domains) ? customer.domains.join(', ') : 'N/A'}
                            </td>
                            <td className="px-4 py-2 border-b">{customer.email}</td>
                            <td className="px-4 py-2 border-b">{customer.phone}</td>
                            <td className="px-4 py-2 border-b">{customer.address}</td>
                        </tr>
                    ))
                }
                </tbody>
            </Table>
            </div>
        ) : (
        <Alert variant="info">No customers available</Alert>
        )
      }
    </Container>
  )
}
