"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Bill, BillStatus } from '@/types/gov';

interface BillStatusChartProps {
  billData: Bill[];
}

const BillStatusChart: React.FC<BillStatusChartProps> = ({ billData }) => {
  if (!billData || billData.length === 0) {
    return <p>No bill data available to display status chart.</p>;
  }

  const statusCounts: { [key in BillStatus]?: number } = {};
  billData.forEach(bill => {
    statusCounts[bill.status] = (statusCounts[bill.status] || 0) + 1;
  });

  const chartData = Object.entries(statusCounts)
    .map(([name, value]) => ({ name, value: value || 0 }))
    .sort((a, b) => b.value - a.value); // Sort by count descending

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 75, // Increased bottom margin for angled labels
        }}
        layout="vertical" // Use vertical layout for better readability of status names
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis
          dataKey="name"
          type="category"
          width={150} // Adjust width to fit status names
          interval={0} // Show all labels
          // Angled labels are harder with vertical bar charts, consider horizontal if too many statuses
        />
        <Tooltip formatter={(value: number, name: string) => [value, `Status: ${name}`]}/>
        <Legend />
        <Bar dataKey="value" fill="#82ca9d" name="Number of Bills" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BillStatusChart;
