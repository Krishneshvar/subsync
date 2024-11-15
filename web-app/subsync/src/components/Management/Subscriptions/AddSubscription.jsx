import React, { useState } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function AddSubscription() {
  const navigate = useNavigate();
  const { username } = useParams();
  const [formData, setFormData] = useState({
    customerID: '',
    productID: ''
  });
  const [error, setError] = useState(null);

  const formFields = [
    { id: 'customerID', label: 'Customer ID', type: 'text', placeholder: 'Enter Customer ID', col: 6 },
    { id: 'productID', label: 'Product ID', type: 'text', placeholder: 'Enter Product ID', col: 6 }
  ];

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    setFormData({
      ...formData,
      [id]: files ? files[0] : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/add-subscription`,
        formData, // Pass the object directly
        { headers: { "Content-Type": "application/json" } } // Ensure correct headers
      );
      if (response.status === 201) {
        navigate(`/${username}/dashboard/subscriptions`);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add subscription. Please try again.");
      console.error("Error adding subscription:", err);
    }
  };

  return (
    <div className="py-4 px-2 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-extrabold text-center text-white py-3 bg-gradient-to-l from-cyan-500 to-blue-500 rounded-lg shadow-lg mb-4">
          Add Subscription
        </h1>
        {error && <Alert variant="danger" className="mb-0 rounded-lg mb-2">{error}</Alert>}
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
                      value={field.isFile ? undefined : formData[field.id]}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
                        field.isFile ? "file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" : ""
                      }`}
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
              Add Subscription
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
