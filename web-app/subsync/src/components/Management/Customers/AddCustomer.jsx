import React, { useState, useEffect } from "react";
import { Alert, Form, Tabs, Tab, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import countryList from "react-select-country-list";
import axios from "axios";

import validateCustomerData from "./FormComponents/Validators";
import OtherDetails from "./FormComponents/OtherDetails";
import PersonalDetails from "./FormComponents/PersonalDetails";
import CompanyDetails from "./FormComponents/CompanyDetails";
import AddressSection from "./FormComponents/AddressSection";
import ContactPersonsSection from "./FormComponents/ContactPersonsSection";
import RemarksSection from "./FormComponents/RemarksSection";

const AddCustomer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editableCustomerId = location.state?.editableCustomerId || null;

  const countries = countryList().getData();
  const [states, setStates] = useState([]);
  const [contactPersons, setContactPersons] = useState([]);
  const [activeTab, setActiveTab] = useState("otherDetails");
  const [isEditing, setIsEditing] = useState(!!editableCustomerId);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [customerData, setCustomerData] = useState({
    salutation: "",
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
    notes: "",
  });

  const resetCustomerData = () => {
    setCustomerData({
      salutation: "",
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
      notes: "",
    });
    setContactPersons([]); // Clear contact persons as well
  };  

  useEffect(() => {
    // Fetch data for edit mode
    const fetchCustomerData = async () => {
      if (!editableCustomerId) return;

      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/customer/${editableCustomerId}`
        );

        if (response.status !== 200) {
          throw new Error("Failed to fetch customer data.");
        }

        const data = response.data.customer;
        setCustomerData({
          salutation: data.salutation,
          firstName: data.first_name,
          lastName: data.last_name,
          companyName: data.company_name,
          displayName: data.display_name,
          email: data.primary_email,
          phoneNumber: data.primary_phone_number,
          gstin: data.gst_in,
          gst_treatment: data.gst_treatment,
          tax_preference: data.tax_preference,
          exemption_reason: data.exemption_reason,
          currencyCode: { label: data.currency_code, value: data.currency_code },
          address: {
            country: { label: data.customer_address.country.label, value: data.customer_address.country.value },
            addressLine: data.customer_address.addressLine,
            state: { label: data.customer_address.state.label, value: data.customer_address.state.value },
            city: data.customer_address.city,
            zipCode: data.customer_address.zipCode,
          },
          notes: data.notes,
        });

        setContactPersons(data.other_contacts || []);
        setLoading(false);
      } catch (error) {
        setErrorMessage(error.message || "Failed to fetch customer data.");
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [editableCustomerId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");

    if (keys.length > 1) {
      setCustomerData((prevData) => ({
        ...prevData,
        [keys[0]]: {
          ...prevData[keys[0]],
          [keys[1]]: value,
        },
      }));
    } else {
      setCustomerData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSelectChange = (field, value) => {
    setCustomerData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      validateCustomerData(customerData);

      const payload = {
        ...customerData,
        contactPersons: contactPersons.map((person) => ({
          salutation: person.salutation,
          first_name: person.first_name,
          last_name: person.last_name,
          email: person.email,
          phone_number: person.phone_number,
        })),
      };

      const url = isEditing
        ? `${import.meta.env.VITE_API_URL}/update-customer/${editableCustomerId}`
        : `${import.meta.env.VITE_API_URL}/create-customer`;

      const response = await axios({
        url,
        method: isEditing ? "PUT" : "POST",
        data: payload,
      });

      if (response.status !== 200) {
        throw new Error("Error saving customer details.");
      }

      setSuccessMessage(
        isEditing ? "Customer Updated Successfully." : "Customer Created Successfully."
      );
      setErrorMessage("");
      if (!isEditing) resetCustomerData();
      setTimeout(() => navigate("customers"), 2000);
    } catch (error) {
      setErrorMessage(error.message || "Error saving customer details.");
      setSuccessMessage("");
    }
  };

  if (loading) return <p>Loading customer details...</p>;

  return (
    <div className="container mt-4">
      <h1 className="mb-4">{isEditing ? "Edit Customer" : "Add Customer"}</h1>

      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <Form onSubmit={handleSubmit}>
        <PersonalDetails
          customerData={customerData}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
        />
        <CompanyDetails
          customerData={customerData}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
        />
        <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
          <Tab eventKey="otherDetails" title="Other Details">
            <OtherDetails
              customerData={customerData}
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
            />
          </Tab>
          <Tab eventKey="address" title="Address">
            <AddressSection
              customerData={customerData}
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
              countries={countries}
              states={states}
              setStates={setStates}
            />
          </Tab>
          <Tab eventKey="contactPersons" title="Contact Persons">
            <ContactPersonsSection
              contactPersons={contactPersons}
              setContactPersons={setContactPersons}
            />
          </Tab>
          <Tab eventKey="remarks" title="Remarks">
            <RemarksSection
              customerData={customerData}
              handleInputChange={handleInputChange}
            />
          </Tab>
        </Tabs>

        <div className="button-section" style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="primary" type="submit">
            {isEditing ? "Update Customer" : "Save Customer"}
          </Button>
          <Button
            variant="secondary"
            type="button"
            onClick={resetCustomerData}
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
