import React from "react";
import { Row, Col, Form } from "react-bootstrap";
import Select from "react-select";

const OtherDetails = ({ customerData, handleInputChange, handleSelectChange }) => {
  return (
    <>
      <Row className="mb-3">
        <Col md={6} className="mt-3">
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
                border: "1px solid #ccc",
                fontSize: "16px",
              }}
            />
          </Form.Group>
        </Col>
        <Col md={6} className="mt-3">
          <Form.Group>
            <Form.Label>Currency Code</Form.Label>
            <Select
              options={[
                { label: "INR", value: "INR" },
                { label: "USD", value: "USD" },
                { label: "EUR", value: "EUR" },
              ]}
              value={customerData.currencyCode || null} // Ensure we pass the whole object
              onChange={(e) => handleSelectChange("currencyCode", e)}
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
              value={customerData.gst_treatment && typeof customerData.gst_treatment === "string"
                ? { label: customerData.gst_treatment, value: customerData.gst_treatment }
                : null}
              onChange={(e) => handleSelectChange("gst_treatment", e.value)}
              getOptionLabel={(e) => e.label}
              getOptionValue={(e) => e.value}
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
              value={customerData.tax_preference && typeof customerData.tax_preference === "string"
                ? { label: customerData.tax_preference, value: customerData.tax_preference }
                : null}
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
      {customerData.tax_preference === "Tax Exempt" && (
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
                  border: "1px solid #ccc",
                }}
              />
            </Form.Group>
          </Col>
        </Row>
      )}
    </>
  );
};

export default OtherDetails;
