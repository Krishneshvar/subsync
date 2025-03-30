import React from "react";
import { Form, Row, Col, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import Select from "react-select";
import PhoneInput from "react-phone-number-input";
import 'react-phone-number-input/style.css'; // Import styles for react-phone-number-input
import { parsePhoneNumberFromString } from "libphonenumber-js";

const PersonalDetails = ({ customerData, handleInputChange, handleSelectChange, handleStatusChange }) => {
  const handlePhoneNumberChange = (value) => {
    if (value) {
      const phoneNumberObj = parsePhoneNumberFromString(value);
      if (phoneNumberObj) {
        handleInputChange({ 
          target: { name: "country_code", value: phoneNumberObj.countryCallingCode ? `+${phoneNumberObj.countryCallingCode}` : "" } 
        });
        handleInputChange({ 
          target: { name: "phoneNumber", value: phoneNumberObj.nationalNumber || "" } 
        });
      } else {
        // If parsing fails, reset values to empty
        handleInputChange({ target: { name: "country_code", value: "" } });
        handleInputChange({ target: { name: "phoneNumber", value: "" } });
      }
    } else {
      // If input is empty, reset values
      handleInputChange({ target: { name: "country_code", value: "" } });
      handleInputChange({ target: { name: "phoneNumber", value: "" } });
    }
  };
  

  return (
    <>
      <Row className="mb-3">
        <Col className="flex flex-col mb-2" md={12}>
          <label className="mb-2">Customer Status</label>
          <ToggleButtonGroup type="radio" name="options" defaultValue={`${customerData.customerStatus}`} className="w-max">
            <ToggleButton
              id="tbg-radio-1"
              variant="outline-success"
              name="customerStatus"
              value="Active"
              onChange={(e) => handleStatusChange(e.currentTarget.value)}
            >
              Active
            </ToggleButton>
            <ToggleButton
              id="tbg-radio-2"
              variant="outline-danger"
              name="customerStatus"
              value="Inactive"
              onChange={(e) => handleStatusChange(e.currentTarget.value)}
            >
              Inactive
            </ToggleButton>
          </ToggleButtonGroup>
        </Col>
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
              value={customerData.salutation && typeof customerData.salutation === "string"
                ? { label: customerData.salutation, value: customerData.salutation }
                : null}
              onChange={(e) => handleSelectChange("salutation", e.value)}
              getOptionLabel={(e) => e.label}
              getOptionValue={(e) => e.value}
              styles={{
                control: (provided) => ({
                  ...provided,
                  borderRadius: "10px",
                  padding: "6px",
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
            <Form.Label>Phone Number</Form.Label>
            <div style={{ display: "flex" }}>
            <PhoneInput
              international
              defaultCountry="IN"
              value={
                  customerData.country_code && customerData.phoneNumber
                    ? `${customerData.country_code}${customerData.phoneNumber}`
                    : ""
                }
                onChange={handlePhoneNumberChange}
                className="phone-input"
                placeholder="Enter phone number"
                style={{
                  borderRadius: "10px",
                  padding: "12px",
                  border: "1px solid #ccc",
                  fontSize: "16px",
                  width: "100%",
                }}
              />
            </div>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              name="email"
              value={customerData.email}
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

export default PersonalDetails;