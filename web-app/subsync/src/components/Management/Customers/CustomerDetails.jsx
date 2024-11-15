import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function CustomerDetails() {
  const { id } = useParams();
  const [customerDetails, setCustomerDetails] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [spendingData, setSpendingData] = useState([]);

  useEffect(() => {
    async function fetchCustomerDetails(id) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/customer/${id}`);
        if (!response.ok) throw new Error("Failed to fetch customer details");
  
        const data = await response.json();
        setCustomerDetails(data.customer);
        setSubscriptions(data.subscriptions);
        
        // Process subscription data for the chart
        const spendingOverTime = data.subscriptions.reduce((acc, sub) => {
          const startDate = new Date(sub.start_date);
          const endDate = new Date(sub.end_date);
          const monthDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + endDate.getMonth() - startDate.getMonth();
          const monthlySpend = parseFloat(sub.amount) / monthDiff;
  
          for (let i = 0; i <= monthDiff; i++) {
            const date = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
            const key = date.toISOString().slice(0, 7); // YYYY-MM format
            acc[key] = (acc[key] || 0) + monthlySpend;
          }
          return acc;
        }, {});
  
        // Convert the object into an array for the chart
        const chartData = Object.entries(spendingOverTime)
          .map(([date, amount]) => ({
            date,
            amount: Number(amount.toFixed(2)),
          }))
          .sort((a, b) => new Date(a.date) - new Date(b.date));
  
        setSpendingData(chartData); // Now it's an array
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
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-primary-foreground">
          <CardTitle className="text-2xl font-bold">Customer Details</CardTitle>
          <Button variant="" size="icon" className="bg-transparent border-none shadow-none" onClick={() => console.log("Edit customer details")}>
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit customer details</span>
          </Button>
        </CardHeader>
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

      <Card className="mb-8">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-primary-foreground">
          <CardTitle className="text-xl font-bold">Subscriptions</CardTitle>
        </CardHeader>
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

      <Card>
        <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-primary-foreground">
          <CardTitle className="text-xl font-bold">Subscription Spending Over Time</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={spendingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(tick) => new Date(tick).toLocaleDateString()}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis />
                <Tooltip labelFormatter={(label) => new Date(label).toLocaleDateString()} formatter={(value) => [`₹${value}`, "Amount"]} />
                <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
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
