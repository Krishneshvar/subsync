import React, { useState } from "react";
import { Form, Button, Row, Col, Alert, ToastContainer } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Bounce } from "react-toastify"; 

export default function AddProduct() {
  const navigate = useNavigate();
  const { username } = useParams();
  const [formData, setFormData] = useState({
    serviceName: "",
    description: "",
    rate: "",
    hsnSac: "",
    taxName: "",
    taxPercentage: "",
    intraStateTaxType: "",
    interStateTaxName: "",
    interStateTaxRate: "",
    sourceReferenceId: "",
    usageUnit: "",
    group: "",
    status: "Active",
  });
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const formFields = [
    { id: "serviceName", label: "Service Name", type: "text", col: 6 },
    { id: "rate", label: "Rate", type: "number", col: 6 },
    { id: "hsnSac", label: "HSN/SAC", type: "text", col: 6 },
    { id: "taxName", label: "Tax Name", type: "text", col: 6 },
    { id: "taxPercentage", label: "Tax Percentage", type: "number", col: 6 },
    { id: "intraStateTaxType", label: "Intra-State Tax Type", type: "text", col: 6 },
    { id: "interStateTaxName", label: "Inter-State Tax Name", type: "text", col: 6 },
    { id: "interStateTaxRate", label: "Inter-State Tax Rate", type: "number", col: 6 },
    { id: "sourceReferenceId", label: "Source Reference ID", type: "text", col: 6 },
    { id: "usageUnit", label: "Usage Unit", type: "text", col: 6 },
    { id: "group", label: "Group", type: "text", col: 6 },
    { id: "status", label: "Status", type: "select", options: ["Active", "Inactive"], col: 6 },
    { id: "description", label: "Description", type: "textarea", rows: 3, col: 12 },
  ];

  return (
    <div className="container mt-4">
      <ToastContainer position="top-center" autoClose={2000} theme="dark" transition={Bounce} pauseOnHover />
      <h1 className="mb-4 text-3xl font-bold ">{isEditing ? "Edit Services" : "Add Service"}</h1>
      <hr className="mb-4 border-blue-500 border-3 size-auto" />
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          axios
            .post("/api/products", formData)
            .then(() => {
              navigate(`/management/products/${username}`);
            })
            .catch((err) => setError(err.response?.data?.message || "An error occurred"));
        }}
      >
        <Row className="g-3">
          {formFields.map((field) => (
            <Col key={field.id} xs={12} sm={field.col}>
              <Form.Group className="mb-3">
                <Form.Label>{field.label}</Form.Label>
                {field.type === "textarea" ? (
                  <Form.Control
                    as="textarea"
                    rows={field.rows}
                    placeholder={field.placeholder}
                    value={formData[field.id]}
                    onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                  />
                ) : field.type === "select" ? (
                  <Form.Select
                    value={formData[field.id]}
                    onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                  >
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Form.Select>
                ) : (
                  <Form.Control
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData[field.id]}
                    onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                  />
                )}
              </Form.Group>
            </Col>
          ))}
        </Row>
        {error && <Alert variant="danger">{error}</Alert>}
        <Button variant="primary" type="submit" className="mt-3">
          Submit
        </Button>
      </Form>
    </div>
  );
}