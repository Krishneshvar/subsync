import './App.css';
import Login from './components/AuthForm/Login';
import Dashboard from './components/Dashboard/Dashboard';
import Home from './components/Home/Home';
import Customers from './components/Management/Customers/Customers';
import Products from './components/Management/Products/Products';
import Subscriptions from './components/Management/Subscriptions/Subscriptions';
import AddCustomer from './components/Management/Customers/AddCustomer';
import AddProduct from './components/Management/Products/AddProduct';
import AddSubscription from './components/Management/Subscriptions/AddSubscription';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  {
    path: "/:username/dashboard",
    element: <Dashboard />,
    children: [
      { index: true, element: <Home /> },
      { path: "customers", element: <Customers /> },
      { path: "customers/add", element: <AddCustomer /> },
      { path: "products", element: <Products /> },
      { path: "products/add", element: <AddProduct /> },
      { path: "subscriptions", element: <Subscriptions /> },
      { path: "subscriptions/add", element: <AddSubscription /> },
    ],
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
