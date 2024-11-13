import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const navItems = [
  { path: 'help', title: 'Help', key: 'help', icon: 'help' },
  { path: 'notifications', title: 'Notifications', key: 'notifications', icon: 'notifications' },
  { path: 'account', title: 'Account', key: 'account', icon: 'account_circle' },
]

export default function NavBar({ toggleSidebar }) {
  return (
    <nav className="bg-white shadow-lg rounded-b-lg border-b-2 border-gray-300">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="flex">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 lg:hidden"
            onClick={toggleSidebar}
          >
            <span className="material-symbols-outlined">menu</span>
          </Button>
          <div className="flex-shrink-0 flex items-center">
            <span className="text-xl font-bold text-primary">SubSync</span>
          </div>
        </div>
        <div className="flex items-center">
          {navItems.map((item) => (
            <Link
              title={item.title}
              key={item.key}
              to={item.path}
              className="ml-4 px-1 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              <span className="material-symbols-outlined">{item.icon}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
