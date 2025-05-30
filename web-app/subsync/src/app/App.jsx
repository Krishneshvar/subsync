import LoginPage from '@/features/Auth/pages/LoginPage';
import Dashboard from '@/features/Dashboard/pages/Dashboard.jsx';
import Home from '@/features/Dashboard/components/Home.jsx';
import Customers from '@/features/Customers/pages/Customers.jsx';
import Domains from '@/features/Domains/pages/Domains.jsx';
import CreateDomain from '@/features/Domains/pages/CreateDomain.jsx';
import Services from '@/features/Services/pages/Services.jsx';
import Subscriptions from '@/features/Subscriptions/Subscriptions.jsx';
import AddCustomer from '@/features/Customers/pages/AddCustomer.jsx';
import AddService from '@/features/Services/pages/AddService.jsx';
import AddSubscription from '@/features/Subscriptions/AddSubscription.jsx';
import CustomerDetails from '@/features/Customers/pages/CustomerDetails.jsx';
import ServiceDetails from '@/features/Services/pages/ServiceDetails.jsx';
import SubscriptionDetails from '@/features/Subscriptions/SubscriptionDetails.jsx';
import Settings from '@/features/Settings/Settings.jsx';
import Taxes from '@/features/Settings/Taxes.jsx';
import AddTax from '@/features/Settings/AddTax.jsx';
import DefaultTaxPreference from '@/features/Settings/DefaultTaxPreference.jsx';
import GSTSettings from '@/features/Settings/GSTSettings.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AllTaxes from '@/features/Settings/AllTaxes.jsx';

const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  {
    path: "/:username/dashboard",
    element: <Dashboard />,
    children: [
      { index: true, element: <Home /> },
      { path: "customers", element: <Customers /> },
      { path: "customers/:id", element: <CustomerDetails /> },
      { path: "customers/add", element: <AddCustomer /> },
      { path: "customers/:id/edit", element: <AddCustomer /> },

      { path: "products", element: <Services /> },
      { path: "products/:id", element: <ServiceDetails /> },
      { path: "products/add", element: <AddService /> },

      { path: "subscriptions", element: <Subscriptions /> },
      { path: "subscriptions/:id", element: <SubscriptionDetails /> },
      { path: "subscriptions/add", element: <AddSubscription /> },

      { path: "domains", element: <Domains /> },
      { path: "domains/:id", element: <CreateDomain /> },
      { path: "domains/edit/:domainId", element: <CreateDomain /> },

      {
        path: "settings",
        element: <Settings />,
        children: [
          { path: "profile", element: <Settings /> },
          {
            path: "taxes",
            element: <Taxes />,
            children: [
              { path: "tax-rates", element: <AllTaxes /> },
              { path: "tax-rates/add", element: <AddTax /> },
              { path: "tax-rates/edit/:id", element: <AddTax /> },
              { path: "default-tax-pref", element: <DefaultTaxPreference /> },
              { path: "gst-settings", element: <GSTSettings /> },
            ]
          }
        ]
      }
    ]
  }
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
