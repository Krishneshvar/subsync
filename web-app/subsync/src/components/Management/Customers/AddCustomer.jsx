import React, { useState, useEffect } from "react";
import { Form, Button, Tabs, Tab, Row, Col, InputGroup, Table, Alert } from "react-bootstrap";
import { FaEnvelope, FaPhone } from "react-icons/fa";
import Select from "react-select";
import countryList from "react-select-country-list"; // To get a list of countries
import axios from 'axios';

const AddCustomer = ({ editableCustomerId = null }) => {
  const [activeTab, setActiveTab] = useState("otherDetails");
  const countries = countryList().getData(); // Fetch list of countries
  const [contactPersons, setContactPersons] = useState([]);
  const [states, setStates] = useState([]);
  
  // State for customer data
  const [customerData, setCustomerData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    displayName: "",
    email: "",
    phoneNumber: "",
    gstin: "",
    currencyCode: { label: "INR", value: "INR" },
    address: {
      country: { label: "India", value: "IN" },
      addressLine: "",
      state: null,
      city: "",
      zipCode: "",
    },
    contactPersons: [],
    notes: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");  // For showing errors
  const [successMessage, setSuccessMessage] = useState(""); // For showing success messages


  useEffect(() => {
    if (editableCustomerId) {
      setIsEditing(true);
      fetchCustomerDetails(editableCustomerId);
    }
  }, [editableCustomerId]);

  const fetchCustomerDetails = async (cid) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/customer/${cid}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch customer details: ${response.statusText}`);
      }
      const data = await response.json();
      setCustomerData(data);
      setContactPersons(data.contactPersons || []);
      setStates(data.address.country === "IN" ? indiaStates : []); // Assuming 'IN' for India
    } catch (error) {
      console.error("Error fetching customer details:", error.message);
      setErrorMessage("Error fetching customer details.");
    }
  };

  const handleCancel = () => {
    // Reset the form to initial state
    setFormData({
      salutation: "",
      first_name: "",
      last_name: "",
      primary_email: "",
      primary_phone_number: "",
      customer_address: "",
      company_name: "",
      display_name: "",
      gst_in: "",
      currency_code: "",
      place_of_supply: "",
      gst_treatment: "",
      tax_preference: "",
      exemption_reason: "",
      custom_fields: "",
      notes: ""
    });

    // Optionally redirect or close modal (if needed)
    // history.push("/customer-list");  // If you want to navigate to another page
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerData({
      ...customerData,
      [name]: value,
    });
  };

  const handleSelectChange = (field, value) => {
    setCustomerData({
      ...customerData,
      [field]: value,
    });
  };

  const handleContactPersonChange = (index, field, value) => {
    const updatedContactPersons = [...contactPersons];
    updatedContactPersons[index][field] = value;
    setContactPersons(updatedContactPersons);
  };

  const addContactPerson = () => {
    setContactPersons([
      ...contactPersons,
      { salutation: "", firstName: "", lastName: "", email: "", phone: "" },
    ]);
  };

  const deleteContactPerson = (index) => {
    setContactPersons(contactPersons.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...customerData,
      contactPersons,
    };

    const method = isEditing ? "PUT" : "POST"; // Use PUT for editing, POST for new customer
    const url = isEditing
      ? `${import.meta.env.VITE_API_URL}/update-customer/${customerData.cid}`
      : `${import.meta.env.VITE_API_URL}/create-customer`;

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Failed to save customer details: ${errorDetails}`);
      }

      const savedCustomer = await response.json();
      console.log("Customer saved:", savedCustomer);

      setSuccessMessage("Customer details saved successfully.");
      setErrorMessage(""); // Clear any previous error message

      // If you're editing, update the state with the new data
      if (isEditing) {
        setCustomerData(savedCustomer);
      } else {
        setCustomerData({
          firstName: "",
          lastName: "",
          companyName: "",
          displayName: "",
          email: "",
          phoneNumber: "",
          gstin: "",
          currencyCode: { label: "INR", value: "INR" },
          address: {
            addressLine: "",
            country: { label: "India", value: "IN" },
            region: "",
            city: "",
            state: "",
            zipCode: "",
          },
          contactPersons: [],
          notes: "",
        });
        setContactPersons([]);
      }
    } catch (error) {
      console.error("Error saving customer details:", error.message);
      setErrorMessage("Error saving customer details.");
      setSuccessMessage(""); // Clear success message if there's an error
    }
  };

  const indiaStates = [
    { label: "Delhi", value: "DL" },
    { label: "Maharashtra", value: "MH" },
    { label: "Tamil Nadu", value: "TN" },
    { label: "Karnataka", value: "KA" },
  ];

  return (
    <div className="container mt-4">
      <h2 className="mb-4" style={{ fontWeight: "bold", fontSize: "30px" }}>
         {isEditing ? "Edit Customer" : "Add Customer"}
      </h2>
      <hr style={{ borderWidth: "2px", marginBottom: "30px", borderColor: "#007bff" }} />

      {/* Error and Success Messages */}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      {/* Customer Information */}
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={customerData.firstName}
                onChange={handleInputChange}
                required
                style={{
                  borderRadius: "10px",
                  padding: "12px",
                  border: "1px solid #ccc",
                  fontSize: "16px",
                }}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={customerData.lastName}
                onChange={handleInputChange}
                required
                style={{
                  borderRadius: "10px",
                  padding: "12px",
                  border: "1px solid #ccc",
                  fontSize: "16px",
                }}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                type="text"
                name="companyName"
                value={customerData.companyName}
                onChange={handleInputChange}
                required
                style={{
                  borderRadius: "10px",
                  padding: "12px",
                  border: "1px solid #ccc",
                  fontSize: "16px",
                }}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Customer Display Name</Form.Label>
              <Form.Control
                type="text"
                name="displayName"
                value={customerData.displayName}
                onChange={handleInputChange}
                required
                style={{
                  borderRadius: "10px",
                  padding: "12px",
                  border: "1px solid #ccc",
                  fontSize: "16px",
                }}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <FaEnvelope />
                </InputGroup.Text>
                <Form.Control
                  type="email"
                  name="email"
                  value={customerData.email}
                  onChange={handleInputChange}
                  required
                  style={{
                    borderRadius: "10px",
                    padding: "12px",
                    fontSize: "16px",
                  }}
                />
              </InputGroup>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Phone Number</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <FaPhone />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  name="phoneNumber"
                  value={customerData.phoneNumber}
                  onChange={handleInputChange}
                  required
                  style={{
                    borderRadius: "10px",
                    padding: "12px",
                    fontSize: "16px",
                  }}
                />
              </InputGroup>
            </Form.Group>
          </Col>
        </Row>

        <br/><br/><br/><br/><br/>

        {/* Tabbed Navigation */}
        <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
          {/* Other Details */}
          <Tab eventKey="otherDetails" title="Other Details">
            <Form>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>GSTIN</Form.Label>
                    <Form.Control
                      type="text"
                      name="gstin"
                      value={customerData.gstin}
                      onChange={handleInputChange}
                      required
                      style={{
                        borderRadius: "10px",
                        padding: "12px",
                        fontSize: "16px",
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Currency Code</Form.Label>
                    <Select
                      options={[
                        { label: "INR", value: "INR" },
                        { label: "USD", value: "USD" },
                        { label: "EUR", value: "EUR" },
                      ]}
                      value={customerData.currencyCode}
                      onChange={(e) => handleSelectChange("currencyCode", e)}
                      required
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          borderRadius: "10px",
                          padding: "12px",
                          fontSize: "16px",
                        }),
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Tab>

          {/* Address */}
          <Tab eventKey="address" title="Address">
            <Form>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Address Line</Form.Label>
                    <Form.Control
                      type="text"
                      name="addressLine"
                      value={customerData.address.addressLine}
                      onChange={handleInputChange}
                      required
                      style={{
                        borderRadius: "10px",
                        padding: "12px",
                        fontSize: "16px",
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Country</Form.Label>
                    <Select
                      options={countries}
                      value={customerData.address.country}
                      onChange={(e) => {
                        handleSelectChange("address", { ...customerData.address, country: e });
                        if (e.value === "IN") {
                          setStates(indiaStates);
                        }
                      }}
                      required
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          borderRadius: "10px",
                          padding: "12px",
                          fontSize: "16px",
                        }),
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>State</Form.Label>
                    <Select
                      options={states}
                      value={customerData.address.state}
                      onChange={(e) => handleSelectChange("address", { ...customerData.address, state: e })}
                      required
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          borderRadius: "10px",
                          padding: "12px",
                          fontSize: "16px",
                        }),
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      type="text"
                      name="city"
                      value={customerData.address.city}
                      onChange={handleInputChange}
                      required
                      style={{
                        borderRadius: "10px",
                        padding: "12px",
                        fontSize: "16px",
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Zip Code</Form.Label>
                    <Form.Control
                      type="text"
                      name="zipCode"
                      value={customerData.address.zipCode}
                      onChange={handleInputChange}
                      required
                      style={{
                        borderRadius: "10px",
                        padding: "12px",
                        fontSize: "16px",
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Tab>

          {/* Contact Persons */}
          <Tab eventKey="contactPersons" title="Contact Persons">
            <Table bordered hover>
              <thead>
                <tr>
                  <th>Salutation</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email Address</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contactPersons.map((person, index) => (
                  <tr key={index}>
                    <td>
                      <Form.Control
                        as="select"
                        value={person.salutation}
                        onChange={(e) => handleContactPersonChange(index, "salutation", e.target.value)}
                      >
                        <option>Mr.</option>
                        <option>Ms.</option>
                        <option>Mrs.</option>
                        <option>Dr.</option>
                      </Form.Control>
                    </td>
                    <td>
                      <Form.Control
                        type="text"
                        value={person.firstName}
                        onChange={(e) => handleContactPersonChange(index, "firstName", e.target.value)}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="text"
                        value={person.lastName}
                        onChange={(e) => handleContactPersonChange(index, "lastName", e.target.value)}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="email"
                        value={person.email}
                        onChange={(e) => handleContactPersonChange(index, "email", e.target.value)}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="text"
                        value={person.phone}
                        onChange={(e) => handleContactPersonChange(index, "phone", e.target.value)}
                      />
                    </td>
                    <td>
                      <Button variant="danger" size="sm" onClick={() => deleteContactPerson(index)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Button variant="primary" onClick={addContactPerson}>Add Person</Button>
          </Tab>

          {/* Remarks */}
          <Tab eventKey="remarks" title="Remarks">
            <Form.Group>
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="notes"
                value={customerData.notes}
                onChange={handleInputChange}
                style={{
                  borderRadius: "10px",
                  padding: "12px",
                  fontSize: "16px",
                }}
              />
            </Form.Group>
          </Tab>
        </Tabs>

        {/* Submit Button */}
        <div 
          className="button-section" 
          style={{
             marginTop: "25px",
             backgroundColor: "#f8f9fa", // Light grey background
             padding: "15px", // Adding padding to create some space inside the div
             borderRadius: "8px", // Rounded corners for a softer look
             border: "1px  #ddd", // Light border to distinguish the section
             
             display: "flex",
             justifyContent: "flex-end", // Subtle shadow to give it a slight lift effect
              }}
        >
            <Button variant="primary" type="submit">
              {isEditing ? "Update Customer" : "Save Customer"}
             </Button>

        <Button 
          variant="secondary" 
          type="button" 
          onClick={handleCancel} 
          style={{ marginLeft: "10px" }}
        >
          Cancel
        </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddCustomer;
