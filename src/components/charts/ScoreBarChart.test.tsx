import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ScoreBarChart from './ScoreBarChart';

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
  };
});

describe('ScoreBarChart', () => {
  const mockScoreData = [
    { name: 'Vote Score', value: 75 },
    { name: 'Promise Fulfillment', value: 60 },
  ];

  it('renders without crashing and displays data labels', () => {
    render(<ScoreBarChart data={mockScoreData} />);

    // Check for the data labels (XAxis dataKey="name")
    // These texts are typically part of the chart's XAxis ticks
    expect(screen.getByText('Vote Score')).toBeInTheDocument();
    expect(screen.getByText('Promise Fulfillment')).toBeInTheDocument();

    // Check for the legend item (Bar name="Score")
    // This text is typically part of the chart's Legend
    expect(screen.getByText('Score')).toBeInTheDocument();
  });

  it('renders empty state or handles no data gracefully (if applicable)', () => {
    // Assuming the component has a way to render when no data is passed,
    // or Recharts handles it. If it's expected to throw error or show specific message, test for that.
    // For now, just ensure it doesn't crash with empty data.
    // The component itself doesn't have specific empty state logic, Recharts might render an empty chart.
    render(<ScoreBarChart data={[]} />);
    // We can check that it doesn't throw an error.
    // If there's a legend even with no data, check for it.
    expect(screen.getByText('Score')).toBeInTheDocument(); // Legend might still render
  });
});
