import { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import Select from "react-select";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "@/api/axiosInstance";
import { FaPlus, FaTrash } from "react-icons/fa";

export default function AddDomain() {
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
    const fetchAllCustomers = async () => {
      try {
        const res = await api.get(`/all-customers`);
        if (res.data.customers) {
          const options = res.data.customers.map((customer) => ({
            value: customer.customer_id,
            label: customer.company_name,
            customerId: customer.customer_id,
          }));
          setAllCustomers(options);
          setFilteredCustomers(options);
        } else {
          setAllCustomers([]);
          setFilteredCustomers([]);
        }
      } catch (err) {
        toast.error("Failed to fetch customers. Please try again.");
        console.error("Error fetching customers:", err);
      }
    };

    fetchAllCustomers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCustomers(allCustomers);
    } else {
      const filtered = allCustomers.filter((customer) =>
        customer.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
  }, [searchTerm, allCustomers]);

  useEffect(() => {
    const state = location.state;
    if (state && state.domain) {
      const domain = state.domain;
      setIsEditing(true);
      setDomainId(domain.domain_id);

      // Ensure nameServers is always an array of strings
      let nameServers = [];
      if (Array.isArray(domain.name_servers)) {
        nameServers = domain.name_servers.filter(ns => ns !== null && ns !== undefined && ns.trim() !== '');
      } else if (typeof domain.name_servers === 'string') {
        nameServers = domain.name_servers.split(',').map(ns => ns.trim()).filter(ns => ns !== '');
      }
      // Ensure there's at least one empty field if no name servers
      nameServers = nameServers.length > 0 ? nameServers : [''];

      // Format the registration date
      let formattedDate = '';
      if (domain.registration_date) {
        try {
          // Check if the date is already in ISO format
          if (domain.registration_date.match(/^\d{4}-\d{2}-\d{2}$/)) {
            formattedDate = domain.registration_date;
          } else {
            formattedDate = formatDateToISO(domain.registration_date);
          }
        } catch (error) {
          console.error('Error formatting date:', error);
          formattedDate = '';
        }
      }

      console.log('Setting name servers:', nameServers); // Debug log

      setFormData({
        domainName: domain.domain_name || '',
        description: domain.description || '',
        customerId: domain.customer_id || '',
        registrationDate: formattedDate,
        registeredWith: domain.registered_with || '',
        otherProvider: domain.other_provider || '',
        nameServers: nameServers,
        mailServices: domain.mail_service_provider || '',
        mailServicesOther: domain.other_mail_service_details || ''
      });
      
      setSelectedCustomer({
        value: domain.customer_id,
        label: domain.customer_name,
      });
    }
  }, [location.state]);

  const handleNameServerChange = (index, value) => {
    const updatedNameServers = [...formData.nameServers];
    updatedNameServers[index] = value;
    setFormData({
      ...formData,
      nameServers: updatedNameServers
    });
  };

  const addNameServer = () => {
    setFormData({
      ...formData,
      nameServers: [...formData.nameServers, ""]
    });
  };

  const removeNameServer = (index) => {
    if (formData.nameServers.length > 1) {
      const updatedNameServers = formData.nameServers.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        nameServers: updatedNameServers
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customerId) {
      toast.error("Please select a customer.");
      return;
    }
    if (!formData.domainName || !formData.registrationDate || !formData.registeredWith) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Filter out empty name servers
    const filteredNameServers = formData.nameServers.filter(ns => ns.trim() !== "");

    const submissionData = {
      customer_id: formData.customerId,
      customer_name: selectedCustomer?.label || "",
      domain_name: formData.domainName,
      registration_date: formData.registrationDate,
      registered_with: formData.registeredWith,
      other_provider: formData.registeredWith !== "Others" ? "" : formData.otherProvider,
      name_servers: filteredNameServers,
      description: formData.description || "",
      mail_service_provider: formData.mailServices || "",
      mail_services_other: formData.mailServices === "Others" ? formData.mailServicesOther : ""
    };

    try {
      if (isEditing) {
        await api.put(`/update-domain/${domainId}`, submissionData);
        toast.success("Domain successfully updated!", { autoClose: 3000 });
      } else {
        await api.post(`/create-domain`, submissionData);
        toast.success("Domain successfully created!", { autoClose: 3000 });
      }

      setTimeout(() => {
        const userSegment = location.pathname.split("/")[1];
        navigate(`/${userSegment}/dashboard/domains`);
      }, 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred while processing the domain.");
    }
  };

  return (
    <>
      <div className="container mt-4">
        <ToastContainer position="top-center" autoClose={2000} theme="dark" transition={Bounce} pauseOnHover />
        <h1 className="mb-4 text-3xl font-bold ">{isEditing ? "Edit Domain" : "Add Domain"}</h1>
        <hr className="mb-4 border-blue-500 border-3 size-auto" />
        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col xs={12} sm={6}>
              <Form.Group className="mb-3">
                <Form.Label>Customer Name</Form.Label>
                <Select
                  options={filteredCustomers}
                  onInputChange={(value, { action }) => {
                    if (action === "input-change") {
                      setSearchTerm(value);
                    }
                  }}
                  onChange={(selected) => {
                    setFormData({ ...formData, customerId: selected?.value || "" });
                    setSelectedCustomer(selected);
                  }}
                  value={selectedCustomer}
                  placeholder="Search and select a customer"
                  isClearable
                />
                {selectedCustomer && (
                  <small className="text-muted">Customer ID: {selectedCustomer.value}</small>
                )}
              </Form.Group>
            </Col>
            <Col xs={12} sm={6}>
              <Form.Group className="mb-3">
                <Form.Label>Domain Name</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.domainName}
                  onChange={(e) => setFormData({ ...formData, domainName: e.target.value })}
                  required
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={6}>
              <Form.Group className="mb-3">
                <Form.Label>Registration Date</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.registrationDate}
                  onChange={(e) => setFormData({ ...formData, registrationDate: e.target.value })}
                  required
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={6}>
              <Form.Group className="mb-3">
                <Form.Label>Registered With</Form.Label>
                <Select
                  options={registeredWithOptions}
                  value={registeredWithOptions.find((opt) => opt.value === formData.registeredWith)}
                  onChange={(selected) =>
                    setFormData({
                      ...formData,
                      registeredWith: selected.value,
                      otherProvider: selected.value === "Others" ? formData.otherProvider : "",
                    })
                  }
                  placeholder="Select Registrar"
                  isClearable
                />
              </Form.Group>
            </Col>
            {formData.registeredWith === "Others" && (
              <Col xs={12} sm={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Specify Other Registrar</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.otherProvider}
                    onChange={(e) => setFormData({ ...formData, otherProvider: e.target.value })}
                    placeholder="Enter registrar name"
                  />
                </Form.Group>
              </Col>
            )}
            <Col xs={12}>
              <Form.Group className="mb-3">
                <Form.Label>Name Servers</Form.Label>
                {formData.nameServers.map((nameServer, index) => (
                  <div key={index} className="d-flex mb-2 align-items-center">
                    <div className="col-md-6">
                      <Form.Control
                        type="text"
                        value={nameServer}
                        onChange={(e) => handleNameServerChange(index, e.target.value)}
                        placeholder="Enter name server"
                        className="me-2"
                      />
                    </div>
                    <Button
                      variant="outline-danger"
                      onClick={() => removeNameServer(index)}
                      disabled={formData.nameServers.length === 1}
                      className="me-2"
                    >
                      <FaTrash />
                    </Button>
                    {index === formData.nameServers.length - 1 && (
                      <Button variant="outline-primary" onClick={addNameServer}>
                        <FaPlus />
                      </Button>
                    )}
                  </div>
                ))}
              </Form.Group>
            </Col>
            <Col xs={12} sm={6}>
              <Form.Group className="mb-3">
                <Form.Label>Mail Services</Form.Label>
                <Select
                  options={mailServicesOptions}
                  value={mailServicesOptions.find(option => option.value === formData.mailServices)}
                  onChange={(selected) => setFormData({ ...formData, mailServices: selected?.value || "" })}
                  isClearable
                />
              </Form.Group>
            </Col>
            {formData.mailServices === "Others" && (
              <Col xs={12} sm={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Specify Other Mail Service</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.mailServicesOther}
                    onChange={(e) => setFormData({ ...formData, mailServicesOther: e.target.value })}
                    placeholder="Please specify the mail service"
                  />
                </Form.Group>
              </Col>
            )}
            <Col xs={12}>
              <Form.Group className="mb-3">
                <Form.Label>Description (Optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Form.Group>
            </Col>
          </Row>
          <Button variant="primary" type="submit" className="mt-3">
            {isEditing ? "Update" : "Submit"}
          </Button>
        </Form>
      </div>
    </>
  );
}
