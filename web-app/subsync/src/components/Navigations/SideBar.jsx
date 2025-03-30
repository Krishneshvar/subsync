import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const sidebarItems = [
  { path: 'dashboard', title: 'Home', icon: 'home' },
  {
    title: 'Customers',
    icon: 'groups',
    submenu: [
      { path: 'dashboard/customers', title: 'Customers', icon: 'person' },
      { path: 'dashboard/domains', title: 'Domains', icon: 'language' },
    ],
  },
  { path: 'dashboard/products', title: 'Products', icon: 'shop' },
  { path: 'dashboard/subscriptions', title: 'Subscriptions', icon: 'subscriptions' },
];

export default function SideBar({ isOpen, toggleSidebar }) {
  const { username } = useParams();
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (title) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleItemClick = () => {
    toggleSidebar(); // Close sidebar when a menu item is clicked
  };

  return (
    <aside
      className={`lg:flex lg:flex-col fixed top-0 left-0 z-40 min-h-screen bg-blue-500 text-primary-foreground
        transition-all duration-300 ease-in-out
        ${isOpen ? 'w-64' : 'w-16'}
        lg:relative lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
    >
      <div className="flex items-center justify-between p-4 border-b border-primary-foreground/10">
        {isOpen && <span className="text-xl font-bold">SubSync</span>}
        <Button
          variant="primary"
          size="icon"
          className="text-primary-foreground hover:bg-primary-foreground/10 z-50"
          onClick={toggleSidebar}
        >
          <span className="material-symbols-outlined">{isOpen ? 'close' : 'menu'}</span>
        </Button>
      </div>
      <nav className="h-[calc(100%-4rem)] overflow-y-auto">
        <ul className="py-2">
          {sidebarItems.map((item) => (
            <li key={item.title || item.path}>
              {item.submenu ? (
                <>
                  <button
                    onClick={() => toggleMenu(item.title)}
                    className="flex items-center w-full py-3 px-4 hover:bg-primary-foreground/10 transition-colors"
                  >
                    <span className="material-symbols-outlined">{item.icon}</span>
                    {isOpen && <span className="ml-2">{item.title}</span>}
                    {isOpen && (
                      <span className="material-symbols-outlined ml-auto">
                        {openMenus[item.title] ? 'expand_less' : 'expand_more'}
                      </span>
                    )}
                  </button>
                  {openMenus[item.title] && (
                    <ul className="pl-6">
                      {item.submenu.map((sub) => (
                        <li key={sub.path}>
                          <Link
                            to={`/${username}/${sub.path}`}
                            className="flex items-center py-2 px-4 hover:bg-primary-foreground/10 transition-colors"
                            onClick={handleItemClick} // Sidebar collapses when clicked
                          >
                            <span className="material-symbols-outlined">{sub.icon}</span>
                            {isOpen && <span className="ml-2">{sub.title}</span>}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link
                  to={`/${username}/${item.path}`}
                  className="flex items-center space-x-2 py-3 px-4 w-full hover:bg-primary-foreground/10 transition-colors"
                  onClick={handleItemClick} // Sidebar collapses when clicked
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  {isOpen && <span>{item.title}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
