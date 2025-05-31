import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion.jsx";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table.jsx";
import { format } from "date-fns";

function DisplayCustomer({ customerDetails }) {
  const renderDetails = (label, value, styles = "") => (
    <div className="mb-4">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className={`text-base ${styles}`}>
        {typeof value === "object" && value !== null ? value.label || "N/A" : value ?? "N/A"}
      </p>
    </div>
  );

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
                {customerDetails.customer_status === "Active" &&
                  renderDetails("Customer Status", customerDetails.customer_status, "bg-green-500 text-white py-1 px-2 rounded-lg w-max")}
                {customerDetails.customer_status === "Inactive" &&
                  renderDetails("Customer Status", customerDetails.customer_status, "bg-red-500 text-white py-1 px-2 rounded-lg w-max")}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {renderDetails("Customer ID", customerDetails.customer_id)}
                  {renderDetails("Salutation", customerDetails.salutation)}
                  {renderDetails("First Name", customerDetails.first_name)}
                  {renderDetails("Last Name", customerDetails.last_name)}
                  {renderDetails("Email", customerDetails.primary_email)}
                  {renderDetails("Primary Phone", customerDetails.phone_with_country_code)}
                  {renderDetails("Secondary Phone", customerDetails.secondary_phone_number || "N/A")}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold pb-2 underline">Payment Terms</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {renderDetails("Term Name", customerDetails.payment_terms?.term_name || "N/A")}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold pb-2 underline">Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {renderDetails("Street Address", customerDetails.customer_address?.addressLine)}
                  {renderDetails("City", customerDetails.customer_address?.city)}
                  {renderDetails("State", customerDetails.customer_address?.state)}
                  {renderDetails("Pin Code", customerDetails.customer_address?.zipCode)}
                  {renderDetails("Country", customerDetails.customer_address?.country)}
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
                    {customerDetails.other_contacts?.map((contact, index) => (
                      <TableRow key={index}>
                        <TableCell>{contact.salutation ?? "N/A"}</TableCell>
                        <TableCell>{contact.first_name ?? "N/A"}</TableCell>
                        <TableCell>{contact.last_name ?? "N/A"}</TableCell>
                        <TableCell>{contact.email ?? "N/A"}</TableCell>
                        <TableCell>{contact.phone_number ?? "N/A"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div>
                <h3 className="text-lg font-bold pb-2 underline">Notes</h3>
                {renderDetails("", customerDetails.notes)}
              </div>

              <div>
                <h3 className="text-lg font-bold pb-2 underline">Company</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {renderDetails("Company Name", customerDetails.company_name)}
                  {renderDetails("Display Name", customerDetails.display_name)}
                  {renderDetails("GSTIN", customerDetails.gst_in)}
                  {renderDetails("Currency Code", customerDetails.currency_code)}
                  {renderDetails("GST Treatment", customerDetails.gst_treatment)}
                  {renderDetails("Tax Preference", customerDetails.tax_preference)}
                  {customerDetails.tax_preference !== "Taxable" &&
                    renderDetails("Exemption Reason", customerDetails.exemption_reason)}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 pt-4">
                {renderDetails("Created At", formatTimestamp(customerDetails.created_at))}
                {renderDetails("Updated At", formatTimestamp(customerDetails.updated_at))}
              </div>

              <Link
                to="edit"
                state={{ editableCustomerId: customerDetails.customer_id }}
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
