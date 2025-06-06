import { createBrowserRouter } from 'react-router-dom';

import AddCustomer from '@/features/Customers/pages/AddCustomer.jsx';
import AddService from '@/features/Services/pages/AddService.jsx';
import AddTax from '@/features/Settings/AddTax.jsx';
import AllTaxes from '@/features/Settings/AllTaxes.jsx';
import CreateDomain from '@/features/Domains/pages/CreateDomain.jsx';
import CustomerDetails from '@/features/Customers/pages/CustomerDetails.jsx';
import Customers from '@/features/Customers/pages/Customers.jsx';
import Dashboard from '@/features/Dashboard/pages/Dashboard.jsx';
import DefaultTaxPreference from '@/features/Settings/DefaultTaxPreference.jsx';
import Domains from '@/features/Domains/pages/Domains.jsx';
import GSTSettings from '@/features/Settings/GSTSettings.jsx';
import Home from '@/features/Dashboard/components/Home.jsx';
import LoginPage from '@/features/Auth/pages/LoginPage';
import ServiceDetails from '@/features/Services/pages/ServiceDetails.jsx';
import Services from '@/features/Services/pages/Services.jsx';
import Settings from '@/features/Settings/Settings.jsx';
import Taxes from '@/features/Settings/Taxes.jsx';
import Vendors from '@/features/Vendors/pages/Vendors';

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

      { path: "domains", element: <Domains /> },
      { path: "domains/:id", element: <CreateDomain /> },
      { path: "domains/edit/:domainId", element: <CreateDomain /> },

      { path: "services", element: <Services /> },
      { path: "services/:id", element: <ServiceDetails /> },
      { path: "services/add", element: <AddService /> },
      { path: "services/:id/edit", element: <AddService /> },

      { path: "vendors", element: <Vendors /> },

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

export default router;
