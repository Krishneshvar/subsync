import React, { useState } from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';

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
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className='top'>
        {
          isCollapsed ? null : <div>SubSync</div>
        }
        <div onClick={toggleSidebar}>
          <span className="material-symbols-outlined move-sidebar">
            dock_to_right
          </span>
        </div>
      </div>
      <div className='menu'>
        <ul className='side-list'>
          {
            sidebarItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <li className={`side-item ${isCollapsed ? 'collapsed-side-item' : ''}`}>
                  <span className="material-symbols-outlined icon">
                    {item.icon}
                  </span>
                  {
                    isCollapsed ? null : <span className="title">{item.title}</span>
                  }
                </li>
              </Link>
            ))
          }
        </ul>
      </div>
    </div>
  );
}

export default Sidebar
