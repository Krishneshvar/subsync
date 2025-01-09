import React, { useState, useEffect } from "react";
import { Form, Button, Tabs, Tab, Row, Col, InputGroup, Table, Alert } from "react-bootstrap";
import { FaEnvelope, FaPhone } from "react-icons/fa";
import Select from "react-select";
import countryList from "react-select-country-list"; // To get a list of countries
import axios from 'axios';

const AddCustomer = () => {
  const [activeTab, setActiveTab] = useState("otherDetails");
  const editableCustomerId = location.state?.editableCustomerId || null;  
  const countries = countryList().getData();
  const [contactPersons, setContactPersons] = useState([]);
  const [states, setStates] = useState([]);

  const [customerData, setCustomerData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    displayName: "",
    email: "",
    phoneNumber: "",
    gstin: "",
    gst_treatment: "",
    tax_preference: "",
    exemption_reason: "",
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
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (editableCustomerId) {
      console.log(editableCustomerId);
      setIsEditing(true);
      fetchCustomerDetails(editableCustomerId);
    }else{
      setIsEditing(false);
      resetCustomerData();
    }
  }, [editableCustomerId]);

  const resetCustomerData = () => {
    setCustomerData({
      firstName: "",
      lastName: "",
      companyName: "",
      displayName: "",
      email: "",
      phoneNumber: "",
      gstin: "",
      gst_treatment: "",
      tax_preference: "",
      exemption_reason: "",
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
  };

  const fetchCustomerDetails = async (cid) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/customer/${cid}`
      );
      console.log("Retrieved data: ", response.data);
  
      const customer = response.data.customer; // Adjust based on your API structure
  
      setCustomerData({
        firstName: customer.first_name,
        lastName: customer.last_name,
        companyName: customer.company_name,
        displayName: customer.display_name,
        email: customer.primary_email,
        phoneNumber: customer.primary_phone_number,
        gstin: customer.gst_in,
        gst_treatment: customer.gst_treatment,
        tax_preference: customer.tax_preference,
        exemption_reason: customer.exemption_reason,
        currencyCode: { label: customer.currency_code, value: customer.currency_code },
        address: {
          country: { label: customer.customer_address.country, value: customer.customer_address.country },
          addressLine: customer.customer_address.addressLine,
          state: customer.customer_address.state,
          city: customer.customer_address.city,
          zipCode: customer.customer_address.zipCode,
        },
        contactPersons: customer.other_contacts || [],
        notes: customer.notes || "",
      });
      setContactPersons(customer.other_contacts || []);
      setStates(customer.customer_address.country === "IN" ? indiaStates : []);
    } catch (error) {
      console.error("Error fetching customer details:", error);
      setErrorMessage("Error fetching customer details.");
    }
  };
  

  const handleCancel = () => {
    setCustomerData({
      salutation: "Mr.",
      firstName: "",
      lastName: "",
      companyName: "",
      displayName: "",
      email: "",
      phoneNumber: "",
      gstin: "",
      currencyCode: "INR",
      address: {
        country: "India",
        addressLine: "",
        state: "Tamil Nadu",
        city: "",
        zipCode: "",
      },
      contactPersons: [],
      notes: "",
    });
    setContactPersons([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");

    if (keys.length > 1) {
      setCustomerData((prevData) => ({
        ...prevData,
        [keys[0]]: {
          ...prevData[keys[0]],
          [keys[1]]: value
        }
      }));
    } else {
      setCustomerData((prevData) => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleSelectChange = (field, value) => {
    setCustomerData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleContactPersonChange = (index, field, value) => {
    const updatedContactPersons = [...contactPersons];
    updatedContactPersons[index][field] = value;
    setContactPersons(updatedContactPersons);
  };

  const addContactPerson = () => {
    setContactPersons([...
      contactPersons,
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
  
    console.log('Payload being sent:', payload);
  
    const url = isEditing
      ? `${import.meta.env.VITE_API_URL}/update-customer/${editableCustomerId}`
      : `${import.meta.env.VITE_API_URL}/create-customer`;
  
    try {
      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error("Error saving customer details.");
      }
  
      setSuccessMessage("Customer details saved successfully.");
      setErrorMessage("");
      if (!isEditing) handleCancel();
    } catch (error) {
      setErrorMessage(error.message || "Error saving customer details.");
      setSuccessMessage("");
    }
  };  

  const indiaStates = [
    { label: "Andhra Pradesh", value: "AP" },
    { label: "Arunachal Pradesh", value: "AR" },
    { label: "Assam", value: "AS" },
    { label: "Bihar", value: "BR" },
    { label: "Chhattisgarh", value: "CG" },
    { label: "Goa", value: "GA" },
    { label: "Gujarat", value: "GJ" },
    { label: "Haryana", value: "HR" },
    { label: "Himachal Pradesh", value: "HP" },
    { label: "Jharkhand", value: "JH" },
    { label: "Karnataka", value: "KA" },
    { label: "Kerala", value: "KL" },
    { label: "Madhya Pradesh", value: "MP" },
    { label: "Maharashtra", value: "MH" },
    { label: "Manipur", value: "MN" },
    { label: "Meghalaya", value: "ML" },
    { label: "Mizoram", value: "MZ" },
    { label: "Nagaland", value: "NL" },
    { label: "Odisha", value: "OR" },
    { label: "Punjab", value: "PB" },
    { label: "Rajasthan", value: "RJ" },
    { label: "Sikkim", value: "SK" },
    { label: "Tamil Nadu", value: "TN" },
    { label: "Telangana", value: "TG" },
    { label: "Tripura", value: "TR" },
    { label: "Uttar Pradesh", value: "UP" },
    { label: "Uttarakhand", value: "UK" },
    { label: "West Bengal", value: "WB" },
    { label: "Andaman and Nicobar Islands", value: "AN" },
    { label: "Chandigarh", value: "CH" },
    { label: "Dadra and Nagar Haveli and Daman and Diu", value: "DN" },
    { label: "Delhi", value: "DL" },
    { label: "Jammu and Kashmir", value: "JK" },
    { label: "Ladakh", value: "LA" },
    { label: "Lakshadweep", value: "LD" },
    { label: "Puducherry", value: "PY" },
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
          <Col md={2}>
            <Form.Group>
              <Form.Label>Salutation</Form.Label>
              <Select
                options={[
                  { label: "Mr.", value: "Mr." },
                  { label: "Ms.", value: "Ms." },
                  { label: "Mrs.", value: "Mrs." },
                  { label: "Dr.", value: "Dr." },
                ]}
                value={customerData.salutation ? { label: customerData.salutation, value: customerData.salutation } : null}
                onChange={(e) => handleSelectChange("salutation", e.value)}
                required
                styles={{
                  control: (provided) => ({
                    ...provided,
                    borderRadius: "10px",
                    padding: "10px",
                    fontSize: "16px",
                  }),
                }}
              />
            </Form.Group>
          </Col>
          <Col md={5}>
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
          <Col md={5}>
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
                      value={
                        customerData.currencyCode && typeof customerData.currencyCode === 'string' 
                          ? { label: customerData.currencyCode, value: customerData.currencyCode }
                          : null
                      }
                      onChange={(e) => handleSelectChange("currencyCode", e.value)}
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
                    <Form.Label>GST Treatment</Form.Label> 
                    <Select
                      options={[
                        { label: "iGST", value: "iGST" },
                        { label: "CGST & SGST", value: "CGST & SGST" },
                        { label: "No GST", value: "No GST" },
                      ]}
                      value={
                        customerData.gst_treatment && typeof customerData.gst_treatment === 'string' 
                          ? { label: customerData.gst_treatment, value: customerData.gst_treatment }
                          : null
                      }
                      onChange={(e) => handleSelectChange("gst_treatment", e.value)}
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
                    <Form.Label>Tax Preference</Form.Label> 
                    <Select
                      options={[
                        { label: "Taxable", value: "Taxable" },
                        { label: "Tax Exempt", value: "Tax Exempt" },
                      ]}
                      value={
                        customerData.tax_preference && typeof customerData.tax_preference === 'string' 
                          ? { label: customerData.tax_preference, value: customerData.tax_preference }
                          : null
                      }
                      onChange={(e) => handleSelectChange("tax_preference", e.value)}
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
              {
                (customerData.tax_preference === "Tax Exempt" )
                ? (
                  <Row className="mb-3">
                    <Col>
                      <Form.Group>
                        <Form.Label>Tax Exemption Reason</Form.Label>
                        <Form.Control
                          type="text"
                          name="exemption_reason"
                          value={customerData.exemption_reason}
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
                ) : (
                  null
                )
              }
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
                      name="address.addressLine"
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
                      value={
                        customerData.address.country && typeof customerData.address.country === 'string' 
                          ? { label: customerData.address.country, value: customerData.address.country }
                          : null
                      }
                      onChange={(e) => {
                        handleSelectChange("address", { ...customerData.address, country: e.value });
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
                      options={indiaStates}
                      value={
                        customerData.address.state && typeof customerData.address.state === 'string' 
                          ? { label: customerData.address.state, value: customerData.address.state }
                          : null
                      }
                      onChange={(e) => handleSelectChange("address", { ...customerData.address, state: e.value })}
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
                      name="address.city"
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
                      name="address.zipCode"
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
