import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import './Navbar.css';

const navItems = [
  { icon: 'help', key: 'help' },
  { icon: 'notifications', key: 'notifications' },
  { icon: 'account_circle', key: 'account_circle' },
];

function AppNavbar() {
  return (
    <Navbar bg="white" expand="lg" className="shadow-sm rounded-bottom nav w-full">
      <Container fluid>
        <Navbar.Brand href="#" className="logo" />
        <Nav className="ms-auto">
          <ul className="navlist">
            {navItems.map((item) => (
              <li key={item.key} className="navitem material-symbols-outlined">
                {item.icon}
              </li>
            ))}
          </ul>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
