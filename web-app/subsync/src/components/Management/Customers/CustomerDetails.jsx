import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, ChevronDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function CustomerDetails() {
  const { id } = useParams();
  const [customerDetails, setCustomerDetails] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    async function fetchCustomerDetails(id) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/customer/${id}`);
        if (!response.ok) throw new Error("Failed to fetch customer details");

        const data = await response.json();
        setCustomerDetails(data.customer);
        setSubscriptions(data.subscriptions);

        // Process data for chart
        const spendingOverTime = data.subscriptions.reduce((acc, sub) => {
          const startDate = new Date(sub.start_date);
          const endDate = new Date(sub.end_date);
          const monthDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + endDate.getMonth() - startDate.getMonth();
          const monthlySpend = parseFloat(sub.amount) / (monthDiff + 1);

          for (let i = 0; i <= monthDiff; i++) {
            const date = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
            const key = date.toISOString().slice(0, 7); // YYYY-MM
            acc[key] = (acc[key] || 0) + monthlySpend;
          }
          return acc;
        }, {});

        // Create chart data
        const labels = Object.keys(spendingOverTime).sort();
        const dataPoints = labels.map((label) => spendingOverTime[label]);

        setChartData({
          labels,
          datasets: [
            {
              label: "Monthly Spending (₹)",
              data: dataPoints,
              borderColor: "#3b82f6",
              backgroundColor: "rgba(59, 130, 246, 0.2)",
              tension: 0.4,
            },
          ],
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchCustomerDetails(id);
  }, [id]);

  const renderDetails = (label, value) => (
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-lg">{value || "N/A"}</p>
    </div>
  );

  const renderSubscription = (subscription) => (
    <Card key={subscription.sub_id} className="bg-gray-50">
      <CardContent className="p-4">
        {[
          { label: "Subscription ID", value: subscription.sub_id },
          { label: "Product ID", value: subscription.service_id },
          { label: "Price", value: subscription.amount },
          { label: "Start Date", value: new Date(subscription.start_date).toLocaleString() },
          { label: "End Date", value: new Date(subscription.end_date).toLocaleString() },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="text-lg mb-2">{value}</p>
          </div>
        ))}
        <p className="text-sm font-medium text-gray-500">Status</p>
        <Badge
          variant={subscription.status === "active" ? "success" : "secondary"}
          className={
            subscription.status === "active"
              ? "bg-success text-white py-1 px-2"
              : subscription.status === "reminded"
              ? "bg-warning text-white py-1 px-2"
              : subscription.status === "warned"
              ? "bg-danger text-white py-1 px-2"
              : "bg-secondary text-white py-1 px-2"
          }
        >
          {subscription.status}
        </Badge>
      </CardContent>
    </Card>
  );

  if (loading) return <SkeletonLoader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="container mx-auto py-4 px-2 sm:px-2 lg:px-6">
      <Accordion type="single" collapsible className="w-full space-y-4">
        <AccordionItem value="customer-details">
          <AccordionTrigger className="bg-gradient-to-r from-blue-500 to-cyan-500 text-primary-foreground rounded-lg p-4">
            <div className="flex justify-between items-center w-full">
              <h2 className="text-2xl font-bold">Customer Details</h2>
              <Button
                variant=""
                size="icon"
                className="bg-transparent border-none shadow-none"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Edit customer details");
                }}
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit customer details</span>
              </Button>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="grid gap-4 md:grid-cols-2 pt-4">
                {customerDetails ? (
                  <>
                    {[
                      { label: "Customer ID", value: customerDetails[0]?.cid },
                      { label: "Name", value: customerDetails[0]?.cname },
                      { label: "Email", value: customerDetails[0]?.email },
                      { label: "Phone Number", value: customerDetails[0]?.phone },
                      { label: "Address", value: customerDetails[0]?.address },
                      { label: "Created At", value: customerDetails[0]?.created_at ? new Date(customerDetails[0].created_at).toLocaleString() : "" },
                      { label: "Updated At", value: customerDetails[0]?.updated_at ? new Date(customerDetails[0].updated_at).toLocaleString() : "" },
                    ].map(({ label, value }) => renderDetails(label, value))}
                  </>
                ) : (
                  <p className="text-gray-500">Customer details not available.</p>
                )}
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="subscriptions">
          <AccordionTrigger className="bg-gradient-to-r from-blue-500 to-cyan-500 text-primary-foreground rounded-lg p-4">
            <h2 className="text-xl font-bold">Subscriptions</h2>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="pt-4">
                {subscriptions.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {subscriptions.map(renderSubscription)}
                  </div>
                ) : (
                  <p className="text-gray-500">No subscriptions found for this customer.</p>
                )}
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="spending-chart">
          <AccordionTrigger className="bg-gradient-to-r from-blue-500 to-cyan-500 text-primary-foreground rounded-lg p-4">
            <h2 className="text-xl font-bold">Subscription Expenses</h2>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="pt-4">
                {chartData ? (
                  <Line
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: "top" },
                        title: { display: true, text: "Monthly Spending (₹)" },
                      },
                    }}
                    data={chartData}
                  />
                ) : (
                  <p className="text-gray-500">No data available for the chart.</p>
                )}
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

const SkeletonLoader = () => (
  <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <Skeleton className="h-12 w-3/4 mb-4" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-full mb-2" />
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <p className="text-red-500">Error: {message}</p>
  </div>
);
