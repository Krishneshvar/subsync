import { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import Select from "react-select";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddDomain() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    domainName: "",
    description: "",
    customerId: "",
    registrationDate: "",
    expiryDate: "",
    registeredWith: "",
    otherProvider: "",
    nameServer: "",
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

  const formatDateToISO = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchAllCustomers = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/all-customers`);
        if (res.data.customers) {
          const options = res.data.customers.map((customer) => ({
            value: customer.customer_id,
            label: customer.display_name,
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
      setFormData({
        domainName: domain.domain_name,
        description: domain.description || "",
        customerId: domain.customer_id,
        registrationDate: formatDateToISO(domain.registration_date),
        expiryDate: formatDateToISO(domain.expiry_date),
        registeredWith: domain.registered_with,
        otherProvider: domain.other_provider || "",
        nameServer: domain.name_server || "",
      });
      setSelectedCustomer({
        value: domain.customer_id,
        label: domain.customer_name,
      });
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customerId) {
      toast.error("Please select a customer.");
      return;
    }
    if (!formData.domainName || !formData.registrationDate || !formData.expiryDate || !formData.registeredWith) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const submissionData = {
      customer_id: formData.customerId,
      customer_name: selectedCustomer?.label || "",
      domain_name: formData.domainName,
      registration_date: formData.registrationDate,
      expiry_date: formData.expiryDate,
      registered_with: formData.registeredWith,
      other_provider: formData.registeredWith !== "Others" ? "" : formData.otherProvider,
      name_server: formData.nameServer || "",
      description: formData.description || "",
    };

    try {
      if (isEditing) {
        await axios.put(`${import.meta.env.VITE_API_URL}/update-domain/${domainId}`, submissionData);
        toast.success("Domain successfully updated!", { autoClose: 3000 });
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/create-domain`, submissionData);
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
                <Form.Label>Expiry Date</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
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
            <Col xs={12} sm={6}>
              <Form.Group className="mb-3">
                <Form.Label>Name Server (Optional)</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.nameServer}
                  onChange={(e) => setFormData({ ...formData, nameServer: e.target.value })}
                  placeholder="Enter name server"
                />
              </Form.Group>
            </Col>
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
