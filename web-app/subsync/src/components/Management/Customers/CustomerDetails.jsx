import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DisplayCustomer from "./DisplayCustomer";
import { Skeleton } from "@/components/ui/skeleton";

export default function CustomerDetails() {
  const { id } = useParams();
  const [customerDetails, setCustomerDetails] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCustomerDetails(id) {
      try {
        // Simulate fetching subscriptions if table is unavailable
        const mockSubscriptions = [
          {
            start_date: "2024-01-01",
            end_date: "2024-06-01",
            amount: "1200.00",
          },
          {
            start_date: "2023-11-01",
            end_date: "2024-03-01",
            amount: "500.00",
          },
        ];

        const response = await fetch(`${import.meta.env.VITE_API_URL}/customer/${id}`);
        if (!response.ok) throw new Error("Failed to fetch customer details");

        const data = await response.json();
        setCustomerDetails(data.customer);

        // Use real subscriptions or mock data
        const subscriptionData = mockSubscriptions; //data.subscriptions.length > 0 ? data.subscriptions : mockSubscriptions;
        setSubscriptions(subscriptionData);

        // Process chart data
        const spendingOverTime =
          subscriptionData.length > 0
            ? subscriptionData.reduce((acc, sub) => {
                const startDate = new Date(sub.start_date);
                const endDate = new Date(sub.end_date);
                const monthDiff =
                  (endDate.getFullYear() - startDate.getFullYear()) * 12 +
                  endDate.getMonth() -
                  startDate.getMonth();
                const monthlySpend = parseFloat(sub.amount) / (monthDiff + 1);

                for (let i = 0; i <= monthDiff; i++) {
                  const date = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
                  const key = date.toISOString().slice(0, 7); // YYYY-MM
                  acc[key] = (acc[key] || 0) + monthlySpend;
                }
                return acc;
              }, {})
            : {}; // Fallback for empty subscriptions

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

  if (loading) return <SkeletonLoader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="container mx-auto py-4 px-2 sm:px-2 lg:px-6">
      <DisplayCustomer
        customerDetails={customerDetails}
        subscriptions={subscriptions}
        chartData={chartData}
      />
    </div>
  );
}

const SkeletonLoader = () => (
  <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <Skeleton className="h-12 w-3/4 mb-4" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-full mb-2" />
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <p className="text-red-500">Error: {message}</p>
  </div>
);
