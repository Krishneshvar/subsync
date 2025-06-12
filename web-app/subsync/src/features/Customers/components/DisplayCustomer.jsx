import { Link } from "react-router-dom";
import { format } from "date-fns";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table.jsx";

function DisplayCustomer({ customerDetails }) {
  const renderDetails = (label, value, styles = "") => {
    const displayValue = typeof value === "object" && value !== null && !Array.isArray(value)
      ? (value.label || "N/A")
      : (value ?? "N/A");

    return (
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className={`text-base ${styles}`}>
          {displayValue}
        </p>
      </div>
    );
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

  const getStatusBadgeClass = (status) => {
    if (status === "Active") return "bg-green-500 text-white py-1 px-2 rounded-lg w-max";
    if (status === "Inactive") return "bg-red-500 text-white py-1 px-2 rounded-lg w-max";
    return "";
  };

  return (
    <Accordion type="single" collapsible defaultValue="customer-details" className="w-full space-y-4">
      <AccordionItem value="customer-details">
        <AccordionTrigger className="bg-blue-500 text-white rounded-lg p-4 hover:bg-blue-600 transition-colors">
          <h2 className="text-2xl font-bold">Customer Details</h2>
        </AccordionTrigger>
        <AccordionContent>
          <Card>
            <CardContent className="pt-4 space-y-6 overflow-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-white max-h-[70vh]">

              <div>
                <h3 className="text-lg font-bold pb-2 underline">Customer</h3>
                {customerDetails.customerStatus && (
                  renderDetails("Customer Status", customerDetails.customerStatus, getStatusBadgeClass(customerDetails.customerStatus))
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {renderDetails("Customer ID", customerDetails.customerId)}
                  {renderDetails("Salutation", customerDetails.salutation)}
                  {renderDetails("First Name", customerDetails.firstName)}
                  {renderDetails("Last Name", customerDetails.lastName)}
                  {renderDetails("Email", customerDetails.primaryEmail)}
                  {renderDetails("Primary Phone", customerDetails.primaryPhoneNumber)}
                  {renderDetails("Secondary Phone", customerDetails.secondaryPhoneNumber || "N/A")}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold pb-2 underline">Payment Terms</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {renderDetails("Term Name", customerDetails.paymentTerms?.termName || "N/A")}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold pb-2 underline">Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {renderDetails("Street Address", customerDetails.customerAddress?.addressLine)}
                  {renderDetails("City", customerDetails.customerAddress?.city)}
                  {renderDetails("State", customerDetails.customerAddress?.state)}
                  {renderDetails("Zip Code", customerDetails.customerAddress?.zipCode)}
                  {renderDetails("Country", customerDetails.customerAddress?.country)}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold pb-2 underline">Other Contacts</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Salutation</TableHead>
                      <TableHead>First Name</TableHead>
                      <TableHead>Last Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone Number</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerDetails.otherContacts?.length > 0 ? (
                      customerDetails.otherContacts.map((contact, index) => (
                        <TableRow key={index}>
                          <TableCell>{contact.salutation ?? "N/A"}</TableCell>
                          <TableCell>{contact.firstName ?? "N/A"}</TableCell>
                          <TableCell>{contact.lastName ?? "N/A"}</TableCell>
                          <TableCell>{contact.email ?? "N/A"}</TableCell>
                          <TableCell>{contact.phoneNumber ?? "N/A"}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan="5" className="text-center text-gray-500">
                          No other contacts found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Notes */}
              <div>
                <h3 className="text-lg font-bold pb-2 underline">Notes</h3>
                {renderDetails("", customerDetails.notes)}
              </div>

              <div>
                <h3 className="text-lg font-bold pb-2 underline">Company</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {renderDetails("Company Name", customerDetails.companyName)}
                  {renderDetails("Display Name", customerDetails.displayName)}
                  {renderDetails("GSTIN", customerDetails.gstin)}
                  {renderDetails("Currency Code", customerDetails.currencyCode)}
                  {renderDetails("GST Treatment", customerDetails.gstTreatment)}
                  {renderDetails("Tax Preference", customerDetails.taxPreference)}
                  {customerDetails.taxPreference !== "Taxable" && (
                    renderDetails("Exemption Reason", customerDetails.exemptionReason)
                  )}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 pt-4">
                {renderDetails("Created At", formatTimestamp(customerDetails.createdAt))}
                {renderDetails("Updated At", formatTimestamp(customerDetails.updatedAt))}
              </div>

              <Link
                to="edit"
                state={{ editableCustomerId: customerDetails.customerId }}
                className="block w-full md:w-auto"
              >
                <Button className="bg-blue-500 text-white hover:bg-blue-600 w-full md:w-auto">
                  Edit Customer
                </Button>
              </Link>
            </CardContent>
          </Card>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default DisplayCustomer;
