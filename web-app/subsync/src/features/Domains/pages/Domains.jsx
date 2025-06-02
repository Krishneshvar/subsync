import { Pencil } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import GenericTable from "@/components/layouts/GenericTable";
import Pagination from "@/components/layouts/Pagination";
import SearchFilterForm from "@/components/layouts/SearchFilterForm";

import { fetchDomains } from "../domainSlice";

function Domains() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const totalPages = 5;
  const { username } = useParams();
  const dispatch = useDispatch();
  const { list: domains, loading, error } = useSelector((state) => state.domains);

  const headers = [
    { key: "domain_name", label: "Domain Name" },
    { key: "customer_name", label: "Customer Name" },
    { key: "registered_with", label: "Registered With" },
    { key: "name_servers", label: "Name Servers" },
    { key: "mail_service_provider", label: "Mail Services" },
    { key: "description", label: "Description" },
    { key: "registration_date", label: "Registration Date" },
    { key: "actions", label: "Actions" }
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-GB");
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    // If it's already in yyyy-MM-dd format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
    
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "";
    
    // Get the date in local timezone
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    return `${day}-${month}-${year}`;
  };

  const formatNameServers = (nameServers) => {
    if (!nameServers || nameServers.length === 0) return "-";
    return nameServers.map((ns, i) => <div key={i}>{ns}</div>);
  };

  const formatMailServices = (provider, details) => {
    if (!provider) return "-";
    return provider === "Others" ? `${provider} (${details || ""})` : provider;
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") setCurrentPage(1);
  };

  const debounceTimeout = useRef();

  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // 500ms debounce
    return () => clearTimeout(debounceTimeout.current);
  }, [search]);

  useEffect(() => {
    // Fetch domains whenever search, sort, order, or page changes
    dispatch(fetchDomains({ search: debouncedSearch, sortBy, order, page: currentPage }));
  }, [dispatch, debouncedSearch, sortBy, order, currentPage]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 shadow-lg rounded-lg">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
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
        <Link to="add">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white w-full sm:w-auto">
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
        <div className="flex justify-center items-center my-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
        </div>
      ) : domains.length > 0 ? (
        <>
          <GenericTable
            headers={headers}
            data={domains.map((domain) => {
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
                registration_date: formatDateForInput(domain.registration_date),
                actions: (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
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
                              name_servers,
                              mail_service_provider,
                              other_mail_service_details,
                              description,
                              registration_date
                            }
                          }}
                        >
                          <Button size="icon" variant="outline" className="ml-1">
                            <Pencil size={12} />
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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

export default Domains;
