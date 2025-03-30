import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import GenericTable from "../../Common/GenericTable"; 
import Pagination from "../../Common/Pagination"; 
import SearchFilterForm from "../../Common/SearchFilterForm"; 
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Dropdown } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import axios from 'axios'; // Import axios for API calls

export default function Domains() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [domains, setDomains] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;
  const fileInputRef = useRef(null);

  const headers = [
    { key: 'domain_name', label: 'Domain Name' },
    { key: 'customer_name', label: 'Customer Name' }, // Ensure backend sends this
    { key: 'registered_with', label: 'Registered With' },
    { key: 'name_server', label: 'Name Server' },
    { key: 'description', label: 'Description' },
    { key: 'registration_date', label: 'Registration Date' },
    { key: 'expiry_date', label: 'Expiry Date' },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // Formats as DD/MM/YYYY
  };

  useEffect(() => {
    const fetchDomains = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:3000/all-domains');
        
        // Format dates before setting the state
        const formattedDomains = response.data.domains.map(domain => ({
          ...domain,
          registration_date: formatDate(domain.registration_date),
          expiry_date: formatDate(domain.expiry_date),
        }));

        setDomains(formattedDomains);
      } catch (err) {
        setError("Failed to fetch domains. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDomains();
  }, []);


  const handleSearch = () => {
    console.log('Searching for:', search);
  };

  return (
    <div className="container shadow-lg rounded-lg mx-auto py-6 px-4 sm:px-6 lg:px-8">
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

        <div className="flex flex-col md:flex-row gap-2 w-full sm:w-auto">
          <Link to={`add`}>
            <Button className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 whitespace-nowrap w-full sm:w-auto">
              New Domain
            </Button>
          </Link>
        </div>
      </div>

      {/* ✅ Show Errors if API fails */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* ✅ Show Loading Spinner */}
      {loading ? (
        <div className="flex justify-center items-center my-8">
          <Spinner animation="border" role="status" variant="primary">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      ) : domains.length > 0 ? (
        <>
          <GenericTable headers={headers} data={domains} primaryKey="domain_id" />
          <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
        </>
      ) : (
        <Alert>
          <AlertTitle>Info</AlertTitle>
          <AlertDescription>No domains available</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
