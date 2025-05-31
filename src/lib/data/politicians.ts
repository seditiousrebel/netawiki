
import type { Politician, AssetDeclaration, CriminalRecord, CommitteeMembership } from '@/types/gov';

const aliceAssetDeclarations: AssetDeclaration[] = [
  { year: 2023, description: 'Primary Residence, Anytown', value: '$500,000 - $750,000', sourceUrl: 'https://example.com/alice-assets-2023.pdf' },
  { year: 2023, description: 'Investment Portfolio (Stocks & Bonds)', value: '$100,000 - $250,000' },
  { year: 2022, description: 'Primary Residence, Anytown', value: '$450,000 - $700,000', sourceUrl: 'https://example.com/alice-assets-2022.pdf' },
];

const bobCriminalRecords: CriminalRecord[] = [
  {
    date: '2019-05-15',
    caseNumber: 'CR-2019-12345',
    offense: 'Campaign Finance Violation (Alleged)',
    court: 'Federal Election Commission',
    status: 'Under Investigation',
    summary: 'Allegations of improper use of campaign funds during the 2018 election cycle. Investigation ongoing.',
    sourceUrl: 'https://example.com/fec-case-12345',
  },
  {
    date: '2021-11-01',
    offense: 'Defamation Lawsuit',
    court: 'Anytown Civil Court',
    status: 'Dismissed',
    summary: 'A defamation lawsuit filed by a political opponent was dismissed by the court.',
  }
];

const aliceCommitteeMemberships: CommitteeMembership[] = [
  { committeeName: 'Senate Committee on Energy and Natural Resources', role: 'Member', startDate: '2021-01-20', endDate: 'Present' },
  { committeeName: 'Joint Economic Committee', role: 'Member', startDate: '2022-03-10', endDate: 'Present' },
  { committeeName: 'City Planning Oversight Committee', role: 'Chair', startDate: '2016-01-01', endDate: '2019-12-31'}
];

const bobCommitteeMemberships: CommitteeMembership[] = [
    { committeeName: 'House Committee on Ways and Means', role: 'Member', startDate: '2019-01-15', endDate: 'Present' },
    { committeeName: 'House Committee on Small Business', role: 'Ranking Member', startDate: '2023-01-10', endDate: 'Present' },
];


export const mockPoliticians: Politician[] = [
  {
    id: 'p1',
    name: 'Alice Democratia',
    partyId: 'party1',
    partyName: 'Blue Unity Party',
    positions: [{ title: 'Senator', startDate: '2020-01-15' }],
    contactInfo: { 
      email: 'alice@example.com', 
      website: 'https://alice.example.com',
      twitter: 'https://twitter.com/AliceDemocratia',
      facebook: 'https://facebook.com/AliceDemocratia',
      linkedin: 'https://linkedin.com/in/AliceDemocratia'
    },
    photoUrl: 'https://placehold.co/300x300.png',
    dataAiHint: 'politician portrait',
    politicalJourney: [
      { date: '2010-05-01', event: 'Elected City Councilor' },
      { date: '2015-11-03', event: 'Elected Mayor' },
      { date: '2020-01-15', event: 'Sworn in as Senator' },
    ],
    bio: 'Alice Democratia is a dedicated public servant with over a decade of experience in governance, championing transparency and citizen engagement.',
    constituency: 'Statewide',
    province: 'Capital Province',
    dateOfBirth: '1975-03-12',
    gender: 'Female',
    education: [
      { institution: 'State University', degree: 'M.A.', field: 'Public Administration', graduationYear: '2005' },
      { institution: 'City College', degree: 'B.A.', field: 'Political Science', graduationYear: '2002' },
    ],
    assetDeclarations: aliceAssetDeclarations,
    criminalRecords: [], // Alice has a clean record for now
    committeeMemberships: aliceCommitteeMemberships,
    overallRating: 4.5,
    voteScore: 78,
    promiseFulfillmentRate: 50, // (1 fulfilled / 2 total promises) * 100
    popularityScore: 85,
  },
  {
    id: 'p2',
    name: 'Bob Republicanus',
    partyId: 'party2',
    partyName: 'Red Alliance Group',
    positions: [{ title: 'Representative', startDate: '2018-01-20' }],
    contactInfo: { 
      email: 'bob@example.com', 
      website: 'https://bob.example.com',
      twitter: 'https://twitter.com/BobRepub',
      instagram: 'https://instagram.com/BobRepubOfficial'
    },
    photoUrl: 'https://placehold.co/300x300.png',
    dataAiHint: 'politician portrait',
    politicalJourney: [
      { date: '2012-08-10', event: 'Founded local business association' },
      { date: '2018-01-20', event: 'Elected as Representative' },
    ],
    bio: 'Bob Republicanus brings a strong business background to his role, focusing on economic growth and fiscal responsibility.',
    constituency: '5th Congressional District',
    province: 'Northern Province',
    dateOfBirth: '1980-09-25',
    gender: 'Male',
    education: [
      { institution: 'Commerce Institute', degree: 'MBA', field: 'Business Administration', graduationYear: '2008' },
      { institution: 'Tech College', degree: 'B.S.', field: 'Economics', graduationYear: '2005' },
    ],
    assetDeclarations: [],
    criminalRecords: bobCriminalRecords,
    committeeMemberships: bobCommitteeMemberships,
    overallRating: 3.8,
    voteScore: 65,
    promiseFulfillmentRate: 0, // (0 fulfilled / 2 total promises) * 100
    popularityScore: 72,
  },
  {
    id: 'p3',
    name: 'Carol Independenta',
    positions: [{ title: 'City Council Member', startDate: '2022-01-01' }],
    contactInfo: { email: 'carol@example.com', website: 'https://carol.example.com' },
    photoUrl: 'https://placehold.co/300x300.png',
    dataAiHint: 'politician portrait',
    politicalJourney: [{ date: '2022-01-01', event: 'Elected to City Council' }],
    bio: 'Carol Independenta is a fresh voice in local politics, advocating for community initiatives.',
    constituency: 'Downtown District',
    province: 'Capital Province',
    dateOfBirth: '1990-06-15',
    gender: 'Female',
    education: [{ institution: 'Community College', degree: 'Associate Degree', field: 'Urban Studies', graduationYear: '2018' }],
    overallRating: 4.1,
    popularityScore: 90,
  },
];

export function getPoliticianById(id: string): Politician | undefined {
  return mockPoliticians.find(p => p.id === id);
}
