"use client";

import React, { memo } from 'react'; // Import memo
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ElectionPerformanceDataPoint {
  electionName: string;
  year: number;
  seatsWon?: number;
  votesPercentage?: number;
}

interface ElectionPerformanceChartProps {
  performanceData?: ElectionPerformanceDataPoint[];
  dataKey: 'seatsWon' | 'votesPercentage';
  chartType?: 'line' | 'area';
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ElectionPerformanceDataPoint;
    const chartPayload = payload[0]; // Access the specific payload for the hovered line/area

    return (
      <div className="bg-background border border-border shadow-lg p-3 rounded-md">
        <p className="font-semibold text-foreground">{`${data.electionName}`}</p>
        <p className="text-sm text-muted-foreground">Year: {data.year}</p>
        {chartPayload.name === 'seatsWon' && data.seatsWon !== undefined && (
          <p style={{ color: chartPayload.stroke || chartPayload.fill }}>Seats Won: {data.seatsWon}</p>
        )}
        {chartPayload.name === 'votesPercentage' && data.votesPercentage !== undefined && (
          <p style={{ color: chartPayload.stroke || chartPayload.fill }}>Vote %: {data.votesPercentage.toFixed(1)}%</p>
        )}
      </div>
    );
  }
  return null;
};

export const ElectionPerformanceChart: React.FC<ElectionPerformanceChartProps> = ({
  performanceData,
  dataKey, // 'seatsWon' or 'votesPercentage'
  chartType = 'line', // Default to line chart
}) => {
  if (!performanceData || performanceData.length < 2) { // Need at least 2 points for a meaningful chart
    return (
      <Card>
        <CardHeader>
          <CardTitle>Election Performance Over Time</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-10">
          <p className="text-muted-foreground">Not enough data to display election performance chart.</p>
          <p className="text-xs text-muted-foreground">At least two election records are needed.</p>
        </CardContent>
      </Card>
    );
  }

  // Sort data by year to ensure the line/area chart connects points chronologically
  const sortedData = [...performanceData].sort((a, b) => a.year - b.year);
  
  const yAxisLabel = dataKey === 'seatsWon' ? 'Seats Won' : 'Vote Percentage (%)';
  const lineName = dataKey === 'seatsWon' ? 'Seats Won' : 'Vote %';
  const strokeColor = dataKey === 'seatsWon' ? "hsl(var(--chart-2))" : "hsl(var(--chart-1))";


  const ChartComponent = chartType === 'area' ? AreaChart : LineChart;
  const ChartLineComponent = chartType === 'area' ? Area : Line;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Election Performance: {yAxisLabel}</CardTitle>
        <CardDescription>
          Shows the party's performance in general elections over the years based on {lineName.toLowerCase()}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ChartComponent data={sortedData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="year" 
              tickFormatter={(year) => String(year)} 
              padding={{ left: 20, right: 20 }} 
            />
            <YAxis 
              label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', offset: 0 }}
              allowDecimals={dataKey === 'votesPercentage'}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }}/>
            <Legend />
            <ChartLineComponent
              type="monotone"
              dataKey={dataKey}
              name={lineName}
              stroke={strokeColor}
              fillOpacity={chartType === 'area' ? 0.3 : 1}
              fill={chartType === 'area' ? strokeColor : "none"}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </ChartComponent>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default memo(ElectionPerformanceChart);
