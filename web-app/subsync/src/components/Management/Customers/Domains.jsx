import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom'; // Added useParams
import { Button } from '@/components/ui/button';
import GenericTable from "../../Common/GenericTable";
import Pagination from "../../Common/Pagination";
import SearchFilterForm from "../../Common/SearchFilterForm";
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import Spinner from 'react-bootstrap/Spinner';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEdit } from "react-icons/fa"; // Import the edit icon from React Icons
import OverlayTrigger from "react-bootstrap/OverlayTrigger"; // Import OverlayTrigger for tooltip
import Tooltip from "react-bootstrap/Tooltip"; // Import Tooltip

export default function Domains() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [domains, setDomains] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;
  const { username, domainId } = useParams();

  const headers = [
    { key: 'domain_name', label: 'Domain Name' },
    { key: 'customer_name', label: 'Customer Name' },
    { key: 'registered_with', label: 'Registered With' },
    { key: 'name_server', label: 'Name Server' },
    { key: 'description', label: 'Description' },
    { key: 'registration_date', label: 'Registration Date' },
    { key: 'expiry_date', label: 'Expiry Date' },
    { key: 'actions', label: 'Actions' }
  ];

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  const handleSearch = (e) => {
    setSearch(e.target.value); // Update search state on every input change
    setCurrentPage(1); // Reset to the first page
  };

  useEffect(() => {
    const fetchDomains = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:3000/all-domains', {
          params: { search, sort: sortBy, order },
        });

        const formattedDomains = response.data.domains
          .map((domain) => ({
            ...domain,
            registration_date: formatDate(domain.registration_date),
            expiry_date: formatDate(domain.expiry_date),
          }))
          .filter((domain) => {
            const searchTerm = search.toLowerCase();
            return (
              domain.domain_name.toLowerCase().includes(searchTerm) ||
              domain.customer_name.toLowerCase().includes(searchTerm) ||
              domain.registered_with?.toLowerCase().includes(searchTerm) ||
              domain.name_server?.toLowerCase().includes(searchTerm) ||
              domain.description?.toLowerCase().includes(searchTerm) ||
              domain.registration_date.includes(searchTerm) ||
              domain.expiry_date.includes(searchTerm)
            );
          });

        setDomains(formattedDomains);
      } catch (err) {
        setError("Failed to fetch domains. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDomains();
  }, [search, sortBy, order, currentPage]);

  return (
    <div className="container shadow-lg rounded-lg mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 w-full">
        <SearchFilterForm
          search={search}
          setSearch={(value) => setSearch(value)} 
          handleSearch={handleSearch}
          sortBy={sortBy}
          setSortBy={setSortBy}
          order={order}
          setOrder={setOrder}
          headers={headers.map(({ key, label }) => ({ key, label }))}
        />
        <Link to={`add`}>
          <Button className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 w-full sm:w-auto">
            New Domain
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
      ) : domains.length > 0 ? (
        <>
          <GenericTable
            headers={headers}
            data={domains.map(domain => ({
              ...domain,
              actions: (
                <div className="flex gap-2">
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`tooltip-edit-${domain.domain_id}`}>Edit</Tooltip>}
                  >
                    <Link to={`/${username}/dashboard/domains/edit/${domain.domain_id}`} state={{ domain }}>
                      <Button className="bg-black-500 text-black ml-1 p-2 rounded-md hover:bg-blue-600">
                        <FaEdit size={10} /> 
                      </Button>
                    </Link>
                  </OverlayTrigger>
                </div>
              )
            }))}
            primaryKey="domain_id"
          />
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
