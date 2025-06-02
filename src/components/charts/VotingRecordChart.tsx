"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { VoteOption } from '@/types/gov'; // Assuming VoteOption is 'Yea', 'Nay', 'Abstain', 'Not Voting'

interface VotingRecordChartProps {
  votingData?: Array<{
    billId: string;
    billSlug?: string;
    billTitle: string;
    vote: VoteOption;
    date?: string;
    summary?: string;
  }>;
}

interface ChartData {
  name: VoteOption;
  count: number;
  bills: string[]; // Store bill titles for tooltip
}

const VOTE_COLORS: Record<VoteOption, string> = {
  Yea: "hsl(var(--chart-1))", // Green
  Nay: "hsl(var(--chart-2))", // Red
  Abstain: "hsl(var(--chart-3))", // Yellow/Orange
  'Not Voting': "hsl(var(--chart-4))", // Gray
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data: ChartData = payload[0].payload;
    return (
      <div className="bg-background border border-border shadow-lg p-3 rounded-md">
        <p className="font-semibold text-foreground">{`${data.name}: ${data.count} vote(s)`}</p>
        {data.bills.length > 0 && (
          <>
            <p className="text-xs text-muted-foreground mt-1 mb-0.5">Bills ({data.bills.length}):</p>
            <ul className="list-disc list-inside text-xs max-h-40 overflow-y-auto">
              {data.bills.map((billTitle, index) => (
                <li key={index} className="truncate" title={billTitle}>{billTitle}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    );
  }
  return null;
};

export const VotingRecordChart: React.FC<VotingRecordChartProps> = ({ votingData }) => {
  if (!votingData || votingData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Voting Record Analysis</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-10">
          <p className="text-muted-foreground">No voting data available for this politician.</p>
        </CardContent>
      </Card>
    );
  }

  const voteCounts = votingData.reduce((acc, record) => {
    acc[record.vote] = (acc[record.vote] || 0) + 1;
    return acc;
  }, {} as Record<VoteOption, number>);

  const chartData: ChartData[] = (Object.keys(VOTE_COLORS) as VoteOption[]).map(voteType => ({
    name: voteType,
    count: voteCounts[voteType] || 0,
    bills: votingData.filter(record => record.vote === voteType).map(r => r.billTitle),
  })).filter(item => item.count > 0); // Only show votes that exist

  if (chartData.length === 0) {
     return (
      <Card>
        <CardHeader>
          <CardTitle>Voting Record Analysis</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-10">
          <p className="text-muted-foreground">No votes recorded in categories (Yea, Nay, Abstain, Not Voting).</p>
        </CardContent>
      </Card>
    );
  }
  
  const totalVotes = chartData.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Voting Record Analysis</CardTitle>
        <CardDescription>
          Summary of votes cast across various bills. Total Votes: {totalVotes}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical" margin={{ right: 30, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" allowDecimals={false} />
            <YAxis type="category" dataKey="name" width={80} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted) / 0.5)' }} />
            {/* <Legend /> // Legend might be redundant if YAxis labels are clear */}
            <Bar dataKey="count" name="Number of Votes" barSize={35}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={VOTE_COLORS[entry.name]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
         <div className="mt-4 text-xs text-muted-foreground">
          {chartData.map(item => (
            <span key={item.name} className="mr-4 inline-flex items-center">
              <span style={{ backgroundColor: VOTE_COLORS[item.name] }} className="w-3 h-3 rounded-sm mr-1.5"></span>
              {item.name}: {item.count}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default VotingRecordChart;
