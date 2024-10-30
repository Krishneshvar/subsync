import React, { useState } from 'react';
import { Nav, Navbar, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const sidebarItems = [
  { path: '/dashboard', title: 'Home', icon: 'home' },
  { path: '/dashboard/customers', title: 'Customers', icon: 'groups' },
  { path: '/dashboard/products', title: 'Products', icon: 'shop' },
  { path: '/dashboard/subscriptions', title: 'Subscriptions', icon: 'subscriptions' },
];

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Navbar
      bg="info"  // Change bg color to info for lighter blue
      variant="dark"
      className={`d-flex flex-column p-3 sidebar ${isCollapsed ? 'collapsed' : ''}`}
    >
      <Navbar.Brand className="mb-3">
        {isCollapsed ? null : <span>SubSync</span>}
        <Button variant="outline-light" size="sm" onClick={toggleSidebar} className="float-end">
          <span className="material-symbols-outlined">{isCollapsed ? 'dock_to_left' : 'dock_to_right'}</span>
        </Button>
      </Navbar.Brand>
      <Nav className="flex-column mt-4">
        {sidebarItems.map((item) => (
          <Nav.Item key={item.path} className="my-2">
            <Link to={item.path} className="nav-link d-flex align-items-center">
              <span className="material-symbols-outlined">{item.icon}</span>
              {isCollapsed ? null : <span className="ms-2">{item.title}</span>}
            </Link>
          </Nav.Item>
        ))}
      </Nav>
    </Navbar>
  );
}

export default Sidebar;
