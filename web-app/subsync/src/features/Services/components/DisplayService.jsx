import { Link } from "react-router-dom";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent } from "@/components/ui/card.jsx";

import { format } from "date-fns";

function DisplayService({ serviceDetails }) {
  const renderSubDetail = (label, value) => {
    let displayValue = value ?? "N/A";

    if (label.includes("Created At") || label.includes("Updated At")) {
        displayValue = formatTimestamp(value);
    } else if (label.toLowerCase().includes("price") && value !== "N/A") {
        displayValue = `$${parseFloat(value).toFixed(2)}`;
    } else if (label.toLowerCase().includes("tax rates") && value !== "N/A") {
        displayValue = `${value}%`;
    }

    return (
      <div className="mb-2">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-base break-words">{displayValue}</p>
      </div>
    );
  };

  const renderDetails = (label, value, styles = "") => {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mt-1">
            {Object.entries(value).map(([key, subValue]) => {
              const subLabel = key
                .replace(/_/g, ' ')
                .replace(/\b\w/g, char => char.toUpperCase());
              return (
                <div key={key}>
                  {renderSubDetail(subLabel, subValue)}
                </div>
              );
            })}
          </div>
        </div>
      );
    } else {
      const displayValue = value ?? "N/A";
      return (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className={`text-base ${styles}`}>{displayValue}</p>
        </div>
      );
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
      return format(new Date(timestamp), "MMMM dd, yyyy hh:mm a");
    } catch (err) {
      console.error("Invalid date:", err);
      return "Invalid Date";
    }
  };

  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
      <AccordionItem value="service-details">
        <AccordionTrigger className="bg-blue-500 text-white rounded-lg p-4 hover:bg-blue-600 transition-colors">
          <h2 className="text-2xl font-bold">Service Details</h2>
        </AccordionTrigger>
        <AccordionContent>
          <Card>
            <CardContent className="pt-4 space-y-6">
              <div>
                <h3 className="text-lg font-bold pb-2 underline">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {renderDetails("Service ID", serviceDetails.service_id)}
                  {renderDetails("Service Name", serviceDetails.service_name)}
                  {renderDetails("SKU", serviceDetails.stock_keepers_unit)}
                  {renderDetails("Tax Preference", serviceDetails.tax_preference)}
                  {renderDetails("Item Group", serviceDetails.item_group_name)}
                  {renderDetails("Preferred Vendor", serviceDetails.preferred_vendor_name)}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold pb-2 underline">Sales Information</h3>
                {renderDetails("Sales Details", serviceDetails.sales_info)}
              </div>

              <div>
                <h3 className="text-lg font-bold pb-2 underline">Purchase Information</h3>
                {renderDetails("Purchase Details", serviceDetails.purchase_info)}
              </div>

              <div>
                <h3 className="text-lg font-bold pb-2 underline">Tax Rates</h3>
                {renderDetails("Tax Rate Details", serviceDetails.default_tax_rates)}
              </div>

              <div className="flex flex-col md:flex-row gap-4 pt-4">
                {renderDetails("Created At", serviceDetails.created_at)}
                {renderDetails("Updated At", serviceDetails.updated_at)}
              </div>

              <Link
                to="edit"
                state={{ editableServiceId: serviceDetails.service_id }}
                className="block w-full md:w-auto"
              >
                <Button className="bg-blue-500 text-white hover:bg-blue-600 w-full md:w-auto">
                  Edit Service
                </Button>
              </Link>
            </CardContent>
          </Card>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default DisplayService;
