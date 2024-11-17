import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { HelpCircle, User, Settings } from 'lucide-react'

const navItems = [
  { path: 'settings', title: 'Settings', key: 'settings', icon: Settings },
  { path: 'help', title: 'Help', key: 'help', icon: HelpCircle },
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
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-4 rounded-full border-2 border-gray-300">
                <User className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48" align="end">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  to={item.path}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              ))}
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </nav>
  )
}
