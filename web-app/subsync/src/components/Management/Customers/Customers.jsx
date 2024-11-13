import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Container, Alert, Spinner, Button, Stack, ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';
import axios from 'axios';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState(null);
  const [loadingCustomers, setLoadingCustomers] = useState(true); // Separate loading state
  const [filterBy, setFilterBy] = useState("Name");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Name");
  const [order, setOrder] = useState("asc");
  
  // New state variables for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const headers = [
    { key: 'cid', label: 'ID' },
    { key: 'cname', label: 'Name' },
    { key: 'domains', label: 'Domains' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone Number' },
    { key: 'address', label: 'Address' }
  ];

  function getKey(label) {
    for (let i = 0; i < headers.length; i++) {
      if (headers[i].label === label) {
        return headers[i].key;
      }
    }
    return null;
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      setLoadingCustomers(true); // Start loading customers
      const fetchCustomers = async () => {
        try {
          setError(null);
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/all-customers`, {
            params: {
              searchType: getKey(filterBy),
              search: search,
              sort: getKey(sortBy),
              order: order,
              page: currentPage,
            },
            withCredentials: true,
          });
          setCustomers(response.data.customers);
          setTotalPages(response.data.totalPages);
        } catch (err) {
          console.error("Error fetching customers:", err);
          setError("Failed to load customers. Please try again later.");
        } finally {
          setLoadingCustomers(false); // Stop loading customers
        }
      };

      fetchCustomers();
    }, 300);

    return () => clearTimeout(handler);
  }, [filterBy, search, sortBy, order, currentPage]);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setSearch(e.target.value);
      setCurrentPage(1); // Reset to first page on new search
    }
  };

  return (
    <Container className="py-2">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Customer List</h2>
      
      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

      <Stack direction="horizontal" className="flex justify-between items-center p-2" gap={3}>
        <div className="flex items-center gap-2 border-1 border-gray-300 px-2 py-1 rounded-full">
          <span className='material-symbols-outlined'>search</span>
          <ButtonGroup>
            <DropdownButton
              variant="primary"
              title={`Filter by: ${filterBy}`}
              id="input-group-dropdown-1"
              as={ButtonGroup}
              onSelect={(eventKey) => setFilterBy(eventKey)}
            >
              {headers.map(header => (
                <Dropdown.Item key={header.key} eventKey={header.label}>{header.label}</Dropdown.Item>
              ))}
            </DropdownButton>
            <DropdownButton
              variant="primary"
              title={`Sort by: ${sortBy}`}
              id="sort-dropdown"
              as={ButtonGroup}
              onSelect={(eventKey) => setSortBy(eventKey)}
            >
              {headers.map(header => (
                <Dropdown.Item key={header.key} eventKey={header.label}>{header.label}</Dropdown.Item>
              ))}
            </DropdownButton>
            <DropdownButton
              variant="primary"
              title={`Order: ${order}`}
              id="order-dropdown"
              as={ButtonGroup}
              onSelect={(eventKey) => setOrder(eventKey)}
            >
              <Dropdown.Item eventKey="asc">Ascending</Dropdown.Item>
              <Dropdown.Item eventKey="desc">Descending</Dropdown.Item>
            </DropdownButton>
          </ButtonGroup>
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none border-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)} // Keep this to update input value
            onKeyPress={handleSearch} // Call handleSearch on key press
          />
        </div>
        <div className="flex flex-row items-center gap-2"></div>
        <div className="p-2 ms-auto">
          <Link to="add">
            <Button variant="primary" className="material-symbols-outlined p-2">
              person_add
            </Button>
          </Link>
        </div>
      </Stack>

      {/* Loading Spinner for Customers */}
      {loadingCustomers ? (
        <div className="flex justify-center items-center my-4">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      ) : (
        customers.length > 0 ? (
          <div className="overflow-x-auto">
            <Table striped bordered hover responsive className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  {headers.map(header => (
                    <th key={header.key} className="px-4 py-2 text-left text-gray-700">
                      {header.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
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
                ))}
              </tbody>
            </Table>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
              <Button 
                disabled={currentPage === 1} 
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              <span>Page {currentPage} of {totalPages}</span>
              <Button 
                disabled={currentPage === totalPages} 
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        ) : (
          <Alert variant="info">No customers available</Alert>
        )
      )}
    </Container>
  );
}
