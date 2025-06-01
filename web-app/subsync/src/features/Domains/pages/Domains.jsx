import { Pencil } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import GenericTable from "@/components/layouts/GenericTable";
import Pagination from "@/components/layouts/Pagination";
import SearchFilterForm from "@/components/layouts/SearchFilterForm";

import api from "@/lib/axiosInstance.js";

function Domains() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [domains, setDomains] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;
  const { username } = useParams();

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
    return new Date(dateString).toLocaleDateString("en-GB");
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

  useEffect(() => {
    async function fetchDomains() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/all-domains", {
          params: { search, sort: sortBy, order }
        });

        const formattedDomains = res.data.domains
          .map((d) => {
            const rawNameServers = Array.isArray(d.name_servers)
              ? d.name_servers
              : (d.name_servers ? d.name_servers.split(",").map(ns => ns.trim()) : []);
            return {
              ...d,
              registration_date: formatDate(d.registration_date),
              expiry_date: formatDate(d.expiry_date),
              displayNameServers: formatNameServers(rawNameServers),
              name_servers: rawNameServers,
              mail_service_provider: formatMailServices(d.mail_service_provider, d.other_mail_service_details)
            };
          })
          .filter((d) => {
            const term = search.toLowerCase();
            return (
              d.domain_name.toLowerCase().includes(term) ||
              d.customer_name.toLowerCase().includes(term) ||
              d.registered_with?.toLowerCase().includes(term) ||
              d.name_servers?.toString().toLowerCase().includes(term) ||
              d.description?.toLowerCase().includes(term) ||
              d.registration_date.includes(term) ||
              d.expiry_date.includes(term)
            );
          });

        setDomains(formattedDomains);
      } catch (err) {
        setError("Failed to fetch domains. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchDomains();
  }, [search, sortBy, order, currentPage]);

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
