import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from '../Navigations/Sidebar'
import NavBar from '../Navigations/NavBar'
import Footer from '../Footer/Footer'

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <NavBar toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-2">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}
