import './Dashboard.css'
import Sidebar from '../Sidebar/Sidebar'
import Navbar from '../Navbar/Navbar'
import Home from '../Home/Home'
import Customers from '../Management/Customers/customers'
import Products from '../Management/Products/products'
import Subscriptions from '../Management/Subscriptions/subscriptions'
import { createBrowserRouter, Outlet, RouterProvider, } from "react-router-dom";

const router = createBrowserRouter([
  { path: "/", element: <Home />, },
  { path: "/customers", element: <Customers />, },
  { path: "/products", element: <Products />, },
  { path: "/subscriptions", element: <Subscriptions />, },
]);

function Dashboard() {

  return (
    <>
      <div className='app-container'>
        <div className='main'>
          <Sidebar />
          <div className='contents'>
            <Navbar />
            <RouterProvider router={router} />
            <Outlet />
          </div>
        </div>
        {/* <Footer /> */}
      </div>
    </>
  )
}

export default Dashboard
