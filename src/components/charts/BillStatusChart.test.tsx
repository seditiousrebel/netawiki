import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BillStatusChart from './BillStatusChart';
import type { Bill } from '@/types/gov'; // Import Bill type

// Mock Recharts ResponsiveContainer
jest.mock('recharts', () => {
  const OriginalRecharts = jest.requireActual('recharts');
  return {
    ...OriginalRecharts,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <OriginalRecharts.ResponsiveContainer width={800} height={500}>
        {children}
      </OriginalRecharts.ResponsiveContainer>
    ),
     // Mocking Tooltip as it can sometimes cause issues with positioning in JSDOM
    Tooltip: ({ active, payload, label }: any) => {
      if (active && payload && payload.length) {
        return (
          <div className="custom-tooltip" data-testid="recharts-tooltip">
            <p className="label">{`Status: ${label}`}</p>
            <p className="intro">{`Number of Bills : ${payload[0].value}`}</p>
          </div>
        );
      }
      return null;
    },
  };
});

describe('BillStatusChart', () => {
  const mockBillData: Bill[] = [
    { id: '1', title: 'Bill 1', status: 'Passed', introducedDate: '2023-01-01', sponsors: [], timelineEvents: [], billNumber: 'B1', summary: 'Summary 1' },
    { id: '2', title: 'Bill 2', status: 'Introduced', introducedDate: '2023-01-02', sponsors: [], timelineEvents: [], billNumber: 'B2', summary: 'Summary 2' },
    { id: '3', title: 'Bill 3', status: 'Passed', introducedDate: '2023-01-03', sponsors: [], timelineEvents: [], billNumber: 'B3', summary: 'Summary 3' },
    { id: '4', title: 'Bill 4', status: 'In Committee', introducedDate: '2023-01-04', sponsors: [], timelineEvents: [], billNumber: 'B4', summary: 'Summary 4' },
    { id: '5', title: 'Bill 5', status: 'Introduced', introducedDate: '2023-01-05', sponsors: [], timelineEvents: [], billNumber: 'B5', summary: 'Summary 5' },
  ];

  it('renders without crashing and displays bill statuses and legend', () => {
    render(<BillStatusChart billData={mockBillData} />);

    // Check for status names (YAxis dataKey="name")
    expect(screen.getByText('Passed')).toBeInTheDocument();
    expect(screen.getByText('Introduced')).toBeInTheDocument();
    expect(screen.getByText('In Committee')).toBeInTheDocument();

    // Check for the legend item (Bar name="Number of Bills")
    expect(screen.getByText('Number of Bills')).toBeInTheDocument();
  });

  it('renders empty state message when no data is provided', () => {
    render(<BillStatusChart billData={[]} />);
    expect(screen.getByText('No bill data available to display status chart.')).toBeInTheDocument();
  });

  // Note: Testing specific bar values (e.g., "2" for "Passed") can be brittle if Recharts
  // renders values in a way that's hard to query directly without deep inspection of SVG.
  // The presence of status labels and legend is a good basic check.
  // If Tooltip were more complex and rendered, we could try to trigger it and check its content.
});
