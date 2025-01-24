import React from "react";
import { Row, Col, Form } from "react-bootstrap"; // For layout and form components
import Select from "react-select"; // For the country and state dropdowns

const AddressSection = ({
  customerData = {},
  handleInputChange,
  handleSelectChange,
  countries,
  states,
  setStates,
}) => {
  const handleCountryChange = (selectedOption) => {
    // Save only the value of the selected country
    handleSelectChange("address", {
      ...customerData.address,
      country: selectedOption.value, // Save only the value
      state: "", // Reset state when country changes
    });

    const indianStates = [
      { label: "Andhra Pradesh", value: "Andhra Pradesh" },
      { label: "Arunachal Pradesh", value: "Arunachal Pradesh" },
      { label: "Assam", value: "Assam" },
      { label: "Bihar", value: "Bihar" },
      { label: "Chhattisgarh", value: "Chhattisgarh" },
      { label: "Goa", value: "Goa" },
      { label: "Gujarat", value: "Gujarat" },
      { label: "Haryana", value: "Haryana" },
      { label: "Himachal Pradesh", value: "Himachal Pradesh" },
      { label: "Jharkhand", value: "Jharkhand" },
      { label: "Karnataka", value: "Karnataka" },
      { label: "Kerala", value: "Kerala" },
      { label: "Madhya Pradesh", value: "Madhya Pradesh" },
      { label: "Maharashtra", value: "Maharashtra" },
      { label: "Manipur", value: "Manipur" },
      { label: "Meghalaya", value: "Meghalaya" },
      { label: "Mizoram", value: "Mizoram" },
      { label: "Nagaland", value: "Nagaland" },
      { label: "Odisha", value: "Odisha" },
      { label: "Punjab", value: "Punjab" },
      { label: "Rajasthan", value: "Rajasthan" },
      { label: "Sikkim", value: "Sikkim" },
      { label: "Tamil Nadu", value: "Tamil Nadu" },
      { label: "Telangana", value: "Telangana" },
      { label: "Tripura", value: "Tripura" },
      { label: "Uttar Pradesh", value: "Uttar Pradesh" },
      { label: "Uttarakhand", value: "Uttarakhand" },
      { label: "West Bengal", value: "West Bengal" },
      { label: "Andaman and Nicobar Islands", value: "Andaman and Nicobar Islands" },
      { label: "Chandigarh", value: "Chandigarh" },
      { label: "Dadra and Nagar Haveli and Daman and Diu", value: "Dadra and Nagar Haveli and Daman and Diu" },
      { label: "Delhi", value: "Delhi" },
      { label: "Jammu and Kashmir", value: "Jammu and Kashmir" },
      { label: "Ladakh", value: "Ladakh" },
      { label: "Lakshadweep", value: "Lakshadweep" },
      { label: "Puducherry", value: "Puducherry" },
    ];

    if (selectedOption.value === "IN") {
      setStates(indianStates);
    } else {
      setStates([]); // Clear states for other countries
    }
  };

  const handleStateChange = (selectedOption) => {
    // Save only the value of the selected state
    handleSelectChange("address", {
      ...customerData.address,
      state: selectedOption.value, // Save only the value
    });
  };

  const address = customerData.address || {};
  const country = address.country || null;
  const state = address.state || null;

  return (
    <>
      <Row className="mb-3">
        <Col md={12}>
          <Form.Group>
            <Form.Label>Address Line</Form.Label>
            <Form.Control
              type="text"
              name="address.addressLine"
              value={address.addressLine || ""}
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
            <Form.Label>Country</Form.Label>
            <Select
              options={countries}
              // Match country value with country options
              value={countries.find((option) => option.value === country) || null} // Display country label
              onChange={handleCountryChange}
              getOptionLabel={(e) => e.label} // Ensure label is displayed
              getOptionValue={(e) => e.value} // Use value for comparisons
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
            <Form.Label>State</Form.Label>
            <Select
              options={states}
              // Match state value with state options
              value={states.find((option) => option.value === state) || null} // Display state label
              onChange={handleStateChange}
              getOptionLabel={(e) => e.label} // Ensure label is displayed
              getOptionValue={(e) => e.value} // Use value for comparisons
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
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              name="address.city"
              value={address.city || ""}
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
            <Form.Label>Zip Code</Form.Label>
            <Form.Control
              type="text"
              name="address.zipCode"
              value={address.zipCode || ""}
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
    </>
  );
};

export default AddressSection;
