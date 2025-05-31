
import type { PromiseItem, PromiseStatus, PromiseEvidenceLink, PromiseStatusUpdate } from '@/types/gov';

export const mockPromises: PromiseItem[] = [
  {
    id: 'pr1',
    slug: 'improve-public-parks-state',
    politicianId: 'p1',
    partyId: 'party1', // Blue Unity Party
    title: 'Improve Public Parks Statewide',
    description: 'Invest $5 million in upgrading and maintaining public parks across the state, focusing on accessibility and green spaces.',
    category: 'Infrastructure',
    subCategory: 'Urban Development',
    datePromised: '2020-02-01',
    sourceType: 'Election Manifesto',
    sourceDetails: 'Page 12, Section 3.1 of the 2020 BUP Manifesto',
    geographicScope: 'Provincial', // Assuming p1 is a state/provincial level politician
    expectedFulfillmentDate: '2025-12-31',
    status: 'In Progress' as PromiseStatus,
    fulfillmentPercentage: 40,
    responsibleAgency: 'State Department of Parks and Recreation',
    evidenceLinks: [
      { url: 'https://example.com/park-project-updates', description: 'Official Park Project Updates Portal', type: 'official_report' },
      { url: 'https://example.com/news/park-groundbreaking', description: 'News Article: Groundbreaking Ceremony for Central Park', type: 'article'}
    ],
    statusUpdateHistory: [
      { date: '2020-02-01', status: 'Pending', description: 'Promise made during election campaign.' },
      { date: '2021-06-15', status: 'In Progress', description: 'Budget allocated and planning phase initiated.', fulfillmentPercentage: 10 },
      { date: '2023-03-01', status: 'In Progress', description: 'Construction started in 3 major parks.', fulfillmentPercentage: 40, updatedBy: 'System' }
    ],
    tags: ['urban-renewal', 'public-spaces', 'environment', 'accessibility'],
    revisionHistory: [
      {
        id: 'rev-promise-pr1-001',
        date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago
        author: 'AdminUser',
        event: 'Promise Status Updated',
        details: 'Status changed from "In Progress" (30%) to "In Progress" (40%) with new park groundbreaking ceremonies.',
        suggestionId: 'sugg_promise_status_update_def'
      },
      {
        id: 'rev-promise-pr1-002',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        author: 'EditorBob',
        event: 'Evidence Link Added',
        details: 'Added new link to news article about groundbreaking ceremony.',
      }
    ]
  },
  {
    id: 'pr2',
    slug: 'increase-teacher-salaries-national',
    politicianId: 'p1',
    title: 'Increase National Teacher Salaries by 10%',
    description: 'Raise average teacher salaries across the nation by 10% within the first term to attract and retain talent.',
    category: 'Education',
    subCategory: 'Teacher Welfare',
    datePromised: '2020-03-15',
    sourceType: 'Public Speech',
    sourceDetails: 'Campaign rally, Capital City, March 15, 2020',
    geographicScope: 'National',
    expectedFulfillmentDate: '2024-06-30',
    actualFulfillmentDate: '2024-05-20',
    status: 'Fulfilled' as PromiseStatus,
    fulfillmentPercentage: 100,
    responsibleAgency: 'Ministry of Education',
    evidenceLinks: [
      { url: 'https://example.com/teacher-salary-report-2024', description: 'Official Salary Report 2024', type: 'document' },
      { url: 'https://example.com/gazette/teachers-pay-rise', description: 'Government Gazette Notification', type: 'document' }
    ],
    statusUpdateHistory: [
      { date: '2020-03-15', status: 'Pending', description: 'Promise announced.'},
      { date: '2022-01-10', status: 'In Progress', description: 'Negotiations with teacher unions started.', fulfillmentPercentage: 25, updatedBy: 'AdminUser1' },
      { date: '2023-07-01', status: 'Partially Fulfilled', description: '5% increase implemented.', fulfillmentPercentage: 50 },
      { date: '2024-05-20', status: 'Fulfilled', description: 'Remaining 5% increase and associated benefits finalized.', fulfillmentPercentage: 100, updatedBy: 'System' }
    ],
    tags: ['education-reform', 'teacher-pay', 'workforce-development'],
  },
  {
    id: 'pr3',
    slug: 'reduce-business-taxes-rag',
    politicianId: 'p2',
    partyId: 'party2', // Red Alliance Group
    title: 'Reduce Corporate Taxes by 5%',
    description: 'Implement a 5% reduction in corporate taxes to stimulate economic growth and create jobs.',
    category: 'Economy',
    subCategory: 'Taxation Policy',
    datePromised: '2018-03-01',
    sourceType: 'Election Manifesto',
    sourceDetails: '2018 RAG Manifesto, Economic Section, p.5',
    geographicScope: 'National',
    expectedFulfillmentDate: '2023-09-01',
    status: 'Broken' as PromiseStatus,
    fulfillmentPercentage: 0,
    reasonForStatus: 'Economic downturn and subsequent budget reallocations prevented implementation.',
    evidenceLinks: [
      { url: 'https://example.com/finance-ministry-statement-2023', description: 'Finance Ministry Statement on Budget Priorities 2023', type: 'official_report'}
    ],
    statusUpdateHistory: [
       { date: '2018-03-01', status: 'Pending', description: 'Promise made.'},
       { date: '2022-10-01', status: 'Stalled', description: 'Policy review delayed due to unforeseen economic challenges.'},
       { date: '2023-09-05', status: 'Broken', description: 'Government announced that the tax cut will not be implemented in the current term.'}
    ],
    tags: ['tax-cuts', 'business-stimulus', 'economic-policy'],
  },
  {
    id: 'pr4',
    slug: 'fund-small-business-startups-national',
    politicianId: 'p2',
    title: 'Fund Small Business Startups Nationally',
    description: 'Allocate $10 million in grants for small business startups to foster innovation and entrepreneurship.',
    category: 'Economy',
    subCategory: 'Entrepreneurship',
    datePromised: '2018-05-10',
    sourceType: 'Interview',
    sourceDetails: 'Interview with Business Today Magazine, May 2018 Issue',
    geographicScope: 'National',
    status: 'Pending' as PromiseStatus,
    fulfillmentPercentage: 0,
    responsibleAgency: 'Ministry of Commerce and Industry',
    evidenceLinks: [],
    statusUpdateHistory: [
       { date: '2018-05-10', status: 'Pending', description: 'Promise announced during interview.'}
    ],
    tags: ['small-business', 'startup-funding', 'innovation'],
  },
  {
    id: 'pr5',
    slug: 'national-digital-literacy-program-bup',
    partyId: 'party1', // Blue Unity Party
    title: 'National Digital Literacy Program',
    description: 'Launch a nationwide program to enhance digital literacy for all age groups, providing access to training and resources.',
    category: 'Education',
    subCategory: 'Digital Skills',
    datePromised: '2024-01-10',
    sourceType: 'Party Manifesto',
    sourceDetails: 'BUP 2024 Manifesto, Chapter 4: "A Digital Future"',
    geographicScope: 'National',
    expectedFulfillmentDate: '2026-12-31',
    status: 'Pending' as PromiseStatus,
    fulfillmentPercentage: 0,
    responsibleAgency: 'Ministry of Information and Technology',
    evidenceLinks: [
      { url: 'https://blueunity.example.com/manifesto-2024.pdf#digital-literacy', description: 'Manifesto Commitment (Section 4.2)', type: 'document' }
    ],
     statusUpdateHistory: [
       { date: '2024-01-10', status: 'Pending', description: 'Promise included in official party manifesto.'}
    ],
    tags: ['digital-divide', 'tech-education', 'skills-development'],
  },
  {
    id: 'pr6',
    slug: 'cancel-highway-project-constituency-x',
    politicianId: 'p3', // Carol Independenta (assuming p3 exists)
    title: 'Cancel Controversial Highway Project in District X',
    description: 'Halt the planned construction of the B47 highway extension due to environmental concerns and lack of community consultation.',
    category: 'Governance',
    subCategory: 'Public Consultation',
    datePromised: '2022-02-15',
    sourceType: 'Public Speech',
    sourceDetails: 'Town Hall Meeting, District X, Feb 15, 2022',
    geographicScope: 'Constituency', // Or District
    expectedFulfillmentDate: '2022-08-01',
    status: 'Fulfilled' as PromiseStatus, // The promise was TO CANCEL, and it was.
    actualFulfillmentDate: '2022-07-20', // Date project was officially cancelled
    fulfillmentPercentage: 100,
    reasonForStatus: 'Promise was to cancel the project, and the project was officially halted by the local council following advocacy.',
    responsibleAgency: 'District X Local Council',
    evidenceLinks: [
      { url: 'https://example.com/district-x-council-meeting-minutes-july2022.pdf', description: 'Council Meeting Minutes - Highway Project Cancelled', type: 'document' }
    ],
    statusUpdateHistory: [
       { date: '2022-02-15', status: 'Pending', description: 'Pledged to work towards cancelling the project.'},
       { date: '2022-07-20', status: 'Fulfilled', description: 'Highway project officially cancelled by council vote.', fulfillmentPercentage: 100, updatedBy: 'CommunityActionGroup' }
    ],
    tags: ['environmental-protection', 'community-rights', 'infrastructure-opposition'],
  }
];

export function getPromisesByPolitician(politicianId: string): PromiseItem[] {
  return mockPromises.filter(p => p.politicianId === politicianId);
}

export function getPromisesByPartyId(partyId: string): PromiseItem[] {
  return mockPromises.filter(p => p.partyId === partyId);
}

export function getPromiseById(id: string): PromiseItem | undefined {
  return mockPromises.find(p => p.id === id || p.slug === id);
}
