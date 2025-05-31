
import type { Bill } from '@/types/gov';

export const mockBills: Bill[] = [
  {
    id: 'b1',
    title: 'Clean Energy Act 2024',
    billNumber: 'S. 567',
    summary: 'A bill to promote investment in renewable energy sources and reduce carbon emissions.',
    sponsors: [{ id: 'p1', name: 'Alice Democratia', type: 'Primary' }],
    status: 'In Committee',
    introducedDate: '2024-03-15',
    amendmentHistory: [],
    committees: ['Senate Committee on Energy and Natural Resources'],
    lastActionDate: '2024-04-01',
    lastActionDescription: 'Referred to committee.',
  },
  {
    id: 'b2',
    title: 'Digital Literacy For All Act',
    billNumber: 'H.R. 1230',
    summary: 'Provides funding for digital literacy programs in underserved communities.',
    sponsors: [{ id: 'p2', name: 'Bob Republicanus', type: 'Primary' }, { id: 'p1', name: 'Alice Democratia', type: 'Co-Sponsor' }],
    status: 'Passed House',
    introducedDate: '2023-09-10',
    votingResults: {
      house: {
        date: '2024-02-20',
        records: [
          { politicianId: 'p1', politicianName: 'Alice Democratia (Proxy)', vote: 'Yea' },
          { politicianId: 'p2', politicianName: 'Bob Republicanus', vote: 'Yea' },
        ],
        passed: true,
      },
    },
    amendmentHistory: [{ date: '2024-01-15', description: 'Amendment to expand program scope adopted.' }],
    committees: ['House Committee on Education and Labor'],
    lastActionDate: '2024-02-21',
    lastActionDescription: 'Sent to Senate.',
    fullTextUrl: 'https://example.com/hr1230-text'
  },
];

export function getBillById(id: string): Bill | undefined {
  return mockBills.find(b => b.id === id);
}
