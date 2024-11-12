import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom'; // Import useParams
import axios from 'axios';

export default function AddCustomer() {
  const navigate = useNavigate();
  const { username } = useParams(); // Get the username from the URL
  const [formData, setFormData] = useState({
    customerName: '',
    profilePicture: null,
    email: '',
    phoneNumber: '',
    address: '',
    domains: '' // New field for domains
  });
  const [error, setError] = useState(null);

  const formFields = [
    { id: 'customerName', label: 'Customer Name', type: 'text', placeholder: 'Enter Customer Name', col: 6 },
    { id: 'profilePicture', label: 'Profile Picture', type: 'file', placeholder: '', col: 6, isFile: true },
    { id: 'email', label: 'Email address', type: 'email', placeholder: 'name@example.com', col: 6 },
    { id: 'phoneNumber', label: 'Phone Number', type: 'tel', placeholder: 'Enter Phone Number', col: 6 },
    { id: 'address', label: 'Customer Address', type: 'textarea', rows: 3, col: 12 },
    { id: 'domains', label: 'Domains (comma separated)', type: 'text', placeholder: 'Enter domains separated by commas', col: 12 } // New field for domains
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
    const data = new FormData();

    // Append all form data to FormData object
    for (const key in formData) {
        data.append(key, formData[key]);
    }

    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/add-customer`, data);
        
        if (response.status === 201) {
            // Navigate to the customers page using dynamic username
            navigate(`/${username}/dashboard/customers`); // Update path dynamically
        }
    } catch (err) {
        setError("Failed to add customer. Please try again.");
        console.error("Error adding customer:", err);
    }
  };

  return (
    <Container className="py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
        Add Customer
      </h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form className="bg-white shadow-lg rounded-lg p-6 max-w-3xl mx-auto" onSubmit={handleSubmit}>
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
                    value={formData[field.id]} // Ensure value is controlled
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
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Customer
          </Button>
        </div>
      </Form>
    </Container>
  );
}
