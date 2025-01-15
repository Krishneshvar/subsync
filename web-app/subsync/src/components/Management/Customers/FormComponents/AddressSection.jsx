import React from "react";
import { Row, Col, Form } from "react-bootstrap";
import Select from "react-select";

const AddressSection = ({ customerData, handleInputChange, handleSelectChange, countries, states, setStates }) => {
  const handleCountryChange = (selectedOption) => {
    handleSelectChange("address", {
      ...customerData.address,
      country: selectedOption,
      state: null, // Reset state when country changes
    });

    // Update states based on selected country
    if (selectedOption.value === "IN") {
      setStates([
        { label: "Maharashtra", value: "Maharashtra" },
        { label: "Karnataka", value: "Karnataka" },
        { label: "Delhi", value: "Delhi" },
      ]);
    } else {
      setStates([]);
    }
  };

  return (
    <>
      <Row className="mb-3">
        <Col md={12}>
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
              value={customerData.address.country.label && typeof customerData.address.country.label === "string"
                ? { label: customerData.address.country.label, value: customerData.address.country.value }
                : null}
              // onChange={(e) =>
              //   handleSelectChange("address", { ...customerData.address, state: e })
              // }
              onChange={(e) => handleSelectChange("address.country", e.value)}
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
              value={customerData.address.state.label && typeof customerData.address.state.value === "string"
                ? { label: customerData.address.state.label, value: customerData.address.state.value }
                : null}
              // onChange={(e) =>
              //   handleSelectChange("address", { ...customerData.address, state: e })
              // }
              onChange={(e) => handleSelectChange("address.state", e.value)}
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
              value={customerData.address.city}
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
              value={customerData.address.zipCode}
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
