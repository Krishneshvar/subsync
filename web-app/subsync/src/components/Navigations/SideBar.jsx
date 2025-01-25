import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const sidebarItems = [
  { path: 'dashboard', title: 'Home', icon: 'home' },
  { path: 'dashboard/customers', title: 'Customers', icon: 'groups' },
  { path: 'dashboard/products', title: 'Products', icon: 'shop' },
  { path: 'dashboard/subscriptions', title: 'Subscriptions', icon: 'subscriptions' },
]

export default function SideBar({ isOpen, toggleSidebar }) {
  const { username } = useParams()

  return (
    <aside
      className={`flex flex-col top-0 left-0 z-40 min-h-screen bg-blue-500 text-primary-foreground
        transition-all duration-300 ease-in-out
        ${isOpen ? 'w-64' : 'w-16'}
        lg:relative lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      <div className="flex items-center justify-between p-4 border-b border-primary-foreground/10">
        {isOpen && <span className="text-xl font-bold">SubSync</span>}
        <Button
          variant="primary"
          size="icon"
          className="text-primary-foreground hover:bg-primary-foreground/10 z-50"
          onClick={toggleSidebar}
        >
          <span className="material-symbols-outlined">
            {isOpen ? 'close' : 'menu'}
          </span>
        </Button>
      </div>
      <nav className="h-[calc(100%-4rem)] overflow-y-auto">
        <ul className="py-2">
          {sidebarItems.map((item) => (
            <li key={item.path}>
              <Link
                to={`/${username}/${item.path}`}
                className="flex items-center space-x-2 py-3 px-4 w-full hover:bg-primary-foreground/10 transition-colors"
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                {isOpen && <span>{item.title}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
