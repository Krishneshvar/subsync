import './App.css';
import Login from './components/AuthForm/Login';
import Dashboard from './components/Dashboard/Dashboard';
import Customers from './components/Management/Customers/Customers';
import Products from './components/Management/Products/Products';
import Subscriptions from './components/Management/Subscriptions/Subscriptions';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

function App() {

  const router = createBrowserRouter([
    { path: "/", element: <Login /> },
    { path: "/dashboard", element: <Dashboard /> },
    { path: "/customers", element: <Customers />, },
    { path: "/products", element: <Products />, },
    { path: "/subscriptions", element: <Subscriptions />, },
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;
