import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Image } from 'react-bootstrap';
import './Login.css';
// import logoImage from './path-to-your-logo.png';

function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="login-display">
      <Container className="container bg-light text-center p-4 shadow-lg rounded-3">
        <Row className="align-items-center mb-3">
          {/* <Col xs="auto">
            <Image src={logoImage} alt="Logo" className="logo" />
          </Col> */}
          <Col>
            <h2 className="heading">Sign In</h2>
          </Col>
        </Row>
        <Form className="form" onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Control 
              required 
              type="text" 
              placeholder="Username" 
              className="input" 
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control 
              required 
              type="password" 
              placeholder="Password" 
              className="input" 
            />
          </Form.Group>
          <Form.Text className="forgot-password">
            <a href="#">Forgot Password?</a>
          </Form.Text>
          <Button 
            type="submit" 
            variant="primary" 
            className="login-button mt-3 w-100"
          >
            Sign In
          </Button>
        </Form>
      </Container>
    </div>
  );
}

export default Login;
