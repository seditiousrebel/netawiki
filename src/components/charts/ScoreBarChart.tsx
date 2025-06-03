"use client";

import React, { memo } from 'react'; // Import memo
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ScoreBarChartProps {
  data: {
    name: string;
    value: number;
  }[];
}

const ScoreBarChart: React.FC<ScoreBarChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" name="Score" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default memo(ScoreBarChart);
