
import type { Committee, CommitteeMemberLink, CommitteeMeeting, CommitteeReport, BillReferredToCommittee, CommitteeActivityEvent } from '@/types/gov';
import { mockPoliticians } from './politicians'; // To get politician names
import { mockBills } from './bills'; // To get bill names/numbers

const getPoliticianName = (id: string) => mockPoliticians.find(p => p.id === id)?.name || 'Unknown Politician';
const getBillDetails = (id: string) => mockBills.find(b => b.id === id);

const financeCommitteeMembers: CommitteeMemberLink[] = [
  { politicianId: 'p1', politicianName: getPoliticianName('p1'), role: 'Chairperson', startDate: '2023-01-15' },
  { politicianId: 'p2', politicianName: getPoliticianName('p2'), role: 'Member', startDate: '2023-01-15' },
];

const publicAccountsCommitteeMembers: CommitteeMemberLink[] = [
  { politicianId: 'p2', politicianName: getPoliticianName('p2'), role: 'Chairperson', startDate: '2023-02-01' },
  { politicianId: 'p1', politicianName: getPoliticianName('p1'), role: 'Member', startDate: '2023-02-01' },
];

const financeCommitteeMeetings: CommitteeMeeting[] = [
  { id: 'm1fc', date: '2024-07-15', title: 'Budget Review Meeting', agendaUrl: 'https://example.com/fc-agenda-20240715.pdf', summary: 'Discussed the Q3 budget performance and upcoming Q4 allocations.' },
  { id: 'm2fc', date: '2024-06-20', title: 'Hearing on Economic Stimulus Package', minutesUrl: 'https://example.com/fc-minutes-20240620.pdf' },
];

const financeCommitteeReports: CommitteeReport[] = [
  { id: 'r1fc', title: 'Annual Financial Oversight Report 2023', publicationDate: '2024-03-01', reportUrl: 'https://example.com/fc-annual-report-2023.pdf', reportType: 'Annual' },
];

const financeBillsReferred: BillReferredToCommittee[] = [
  { billId: 'b1', billName: getBillDetails('b1')?.title || 'Clean Energy Act 2024', billNumber: getBillDetails('b1')?.billNumber, referralDate: '2024-03-18', status: 'Reported Out by Committee' },
];

const publicAccountsBillsReferred: BillReferredToCommittee[] = [
   { billId: 'b2', billName: getBillDetails('b2')?.title || 'Digital Literacy For All Act', billNumber: getBillDetails('b2')?.billNumber, referralDate: '2023-10-01', status: 'Under Review by Committee' },
];

const financeCommitteeActivity: CommitteeActivityEvent[] = [
  { date: '2024-05-01', event: 'Inquiry Launched: National Tax System Review', description: 'The committee initiated a comprehensive review of the current national tax system.' },
  { date: '2024-06-10', event: 'Public Hearing: Proposed Banking Sector Reforms', description: 'Held public consultations with stakeholders from the banking industry and consumer groups.', relatedDocumentUrl: 'https://example.com/hearing-notice-banking.pdf'},
  { date: '2024-07-20', event: 'Report Submitted: Mid-Year Budget Performance', description: 'Submitted its mid-year budget performance analysis report to the Parliament.'}
];


export const mockCommittees: Committee[] = [
  {
    id: 'com1',
    slug: 'finance-committee',
    name: 'Finance Committee',
    nepaliName: 'अर्थ समिति',
    committeeType: 'Thematic',
    house: 'House of Representatives',
    mandate: 'To examine public revenue and expenditure, financial bills, and overall economic policies of the government. It also oversees the functioning of the Ministry of Finance and related public financial institutions.',
    members: financeCommitteeMembers,
    contactInfo: {
      email: 'finance.committee@parliament.gov.example',
      phone: '01-5551234',
      officeAddress: 'Room 301, Parliament Building, Capital City',
      website: 'https://parliament.gov.example/committees/finance'
    },
    meetings: financeCommitteeMeetings,
    reports: financeCommitteeReports,
    billsReferred: financeBillsReferred,
    activityTimeline: financeCommitteeActivity,
    tags: ['economy', 'budget', 'taxation', 'public-finance'],
    isActive: true,
    establishmentDate: '2018-08-01',
    dataAiHint: 'meeting room discussion',
    revisionHistory: [
      {
        id: 'rev-committee-001',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        author: 'AdminUserFinance',
        event: 'Committee Mandate Updated',
        details: 'Updated the committee mandate text to reflect new legislative responsibilities regarding digital currencies.',
        suggestionId: 'sugg_committee_mandate_abc'
      },
      {
        id: 'rev-committee-002',
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
        author: 'System',
        event: 'Committee Record Created',
        details: 'Initial record for Finance Committee created.',
      }
    ]
  },
  {
    id: 'com2',
    slug: 'public-accounts-committee',
    name: 'Public Accounts Committee',
    nepaliName: 'सार्वजनिक लेखा समिति',
    committeeType: 'House Committee',
    house: 'National Assembly',
    mandate: 'To scrutinize the accounts showing the appropriation of sums granted by Parliament for the expenditure of the Government, the annual financial accounts of the Government and such other accounts laid before the House as the Committee may think fit.',
    members: publicAccountsCommitteeMembers,
    contactInfo: {
      email: 'pac@parliament.gov.example',
      officeAddress: 'Room 205, Parliament Building, Capital City'
    },
    billsReferred: publicAccountsBillsReferred,
    tags: ['accountability', 'audit', 'public-spending', 'transparency'],
    isActive: true,
    establishmentDate: '2019-01-10',
    dataAiHint: 'government building audit',
  },
  {
    id: 'com3',
    slug: 'education-health-committee',
    name: 'Education and Health Committee',
    committeeType: 'Thematic',
    house: 'House of Representatives',
    mandate: 'To deliberate on policies and legislation concerning education, health, culture, sports, and social welfare. Oversees relevant ministries.',
    members: [
      { politicianId: 'p1', politicianName: getPoliticianName('p1'), role: 'Member', startDate: '2023-01-15' },
    ],
    tags: ['education', 'healthcare', 'social-welfare', 'culture'],
    isActive: true,
    dataAiHint: 'classroom students books',
  },
  {
    id: 'com4',
    slug: 'committee-on-energy-and-natural-resources',
    name: 'Senate Committee on Energy and Natural Resources', // Match exact name from bill for linking
    committeeType: 'House Committee', // Assuming Senate is a "House"
    house: 'Senate',
    mandate: 'Oversees matters related to energy policy, natural resources, public lands, and indigenous affairs.',
    members: [
        { politicianId: 'p1', politicianName: getPoliticianName('p1'), role: 'Member' }
    ],
    billsReferred: [
      { billId: 'b1', billName: getBillDetails('b1')?.title || 'Clean Energy Act 2024', billNumber: getBillDetails('b1')?.billNumber, referralDate: '2024-03-18', status: 'Reported out of Committee' },
    ],
    tags: ['energy', 'environment', 'natural-resources'],
    isActive: true,
    dataAiHint: 'power lines solar panel',
  },
    {
    id: 'com5',
    slug: 'house-committee-on-education-and-labor',
    name: 'House Committee on Education and Labor', // Match exact name from bill for linking
    committeeType: 'House Committee',
    house: 'House',
    mandate: 'Jurisdiction over education and workforce programs.',
    members: [
        { politicianId: 'p2', politicianName: getPoliticianName('p2'), role: 'Member' }
    ],
    billsReferred: [
      { billId: 'b2', billName: getBillDetails('b2')?.title || 'Digital Literacy For All Act', billNumber: getBillDetails('b2')?.billNumber, referralDate: '2023-10-01', status: 'Reported Out by Committee' },
    ],
    tags: ['education', 'labor', 'workforce'],
    isActive: true,
    dataAiHint: 'students graduation cap',
  },
  // Stubs for new committees identified from bills.ts
  {
    id: 'com6',
    slug: 'house-committee-on-energy-and-commerce',
    name: 'House Committee on Energy and Commerce',
    committeeType: 'House Committee',
    house: 'House of Representatives',
    mandate: 'Jurisdiction over energy, commerce, health, environment, and telecommunications.',
    members: [],
    billsReferred: [
      { billId: 'b1', billName: getBillDetails('b1')?.title || 'Clean Energy Act 2024', billNumber: getBillDetails('b1')?.billNumber, referralDate: '2024-07-12', status: 'Pending Review' } // Assuming referral after Senate passage for b1
    ], 
    tags: ['energy', 'commerce', 'health', 'environment'],
    isActive: true,
  },
  {
    id: 'com7',
    slug: 'senate-committee-on-health-education-labor-pensions',
    name: 'Senate Committee on Health, Education, Labor, and Pensions (HELP)',
    committeeType: 'Senate Committee',
    house: 'Senate',
    mandate: 'Oversees matters related to health, education, labor, and pensions.',
    members: [],
    billsReferred: [
      { billId: 'b2', billName: getBillDetails('b2')?.title || 'Digital Literacy For All Act', billNumber: getBillDetails('b2')?.billNumber, referralDate: '2024-02-28', status: 'Reported Favorably' }
    ], 
    tags: ['health', 'education', 'labor', 'pensions'],
    isActive: true,
  },
  {
    id: 'com8',
    slug: 'house-committee-on-science-space-technology',
    name: 'House Committee on Science, Space, and Technology',
    committeeType: 'House Committee',
    house: 'House of Representatives',
    mandate: 'Jurisdiction over non-defense federal scientific research and development.',
    members: [],
    billsReferred: [
      { billId: 'b3', billName: getBillDetails('b3')?.title || 'National AI Research & Development Act 2025', billNumber: getBillDetails('b3')?.billNumber, referralDate: '2025-01-20', status: 'Reported Favorably (Amended)' }
    ], 
    tags: ['science', 'technology', 'space', 'research'],
    isActive: true,
  },
  {
    id: 'com9',
    slug: 'senate-committee-on-commerce-science-transportation',
    name: 'Senate Committee on Commerce, Science, and Transportation',
    committeeType: 'Senate Committee',
    house: 'Senate',
    mandate: 'Oversees commerce, science, technology, and transportation policy.',
    members: [],
    billsReferred: [
      { billId: 'b3', billName: getBillDetails('b3')?.title || 'National AI Research & Development Act 2025', billNumber: getBillDetails('b3')?.billNumber, referralDate: '2025-04-15', status: 'Reported Favorably (Amended)' }
    ], 
    tags: ['commerce', 'science', 'transportation', 'technology'],
    isActive: true,
  },
  {
    id: 'com10',
    slug: 'senate-judiciary-committee',
    name: 'Senate Judiciary Committee',
    committeeType: 'Senate Committee',
    house: 'Senate',
    mandate: 'Oversees federal judiciary, constitutional amendments, and criminal justice.',
    members: [],
    billsReferred: [
      { billId: 'b4', billName: getBillDetails('b4')?.title || 'Accountability in Public Office Act 2024', billNumber: getBillDetails('b4')?.billNumber, referralDate: '2024-02-10', status: 'Reported with No Recommendation' }
    ], 
    tags: ['judiciary', 'law', 'crime', 'constitution'],
    isActive: true,
  },
  {
    id: 'com11',
    slug: 'house-oversight-committee',
    name: 'House Oversight Committee',
    committeeType: 'House Committee',
    house: 'House of Representatives',
    mandate: 'Primary investigative committee in the House.',
    members: [],
    billsReferred: [
      { billId: 'b4', billName: getBillDetails('b4')?.title || 'Accountability in Public Office Act 2024', billNumber: getBillDetails('b4')?.billNumber, referralDate: '2024-04-25', status: 'Voted Against Bill' }
    ], 
    tags: ['oversight', 'investigations', 'government-accountability'],
    isActive: true,
  },
  {
    id: 'com12',
    slug: 'house-committee-on-financial-services',
    name: 'House Committee on Financial Services',
    committeeType: 'House Committee',
    house: 'House of Representatives',
    mandate: 'Jurisdiction over the financial services industry, including banking, insurance, housing, and securities.',
    members: [],
    billsReferred: [
      { billId: 'b5', billName: getBillDetails('b5')?.title || 'Commemorative Coin for Local Hero Act 2024', billNumber: getBillDetails('b5')?.billNumber, referralDate: '2024-07-02', status: 'Failed in Committee Vote' }
    ], 
    tags: ['finance', 'banking', 'insurance', 'housing', 'securities'],
    isActive: true,
  }
];

export function getAllCommittees(): Committee[] {
  return mockCommittees;
}

export function getCommitteeById(idOrSlug: string): Committee | undefined {
  return mockCommittees.find(c => c.id === idOrSlug || c.slug === idOrSlug);
}

export function getCommitteeByName(name: string): Committee | undefined {
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  return mockCommittees.find(c => c.name === name || c.slug === slug);
}
