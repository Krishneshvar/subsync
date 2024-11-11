import React, { useState } from 'react'
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const formFields = [
    { id: "formBasicUsername", label: "Username", type: "text", placeholder: "Enter username", value: username, onChange: (e) => setUsername(e.target.value) },
    { id: "formBasicPassword", label: "Password", type: "password", placeholder: " Enter Password", value: password, onChange: (e) => setPassword(e.target.value) },
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
        // Send login request with credentials included
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/login/user`, 
            { username, password }, 
            //{ withCredentials: true } // Include credentials (cookies)
        );

        // Check if the response indicates success
        if (response.status === 200) {
            navigate(`/${username}/dashboard`);
        }
    }
    catch (error) {
        // Handle errors based on the response
        if (error.response) {
            // Set error message from server response or default message
            setError(error.response.data.error || 'Invalid credentials');
        }
        else {
            // Handle network or other errors
            setError('There was an error logging in.');
        }
        console.error("Login error:", error);
    }
  };

  return (
    <Container className="min-h-screen flex items-center justify-center bg-">
      <Row className="w-full max-w-md">
        <Col>
          <div className="bg-white shadow-2xl rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign In</h2>
            { error && <Alert variant="danger" className="mb-4">{error}</Alert> }
            <Form onSubmit={handleSubmit}>
              {
                formFields.map((field) => (
                  <Form.Group className="mb-4" controlId={field.id} key={field.id}>
                    <Form.Label className="text-sm font-medium text-gray-700">{field.label}</Form.Label>
                    <Form.Control
                      type={field.type}
                      placeholder={field.placeholder}
                      value={field.value}
                      onChange={field.onChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      required
                    />
                  </Form.Group>
                ))
              }

              <Button variant="primary" type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Sign In
              </Button>
            </Form>
            <div className="mt-6 text-center">
              <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">Forgot your password?</a>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  )
}
