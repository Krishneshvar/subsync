import React, { useState } from 'react'
import { Navbar, Nav, Button } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'

const sidebarItems = [
  { path: 'dashboard', title: 'Home', icon: 'home' },
  { path: 'dashboard/customers', title: 'Customers', icon: 'groups' },
  { path: 'dashboard/products', title: 'Products', icon: 'shop' },
  { path: 'dashboard/subscriptions', title: 'Subscriptions', icon: 'subscriptions' },
]

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false)
  const { username } = useParams(); // Get username from route params

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <Navbar
      bg="primary"
      variant="dark"
      className={`flex-column p-3 h-full transition-all duration-300 ease-in-out ${
        isExpanded ? 'w-64 absolute left-0 top-0 bottom-0 z-10' : 'w-16'
      }`}
    >
      <Navbar.Brand className="w-full mb-3 flex items-center justify-between">
        {isExpanded && <span className="text-xl font-bold">SubSync</span>}
        <Button
          variant="outline-light"
          size="sm"
          onClick={toggleSidebar}
          className="border-0 p-1"
          aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <span className="material-symbols-outlined">
            {isExpanded ? 'chevron_left' : 'chevron_right'}
          </span>
        </Button>
      </Navbar.Brand>
      <Nav className="flex-column mt-4 w-full">
        {sidebarItems.map((item) => (
          <Nav.Item key={item.path} className="my-2 w-full">
            <Link
              to={`/${username}/${item.path}`} // Use username in path
              className="nav-link flex items-center text-white hover:bg-blue-600 rounded p-2 transition-colors duration-200"
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              { isExpanded && <span className="ml-2">{item.title}</span> }
            </Link>
          </Nav.Item>
        ))}
      </Nav>
    </Navbar>
  )
}
