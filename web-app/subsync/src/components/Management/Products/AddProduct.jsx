import React, { useState } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function AddProduct() {
  const navigate = useNavigate();
  const { username } = useParams();
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    validity: '',
    price: ''
  });
  const [error, setError] = useState(null);

  const formFields = [
    { id: 'productName', label: 'Product Name', type: 'text', placeholder: 'Enter Product Name', col: 6 },
    { id: 'description', label: 'Description', type: 'textarea', rows: 3, col: 12 },
    { id: 'validity', label: 'Validity', type: 'number', placeholder: 'Enter Validity (in days)', col: 6 },
    { id: 'price', label: 'Price', type: 'number', placeholder: 'Enter Price', col: 6 }
  ];

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation for required fields
    for (const key in formData) {
      if (!formData[key]) {
        setError(`${key} is a required field.`);
        return;
      }
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/add-product`, formData);

      if (response.status === 201) {
        navigate(`/${username}/dashboard/products`);
      }
    } catch (err) {
      const serverError = err.response?.data?.error || "Failed to add product. Please try again.";
      setError(serverError);
      console.error("Error adding product:", err);
    }
  };

  return (
    <div className="py-4 px-2 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-extrabold text-center text-white py-3 bg-gradient-to-l from-cyan-500 to-blue-500 rounded-lg shadow-lg mb-4">
          Add Product
        </h1>
        {error && <Alert variant="danger" className="mb-2 rounded-lg">{error}</Alert>}
        <Form className="bg-white shadow-lg rounded-lg p-6" onSubmit={handleSubmit}>
          <Row>
            {formFields.map((field) => (
              <Col md={field.col} key={field.id}>
                <Form.Group className="mb-4" controlId={field.id}>
                  <Form.Label className="text-sm font-medium text-gray-700">{field.label}</Form.Label>
                  {field.type === 'textarea' ? (
                    <Form.Control
                      as="textarea"
                      rows={field.rows}
                      value={formData[field.id]}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  ) : (
                    <Form.Control
                      type={field.type}
                      placeholder={field.placeholder}
                      value={formData[field.id]}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  )}
                </Form.Group>
              </Col>
            ))}
          </Row>
          <div className="flex justify-end mt-6">
            <Button
              variant="primary"
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-l from-cyan-500 to-blue-500 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Product
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
