
import type { Politician, AssetDeclaration, CriminalRecord, CommitteeMembership, StatementQuote, PartyAffiliation } from '@/types/gov';

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

const aliceStatementsAndQuotes: StatementQuote[] = [
  {
    id: 'sq1',
    quoteText: "Transparency is not just a buzzword; it's the bedrock of a healthy democracy. We must strive for openness in all governmental affairs.",
    sourceName: "Annual State of the Union Speech",
    sourceUrl: "https://example.com/speech-transcript",
    dateOfStatement: "2024-01-20",
  },
  {
    id: 'sq2',
    quoteText: "Investing in education is investing in our future. Every child deserves access to quality learning resources.",
    sourceName: "Education Summit Keynote",
    dateOfStatement: "2023-11-05",
  },
];

const bobStatementsAndQuotes: StatementQuote[] = [
  {
    id: 'sq3',
    quoteText: "Fiscal responsibility and a balanced budget are paramount to ensuring long-term economic stability for our nation.",
    sourceName: "Chamber of Commerce Address",
    dateOfStatement: "2024-02-10",
  }
];

const alicePartyAffiliations: PartyAffiliation[] = [
  { partyId: 'party0', partyName: 'Student Progressive Front', role: 'Regional Secretary', startDate: '2000-09-01', endDate: '2002-05-30' },
  { partyId: 'party1', partyName: 'Blue Unity Party', role: 'Member', startDate: '2008-01-15' /* Current */ }
];

const bobPartyAffiliations: PartyAffiliation[] = [
  { partyId: 'party2', partyName: 'Red Alliance Group', role: 'Precinct Captain', startDate: '2010-03-01', endDate: '2014-12-31' },
  { partyId: 'party2', partyName: 'Red Alliance Group', role: 'Member', startDate: '2015-01-01' /* Current */ }
];


export const mockPoliticians: Politician[] = [
  {
    id: 'p1',
    name: 'Alice Democratia',
    nepaliName: 'एलिस डेमोक्रेटिया',
    aliases: ['Ally D.'],
    slug: 'alice-democratia',
    partyId: 'party1',
    partyName: 'Blue Unity Party',
    partyAffiliations: alicePartyAffiliations,
    positions: [{ title: 'Senator', startDate: '2020-01-15' }],
    contactInfo: { 
      email: 'alice@example.com',
      phone: '555-0101',
      officePhone: '555-0100',
      permanentAddress: '123 Liberty Lane, Capital City, CP 10001',
      temporaryAddress: 'Apt 4B, Statesman Towers, Capital City, CP 10002',
      website: 'https://alice.example.com',
      twitter: 'https://twitter.com/AliceDemocratia',
      facebook: 'https://facebook.com/AliceDemocratia',
      linkedin: 'https://linkedin.com/in/AliceDemocratia'
    },
    photoUrl: 'https://placehold.co/300x300.png',
    dataAiHint: 'politician portrait',
    politicalJourney: [
      { date: '2005-06-01', event: 'Graduated State University (M.A. Public Administration)' },
      { date: '2010-05-01', event: 'Elected City Councilor', description: 'Represented District 3.' },
      { date: '2015-11-03', event: 'Elected Mayor of Hopeville' },
      { date: '2019-10-05', event: 'Awarded "Community Champion Award"', description: 'For efforts in urban revitalization.' },
      { date: '2020-01-15', event: 'Sworn in as Senator' },
      { date: '2022-07-01', event: 'Published "The Future of Governance" Policy Paper' },
    ],
    bio: 'Alice Democratia is a dedicated public servant with over a decade of experience in governance, championing transparency and citizen engagement.',
    politicalIdeology: ['Progressivism', 'Social Justice', 'Environmentalism'],
    languagesSpoken: ['English', 'Spanish'],
    constituency: 'Statewide',
    province: 'Capital Province',
    dateOfBirth: '1975-03-12',
    placeOfBirth: { district: 'Central District', address: 'Hopeville' },
    gender: 'Female',
    education: [
      { institution: 'State University', degree: 'M.A.', field: 'Public Administration', graduationYear: '2005' },
      { institution: 'City College', degree: 'B.A.', field: 'Political Science', graduationYear: '2002' },
    ],
    assetDeclarations: aliceAssetDeclarations,
    criminalRecords: [], 
    committeeMemberships: aliceCommitteeMemberships,
    statementsAndQuotes: aliceStatementsAndQuotes,
    isActiveInPolitics: true,
    lastActivityDate: '2024-07-15T10:00:00Z',
    overallRating: 4.5,
    userRatingCount: 123,
    voteScore: 78,
    promiseFulfillmentRate: 50, 
    popularityScore: 85,
    controversyIds: ['c1', 'c3'],
  },
  {
    id: 'p2',
    name: 'Bob Republicanus',
    nepaliName: 'बब रिपब्लिकनस',
    aliases: ['R. Bob'],
    slug: 'bob-republicanus',
    partyId: 'party2',
    partyName: 'Red Alliance Group',
    partyAffiliations: bobPartyAffiliations,
    positions: [{ title: 'Representative', startDate: '2018-01-20' }],
    contactInfo: { 
      email: 'bob@example.com',
      phone: '555-0202',
      officePhone: '555-0200',
      permanentAddress: '456 Patriot Ave, Freedom Town, NP 20002',
      website: 'https://bob.example.com',
      twitter: 'https://twitter.com/BobRepub',
      instagram: 'https://instagram.com/BobRepubOfficial'
    },
    photoUrl: 'https://placehold.co/300x300.png',
    dataAiHint: 'politician portrait',
    politicalJourney: [
      { date: '2012-08-10', event: 'Founded local business association', description: 'Focused on supporting small enterprises.' },
      { date: '2018-01-20', event: 'Elected as Representative' },
      { date: '2021-03-15', event: 'Received "Small Business Advocate of the Year" award' },
    ],
    bio: 'Bob Republicanus brings a strong business background to his role, focusing on economic growth and fiscal responsibility.',
    politicalIdeology: ['Conservatism', 'Fiscal Responsibility', 'Free Markets'],
    languagesSpoken: ['English'],
    constituency: '5th Congressional District',
    province: 'Northern Province',
    dateOfBirth: '1980-09-25',
    placeOfBirth: { district: 'Northland County' },
    gender: 'Male',
    education: [
      { institution: 'Commerce Institute', degree: 'MBA', field: 'Business Administration', graduationYear: '2008' },
      { institution: 'Tech College', degree: 'B.S.', field: 'Economics', graduationYear: '2005' },
    ],
    assetDeclarations: [],
    criminalRecords: bobCriminalRecords,
    committeeMemberships: bobCommitteeMemberships,
    statementsAndQuotes: bobStatementsAndQuotes,
    isActiveInPolitics: true,
    lastActivityDate: '2024-06-20T14:30:00Z',
    overallRating: 3.8,
    userRatingCount: 98,
    voteScore: 65,
    promiseFulfillmentRate: 0, 
    popularityScore: 72,
    controversyIds: ['c2'],
  },
  {
    id: 'p3',
    name: 'Carol Independenta',
    slug: 'carol-independenta',
    positions: [{ title: 'City Council Member', startDate: '2022-01-01' }],
    partyAffiliations: [{partyId: 'independent', partyName: 'Independent', startDate: '2021-11-01'}],
    contactInfo: { email: 'carol@example.com', website: 'https://carol.example.com' },
    photoUrl: 'https://placehold.co/300x300.png',
    dataAiHint: 'politician portrait',
    politicalJourney: [{ date: '2022-01-01', event: 'Elected to City Council' }],
    bio: 'Carol Independenta is a fresh voice in local politics, advocating for community initiatives.',
    politicalIdeology: ['Independent', 'Community Focus'],
    languagesSpoken: ['English', 'French'],
    constituency: 'Downtown District',
    province: 'Capital Province',
    dateOfBirth: '1990-06-15',
    placeOfBirth: { district: 'Urban Center', address: 'Main Street' },
    gender: 'Female',
    education: [{ institution: 'Community College', degree: 'Associate Degree', field: 'Urban Studies', graduationYear: '2018' }],
    isActiveInPolitics: false,
    dateOfDeath: '2023-11-10', 
    lastActivityDate: '2023-11-01T09:00:00Z',
    overallRating: 4.1,
    userRatingCount: 75,
    popularityScore: 90,
  },
];

export function getPoliticianById(id: string): Politician | undefined {
  return mockPoliticians.find(p => p.id === id);
}
