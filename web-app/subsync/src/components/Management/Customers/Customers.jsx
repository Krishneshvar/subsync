import React, { useEffect, useState } from 'react'
import { Table, Container, Alert, Spinner, Button } from 'react-bootstrap'
import axios from 'axios'

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const headers = [{ key: 'cid', label: 'ID' }, { key: 'cname', label: 'Name' }, { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone Number' }, { key: 'address', label: 'Address' }
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
      <Button variant="primary" className="material-symbols-outlined mb-4">
          person_add
      </Button>

      {
        customers.length > 0 ? (
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
                    customers.map((customer) => (
                        <tr key={customer.cid}>
                            <td className="px-4 py-2 border-b">{customer.cid}</td>
                            <td className="px-4 py-2 border-b">{customer.cname}</td>
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
