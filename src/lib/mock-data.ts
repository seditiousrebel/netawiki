import type { Politician, Party, PromiseItem, Bill, PromiseStatus } from '@/types/gov';

export const mockPoliticians: Politician[] = [
  {
    id: 'p1',
    name: 'Alice Democratia',
    partyId: 'party1',
    partyName: 'Blue Unity Party',
    positions: [{ title: 'Senator', startDate: '2020-01-15' }],
    contactInfo: { email: 'alice@example.com', website: 'https://alice.example.com' },
    photoUrl: 'https://placehold.co/300x300.png',
    dataAiHint: 'politician portrait',
    politicalJourney: [
      { date: '2010-05-01', event: 'Elected City Councilor' },
      { date: '2015-11-03', event: 'Elected Mayor' },
      { date: '2020-01-15', event: 'Sworn in as Senator' },
    ],
    bio: 'Alice Democratia is a dedicated public servant with over a decade of experience in governance, championing transparency and citizen engagement.',
    district: 'Statewide',
    dateOfBirth: '1975-03-12',
    gender: 'Female',
    education: [
      { institution: 'State University', degree: 'M.A.', field: 'Public Administration', graduationYear: '2005' },
      { institution: 'City College', degree: 'B.A.', field: 'Political Science', graduationYear: '2002' },
    ],
  },
  {
    id: 'p2',
    name: 'Bob Republicanus',
    partyId: 'party2',
    partyName: 'Red Alliance Group',
    positions: [{ title: 'Representative', startDate: '2018-01-20' }],
    contactInfo: { email: 'bob@example.com', website: 'https://bob.example.com' },
    photoUrl: 'https://placehold.co/300x300.png',
    dataAiHint: 'politician portrait',
    politicalJourney: [
      { date: '2012-08-10', event: 'Founded local business association' },
      { date: '2018-01-20', event: 'Elected as Representative' },
    ],
    bio: 'Bob Republicanus brings a strong business background to his role, focusing on economic growth and fiscal responsibility.',
    district: '5th Congressional District',
    dateOfBirth: '1980-09-25',
    gender: 'Male',
    education: [
      { institution: 'Commerce Institute', degree: 'MBA', field: 'Business Administration', graduationYear: '2008' },
      { institution: 'Tech College', degree: 'B.S.', field: 'Economics', graduationYear: '2005' },
    ],
  },
];

export const mockParties: Party[] = [
  {
    id: 'party1',
    name: 'Blue Unity Party',
    leadership: [{ name: 'Eleanor Vanguard', role: 'Party Chair' }],
    contactInfo: { website: 'https://blueunity.example.com' },
    logoUrl: 'https://placehold.co/200x200.png',
    dataAiHint: 'party logo',
    history: 'Founded in 1990 with a focus on social justice and environmental protection.',
    electionSymbolUrl: 'https://placehold.co/100x100.png',
    ideology: ['Progressivism', 'Environmentalism'],
    foundedDate: '1990-07-04',
  },
  {
    id: 'party2',
    name: 'Red Alliance Group',
    leadership: [{ name: 'Marcus Standard', role: 'Party Leader' }],
    contactInfo: { website: 'https://redalliance.example.com' },
    logoUrl: 'https://placehold.co/200x200.png',
    dataAiHint: 'party logo',
    history: 'Established in 1985, advocating for free markets and individual liberties.',
    electionSymbolUrl: 'https://placehold.co/100x100.png',
    ideology: ['Conservatism', 'Libertarianism'],
    foundedDate: '1985-02-15',
  },
];

export const mockPromises: PromiseItem[] = [
  {
    id: 'pr1',
    politicianId: 'p1',
    title: 'Improve Public Parks',
    description: 'Invest $5 million in upgrading and maintaining public parks across the state.',
    dueDate: '2025-12-31',
    status: 'In Progress' as PromiseStatus,
    evidenceLinks: [{ url: 'https://example.com/park-project-updates', description: 'Park Project Updates' }],
    category: 'Infrastructure',
    datePromised: '2020-02-01',
  },
  {
    id: 'pr2',
    politicianId: 'p1',
    title: 'Increase Teacher Salaries',
    description: 'Raise average teacher salaries by 10% within the first term.',
    dueDate: '2024-06-30',
    status: 'Fulfilled' as PromiseStatus,
    evidenceLinks: [{ url: 'https://example.com/teacher-salary-report', description: 'Salary Report 2024' }],
    category: 'Education',
    datePromised: '2020-03-15',
    dateCompleted: '2024-05-20',
  },
  {
    id: 'pr3',
    politicianId: 'p2',
    title: 'Reduce Business Taxes',
    description: 'Implement a 5% reduction in corporate taxes to stimulate economic growth.',
    dueDate: '2023-09-01',
    status: 'Broken' as PromiseStatus,
    evidenceLinks: [],
    category: 'Economy',
    datePromised: '2018-03-01',
  },
  {
    id: 'pr4',
    politicianId: 'p2',
    title: 'Fund Small Business Startups',
    description: 'Allocate $10 million in grants for small business startups.',
    status: 'Pending' as PromiseStatus,
    evidenceLinks: [],
    category: 'Economy',
    datePromised: '2018-05-10',
  },
];

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

export function getPoliticianById(id: string): Politician | undefined {
  return mockPoliticians.find(p => p.id === id);
}

export function getPartyById(id: string): Party | undefined {
  return mockParties.find(p => p.id === id);
}

export function getPromisesByPolitician(politicianId: string): PromiseItem[] {
  return mockPromises.filter(p => p.politicianId === politicianId);
}

export function getBillById(id: string): Bill | undefined {
  return mockBills.find(b => b.id === id);
}
