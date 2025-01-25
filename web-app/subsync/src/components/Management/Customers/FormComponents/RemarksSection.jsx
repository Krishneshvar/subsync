// components/RemarksSection.jsx
import React from "react";
import { Form } from "react-bootstrap";

const RemarksSection = ({ customerData, handleInputChange }) => {
  return (
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
          border: "1px solid #ccc",
          marginBottom: "1rem", 
        }}
      />
    </Form.Group>
  );
};

export default RemarksSection;
