// components/CompanyDetails.jsx
import React from "react";
import { Row, Col, Form } from "react-bootstrap";
import Select from "react-select";

const CompanyDetails = ({ customerData, handleInputChange, handleSelectChange }) => {
  return (
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
  );
};

export default CompanyDetails;
