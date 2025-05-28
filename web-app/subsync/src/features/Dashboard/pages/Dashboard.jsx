import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from '@/components/layouts/Navigations/SideBar.jsx'
import NavBar from '@/components/layouts/Navigations/NavBar.jsx'

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="flex min-h-screen">
      <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <NavBar toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-2">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Dashboard
