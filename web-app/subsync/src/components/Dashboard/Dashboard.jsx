import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../Sidebar/Sidebar'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-grow">
        <div className="w-16 flex-shrink-0">
          <Sidebar />
        </div>
        <div className="flex flex-col flex-grow">
          <Navbar />
          <main className="flex-grow p-4">
            <Outlet />
          </main>
        </div>
      </div>
      <Footer />
    </div>
  )
}
