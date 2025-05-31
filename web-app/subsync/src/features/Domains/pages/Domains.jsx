import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';
import GenericTable from "../../../components/layouts/GenericTable.jsx";
import Pagination from "../../../components/layouts/Pagination.jsx";
import SearchFilterForm from "../../../components/layouts/SearchFilterForm.jsx";
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert.jsx';
import { OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import api from '@/api/axiosInstance.js';
import { FaEdit } from "react-icons/fa";

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
    { key: 'name_servers', label: 'Name Servers' },
    { key: 'mail_service_provider', label: 'Mail Services' },
    { key: 'description', label: 'Description' },
    { key: 'registration_date', label: 'Registration Date' },
    // { key: 'expiry_date', label: 'Expiry Date' },
    { key: 'actions', label: 'Actions' }
  ];

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  const formatNameServers = (nameServers) => {
    if (!nameServers || nameServers.length === 0) return '-';
    return (
      <>
        {nameServers.map((ns, idx) => (
          <div key={idx}>{ns}</div>
        ))}
      </>
    );
  };

  const formatMailServices = (provider, details) => {
    if (!provider) return '-';
    return provider === 'Others' ? `${provider} (${details || ''})` : provider;
  };

 const handleSearch = (e) => {
  if (e.key === 'Enter') {
    setCurrentPage(1); // Optional: trigger filtering
  }
};

  useEffect(() => {
    const fetchDomains = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/all-domains`, {
          params: { search, sort: sortBy, order },
        });

        const formattedDomains = response.data.domains
          .map((domain) => {
            const rawNameServers = Array.isArray(domain.name_servers) ? domain.name_servers : 
              (domain.name_servers ? domain.name_servers.split(',').map(ns => ns.trim()) : []);
            
            return {
              ...domain,
              registration_date: formatDate(domain.registration_date),
              expiry_date: formatDate(domain.expiry_date),
              displayNameServers: formatNameServers(rawNameServers),
              name_servers: rawNameServers,
              mail_service_provider: formatMailServices(domain.mail_service_provider, domain.other_mail_service_details)
            };
          })
          .filter((domain) => {
            const searchTerm = search.toLowerCase();
            return (
              domain.domain_name.toLowerCase().includes(searchTerm) ||
              domain.customer_name.toLowerCase().includes(searchTerm) ||
              domain.registered_with?.toLowerCase().includes(searchTerm) ||
              domain.name_servers?.toLowerCase().includes(searchTerm) ||
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
          setSearch={setSearch}
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
            data={domains.map(domain => {
              // Extract only serializable, unformatted fields for state
              const {
                domain_id,
                domain_name,
                customer_id,
                customer_name,
                registered_with,
                other_provider,
                name_servers,
                mail_service_provider,
                other_mail_service_details,
                description,
                registration_date
              } = domain;
              return {
                ...domain,
                actions: (
                  <div className="flex gap-2">
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id={`tooltip-edit-${domain_id}`}>Edit</Tooltip>}
                    >
                      <Link
                        to={`/${username}/dashboard/domains/edit/${domain_id}`}
                        state={{
                          domain: {
                            domain_id,
                            domain_name,
                            customer_id,
                            customer_name,
                            registered_with,
                            other_provider,
                            name_servers: domain.name_servers,
                            mail_service_provider,
                            other_mail_service_details,
                            description,
                            registration_date
                          }
                        }}
                      >
                        <Button className="bg-black-500 text-black ml-1 p-2 rounded-md hover:bg-blue-600">
                          <FaEdit size={10} />
                        </Button>
                      </Link>
                    </OverlayTrigger>
                  </div>
                )
              };
            })}
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
