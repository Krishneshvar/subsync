import React, { useEffect } from "react";
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";
import { Line } from "react-chartjs-2";
import { Card, CardContent } from "@/components/ui/card";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

export default function SubscriptionExpenses({ chartData }) {
  useEffect(() => {
    // Cleanup Chart.js instances on unmount
    return () => {
      Object.values(ChartJS.instances).forEach((instance) => instance.destroy());
    };
  }, []);

  return (
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
                  maintainAspectRatio: false,
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
  );
}
