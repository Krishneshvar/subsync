import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css';

function Footer() {
  const currYear = new Date().getFullYear();

  return (
    <Container fluid as="footer" className="footer bg-dark text-light py-2">
      <Row className="justify-content-center">
        <Col md="auto" className="text-center">
          &copy; {currYear} SubSync
        </Col>
      </Row>
    </Container>
  );
}

export default Footer;
