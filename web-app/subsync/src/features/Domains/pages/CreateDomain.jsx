import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer, Bounce } from "react-toastify";
import Select from "react-select";
import { FaPlus, FaTrash } from "react-icons/fa";
import api from "@/api/axiosInstance";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

function AddDomain() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    domainName: "",
    description: "",
    customerId: "",
    registrationDate: "",
    registeredWith: "",
    otherProvider: "",
    nameServers: [""],
    mailServices: "",
    mailServicesOther: ""
  });

  const [allCustomers, setAllCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [domainId, setDomainId] = useState(null);

  const registeredWithOptions = [
    { value: "OCS", label: "OCS" },
    { value: "Direct Customer", label: "Direct Customer" },
    { value: "Winds", label: "Winds" },
    { value: "Others", label: "Others" },
  ];

  const mailServicesOptions = [
    { value: "ResellerClub", label: "ResellerClub" },
    { value: "GWS", label: "GWS" },
    { value: "Business email", label: "Business email" },
    { value: "Microsoft", label: "Microsoft" },
    { value: "Others", label: "Others" },
  ];

  const formatDateToISO = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    async function fetchAllCustomers() {
      try {
        const res = await api.get("/all-customers");
        const options = res.data.customers?.map(c => ({
          value: c.customer_id,
          label: c.company_name,
        })) || [];
        setAllCustomers(options);
        setFilteredCustomers(options);
      } catch (err) {
        toast.error("Failed to fetch customers.");
      }
    }
    fetchAllCustomers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") return setFilteredCustomers(allCustomers);
    setFilteredCustomers(allCustomers.filter(c =>
      c.label.toLowerCase().includes(searchTerm.toLowerCase())
    ));
  }, [searchTerm, allCustomers]);

  useEffect(() => {
    const state = location.state;
    if (state?.domain) {
      const d = state.domain;
      setIsEditing(true);
      setDomainId(d.domain_id);
      setFormData({
        domainName: d.domain_name || "",
        description: d.description || "",
        customerId: d.customer_id || "",
        registrationDate: /^\d{4}-\d{2}-\d{2}$/.test(d.registration_date)
          ? d.registration_date
          : formatDateToISO(d.registration_date),
        registeredWith: d.registered_with || "",
        otherProvider: d.other_provider || "",
        nameServers: Array.isArray(d.name_servers)
          ? d.name_servers.filter(Boolean)
          : d.name_servers?.split(",").map(ns => ns.trim()).filter(Boolean) || [""],
        mailServices: d.mail_service_provider || "",
        mailServicesOther: d.other_mail_service_details || ""
      });
      setSelectedCustomer({ value: d.customer_id, label: d.customer_name });
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerId || !formData.domainName || !formData.registrationDate || !formData.registeredWith) {
      return toast.error("Please fill all required fields.");
    }

    const payload = {
      customer_id: formData.customerId,
      customer_name: selectedCustomer?.label,
      domain_name: formData.domainName,
      registration_date: formData.registrationDate,
      registered_with: formData.registeredWith,
      other_provider: formData.registeredWith === "Others" ? formData.otherProvider : "",
      name_servers: formData.nameServers.filter(ns => ns.trim() !== ""),
      description: formData.description,
      mail_service_provider: formData.mailServices,
      mail_services_other: formData.mailServices === "Others" ? formData.mailServicesOther : ""
    };

    try {
      if (isEditing) {
        await api.put(`/update-domain/${domainId}`, payload);
        toast.success("Domain updated!");
      } else {
        await api.post("/create-domain", payload);
        toast.success("Domain created!");
      }

      setTimeout(() => {
        const userSegment = location.pathname.split("/")[1];
        navigate(`/${userSegment}/dashboard/domains`);
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    }
  };

  const handleNameServerChange = (index, value) => {
    const ns = [...formData.nameServers];
    ns[index] = value;
    setFormData({ ...formData, nameServers: ns });
  };

  const addNameServer = () => {
    setFormData({ ...formData, nameServers: [...formData.nameServers, ""] });
  };

  const removeNameServer = (index) => {
    if (formData.nameServers.length === 1) return;
    setFormData({ ...formData, nameServers: formData.nameServers.filter((_, i) => i !== index) });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <ToastContainer position="top-center" autoClose={2000} transition={Bounce} theme="dark" />
      <h1 className="text-3xl font-bold mb-4">{isEditing ? "Edit Domain" : "Add Domain"}</h1>
      <hr className="mb-6 border-blue-500" />
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Name */}
        <div>
          <Label>Customer Name</Label>
          <Select
            options={filteredCustomers}
            onInputChange={(val, { action }) => action === "input-change" && setSearchTerm(val)}
            onChange={(s) => {
              setFormData({ ...formData, customerId: s?.value || "" });
              setSelectedCustomer(s);
            }}
            value={selectedCustomer}
            placeholder="Search customer"
            isClearable
          />
          {selectedCustomer && (
            <p className="text-xs text-muted-foreground mt-1">Customer ID: {selectedCustomer.value}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Domain Name</Label>
            <Input required value={formData.domainName} onChange={(e) => setFormData({ ...formData, domainName: e.target.value })} />
          </div>
          <div>
            <Label>Registration Date</Label>
            <Input type="date" required value={formData.registrationDate} onChange={(e) => setFormData({ ...formData, registrationDate: e.target.value })} />
          </div>
          <div>
            <Label>Registered With</Label>
            <Select
              options={registeredWithOptions}
              value={registeredWithOptions.find(opt => opt.value === formData.registeredWith)}
              onChange={(s) =>
                setFormData({
                  ...formData,
                  registeredWith: s?.value || "",
                  otherProvider: s?.value === "Others" ? formData.otherProvider : ""
                })
              }
              isClearable
              placeholder="Select registrar"
            />
          </div>
          {formData.registeredWith === "Others" && (
            <div>
              <Label>Other Registrar</Label>
              <Input value={formData.otherProvider} onChange={(e) => setFormData({ ...formData, otherProvider: e.target.value })} />
            </div>
          )}
        </div>

        {/* Name Servers */}
        <div>
          <Label>Name Servers</Label>
          {formData.nameServers.map((ns, index) => (
            <div key={index} className="flex items-center gap-2 mt-2">
              <Input value={ns} onChange={(e) => handleNameServerChange(index, e.target.value)} placeholder="Enter name server" />
              <Button variant="destructive" type="button" size="icon" onClick={() => removeNameServer(index)} disabled={formData.nameServers.length === 1}>
                <FaTrash className="w-3 h-3" />
              </Button>
              {index === formData.nameServers.length - 1 && (
                <Button type="button" size="icon" onClick={addNameServer}>
                  <FaPlus className="w-3 h-3" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Mail Services</Label>
            <Select
              options={mailServicesOptions}
              value={mailServicesOptions.find(opt => opt.value === formData.mailServices)}
              onChange={(s) => setFormData({ ...formData, mailServices: s?.value || "" })}
              isClearable
            />
          </div>
          {formData.mailServices === "Others" && (
            <div>
              <Label>Other Mail Service</Label>
              <Input value={formData.mailServicesOther} onChange={(e) => setFormData({ ...formData, mailServicesOther: e.target.value })} />
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <Label>Description (optional)</Label>
          <Textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
        </div>

        <div className="pt-6">
          <Button type="submit">{isEditing ? "Update Domain" : "Create Domain"}</Button>
        </div>
      </form>
    </div>
  );
}

export default AddDomain;
