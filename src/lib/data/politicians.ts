
import type { Politician, AssetDeclaration, CriminalRecord, CommitteeMembership, StatementQuote, PartyAffiliation } from '@/types/gov';

const aliceAssetDeclarations: AssetDeclaration[] = [
  { year: 2023, description: 'Primary Residence, Anytown', value: '$500,000 - $750,000', sourceUrl: 'https://example.com/alice-assets-2023.pdf' },
  { year: 2023, description: 'Investment Portfolio (Stocks & Bonds)', value: '$100,000 - $250,000' },
  { year: 2022, description: 'Primary Residence, Anytown', value: '$450,000 - $700,000', sourceUrl: 'https://example.com/alice-assets-2022.pdf' },
  { year: 2023, description: 'Vacation Cabin, Pine Woods', value: '$150,000 - $300,000' },
  { year: 2022, description: 'Government Bonds', value: '$50,000 - $100,000' },
  { year: 2021, description: 'Art Collection (Minor)', value: '$10,000 - $25,000' },
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
  },
  {
    date: '2005-03-10',
    offense: 'Public Disturbance Charge (Protest)',
    court: 'Freedom Town Municipal Court',
    status: 'Dismissed',
    summary: 'Charge related to a student protest during college years. Record expunged after community service.',
  },
  {
    date: '2023-02-20',
    offense: 'Alleged Conflict of Interest - StarTech Contract',
    status: 'Investigated - Cleared',
    court: 'Parliamentary Ethics Committee',
    summary: 'An inquiry was conducted into Bob Republicanus\'s involvement in awarding a government contract to StarTech Solutions, a company where his cousin is a minor shareholder. The committee found no evidence of improper influence and cleared him of any wrongdoing.',
    sourceUrl: 'https://example.com/ethics-committee-report-startech.pdf'
  }
];

const aliceCommitteeMemberships: CommitteeMembership[] = [
  { committeeName: 'Senate Committee on Energy and Natural Resources', role: 'Member', startDate: '2021-01-20', endDate: 'Present' },
  { committeeName: 'Joint Economic Committee', role: 'Member', startDate: '2022-03-10', endDate: 'Present' },
  { committeeName: 'City Planning Oversight Committee', role: 'Chair', startDate: '2016-01-01', endDate: '2019-12-31'},
  { committeeName: 'Education and Health Committee', role: 'Active Member', startDate: '2020-02-01', endDate: 'Present'},
  { committeeName: 'Subcommittee on Renewable Energy Transition', role: 'Chair', startDate: '2023-01-15', endDate: 'Present' }, // Fictional sub-committee
];

const bobCommitteeMemberships: CommitteeMembership[] = [
    { committeeName: 'House Committee on Ways and Means', role: 'Member', startDate: '2019-01-15', endDate: 'Present' },
    { committeeName: 'House Committee on Small Business', role: 'Ranking Member', startDate: '2023-01-10', endDate: 'Present' },
    { committeeName: 'Select Committee on Fiscal Responsibility', role: 'Co-Chair', startDate: '2022-05-01', endDate: '2023-05-01' }, // Fictional select committee
    { committeeName: 'Finance Committee', role: 'Ex-officio Member', startDate: '2021-01-01', endDate: '2022-12-31' },
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
  {
    id: 'sq-alice-new1',
    quoteText: "Climate change is the challenge of our generation. We need bold action, not incremental steps.",
    sourceName: "Interview with 'Green Future Today'",
    dateOfStatement: "2023-08-15",
    sourceUrl: "https://example.com/greenfuture-alice-interview"
  },
  {
    id: 'sq-alice-new2',
    quoteText: "The digital divide is a barrier to equality. We must ensure every citizen has access to the tools of the 21st century.",
    sourceName: "Tech Inclusion Forum",
    dateOfStatement: "2024-02-28",
  }
];

const bobStatementsAndQuotes: StatementQuote[] = [
  {
    id: 'sq3',
    quoteText: "Fiscal responsibility and a balanced budget are paramount to ensuring long-term economic stability for our nation.",
    sourceName: "Chamber of Commerce Address",
    dateOfStatement: "2024-02-10",
  },
  {
    id: 'sq-bob-new1',
    quoteText: "Innovation and entrepreneurship are the engines of job creation. Government should get out of the way and let businesses thrive.",
    sourceName: "Startup National Conference",
    dateOfStatement: "2023-09-20",
  },
  {
    id: 'sq-bob-new2',
    quoteText: "A strong national defense ensures peace through strength. We must always support our troops and their families.",
    sourceName: "Veterans Day Speech",
    dateOfStatement: "2023-11-11",
    sourceUrl: "https://example.com/bob-veterans-day-2023"
  }
];

const alicePartyAffiliations: PartyAffiliation[] = [
  { partyId: 'party0', partyName: 'Student Progressive Front', role: 'Regional Secretary', startDate: '2000-09-01', endDate: '2002-05-30' },
  { partyId: 'party1', partyName: 'Blue Unity Party', role: 'Member', startDate: '2008-01-15', endDate: '2020-12-31' }, // Assuming Chair role supersedes general member and policy head for top display
  { partyId: 'party1', partyName: 'Blue Unity Party', role: 'Party Chair', startDate: '2021-01-01', endDate: 'Present' }
];

const bobPartyAffiliations: PartyAffiliation[] = [
  { partyId: 'party2', partyName: 'Red Alliance Group', role: 'Precinct Captain', startDate: '2010-03-01', endDate: '2014-12-31' },
  { partyId: 'party2', partyName: 'Red Alliance Group', role: 'Member', startDate: '2015-01-01', endDate: '2017-12-31' }, // End-dating general member role
  { partyId: 'party2', partyName: 'Red Alliance Group', role: 'Chief Strategist', startDate: '2018-01-01', endDate: 'Present' }
];

// Data for Evelyn Chang (p4)
const evelynPoliticalJourney: Politician['politicalJourney'] = [
  { date: '1995-06-01', event: 'Graduated Capital University (J.D.)' },
  { date: '1996-01-15', event: 'Joined District Attorney\'s Office as Prosecutor' },
  { date: '2000-11-07', event: 'Elected to State Assembly, District 12', description: 'Youngest member elected that year.' },
  { date: '2002-05-01', event: 'Authored the "Clean Air Initiative Act" (State Level)', description: 'Landmark environmental legislation for the state.' },
  { date: '2003-01-10', event: 'Appointed Chair of State Assembly Judiciary Committee' },
  { date: '2004-11-02', event: 'Re-elected to State Assembly, District 12' },
  { date: '2005-07-20', event: 'Keynote speaker at National Environmental Summit' },
  { date: '2006-03-01', event: 'Resigned from State Assembly to run for National Senate' },
  { date: '2006-11-07', event: 'Elected to National Senate' },
  { date: '2007-02-01', event: 'Co-sponsored the "National Education Reform Act"', description: 'Focused on increasing teacher salaries and school funding.' },
  { date: '2008-09-15', event: 'Publicly criticized Party A\'s stance on healthcare, leading to internal friction.', controversyIds: ['c-fictional-healthcare-dispute'] },
  { date: '2009-01-01', event: 'Switched party affiliation from Party A to Party B', description: 'Cited irreconcilable differences on core policy issues.' },
  { date: '2010-05-10', event: 'Appointed to Senate Foreign Relations Committee' },
  { date: '2011-07-01', event: 'Led a bipartisan delegation to international climate talks' },
  { date: '2012-11-06', event: 'Re-elected to National Senate (representing Party B)' },
  { date: '2013-03-20', event: 'Authored "Tech Innovation Grant Program Act"' },
  { date: '2014-10-01', event: 'Faced ethics inquiry over stock trades, later cleared.', controversyIds: ['c-fictional-ethics-inquiry'] },
  { date: '2016-01-15', event: 'Became Senate Minority Whip for Party B' },
  { date: '2018-06-01', event: 'Lost primary election for Senate re-nomination' },
  { date: '2019-01-01', event: 'Founded "Citizens for Accountable Governance" NGO' },
  { date: '2022-11-08', event: 'Elected Mayor of Capital City as an Independent Candidate', description: 'Historic win against established party candidates.' },
  { date: '2024-01-01', event: 'Launched "Smart City Initiative" for Capital City' }
];

const evelynPartyAffiliations: PartyAffiliation[] = [
  { partyId: 'party-fictional-A', partyName: 'Liberty Party', role: 'Member', startDate: '1998-01-01', endDate: '2008-12-31' },
  { partyId: 'party-fictional-B', partyName: 'Progress First Party', role: 'Member', startDate: '2009-01-01', endDate: '2017-12-31' },
  { partyId: 'party-fictional-B', partyName: 'Progress First Party', role: 'Senate Minority Whip', startDate: '2016-01-15', endDate: '2017-12-31' },
  { partyId: 'independent', partyName: 'Independent', startDate: '2018-01-01', endDate: 'Present' }
];

const evelynCommitteeMemberships: CommitteeMembership[] = [
  { committeeName: 'Senate Foreign Relations Committee', role: 'Member', startDate: '2010-05-10', endDate: '2018-01-01' },
  { committeeName: 'State Assembly Judiciary Committee', role: 'Chair', startDate: '2003-01-10', endDate: '2006-03-01' },
  { committeeName: 'Finance Committee', role: 'Member', startDate: '2007-01-15', endDate: '2009-01-01' },
  { committeeName: 'Capital City Budget Oversight Task Force', role: 'Chair', startDate: '2023-01-01', endDate: 'Present' } // Local committee
];

// Data for Marcus Thorne (p5)
const marcusPartyAffiliations: PartyAffiliation[] = [
  { partyId: 'party2', partyName: 'Red Alliance Group', role: 'Youth Wing Leader', startDate: '2005-01-01', endDate: '2008-12-31' },
  { partyId: 'party2', partyName: 'Red Alliance Group', role: 'Member', startDate: '2009-01-01', endDate: '2015-06-30' },
  { partyId: 'party-fictional-centrist', partyName: 'Centrist Path Party', role: 'Founding Member', startDate: '2015-07-01', endDate: '2019-12-31' },
  { partyId: 'independent', partyName: 'Independent', role: 'Candidate for Council', startDate: '2020-01-01', endDate: '2020-11-05' },
  { partyId: 'party1', partyName: 'Blue Unity Party', role: 'Policy Advisor (Local Chapter)', startDate: '2021-01-15', endDate: 'Present' }
];

const marcusCriminalRecords: CriminalRecord[] = [
    { date: '2016-07-22', offense: 'Violation of Protest Permit Regulations', court: 'Capital City Municipal Court', status: 'Fined', summary: 'Fined for organizing a protest that deviated from permitted route during Centrist Path Party rally.', caseNumber: 'CCMC-2016-5432'},
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
      linkedin: 'https://linkedin.com/in/AliceDemocratia',
      instagram: 'https://instagram.com/AliceDemocratiaOfficial'
    },
    photoUrl: 'https://placehold.co/300x300.png',
    dataAiHint: 'politician portrait',
    politicalJourney: [
      { date: '2005-06-01', event: 'Graduated State University (M.A. Public Administration)' },
      { date: '2006-01-10', event: 'Intern at City Hall Mayor\'s Office', description: 'Gained firsthand experience in municipal governance.' },
      { date: '2008-03-15', event: 'Campaign Manager for Local Council Election', description: 'Successfully managed a winning campaign for a city council candidate.' },
      { date: '2010-05-01', event: 'Elected City Councilor', description: 'Represented District 3, focusing on community development and parks.' },
      { date: '2012-09-01', event: 'Led Task Force on Urban Green Spaces', description: 'Resulted in the "Green City Initiative" adopted by Hopeville.' },
      { date: '2014-07-20', event: 'Keynote Speaker at National League of Cities Conference', description: 'Spoke on "Innovative Urban Solutions".' },
      { date: '2015-11-03', event: 'Elected Mayor of Hopeville', description: 'Focused on sustainable development and public transit improvements.' },
      { date: '2017-05-22', event: 'Negotiated Inter-City Partnership for Regional Development', description: 'Forged alliance with neighboring cities for economic cooperation.' },
      { date: '2019-10-05', event: 'Awarded "Community Champion Award"', description: 'For efforts in urban revitalization and homeless outreach programs.' },
      { date: '2020-01-15', event: 'Sworn in as Senator' },
      { date: '2021-11-10', event: 'Spearheaded the "Tech for Tomorrow" educational grant program.', description: 'Secured federal funding for STEM education in underserved schools.'},
      { date: '2022-07-01', event: 'Published "The Future of Governance" Policy Paper', description: 'Outlined strategies for digital transformation in public service.' },
      { date: '2023-04-10', event: 'Chaired Senate hearing on Renewable Energy Subsidies', description: 'Examined the effectiveness and future of green energy incentives.'},
      { date: '2024-01-20', event: 'Delivered widely acclaimed speech on national unity at the party convention.'}
    ],
    bio: 'Alice Democratia is a dedicated public servant with over fifteen years of experience in governance, from local council to the Senate. She champions transparency, citizen engagement, sustainable development, and educational equity. Her work on the "Tech for Tomorrow" initiative has been nationally recognized.',
    politicalIdeology: ['Progressivism', 'Social Justice', 'Environmentalism', 'Technological Advancement'],
    languagesSpoken: ['English', 'Spanish', 'Basic French'],
    constituency: 'Statewide Senator', // General description
    constituencyId: 'const-state-senate-capital', // Link to a conceptual 'statewide' constituency
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
    tags: ['education-advocate', 'environmentalist', 'urban-development', 'tech-in-gov', 'transparency', 'social-programs'],
    isActiveInPolitics: true,
    lastActivityDate: '2024-07-15T10:00:00Z',
    overallRating: 4.5,
    userRatingCount: 123,
    voteScore: 78,
    promiseFulfillmentRate: 50,
    popularityScore: 85,
    committeeIds: ['com1', 'com2', 'com3', 'com4', 'subcom-renewable-alice'], // Added fictional subcommittee ID
    controversyIds: ['c1', 'c3', 'c-fictional-land-deal'], // Added a fictional controversy ID
    votingRecords: [
      { billId: 'b1', billSlug: 'clean-energy-act-2024', billTitle: 'Clean Energy Act 2024', vote: 'Yea', date: '2024-07-10', summary: 'Voted in favor of promoting renewable energy during final Senate passage.' }, // Date updated to match new bill data
      { billId: 'b2', billSlug: 'digital-literacy-for-all-act', billTitle: 'Digital Literacy For All Act', vote: 'Yea', date: '2024-02-20', summary: 'Supported the bill for digital education during House passage.' }, // Date updated
      { billId: 'b3', billSlug: 'national-ai-research-act-2025', billTitle: 'National AI Research & Development Act 2025', vote: 'Nay', date: '2025-04-10', summary: 'Opposed the AI Act citing concerns about ethical oversight mechanisms in the final House version.' }, // Updated to new b3
      { billId: 'b4', billSlug: 'accountability-in-public-office-act-2024', billTitle: 'Accountability in Public Office Act 2024', vote: 'Abstain', date: '2024-04-15', summary: 'Abstained on the Accountability Act in the Senate, calling for broader bipartisan consensus.' }, // Updated to new b4
      { billId: 'b5', billSlug: 'commemorative-coin-local-hero-act-2024', billTitle: 'Commemorative Coin for Local Hero Act 2024', vote: 'Yea', date: '2024-07-15', summary: 'Supported the commemorative coin for Jane Appleseed in committee.' }, // Updated to new b5, date adjusted for committee hearing
      { billId: 'b-fictional-data-privacy', billSlug: 'data-privacy-act-2023', billTitle: 'Data Privacy Act 2023', vote: 'Yea', date: '2023-05-20', summary: 'Strongly supported enhanced consumer data protection.'},
      { billId: 'b-fictional-election-reform', billSlug: 'election-reform-act-2022', billTitle: 'Election Reform Act 2022', vote: 'Yea', date: '2022-11-10', summary: 'Voted for measures to improve election security and accessibility.'},
      { billId: 'b-fictional-mental-health-funding', billSlug: 'mental-health-parity-act-2024', billTitle: 'Mental Health Parity Act 2024', vote: 'Yea', date: '2024-02-15', summary: 'Championed increased funding for mental health services.'},
      { billId: 'b-fictional-trade-agreement-alpha', billSlug: 'alpha-trade-agreement-ratification', billTitle: 'Alpha Trade Agreement Ratification', vote: 'Nay', date: '2023-08-01', summary: 'Opposed due to concerns over labor rights protections.'},
      { billId: 'b-fictional-ai-regulation', billSlug: 'ai-ethics-and-safety-act', billTitle: 'AI Ethics and Safety Act', vote: 'Abstain', date: '2024-07-05', summary: 'Called for further study and expert consultation before voting.'}
    ],
    revisionHistory: [
      { id: 'rh1_p1', date: '2024-03-15T10:00:00Z', author: 'Admin', event: 'Bio updated from suggestion', details: 'Expanded on experience in governance.', suggestionId: 'sugg_bio_p1_abc' },
      { id: 'rh2_p1', date: '2024-02-01T14:30:00Z', author: 'User:AliceD_Staff', event: 'Contact email updated', details: 'Email changed to alice.democratia.official@example.com' },
      { id: 'rh3_p1', date: '2020-01-10T09:00:00Z', author: 'System', event: 'Politician profile created' }
    ]
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
      temporaryAddress: 'Suite 100, Capital Business Center, Capital City, CP 10005',
      website: 'https://bob.example.com',
      twitter: 'https://twitter.com/BobRepub',
      facebook: 'https://facebook.com/BobRepubOfficial',
      instagram: 'https://instagram.com/BobRepubOfficial'
    },
    photoUrl: 'https://placehold.co/300x300.png',
    dataAiHint: 'politician portrait',
    politicalJourney: [
      { date: '2012-08-10', event: 'Founded local business association "Freedom Town Entrepreneurs"', description: 'Focused on supporting small enterprises and reducing local regulations.' },
      { date: '2014-05-01', event: 'Testified before State Commerce Committee', description: 'Advocated for tax cuts for small businesses.' },
      { date: '2016-01-20', event: 'Appointed to Regional Economic Development Board' },
      { date: '2018-01-20', event: 'Elected as Representative for 5th Congressional District' },
      { date: '2019-07-01', event: 'Successfully passed Amendment to Deregulation Act of 2019', description: 'Reduced bureaucratic hurdles for new businesses.' },
      { date: '2020-03-10', event: 'Led trade delegation to Neighboring Country Alpha', description: 'Focused on opening new markets for local agricultural products.' },
      { date: '2021-03-15', event: 'Received "Small Business Advocate of the Year" award from National Federation of Independent Business.' },
      { date: '2022-09-01', event: 'Keynote speaker at "Fiscal Freedom Summit"', description: 'Spoke on principles of limited government and free markets.' },
      { date: '2023-05-18', event: 'Opposed the "Green Energy Mandate Bill" in parliamentary debate.', description: 'Argued it would harm traditional energy sector jobs.'},
      { date: '2024-02-01', event: 'Launched "Cut the Red Tape" initiative for constituents.', description: 'A program to help individuals and businesses navigate government bureaucracy.'}
    ],
    bio: 'Bob Republicanus brings a strong business background to his role, focusing on economic growth, fiscal responsibility, and deregulation. He is a vocal advocate for small businesses and free market principles, and has actively worked on reducing bureaucratic hurdles for entrepreneurs.',
    politicalIdeology: ['Conservatism', 'Fiscal Responsibility', 'Free Markets', 'Limited Government'],
    languagesSpoken: ['English'],
    constituency: '5th Congressional District', // Display name
    constituencyId: 'const-fed-np-5', // Example Federal Constituency ID
    province: 'Northern Province',
    dateOfBirth: '1980-09-25',
    placeOfBirth: { district: 'Northland County', address: 'Freedom Town' },
    gender: 'Male',
    education: [
      { institution: 'Commerce Institute', degree: 'MBA', field: 'Business Administration', graduationYear: '2008' },
      { institution: 'Tech College', degree: 'B.S.', field: 'Economics', graduationYear: '2005' },
    ],
    assetDeclarations: [
      { year: 2023, description: 'Commercial Property, Freedom Town', value: '$250,000 - $500,000' },
      { year: 2023, description: 'Shares in "RepubCo Holdings"', value: '$50,000 - $100,000', sourceUrl: 'https://example.com/bob-assets-2023.pdf' },
      { year: 2022, description: 'Agricultural Land, Northland County', value: '$100,000 - $250,000' },
    ],
    criminalRecords: bobCriminalRecords,
    committeeMemberships: bobCommitteeMemberships,
    statementsAndQuotes: bobStatementsAndQuotes,
    tags: ['business-leader', 'fiscal-conservative', 'small-business', 'deregulation', 'free-trade'],
    isActiveInPolitics: true,
    lastActivityDate: '2024-06-20T14:30:00Z',
    overallRating: 3.8,
    userRatingCount: 98,
    voteScore: 65,
    promiseFulfillmentRate: 0, // Assuming 0 means no promises tracked or all unfulfilled.
    popularityScore: 72,
    committeeIds: ['com1', 'com2', 'com5', 'com-fictional-fiscal-resp'], // Added fictional committee ID
    controversyIds: ['c2', 'c-fictional-campaign-finance'], // Added a fictional controversy ID
    votingRecords: [
      { billId: 'b1', billSlug: 'clean-energy-act-2024', billTitle: 'Clean Energy Act 2024', vote: 'Nay', date: '2024-07-10', summary: 'Opposed Clean Energy Act in Senate due to concerns about economic impact on traditional energy sectors.' }, // Date updated
      { billId: 'b2', billSlug: 'digital-literacy-for-all-act', billTitle: 'Digital Literacy For All Act', vote: 'Yea', date: '2024-02-20', summary: 'Supported Digital Literacy Act in House to enhance workforce skills.' }, // Date updated
      { billId: 'b3', billSlug: 'national-ai-research-act-2025', billTitle: 'National AI Research & Development Act 2025', vote: 'Yea', date: '2025-04-10', summary: 'Co-sponsored and voted for the AI Act in House, emphasizing economic benefits.' }, // Updated to new b3
      { billId: 'b6', billSlug: 'small-business-tax-relief-act', billTitle: 'Small Business Tax Relief Act', vote: 'Yea', date: '2024-02-15', summary: 'Championed this bill for economic stimulus.' }, // Kept b6 as is
      { billId: 'b7', billSlug: 'environmental-protection-enhancement-act', billTitle: 'Environmental Protection Enhancement Act', vote: 'Nay', date: '2023-09-05', summary: 'Argued it imposed excessive regulations on businesses.' }, // Kept b7 as is
      { billId: 'b-fictional-balanced-budget-amendment', billSlug: 'balanced-budget-amendment-2023', billTitle: 'Balanced Budget Amendment 2023', vote: 'Yea', date: '2023-07-12', summary: 'Strongly supported constitutional amendment for a balanced budget.'},
      { billId: 'b-fictional-free-trade-act-zeta', billSlug: 'zeta-free-trade-agreement', billTitle: 'Zeta Free Trade Agreement', vote: 'Yea', date: '2022-10-05', summary: 'Advocated for opening new international markets.'},
      { billId: 'b-fictional-school-choice-program', billSlug: 'school-choice-initiative-act', billTitle: 'School Choice Initiative Act', vote: 'Yea', date: '2024-01-20', summary: 'Supported measures to increase parental choice in education.'},
      { billId: 'b-fictional-national-security-funding', billSlug: 'national-defense-authorization-act-2024', billTitle: 'National Defense Authorization Act 2024', vote: 'Yea', date: '2023-12-01', summary: 'Voted to increase funding for national security.'},
      { billId: 'b-fictional-healthcare-market-reform', billSlug: 'healthcare-market-reform-act', billTitle: 'Healthcare Market Reform Act', vote: 'Nay', date: '2024-04-10', summary: 'Opposed, advocating for less government intervention in healthcare.'}
    ],
    revisionHistory: [
      { id: 'rh1_p2', date: '2024-01-20T11:00:00Z', author: 'User:CampaignTeamBob', event: 'Photo URL updated', details: 'New official portrait added.' },
      { id: 'rh2_p2', date: '2018-01-15T09:00:00Z', author: 'System', event: 'Politician profile created' }
    ]
  },
  {
    id: 'p3',
    name: 'Carol Independenta',
    slug: 'carol-independenta',
    partyId: 'independent', // Explicitly set partyId for independents
    partyName: 'Independent', // Explicitly set partyName for independents
    positions: [{ title: 'City Council Member', startDate: '2022-01-01' }],
    partyAffiliations: [{partyId: 'independent', partyName: 'Independent', startDate: '2021-11-01'}],
    contactInfo: { email: 'carol@example.com', website: 'https://carol.example.com', phone: '555-0303' },
    photoUrl: 'https://placehold.co/300x300.png',
    dataAiHint: 'politician portrait',
    politicalJourney: [{ date: '2022-01-01', event: 'Elected to City Council' }],
    bio: 'Carol Independenta is a fresh voice in local politics, advocating for community initiatives and transparent governance. Known for her direct approach and focus on constituent services.',
    politicalIdeology: ['Independent', 'Community Focus', 'Good Governance'],
    languagesSpoken: ['English', 'French'],
    constituency: 'Downtown District', // Display name
    constituencyId: 'const-local-cc-downtown', // Example Local Constituency ID
    province: 'Capital Province',
    dateOfBirth: '1990-06-15',
    placeOfBirth: { district: 'Urban Center', address: 'Main Street' },
    gender: 'Female',
    education: [{ institution: 'Community College', degree: 'Associate Degree', field: 'Urban Studies', graduationYear: '2018' }],
    isActiveInPolitics: false,
    dateOfDeath: '2023-11-10', // Example: Deceased politician
    lastActivityDate: '2023-11-01T09:00:00Z',
    tags: ['local-politics', 'community-advocate', 'independent-voice', 'municipal-reform'],
    overallRating: 4.1,
    userRatingCount: 75,
    popularityScore: 90,
    votingRecords: [ // Added some example voting records for a local politician
      { billId: 'local-bylaw-101', billSlug: 'park-improvement-bylaw', billTitle: 'Park Improvement Bylaw 101', vote: 'Yea', date: '2022-05-10', summary: 'Supported funding for downtown park renovations.'},
      { billId: 'local-bylaw-102', billSlug: 'zoning-change-main-st', billTitle: 'Main St. Zoning Change Bylaw 102', vote: 'Nay', date: '2023-02-15', summary: 'Opposed zoning change due to concerns about neighborhood character.'}
    ],
    committeeMemberships: [
        { committeeName: 'City Planning Oversight Committee', role: 'Member', startDate: '2022-02-01', endDate: '2023-11-10' }
    ]
  },
  // New Politician: Evelyn "Evie" Chang (p4) - Long Political Journey
  {
    id: 'p4',
    name: 'Senator Evelyn "Evie" Chang',
    nepaliName: 'एभलिन चाङ',
    aliases: ['Evie Chang', 'The Negotiator'],
    slug: 'evelyn-chang',
    partyId: 'independent', // Current affiliation
    partyName: 'Independent',
    partyAffiliations: evelynPartyAffiliations,
    positions: [
        { title: 'Mayor of Capital City', startDate: '2022-11-08', endDate: 'Present' },
        { title: 'Senator', startDate: '2006-11-07', endDate: '2018-01-15' },
        { title: 'State Assembly Member', startDate: '2000-11-07', endDate: '2006-03-01' }
    ],
    contactInfo: {
      email: 'evie.chang@capitalcity.gov',
      officePhone: '555-0400',
      website: 'https://evelynchang.example.com',
      twitter: 'https://twitter.com/MayorEvieChang',
      linkedin: 'https://linkedin.com/in/EvelynChangPublicService'
    },
    photoUrl: 'https://placehold.co/300x300.png?text=EC',
    dataAiHint: 'experienced female politician portrait',
    politicalJourney: evelynPoliticalJourney,
    bio: 'Senator Evelyn "Evie" Chang has a distinguished career spanning over two decades in public service, from state prosecutor to National Senator, and now as Mayor of Capital City. Known for her sharp intellect, bipartisan approach, and dedication to environmental and educational reforms, Chang has navigated complex political landscapes, including notable party switches, always prioritizing constituent needs and effective governance.',
    politicalIdeology: ['Centrism', 'Pragmatism', 'Environmental Realism', 'Education Reform'],
    languagesSpoken: ['English', 'Mandarin Chinese'],
    constituency: 'Mayor of Capital City (Previously Senator)',
    constituencyId: 'const-local-capitalcity-mayor',
    province: 'Capital Province',
    dateOfBirth: '1970-07-07',
    placeOfBirth: { district: 'Capital City Suburbs' },
    gender: 'Female',
    education: [
      { institution: 'Capital University', degree: 'J.D.', field: 'Law', graduationYear: '1995' },
      { institution: 'State College', degree: 'B.A.', field: 'History', graduationYear: '1992' },
    ],
    assetDeclarations: [
      { year: 2023, description: 'Condominium, Capital City Downtown', value: '$750,000 - $1,000,000' },
      { year: 2023, description: 'Managed Retirement Fund', value: '$500,000 - $1,000,000' },
    ],
    criminalRecords: [],
    committeeMemberships: evelynCommitteeMemberships,
    statementsAndQuotes: [
      { id: 'sq-ec1', quoteText: "Effective leadership is about building bridges, not walls. Finding common ground is essential for progress.", sourceName: "Mayoral Inauguration Speech", dateOfStatement: "2022-11-15" },
      { id: 'sq-ec2', quoteText: "Our cities are laboratories of innovation. Let's empower them to solve the challenges of tomorrow.", sourceName: "National Mayors Conference", dateOfStatement: "2023-06-10" },
    ],
    tags: ['experienced-leader', 'bipartisan', 'urban-policy', 'environmental-law', 'mayoral-leadership', 'party-switcher'],
    isActiveInPolitics: true,
    lastActivityDate: '2024-07-20T11:00:00Z',
    overallRating: 4.7,
    userRatingCount: 250,
    voteScore: 85, // Fictional score reflecting past senate career
    promiseFulfillmentRate: 70, // As Mayor
    popularityScore: 92,
    committeeIds: ['com1', 'com-fictional-foreign-relations', 'com-fictional-state-judiciary'], // Using existing and fictional
    controversyIds: ['c-fictional-ethics-inquiry', 'c-fictional-healthcare-dispute'],
    votingRecords: [ 
      { billId: 'b1', billSlug: 'clean-energy-act-2024', billTitle: 'Clean Energy Act 2024', vote: 'Yea', date: '2024-07-10', summary: 'Supported Clean Energy Act in Senate as a co-sponsor.' }, // Date updated to match new bill data
      { billId: 'b2', billSlug: 'digital-literacy-for-all-act', billTitle: 'Digital Literacy For All Act', vote: 'Yea', date: '2024-05-10', summary: 'Co-sponsored and voted for Digital Literacy Act in Senate.' }, // Date updated
      { billId: 'b3', billSlug: 'national-ai-research-act-2025', billTitle: 'National AI Research & Development Act 2025', vote: 'Yea', date: '2025-07-15', summary: 'Primary sponsor, voted Yea on final Senate passage of AI Act conference report.' }, // Vote on new b3
      { billId: 'b4', billSlug: 'accountability-in-public-office-act-2024', billTitle: 'Accountability in Public Office Act 2024', vote: 'Yea', date: '2024-04-15', summary: 'Supported Accountability Act in Senate passage.' }, // Vote on new b4
      { billId: 'b-fictional-campaign-finance-reform', billSlug: 'campaign-finance-reform-act-2012', billTitle: 'Campaign Finance Reform Act 2012', vote: 'Yea', date: '2012-05-01', summary: 'Voted for stricter campaign finance regulations during Senate term.'},
      { billId: 'b-fictional-veterans-support-act', billSlug: 'veterans-support-act-2015', billTitle: 'Veterans Support Act 2015', vote: 'Yea', date: '2015-11-11', summary: 'Supported increased benefits for veterans during Senate term.'},
      { billId: 'b-fictional-banking-deregulation-2007', billSlug: 'banking-deregulation-act-2007', billTitle: 'Banking Deregulation Act 2007', vote: 'Nay', date: '2007-09-01', summary: 'Opposed certain banking deregulation measures during Senate term, citing risk.'},
    ],
    revisionHistory: [
      { id: 'rh1_p4', date: '2023-01-10T09:00:00Z', author: 'System', event: 'Politician profile created (migrated from legacy system)' }
    ]
  },
  // New Politician: Marcus "The Maverick" Thorne (p5) - Complex Party History
  {
    id: 'p5',
    name: 'Councilman Marcus "The Maverick" Thorne',
    nepaliName: 'मार्कस थर्न',
    aliases: ['The Maverick', 'Marcus T.'],
    slug: 'marcus-thorne',
    partyId: 'party1', // Current affiliation
    partyName: 'Blue Unity Party',
    partyAffiliations: marcusPartyAffiliations,
    positions: [{ title: 'City Councilor, District 7', startDate: '2022-01-01' }],
    contactInfo: {
      email: 'marcus.thorne@council.gov',
      officePhone: '555-0500',
      website: 'https://marcusthorne.example.org',
    },
    photoUrl: 'https://placehold.co/300x300.png?text=MT',
    dataAiHint: 'young male politician portrait',
    politicalJourney: [
      { date: '2008-05-01', event: 'Elected Student Body President, State University' },
      { date: '2010-01-10', event: 'Co-founded "Youth Vote Now" advocacy group' },
      { date: '2012-11-06', event: 'Unsuccessfully ran for State Assembly with Red Alliance Group' },
      { date: '2015-07-01', event: 'Co-founded the "Centrist Path Party"', description: 'Aimed to bridge partisan divides.' },
      { date: '2018-03-10', event: 'Published opinion piece "A New Way Forward for Local Governance" in Capital Times' },
      { date: '2020-11-03', event: 'Unsuccessfully ran for Mayor as an Independent' },
      { date: '2021-05-01', event: 'Appointed to Citizen Advisory Board for Urban Renewal' },
      { date: '2022-01-01', event: 'Elected City Councilor, District 7 (Affiliated with Blue Unity Party)' },
      { date: '2023-08-15', event: 'Championed the "Open Data Initiative" for city government transparency.'}
    ],
    bio: 'Councilman Marcus "The Maverick" Thorne is known for his dynamic political journey, having been affiliated with multiple parties before finding his current role. He champions fiscal pragmatism and social inclusivity, focusing on transparency and community-driven solutions in local governance.',
    politicalIdeology: ['Centrism', 'Fiscal Conservatism (early)', 'Social Liberalism (later)', 'Good Governance'],
    languagesSpoken: ['English', 'Sign Language (Basic)'],
    constituency: 'City Council District 7',
    constituencyId: 'const-local-cc-d7',
    province: 'Capital Province',
    dateOfBirth: '1986-04-20',
    placeOfBirth: { district: 'Metro Area' },
    gender: 'Male',
    education: [
      { institution: 'State University', degree: 'B.A.', field: 'Public Policy & Economics', graduationYear: '2009' },
    ],
    assetDeclarations: [
      { year: 2023, description: 'Apartment Rental, District 7', value: 'N/A (Rental)' },
      { year: 2023, description: 'Cryptocurrency Holdings (BTC, ETH)', value: '$5,000 - $15,000' },
    ],
    criminalRecords: marcusCriminalRecords,
    committeeMemberships: [
      { committeeName: 'Public Accounts Committee', role: 'Member', startDate: '2022-02-01', endDate: 'Present' }, // Local version
      { committeeName: 'City Planning Oversight Committee', role: 'Vice-Chair', startDate: '2023-01-15', endDate: 'Present' },
    ],
    statementsAndQuotes: [
      { id: 'sq-mt1', quoteText: "Labels shouldn't define us; our actions and solutions should. I'm here to work for the people, regardless of party lines.", sourceName: "Council Inaugural Speech", dateOfStatement: "2022-01-05" },
      { id: 'sq-mt2', quoteText: "Open data is the key to an informed citizenry and an accountable government.", sourceName: "Tech in Gov Conference", dateOfStatement: "2023-10-10" },
    ],
    tags: ['maverick', 'cross-partisan', 'local-gov', 'transparency', 'fiscal-pragmatism', 'urban-planning'],
    isActiveInPolitics: true,
    lastActivityDate: '2024-07-18T16:00:00Z',
    overallRating: 4.0,
    userRatingCount: 65,
    popularityScore: 78,
    committeeIds: ['com2-local', 'com3-local'], // Placeholder local committee IDs
    controversyIds: ['c-fictional-campaign-finance-centrist'], // Placeholder
    votingRecords: [
      { billId: 'local-bylaw-201', billSlug: 'community-policing-initiative', billTitle: 'Community Policing Initiative Funding', vote: 'Yea', date: '2023-03-10', summary: 'Supported increased funding for community policing programs.'},
      { billId: 'local-bylaw-202', billSlug: 'affordable-housing-zone-expansion', billTitle: 'Affordable Housing Zone Expansion', vote: 'Abstain', date: '2024-04-05', summary: 'Abstained, citing need for more robust community consultation and impact studies.'},
      { billId: 'local-bylaw-203', billSlug: 'public-transport-fare-increase', billTitle: 'Public Transport Fare Increase', vote: 'Nay', date: '2023-11-01', summary: 'Opposed fare increase without corresponding service improvements.'},
      { billId: 'b4', billSlug: 'accountability-in-public-office-act-2024', billTitle: 'Accountability in Public Office Act 2024', vote: 'Yea', date: '2024-04-15', summary: 'As primary sponsor, strongly advocated and voted Yea for the Accountability Act in Senate.'}, // Vote on new b4
      { billId: 'b3', billSlug: 'national-ai-research-act-2025', billTitle: 'National AI Research & Development Act 2025', vote: 'Yea', date: '2025-04-10', summary: 'Supported the AI Act in House, focusing on its innovation aspects.'} // Vote on new b3
    ],
    revisionHistory: [
      { id: 'rh1_p5', date: '2022-01-01T10:00:00Z', author: 'System', event: 'Politician profile created' }
    ]
  }
];

export function getPoliticianById(id: string): Politician | undefined {
  return mockPoliticians.find(p => p.id === id);
}

    