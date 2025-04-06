import Login from './components/AuthForm/Login';
import Dashboard from './components/Dashboard/Dashboard';
import Home from './components/Home/Home';
import Customers from './components/Management/Customers/Customers';
import Domains from './components/Management/Customers/Domains';
import CreateDomain from './components/Management/Customers/CreateDomain';
import Products from './components/Management/Products/Products';
import Subscriptions from './components/Management/Subscriptions/Subscriptions';
import AddCustomer from './components/Management/Customers/AddCustomer';
import AddProduct from './components/Management/Products/AddProduct';
import AddSubscription from './components/Management/Subscriptions/AddSubscription';
import CustomerDetails from './components/Management/Customers/CustomerDetails';
import ProductDetails from './components/Management/Products/ProductDetails';
import SubscriptionDetails from './components/Management/Subscriptions/SubscriptionDetails';
import Settings from './components/Settings/Settings';
import Taxes from './components/Settings/Taxes';
import AddTax from './components/Settings/AddTax';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  {
    path: "/:username/dashboard",
    element: <Dashboard />,
    children: [
      { index: true, element: <Home /> },
      { path: "customers", element: <Customers /> },
      { path: "customers/:id", element: <CustomerDetails /> },
      { path: "customers/add", element: <AddCustomer /> },
      { path: "customers/:id/edit", element: <AddCustomer /> },

      { path: "products", element: <Products /> },
      { path: "products/:id", element: <ProductDetails /> },
      { path: "products/add", element: <AddProduct /> },

      { path: "subscriptions", element: <Subscriptions /> },
      { path: "subscriptions/:id", element: <SubscriptionDetails /> },
      { path: "subscriptions/add", element: <AddSubscription /> },

      { path: "domains", element: <Domains /> },
      { path: "domains/:id", element: <CreateDomain /> },
      {path: "domains/edit/:domainId", element: <CreateDomain />},

      { path: "settings",
        element: <Settings />,
        children: [
          { path: "profile", element: <Settings /> },

          { path: "taxes", element: <Taxes /> },
          { path: "taxes/add", element: <AddTax /> },
        ]
      },
    ],
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
