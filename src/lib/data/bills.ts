
import type { Bill, BillStatus, BillTimelineEvent } from '@/types/gov';

export const mockBills: Bill[] = [
  {
    id: 'b1',
    slug: 'clean-energy-act-2024',
    title: 'Clean Energy Act 2024',
    billNumber: 'S. 567',
    summary: 'A bill to promote investment in renewable energy sources and reduce carbon emissions.',
    purpose: 'To transition the national energy grid towards cleaner sources, create green jobs, and meet international climate targets.',
    sponsors: [{ id: 'p1', name: 'Alice Democratia', type: 'Primary' }],
    status: 'In Committee' as BillStatus,
    introducedDate: '2024-03-15',
    billType: 'Government',
    responsibleMinistry: 'Ministry of Energy',
    houseOfIntroduction: 'Senate',
    parliamentarySession: '3rd Session, 48th Parliament',
    keyDates: {
      introduced: '2024-03-15',
      committeeReferral: '2024-03-18',
    },
    timelineEvents: [
      { date: '2024-03-15', event: 'Bill Introduced in Senate', description: 'First reading by Senator Alice Democratia.' },
      { date: '2024-03-18', event: 'Referred to Committee', description: 'Sent to the Senate Committee on Energy and Natural Resources for review.' },
      { date: '2024-04-05', event: 'Committee Hearing Held', description: 'Public and expert testimonies were heard by the committee.', actor: 'Senate Committee on Energy and Natural Resources' },
    ],
    committees: ['Senate Committee on Energy and Natural Resources'],
    lastActionDate: '2024-04-05',
    lastActionDescription: 'Committee hearing held.',
    impact: 'Amends the National Energy Policy Act of 2005 to include new incentives for solar and wind power.',
    tags: ['energy', 'climate-change', 'renewable-energy', 'government-bill'],
    fullTextUrl: 'https://example.com/s567-text-v1.pdf',
    revisionHistory: [
      {
        id: 'rev-bill-001',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        author: 'EditorAlice',
        event: 'Bill Summary Updated',
        details: 'Clarified language in the bill summary regarding funding allocation.',
        suggestionId: 'sugg_bill_summ_abc'
      },
      {
        id: 'rev-bill-002',
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
        author: 'AdminBob',
        event: 'Sponsor List Amended',
        details: 'Added co-sponsor Rep. Fictional based on parliamentary records.',
      }
    ]
  },
  {
    id: 'b2',
    slug: 'digital-literacy-for-all-act',
    title: 'Digital Literacy For All Act',
    billNumber: 'H.R. 1230',
    summary: 'Provides funding for digital literacy programs in underserved communities.',
    purpose: 'To bridge the digital divide and ensure all citizens have the necessary skills to participate in the modern economy and society.',
    sponsors: [{ id: 'p2', name: 'Bob Republicanus', type: 'Primary' }, { id: 'p1', name: 'Alice Democratia', type: 'Co-Sponsor' }],
    status: 'Passed House' as BillStatus,
    introducedDate: '2023-09-10',
    billType: 'Private Member',
    houseOfIntroduction: 'House',
    parliamentarySession: '2nd Session, 48th Parliament',
    keyDates: {
      introduced: '2023-09-10',
      passedLowerHouse: '2024-02-20',
    },
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
    timelineEvents: [
      { date: '2023-09-10', event: 'Bill Introduced in House', description: 'First reading by Rep. Bob Republicanus.' },
      { date: '2023-10-01', event: 'Referred to Committee', description: 'Sent to House Committee on Education and Labor.'},
      { date: '2024-01-15', event: 'Amendment A1 Proposed', description: 'Amendment to expand program scope.', actor: 'Rep. Fictional', relatedDocumentUrl: 'https://example.com/hr1230-amendment-a1.pdf' },
      { date: '2024-01-20', event: 'Amendment A1 Adopted', description: 'The committee adopted the amendment to expand program scope.'},
      { date: '2024-02-20', event: 'Passed House Vote', description: 'The bill successfully passed the House vote.' }
    ],
    committees: ['House Committee on Education and Labor'],
    lastActionDate: '2024-02-21',
    lastActionDescription: 'Sent to Senate.',
    fullTextUrl: 'https://example.com/hr1230-text-v2.pdf',
    impact: 'Establishes a new grant program under the Department of Education.',
    tags: ['education', 'digital-divide', 'technology', 'social-program', 'private-member-bill'],
  },
];

export function getBillById(id: string): Bill | undefined {
  return mockBills.find(b => b.id === id || b.slug === id);
}

export function getBillsBySponsor(politicianId: string): Bill[] {
  return mockBills.filter(bill =>
    bill.sponsors.some(sponsor => sponsor.id === politicianId)
  );
}

    