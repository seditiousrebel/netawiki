
import type { Party, LeadershipEvent, PartyAlliance, PartySplitMergerEvent, PartyStance, FundingSource, IntraPartyElection, HistoricalManifesto, ElectionPerformanceRecord } from '@/types/gov';

const bupLeadershipHistory: LeadershipEvent[] = [
  { name: 'Arthur Founder', role: 'Founding Chair', startDate: '1990-07-04', endDate: '1998-06-30' },
  { name: 'Eleanor Vanguard', role: 'Party Chair', startDate: '1998-07-01', politicianId: 'p3-nonexistent', endDate: '2010-12-31' },
  { name: 'David Stalwart', role: 'Party Chair', startDate: '2011-01-01', endDate: '2020-12-31' },
  { name: 'Alice Democratia', role: 'Party Chair', startDate: '2021-01-01', politicianId: 'p1', endDate: 'Present' },
  { name: 'Old Secretary', role: 'General Secretary', startDate: '1990-07-04', endDate: '2005-12-31'},
  { name: 'John Smith', role: 'General Secretary', startDate: '2006-01-01', endDate: '2018-06-30' },
  { name: 'Sarah Chen', role: 'General Secretary', startDate: '2018-07-01', endDate: 'Present' }
];

const ragLeadershipHistory: LeadershipEvent[] = [
  { name: 'Senator Oldguard', role: 'Founding Leader', startDate: '1985-02-15', endDate: '1995-01-01' },
  { name: 'Marcus Standard', role: 'Party Leader', startDate: '1995-01-02', politicianId: 'p2', endDate: '2015-12-31' },
  { name: 'Victoria Ironwood', role: 'Party Leader', startDate: '2016-01-01', endDate: 'Present' },
  { name: 'Bob Republicanus', role: 'Chief Strategist', startDate: '2018-01-01', politicianId: 'p2', endDate: 'Present' }
];

const bupAlliances: PartyAlliance[] = [
  {
    name: 'Progressive Coalition',
    partnerPartyIds: ['party3-fictional', 'party4-fictional'],
    partnerPartyNames: ['Green Future Party', 'Social Justice Union'],
    startDate: '2022-01-10',
    endDate: 'Ongoing',
    purpose: 'To collaborate on progressive legislation and election strategies.',
    status: 'Active',
  },
  {
    name: 'Centrist Alliance for Stability',
    partnerPartyIds: ['party-fictional-centrist'], 
    partnerPartyNames: ['Centrist Path Party'],
    startDate: '2016-01-01',
    endDate: '2018-12-31',
    purpose: 'Electoral pact to ensure stable governance during economic uncertainty.',
    status: 'Dissolved',
  }
];

const bupSplitMergerHistory: PartySplitMergerEvent[] = [
  { date: '1990-07-04', type: 'Formation', description: 'Formed from a coalition of progressive groups, including the "Social Reform Movement" and "Environmental Action Front".'},
  { date: '1999-05-10', type: 'Split', description: 'A radical environmentalist faction, "Eco-Warriors United", split off due to disagreements on pragmatic policy approaches. Key figure: Radical Greenman.', involvedParties: [{name: 'Eco-Warriors United', role: 'EmergedAs'}]},
  { date: '2005-11-20', type: 'Merger', description: 'Merged with the "Environmental Action League" to consolidate green policy efforts.', involvedParties: [{name: 'Environmental Action League', role: 'PartnerInMerger'}]},
  { date: '2015-02-01', type: 'Merger', description: 'Absorbed the smaller "Digital Future Initiative" party, enhancing its tech policy platform.', involvedParties: [{name: 'Digital Future Initiative', role: 'PartnerInMerger'}]}
];

const ragSplitMergerHistory: PartySplitMergerEvent[] = [
   { date: '1985-02-15', type: 'Formation', description: 'Established as a new conservative entity, breaking away from the old "National Conservative Union".', involvedParties: [{name: 'National Conservative Union', role: 'SplitFrom'}]},
   { date: '1992-03-10', type: 'Split', description: 'A libertarian faction, "The Freemen Group", split to form the "Traditional Values Party" due to disagreements on social policy. Key figure: Archibald Purity.', involvedParties: [{name: 'Traditional Values Party', role: 'EmergedAs'}]},
   { date: '2008-07-15', type: 'Merger', description: 'Merged with the "National Business First Party" to strengthen economic platform.', involvedParties: [{name: 'National Business First Party', role: 'PartnerInMerger'}]},
   { date: '2018-01-20', type: 'Split', description: 'A small populist faction, "The People\'s Voice First", split off citing disconnect with grassroots. Key figure: Vox Populi.', involvedParties: [{name: 'The People\'s Voice First', role: 'EmergedAs'}]}
];


const bupStances: PartyStance[] = [
  { issueId: 'b1', issueTitle: 'Clean Energy Act 2024', stance: 'Supports', statement: 'BUP strongly supports the Clean Energy Act as it aligns with our core environmental principles.', statementUrl: 'https://blueunity.example.com/stances/clean-energy-act', dateOfStance: '2024-03-20', isBill: true },
  { issueId: 'national-healthcare-reform', issueTitle: 'National Healthcare Reform', stance: 'Supports', statement: 'We advocate for comprehensive healthcare reform to ensure universal access.', dateOfStance: '2023-11-01', isBill: false },
  { issueId: 'data-privacy-framework', issueTitle: 'National Data Privacy Framework', stance: 'Neutral', statement: 'Initially reviewing the proposed framework, seeking expert consultation.', dateOfStance: '2022-05-01', isBill: false },
  { issueId: 'data-privacy-framework', issueTitle: 'National Data Privacy Framework', stance: 'Supports with reservations', statement: 'Supports the framework after amendments ensuring robust consumer protection and innovation safeguards.', dateOfStance: '2023-01-15', isBill: false },
  { issueId: 'b3', issueTitle: 'National Infrastructure Bond Act', stance: 'Conditional Support', statement: 'Supports the bond act provided there are strong environmental oversight and labor protection clauses.', dateOfStance: '2024-04-01', isBill: true },
  { issueId: 'urban-transport-funding', issueTitle: 'Urban Public Transport Funding Increase', stance: 'Strongly Supports', statement: 'Advocates for a significant increase in federal funding for urban public transit to reduce congestion and emissions.', dateOfStance: '2023-07-10', isBill: false },
  { issueId: 'ai-ethics-regulation', issueTitle: 'AI Ethics and Safety Regulation', stance: 'Cautious Approach', statement: 'Believes in fostering AI innovation but calls for a multi-stakeholder commission to develop ethical guidelines before enacting broad legislation.', dateOfStance: '2024-06-01', isBill: false },
];

const ragStances: PartyStance[] = [
  { issueId: 'b2', issueTitle: 'Digital Literacy For All Act', stance: 'Supports', statement: 'RAG believes digital literacy is crucial for economic competitiveness.', dateOfStance: '2023-10-05', isBill: true },
  { issueId: 'tax-cut-proposal-2025', issueTitle: 'Proposed Tax Cuts 2025', stance: 'Strongly Supports', statement: 'Lowering taxes will stimulate investment and job creation across all sectors.', statementUrl: 'https://redalliance.example.com/stances/tax-cuts-2025', dateOfStance: '2024-05-15', isBill: false },
  { issueId: 'national-service-program', issueTitle: 'Mandatory National Service Program', stance: 'Under Review', statement: 'The party is currently reviewing proposals for a mandatory national service program for young adults.', dateOfStance: '2022-08-01', isBill: false },
  { issueId: 'national-service-program', issueTitle: 'Mandatory National Service Program', stance: 'Supports (Voluntary Civic Track)', statement: 'Supports a revised proposal focusing on a voluntary civic service track with incentives, rather than mandatory military service.', dateOfStance: '2023-03-10', isBill: false },
  { issueId: 'b7', issueTitle: 'Environmental Protection Enhancement Act', stance: 'Opposes', statement: 'RAG opposes this act due to concerns about overregulation and its potential negative impact on economic growth.', dateOfStance: '2023-08-20', isBill: true },
  { issueId: 'free-trade-agreement-zeta', issueTitle: 'Zeta Free Trade Agreement', stance: 'Supports', statement: 'Advocates for the ratification of the Zeta FTA to open new markets for domestic businesses.', dateOfStance: '2022-09-15', isBill: false },
  { issueId: 'school-choice-initiatives', issueTitle: 'School Choice Initiatives', stance: 'Strongly Supports', statement: 'RAG champions policies that empower parents with greater choice in their children\'s education, including voucher programs.', dateOfStance: '2024-01-10', isBill: false },
];

const bupFundingSources: FundingSource[] = [
    { year: '2023', sourceName: 'EcoFuture Foundation', amount: '$50,000', type: 'Grant', description: 'For environmental advocacy programs.', sourceUrl: 'https://example.com/ecofuture-grant-report.pdf' },
    { year: '2023', sourceName: 'Public Donations (Aggregated)', amount: '$120,000', type: 'Donation', description: 'Collected through online platform and fundraising events.'},
    { year: '2022', sourceName: 'Tech Innovators LLC', amount: 'Significant Contributor (Undisclosed)', type: 'Corporate Contribution', description: 'Support for technology in governance initiatives.'},
    { year: '2024', sourceName: 'Union of Progressive Workers', amount: '$75,000', type: 'Union Contribution', description: 'Support for pro-labor policies.'},
    { year: '2024', sourceName: 'Crowdfund for Change Campaign', amount: '$95,000', type: 'Crowdfunding', description: 'Online campaign for digital rights advocacy.'}
];

const ragFundingSources: FundingSource[] = [
    { year: '2023', sourceName: 'Liberty Holdings Inc.', amount: '$150,000', type: 'Corporate Contribution', description: 'General operational support.'},
    { year: '2023', sourceName: 'Small Business Alliance Fund', amount: '$80,000', type: 'PAC Contribution', description: 'Support for pro-business candidates.'},
    { year: '2022', sourceName: 'Anonymous Donor Trust', amount: '$200,000', type: 'Trust Donation', description: 'Large private donation.'},
];


const bupIntraPartyElections: IntraPartyElection[] = [
    { date: '2022-08-15', electionTitle: 'National Convention - Party Chairperson Election', resultsSummary: 'Eleanor Vanguard re-elected as Party Chair with 75% of delegate votes.', documentUrl: 'https://blueunity.example.com/election-results-2022.pdf'},
    { date: '2023-03-01', electionTitle: 'Youth Wing Leadership Election', description: 'Election for the new President of the Blue Unity Youth Wing.', resultsSummary: 'Sarah Young elected President.'},
    { date: '2024-04-10', electionTitle: 'Policy Committee Head Election', description: 'Internal election for the head of the party\'s influential Policy Committee.', resultsSummary: 'Dr. Evelyn Hayes elected Policy Head.'}
];

const ragIntraPartyElections: IntraPartyElection[] = [
    { date: '2021-06-20', electionTitle: 'State Chapter Leadership Elections (Northern Province)', resultsSummary: 'John Doe elected Chair for Northern Province RAG chapter.', description: 'Regular election cycle for state leadership.'},
];

const bupHistoricalManifestos: HistoricalManifesto[] = [
  { year: '2024', url: 'https://blueunity.example.com/manifesto-2024.pdf', description: 'Manifesto for the 2024 General Elections "A Future for All".' },
  { year: '2019', url: 'https://blueunity.example.com/manifesto-2019.pdf', description: 'Manifesto for the 2019 General Elections "Progress Together".' },
  { year: '2014', url: 'https://blueunity.example.com/manifesto-2014.pdf', description: 'Party platform for the 2014 National Assembly elections "New Horizons".' },
  { year: '2009', url: 'https://blueunity.example.com/manifesto-2009.pdf', description: 'Manifesto for the 2009 elections "A Fairer Society".'}
];

const ragHistoricalManifestos: HistoricalManifesto[] = [
  { year: '2024', url: 'https://redalliance.example.com/platform-2024.pdf', description: 'Platform for the 2024 Elections "Liberty & Prosperity".' },
  { year: '2019', url: 'https://redalliance.example.com/platform-2019.pdf', description: 'RAG Platform "Restoring Values" for 2019.' },
  { year: '2014', url: 'https://redalliance.example.com/platform-2014.pdf', description: 'Economic Freedom Agenda - 2014.' },
];

const bupElectionHistory: ElectionPerformanceRecord[] = [
  // electionId could be added if linking to specific Election entities
  { electionName: 'General Election 2024', year: 2024, seatsContested: 160, seatsWon: 72, votesPercentage: 38.2, changeInSeats: 7, changeInPercentage: 2.7, notes: 'Increased seat share. Formed government with Progressive Coalition.' },
  { electionName: 'Local Elections 2022', year: 2022, seatsWon: 350, notes: 'Maintained strong local presence across several key municipalities.' },
  { electionName: 'General Election 2019', year: 2019, seatsContested: 150, seatsWon: 65, votesPercentage: 35.5, changeInSeats: -5, changeInPercentage: -1.5, notes: 'Formed a coalition government as senior partner.' },
  { electionName: 'General Election 2014', year: 2014, seatsContested: 145, seatsWon: 70, votesPercentage: 37.0, notes: 'Secured a clear majority, forming government independently.' },
  { electionName: 'Mid-term Senate Elections 2016', year: 2016, seatsWon: 15, notes: 'Gained 2 additional seats in the Senate.'}
];

const ragElectionHistory: ElectionPerformanceRecord[] = [
  { electionName: 'General Election 2024', year: 2024, seatsContested: 155, seatsWon: 60, votesPercentage: 32.5, changeInSeats: 5, changeInPercentage: 2.4, notes: 'Strengthened position as main opposition party.' },
  { electionName: 'Local Elections 2022', year: 2022, seatsWon: 280, notes: 'Made significant gains in several rural councils.' },
  { electionName: 'General Election 2019', year: 2019, seatsContested: 140, seatsWon: 55, votesPercentage: 30.1, changeInSeats: 2, changeInPercentage: 1.1, notes: 'Official opposition.' },
  { electionName: 'General Election 2014', year: 2014, seatsContested: 135, seatsWon: 53, votesPercentage: 29.0, notes: 'Remained in opposition.' },
  { electionName: 'By-Election District 7', year: 2021, seatsWon: 1, notes: 'Won a crucial by-election in a previously BUP-held district.'}
];

const gfpElectionHistory: ElectionPerformanceRecord[] = [
  { electionName: 'General Election 2024', year: 2024, seatsWon: 5, votesPercentage: 3.5, changeInSeats: 2, changeInPercentage: 0.8 },
  { electionName: 'General Election 2019', year: 2019, seatsWon: 3, votesPercentage: 2.7, changeInSeats: 1, changeInPercentage: 0.5 },
  { electionName: 'General Election 2014', year: 2014, seatsWon: 2, votesPercentage: 2.2 },
];

// Data for new party: People's Progressive Front (PPF)
const ppfLeadershipHistory: LeadershipEvent[] = [
  { name: 'Arthur Pendelton', role: 'Interim Leader', startDate: '2000-01-15', endDate: '2000-08-30' },
  { name: 'Sofia Chen', role: 'Party President', startDate: '2000-09-01', endDate: '2010-05-10' },
  { name: 'Rajiv Singh', role: 'Party President', startDate: '2010-05-11', endDate: 'Present' },
  { name: 'Maria Flores', role: 'Secretary-General', startDate: '2000-09-01', endDate: 'Present'}
];

const ppfSplitMergerHistory: PartySplitMergerEvent[] = [
  { date: '2000-01-15', type: 'Formation', description: 'Formed from a major progressive faction splitting from the "Old People\'s Party" due to ideological differences regarding economic policy. Key figures: Arthur Pendelton, Sofia Chen.', involvedParties: [{name: 'Old People\'s Party', role: 'SplitFrom'}] },
  { date: '2008-06-20', type: 'Merger', description: 'Successfully merged with the "Green Agrarian Union", broadening its support base in rural areas and strengthening its environmental platform.', involvedParties: [{name: 'Green Agrarian Union', role: 'PartnerInMerger'}]},
  { date: '2015-03-01', type: 'Split', description: 'A smaller, more radical youth faction, "Youth Forward Bloc", split due to disagreements on the pace of reforms. Key figure: Alex Youngblood.', involvedParties: [{name: 'Youth Forward Bloc', role: 'EmergedAs'}]}
];

const ppfStances: PartyStance[] = [
  { issueId: 'urban-development-rural-support', issueTitle: 'Urban Development vs Rural Support Balance', stance: 'Prioritizes Rural Support', statement: 'Initial focus on redressing historical underinvestment in rural communities.', dateOfStance: '2001-02-01', isBill: false },
  { issueId: 'urban-development-rural-support', issueTitle: 'Urban Development vs Rural Support Balance', stance: 'Balanced Approach', statement: 'Recognizes the need for sustainable urban development while ensuring continued robust support for rural agricultural and community programs.', dateOfStance: '2010-05-15', isBill: false },
  { issueId: 'b1', issueTitle: 'Clean Energy Act 2024', stance: 'Supports with amendments', statement: 'Supports the overall goal but proposes amendments for stronger community ownership models of renewable projects.', dateOfStance: '2024-03-25', isBill: true },
  { issueId: 'worker-rights-gig-economy', issueTitle: 'Gig Economy Worker Rights', stance: 'Strongly Supports', statement: 'Advocates for comprehensive legislation to provide benefits and protections for gig economy workers.', dateOfStance: '2023-09-01', isBill: false },
  { issueId: 'national-digital-id', issueTitle: 'National Digital ID Program', stance: 'Conditional Opposition', statement: 'Opposes the current proposal due to privacy concerns, demands stronger data protection measures before consideration.', dateOfStance: '2024-01-20', isBill: false },
];

const ppfFundingSources: FundingSource[] = [
    { year: '2023', sourceName: 'Rural Cooperative Union', amount: '$60,000', type: 'Union Contribution', description: 'Support for agricultural policies.' },
    { year: '2023', sourceName: 'Grassroots Member Drive', amount: '$150,000', type: 'Donation', description: 'Numerous small donations from members.'},
    { year: '2022', sourceName: 'Social Equity Fund', amount: '$40,000', type: 'Grant', description: 'For programs promoting social justice.'}
];

const ppfIntraPartyElections: IntraPartyElection[] = [
    { date: '2020-09-10', electionTitle: 'National Executive Committee Elections', resultsSummary: 'New members elected to NEC, representing diverse regional chapters.', documentUrl: 'https://ppf.example.com/nec-election-2020.pdf'},
];

const ppfHistoricalManifestos: HistoricalManifesto[] = [
  { year: '2019', url: 'https://ppf.example.com/manifesto-2019.pdf', description: 'PPF Manifesto for 2019 "A New Deal for the People".' },
  { year: '2014', url: 'https://ppf.example.com/manifesto-2014.pdf', description: 'PPF Platform "Forward Together" for 2014.' },
  { year: '2009', url: 'https://ppf.example.com/manifesto-2009.pdf', description: 'PPF Platform "Real Change Now" for 2009.' },
  { year: '2004', url: 'https://ppf.example.com/manifesto-2004.pdf', description: 'PPF Platform "The People\'s Voice" for 2004.' },
];

const ppfElectionHistory: ElectionPerformanceRecord[] = [
  { electionName: 'General Election 2024', year: 2024, seatsContested: 120, seatsWon: 25, votesPercentage: 15.5, changeInSeats: 5, changeInPercentage: 2.0, notes: 'Significant gains, became third-largest party.' },
  { electionName: 'General Election 2019', year: 2019, seatsContested: 110, seatsWon: 20, votesPercentage: 13.5, changeInSeats: 2, changeInPercentage: 1.0, notes: 'Consolidated support in key regions.' },
  { electionName: 'General Election 2014', year: 2014, seatsContested: 100, seatsWon: 18, votesPercentage: 12.5, notes: 'Established as a notable opposition voice.' },
  { electionName: 'General Election 2009', year: 2009, seatsContested: 90, seatsWon: 15, votesPercentage: 10.0, notes: 'First major breakthrough after Green Agrarian Union merger.' },
  { electionName: 'General Election 2004', year: 2004, seatsContested: 80, seatsWon: 8, votesPercentage: 6.5, notes: 'Initial electoral participation post-formation.' },
];


export const mockParties: Party[] = [
  {
    id: 'party1',
    name: 'Blue Unity Party',
    nepaliName: 'निलो एकता पार्टी',
    abbreviation: 'BUP',
    slug: 'blue-unity-party',
    leadership: [
      { name: 'Alice Democratia', role: 'Party Chair', politicianId: 'p1' },
      { name: 'Sarah Chen', role: 'General Secretary' },
      { name: 'David Stalwart', role: 'Senior Advisor', politicianId: 'p3-nonexistent'} // Assuming p3 is not Eleanor
    ],
    leadershipHistory: bupLeadershipHistory,
    contactInfo: {
      website: 'https://blueunity.example.com',
      email: 'info@blueunity.example.com',
      phone: '555-0011'
    },
    headquartersAddress: '1 Unity Plaza, Capital City, CP 10001',
    logoUrl: 'https://placehold.co/200x200.png',
    flagUrl: 'https://placehold.co/150x100.png?text=BUP+Flag',
    dataAiHint: 'party logo blue',
    electionSymbolUrl: 'https://placehold.co/100x100.png?text=Symbol1',
    partyColorHex: '#3072BA', // Patriotic Blue
    history: 'Founded in 1990, the BUP has evolved from a coalition of progressive groups into a major political force, known for its focus on social justice, environmental protection, and more recently, digital rights and technological advancement. (Short history for list views)',
    aboutParty: 'The Blue Unity Party (BUP) was established in 1990 by a coalition of progressive thinkers and activists. Our core mission is to champion social justice, safeguard the environment for future generations, and promote inclusive economic growth. After merging with the Environmental Action League and later the Digital Future Initiative, the party has broadened its policy scope. The BUP is structured with a national committee, regional chapters, and various specialized wings including influential Youth and Women\'s wings, and a newly formed Labour Wing. We believe in grassroots engagement and transparent governance.',
    foundedDate: '1990-07-04',
    registrationNumber: 'NAT-001-1990',
    ideology: ['Progressivism', 'Environmentalism', 'Social Democracy', 'Digital Rights'],
    detailedIdeologyDescription: 'BUP advocates for policies that support a strong social safety net, investment in renewable energy, universal healthcare, and equal opportunities for all citizens. We also champion robust data privacy laws and ethical AI development. We believe in a regulated market economy that serves the public good and promotes sustainable innovation.',
    partyManifestoUrl: 'https://blueunity.example.com/manifesto-2024.pdf',
    historicalManifestos: bupHistoricalManifestos,
    internationalAffiliations: ['Progressive Alliance International', 'Global Green Network (Observer)'],
    wings: [
      { name: 'Youth Wing', keyLeaders: [{name: 'Sarah Young', politicianId: 'p1'}], description: 'Engaging young people in political discourse and action. Recently launched a "Digital Natives for Policy" campaign.' },
      { name: 'Women\'s Wing', keyLeaders: [{name: 'Maria Garcia'}], description: 'Advocating for gender equality, women\'s empowerment, and increased female representation in politics.' },
      { name: 'Student Front', keyLeaders: [], description: 'Mobilizing students for progressive causes and voter registration drives.'},
      { name: 'Labour Wing', keyLeaders: [{name: 'Thomas Ironwright'}], description: 'Focuses on workers\' rights, fair wages, and union relations. Established 2018.'}
    ],
    alliances: bupAlliances,
    splitMergerHistory: bupSplitMergerHistory,
    stancesOnIssues: bupStances,
    fundingSources: bupFundingSources,
    intraPartyElections: bupIntraPartyElections,
    electionHistory: bupElectionHistory,
    isActive: true,
    isNationalParty: true,
    controversyIds: ['c1', 'c3'],
    tags: ['centrist', 'social-liberalism', 'green-policy', 'digital-inclusion'],
    revisionHistory: [
      {
        id: 'rev-party-001',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        author: 'AdminUserBUP',
        event: 'Party Details Updated',
        details: 'Updated party manifesto link and contact information based on official website changes.',
        suggestionId: 'sugg_party_contact_bup_xyz'
      },
      {
        id: 'rev-party-002',
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
        author: 'System',
        event: 'Party Record Created',
        details: 'Initial party record created upon system migration.',
      }
    ]
  },
  {
    id: 'party2',
    name: 'Red Alliance Group',
    nepaliName: 'रातो गठबन्धन समूह',
    abbreviation: 'RAG',
    slug: 'red-alliance-group',
    leadership: [
      { name: 'Victoria Ironwood', role: 'Party Leader' },
      { name: 'Bob Republicanus', role: 'Chief Strategist', politicianId: 'p2' },
      { name: 'Linda Fiscal', role: 'Chief Whip'}
    ],
    leadershipHistory: ragLeadershipHistory,
    contactInfo: {
      website: 'https://redalliance.example.com',
      email: 'contact@redalliance.example.com',
      phone: '555-0022'
    },
    headquartersAddress: '100 Freedom Road, Libertyville, LP 20002',
    logoUrl: 'https://placehold.co/200x200.png',
    flagUrl: 'https://placehold.co/150x100.png?text=RAG+Flag',
    dataAiHint: 'party logo red',
    electionSymbolUrl: 'https://placehold.co/100x100.png?text=Symbol2',
    partyColorHex: '#BA3030', // A shade of red
    history: 'Established in 1985 from a faction of the National Conservative Union, RAG champions free markets, individual liberties, and a strong national identity. Merged with the National Business First Party in 2008. (Short history for list views)',
    aboutParty: 'The Red Alliance Group (RAG) was formed in 1985 by a group of entrepreneurs and constitutional scholars dedicated to the principles of free markets, limited government, and individual liberty. Following its merger with the National Business First Party in 2008, RAG solidified its pro-business stance. Our mission is to foster an environment where businesses can thrive and citizens are empowered. The party structure includes a policy advisory council, state-level caucuses, and specialized councils for business and agriculture.',
    foundedDate: '1985-02-15',
    registrationNumber: 'NAT-005-1985',
    ideology: ['Conservatism', 'Libertarianism', 'Free Market Economy', 'Nationalism'],
    detailedIdeologyDescription: 'RAG supports policies that promote fiscal responsibility, lower taxation, deregulation, and a strong national defense. We believe in personal responsibility, the power of the individual, and upholding traditional values. The party advocates for a minimal government footprint in the economy.',
    partyManifestoUrl: 'https://redalliance.example.com/platform-2024.pdf',
    historicalManifestos: ragHistoricalManifestos,
    parentPartyId: 'partyOldConservative',
    parentPartyName: 'Old Conservative Union (Historical)',
    splinterPartyIds: ['partyNeoLibertarian', 'partyPeoplesVoiceFirst'],
    splinterPartyNames: ['Neo-Libertarian Movement', 'The People\'s Voice First'],
    wings: [
      { name: 'Business Council', description: 'Connecting with and supporting the business community. Hosts annual "Economic Freedom Summit".' },
      { name: 'Veterans Affairs Wing', keyLeaders: [{name: 'Colonel Strong (Bob R.)', politicianId: 'p2' }]},
      { name: 'Agricultural Council', keyLeaders: [{name: 'Farmer Giles'}], description: 'Advocating for farmers and rural communities. Established 2010.'}
    ],
    splitMergerHistory: ragSplitMergerHistory,
    stancesOnIssues: ragStances,
    fundingSources: ragFundingSources,
    intraPartyElections: ragIntraPartyElections,
    electionHistory: ragElectionHistory,
    isActive: true, // Changed to true for more dynamic interaction possibility
    isNationalParty: true, // Changed to true
    controversyIds: ['c2', 'c-fictional-rag-lobbying'],
    tags: ['right-wing', 'economic-conservatism', 'nationalism', 'pro-business'],
  },
  {
    id: 'party3-fictional',
    name: 'Green Future Party',
    abbreviation: 'GFP',
    slug: 'green-future-party',
    leadership: [{ name: 'Terra Evergreen', role: 'Party Leader'}],
    contactInfo: { email: 'info@greenfuture.example'},
    logoUrl: 'https://placehold.co/200x200.png',
    electionSymbolUrl: 'https://placehold.co/100x100.png?text=Symbol3',
    history: 'Advocates for environmental protection and sustainability.',
    foundedDate: '2010-01-01',
    ideology: ['Environmentalism', 'Green Politics'],
    isActive: true,
    isNationalParty: false,
    electionHistory: gfpElectionHistory,
    dataAiHint: 'party logo green',
    tags: ['eco-socialism', 'sustainability', 'climate-action'],
  },
  {
    id: 'party4-fictional',
    name: 'Social Justice Union',
    abbreviation: 'SJU',
    slug: 'social-justice-union',
    leadership: [{ name: 'Justus Equality', role: 'Party Leader'}],
    contactInfo: { email: 'info@sju.example'},
    logoUrl: 'https://placehold.co/200x200.png',
    electionSymbolUrl: 'https://placehold.co/100x100.png?text=Symbol4',
    history: 'Focuses on social equality and workers\' rights.',
    foundedDate: '2005-05-01',
    ideology: ['Socialism', 'Worker Rights'],
    parentPartyName: 'Old Labour Front',
    isActive: true,
    isNationalParty: true,
    dataAiHint: 'party logo purple',
    tags: ['democratic-socialism', 'labor-rights', 'equality'],
  },
  {
    id: 'party5',
    name: 'People\'s Progressive Front',
    nepaliName: 'जन प्रगतिशील मोर्चा',
    abbreviation: 'PPF',
    slug: 'peoples-progressive-front',
    leadership: [
      { name: 'Rajiv Singh', role: 'Party President', politicianId: 'p-fictional-rajiv' }, // Assuming a fictional ID for a leader not in politicians.ts
      { name: 'Maria Flores', role: 'Secretary-General' }
    ],
    leadershipHistory: ppfLeadershipHistory,
    contactInfo: {
      website: 'https://ppfront.example.org',
      email: 'contact@ppfront.example.org',
      phone: '555-0055'
    },
    headquartersAddress: '5 People\'s Avenue, Unity City, UC 50005',
    logoUrl: 'https://placehold.co/200x200.png?text=PPF',
    flagUrl: 'https://placehold.co/150x100.png?text=PPF+Flag',
    dataAiHint: 'party logo orange and green',
    electionSymbolUrl: 'https://placehold.co/100x100.png?text=Symbol5',
    partyColorHex: '#FF8C00', // Dark Orange
    history: 'Formed in 2000 from a major progressive faction of the Old People\'s Party, the PPF merged with the Green Agrarian Union in 2008, significantly broadening its appeal. Advocates for social democracy, environmental sustainability, and grassroots empowerment.',
    aboutParty: 'The People\'s Progressive Front (PPF) emerged in early 2000 from a significant ideological split within the Old People\'s Party, driven by a desire for more radical progressive reforms and grassroots democracy. Under the initial leadership of Arthur Pendelton and later Sofia Chen, the PPF established itself as a voice for workers, farmers, and marginalized communities. A key milestone was the 2008 merger with the Green Agrarian Union, which integrated deep ecological concerns and rural advocacy into the party\'s platform. The PPF champions policies aimed at reducing inequality, transitioning to a green economy, and strengthening local governance structures. It faces ongoing challenges from more radical splinter groups like the Youth Forward Bloc.',
    foundedDate: '2000-01-15',
    registrationNumber: 'NAT-025-2000',
    ideology: ['Social Democracy', 'Agrarianism', 'Environmental Justice', 'Grassroots Democracy'],
    detailedIdeologyDescription: 'PPF combines principles of social democracy with a strong emphasis on environmental sustainability and agrarian justice. Key policies include land reform, support for cooperatives, investment in public services, progressive taxation, and robust climate action. The party believes in decentralized power and active citizen participation in decision-making.',
    partyManifestoUrl: 'https://ppfront.example.org/manifesto-current.pdf',
    historicalManifestos: ppfHistoricalManifestos,
    internationalAffiliations: ['Global Progressive Forum'],
    wings: [
      { name: 'Farmers United Wing', keyLeaders: [{name: 'Old MacDonald'}], description: 'Represents the interests of small and medium-scale farmers.' },
      { name: 'Eco-Socialist Youth Cadre', keyLeaders: [], description: 'The party\'s energetic youth branch, focused on climate action and social equality.' },
      { name: 'Workers\' Solidarity Front', description: 'Advocates for labor rights and fair employment practices.'}
    ],
    alliances: [
        { name: 'Left-Green Alliance (Local Elections)', partnerPartyIds: ['party3-fictional'], partnerPartyNames: ['Green Future Party'], startDate: '2022-03-01', endDate: '2022-11-30', purpose: 'Collaboration for local council elections in specific regions.', status: 'Concluded'}
    ],
    splitMergerHistory: ppfSplitMergerHistory,
    stancesOnIssues: ppfStances,
    fundingSources: ppfFundingSources,
    intraPartyElections: ppfIntraPartyElections,
    electionHistory: ppfElectionHistory,
    isActive: true,
    isNationalParty: true,
    controversyIds: ['c-fictional-ppf-funding-source-inquiry'], // Fictional controversy ID
    tags: ['progressive', 'agrarian-socialism', 'environmental-justice', 'decentralization'],
    revisionHistory: [
      { id: 'rev-party-ppf-001', date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), author: 'FoundingMember', event: 'Initial Party Data Entry', details: 'Party profile created with formation data.'}
    ]
  }
];

// Data for new party: People's Progressive Front (PPF)
const ppfLeadershipHistory: LeadershipEvent[] = [
  { name: 'Arthur Pendelton', role: 'Interim Leader', startDate: '2000-01-15', endDate: '2000-08-30' },
  { name: 'Sofia Chen', role: 'Party President', startDate: '2000-09-01', endDate: '2010-05-10' },
  { name: 'Rajiv Singh', role: 'Party President', startDate: '2010-05-11', endDate: 'Present' },
  { name: 'Maria Flores', role: 'Secretary-General', startDate: '2000-09-01', endDate: 'Present'}
];

const ppfSplitMergerHistory: PartySplitMergerEvent[] = [
  { date: '2000-01-15', type: 'Formation', description: 'Formed from a major progressive faction splitting from the "Old People\'s Party" due to ideological differences regarding economic policy. Key figures: Arthur Pendelton, Sofia Chen.', involvedParties: [{name: 'Old People\'s Party', role: 'SplitFrom'}] },
  { date: '2008-06-20', type: 'Merger', description: 'Successfully merged with the "Green Agrarian Union", broadening its support base in rural areas and strengthening its environmental platform.', involvedParties: [{name: 'Green Agrarian Union', role: 'PartnerInMerger'}]},
  { date: '2015-03-01', type: 'Split', description: 'A smaller, more radical youth faction, "Youth Forward Bloc", split due to disagreements on the pace of reforms. Key figure: Alex Youngblood.', involvedParties: [{name: 'Youth Forward Bloc', role: 'EmergedAs'}]}
];

const ppfStances: PartyStance[] = [
  { issueId: 'urban-development-rural-support', issueTitle: 'Urban Development vs Rural Support Balance', stance: 'Prioritizes Rural Support', statement: 'Initial focus on redressing historical underinvestment in rural communities.', dateOfStance: '2001-02-01', isBill: false },
  { issueId: 'urban-development-rural-support', issueTitle: 'Urban Development vs Rural Support Balance', stance: 'Balanced Approach', statement: 'Recognizes the need for sustainable urban development while ensuring continued robust support for rural agricultural and community programs.', dateOfStance: '2010-05-15', isBill: false },
  { issueId: 'b1', issueTitle: 'Clean Energy Act 2024', stance: 'Supports with amendments', statement: 'Supports the overall goal but proposes amendments for stronger community ownership models of renewable projects.', dateOfStance: '2024-03-25', isBill: true },
  { issueId: 'worker-rights-gig-economy', issueTitle: 'Gig Economy Worker Rights', stance: 'Strongly Supports', statement: 'Advocates for comprehensive legislation to provide benefits and protections for gig economy workers.', dateOfStance: '2023-09-01', isBill: false },
  { issueId: 'national-digital-id', issueTitle: 'National Digital ID Program', stance: 'Conditional Opposition', statement: 'Opposes the current proposal due to privacy concerns, demands stronger data protection measures before consideration.', dateOfStance: '2024-01-20', isBill: false },
];

const ppfFundingSources: FundingSource[] = [
    { year: '2023', sourceName: 'Rural Cooperative Union', amount: '$60,000', type: 'Union Contribution', description: 'Support for agricultural policies.' },
    { year: '2023', sourceName: 'Grassroots Member Drive', amount: '$150,000', type: 'Donation', description: 'Numerous small donations from members.'},
    { year: '2022', sourceName: 'Social Equity Fund', amount: '$40,000', type: 'Grant', description: 'For programs promoting social justice.'}
];

const ppfIntraPartyElections: IntraPartyElection[] = [
    { date: '2020-09-10', electionTitle: 'National Executive Committee Elections', resultsSummary: 'New members elected to NEC, representing diverse regional chapters.', documentUrl: 'https://ppf.example.com/nec-election-2020.pdf'},
];

const ppfHistoricalManifestos: HistoricalManifesto[] = [
  { year: '2019', url: 'https://ppf.example.com/manifesto-2019.pdf', description: 'PPF Manifesto for 2019 "A New Deal for the People".' },
  { year: '2014', url: 'https://ppf.example.com/manifesto-2014.pdf', description: 'PPF Platform "Forward Together" for 2014.' },
  { year: '2009', url: 'https://ppf.example.com/manifesto-2009.pdf', description: 'PPF Platform "Real Change Now" for 2009.' },
  { year: '2004', url: 'https://ppf.example.com/manifesto-2004.pdf', description: 'PPF Platform "The People\'s Voice" for 2004.' },
];

const ppfElectionHistory: ElectionPerformanceRecord[] = [
  { electionName: 'General Election 2024', year: 2024, seatsContested: 120, seatsWon: 25, votesPercentage: 15.5, changeInSeats: 5, changeInPercentage: 2.0, notes: 'Significant gains, became third-largest party.' },
  { electionName: 'General Election 2019', year: 2019, seatsContested: 110, seatsWon: 20, votesPercentage: 13.5, changeInSeats: 2, changeInPercentage: 1.0, notes: 'Consolidated support in key regions.' },
  { electionName: 'General Election 2014', year: 2014, seatsContested: 100, seatsWon: 18, votesPercentage: 12.5, notes: 'Established as a notable opposition voice.' },
  { electionName: 'General Election 2009', year: 2009, seatsContested: 90, seatsWon: 15, votesPercentage: 10.0, notes: 'First major breakthrough after Green Agrarian Union merger.' },
  { electionName: 'General Election 2004', year: 2004, seatsContested: 80, seatsWon: 8, votesPercentage: 6.5, notes: 'Initial electoral participation post-formation.' },
];


export const mockParties: Party[] = [
  {
    id: 'party1',
    name: 'Blue Unity Party',
    nepaliName: 'निलो एकता पार्टी',
    abbreviation: 'BUP',
    slug: 'blue-unity-party',
    leadership: [
      { name: 'Alice Democratia', role: 'Party Chair', politicianId: 'p1' },
      { name: 'Sarah Chen', role: 'General Secretary' },
      { name: 'David Stalwart', role: 'Senior Advisor', politicianId: 'p3-nonexistent'} // Assuming p3 is not Eleanor
    ],
    leadershipHistory: bupLeadershipHistory,
    contactInfo: {
      website: 'https://blueunity.example.com',
      email: 'info@blueunity.example.com',
      phone: '555-0011'
    },
    headquartersAddress: '1 Unity Plaza, Capital City, CP 10001',
    logoUrl: 'https://placehold.co/200x200.png',
    flagUrl: 'https://placehold.co/150x100.png?text=BUP+Flag',
    dataAiHint: 'party logo blue',
    electionSymbolUrl: 'https://placehold.co/100x100.png?text=Symbol1',
    partyColorHex: '#3072BA', // Patriotic Blue
    history: 'Founded in 1990, the BUP has evolved from a coalition of progressive groups into a major political force, known for its focus on social justice, environmental protection, and more recently, digital rights and technological advancement. (Short history for list views)',
    aboutParty: 'The Blue Unity Party (BUP) was established in 1990 by a coalition of progressive thinkers and activists. Our core mission is to champion social justice, safeguard the environment for future generations, and promote inclusive economic growth. After merging with the Environmental Action League and later the Digital Future Initiative, the party has broadened its policy scope. The BUP is structured with a national committee, regional chapters, and various specialized wings including influential Youth and Women\'s wings, and a newly formed Labour Wing. We believe in grassroots engagement and transparent governance.',
    foundedDate: '1990-07-04',
    registrationNumber: 'NAT-001-1990',
    ideology: ['Progressivism', 'Environmentalism', 'Social Democracy', 'Digital Rights'],
    detailedIdeologyDescription: 'BUP advocates for policies that support a strong social safety net, investment in renewable energy, universal healthcare, and equal opportunities for all citizens. We also champion robust data privacy laws and ethical AI development. We believe in a regulated market economy that serves the public good and promotes sustainable innovation.',
    partyManifestoUrl: 'https://blueunity.example.com/manifesto-2024.pdf',
    historicalManifestos: bupHistoricalManifestos,
    internationalAffiliations: ['Progressive Alliance International', 'Global Green Network (Observer)'],
    wings: [
      { name: 'Youth Wing', keyLeaders: [{name: 'Sarah Young', politicianId: 'p1'}], description: 'Engaging young people in political discourse and action. Recently launched a "Digital Natives for Policy" campaign.' },
      { name: 'Women\'s Wing', keyLeaders: [{name: 'Maria Garcia'}], description: 'Advocating for gender equality, women\'s empowerment, and increased female representation in politics.' },
      { name: 'Student Front', keyLeaders: [], description: 'Mobilizing students for progressive causes and voter registration drives.'},
      { name: 'Labour Wing', keyLeaders: [{name: 'Thomas Ironwright'}], description: 'Focuses on workers\' rights, fair wages, and union relations. Established 2018.'}
    ],
    alliances: bupAlliances,
    splitMergerHistory: bupSplitMergerHistory,
    stancesOnIssues: bupStances,
    fundingSources: bupFundingSources,
    intraPartyElections: bupIntraPartyElections,
    electionHistory: bupElectionHistory,
    isActive: true,
    isNationalParty: true,
    controversyIds: ['c1', 'c3'],
    tags: ['centrist', 'social-liberalism', 'green-policy', 'digital-inclusion'],
    revisionHistory: [
      {
        id: 'rev-party-001',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        author: 'AdminUserBUP',
        event: 'Party Details Updated',
        details: 'Updated party manifesto link and contact information based on official website changes.',
        suggestionId: 'sugg_party_contact_bup_xyz'
      },
      {
        id: 'rev-party-002',
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
        author: 'System',
        event: 'Party Record Created',
        details: 'Initial party record created upon system migration.',
      }
    ]
  },
  {
    id: 'party2',
    name: 'Red Alliance Group',
    nepaliName: 'रातो गठबन्धन समूह',
    abbreviation: 'RAG',
    slug: 'red-alliance-group',
    leadership: [
      { name: 'Victoria Ironwood', role: 'Party Leader' },
      { name: 'Bob Republicanus', role: 'Chief Strategist', politicianId: 'p2' },
      { name: 'Linda Fiscal', role: 'Chief Whip'}
    ],
    leadershipHistory: ragLeadershipHistory,
    contactInfo: {
      website: 'https://redalliance.example.com',
      email: 'contact@redalliance.example.com',
      phone: '555-0022'
    },
    headquartersAddress: '100 Freedom Road, Libertyville, LP 20002',
    logoUrl: 'https://placehold.co/200x200.png',
    flagUrl: 'https://placehold.co/150x100.png?text=RAG+Flag',
    dataAiHint: 'party logo red',
    electionSymbolUrl: 'https://placehold.co/100x100.png?text=Symbol2',
    partyColorHex: '#BA3030', // A shade of red
    history: 'Established in 1985 from a faction of the National Conservative Union, RAG champions free markets, individual liberties, and a strong national identity. Merged with the National Business First Party in 2008. (Short history for list views)',
    aboutParty: 'The Red Alliance Group (RAG) was formed in 1985 by a group of entrepreneurs and constitutional scholars dedicated to the principles of free markets, limited government, and individual liberty. Following its merger with the National Business First Party in 2008, RAG solidified its pro-business stance. Our mission is to foster an environment where businesses can thrive and citizens are empowered. The party structure includes a policy advisory council, state-level caucuses, and specialized councils for business and agriculture.',
    foundedDate: '1985-02-15',
    registrationNumber: 'NAT-005-1985',
    ideology: ['Conservatism', 'Libertarianism', 'Free Market Economy', 'Nationalism'],
    detailedIdeologyDescription: 'RAG supports policies that promote fiscal responsibility, lower taxation, deregulation, and a strong national defense. We believe in personal responsibility, the power of the individual, and upholding traditional values. The party advocates for a minimal government footprint in the economy.',
    partyManifestoUrl: 'https://redalliance.example.com/platform-2024.pdf',
    historicalManifestos: ragHistoricalManifestos,
    parentPartyId: 'partyOldConservative',
    parentPartyName: 'Old Conservative Union (Historical)',
    splinterPartyIds: ['partyNeoLibertarian', 'partyPeoplesVoiceFirst'],
    splinterPartyNames: ['Neo-Libertarian Movement', 'The People\'s Voice First'],
    wings: [
      { name: 'Business Council', description: 'Connecting with and supporting the business community. Hosts annual "Economic Freedom Summit".' },
      { name: 'Veterans Affairs Wing', keyLeaders: [{name: 'Colonel Strong (Bob R.)', politicianId: 'p2' }]},
      { name: 'Agricultural Council', keyLeaders: [{name: 'Farmer Giles'}], description: 'Advocating for farmers and rural communities. Established 2010.'}
    ],
    splitMergerHistory: ragSplitMergerHistory,
    stancesOnIssues: ragStances,
    fundingSources: ragFundingSources,
    intraPartyElections: ragIntraPartyElections,
    electionHistory: ragElectionHistory,
    isActive: true, // Changed to true for more dynamic interaction possibility
    isNationalParty: true, // Changed to true
    controversyIds: ['c2', 'c-fictional-rag-lobbying'],
    tags: ['right-wing', 'economic-conservatism', 'nationalism', 'pro-business'],
  },
  {
    id: 'party3-fictional',
    name: 'Green Future Party',
    abbreviation: 'GFP',
    slug: 'green-future-party',
    leadership: [{ name: 'Terra Evergreen', role: 'Party Leader'}],
    contactInfo: { email: 'info@greenfuture.example'},
    logoUrl: 'https://placehold.co/200x200.png',
    electionSymbolUrl: 'https://placehold.co/100x100.png?text=Symbol3',
    history: 'Advocates for environmental protection and sustainability.',
    foundedDate: '2010-01-01',
    ideology: ['Environmentalism', 'Green Politics'],
    isActive: true,
    isNationalParty: false,
    electionHistory: gfpElectionHistory,
    dataAiHint: 'party logo green',
    tags: ['eco-socialism', 'sustainability', 'climate-action'],
  },
  {
    id: 'party4-fictional',
    name: 'Social Justice Union',
    abbreviation: 'SJU',
    slug: 'social-justice-union',
    leadership: [{ name: 'Justus Equality', role: 'Party Leader'}],
    contactInfo: { email: 'info@sju.example'},
    logoUrl: 'https://placehold.co/200x200.png',
    electionSymbolUrl: 'https://placehold.co/100x100.png?text=Symbol4',
    history: 'Focuses on social equality and workers\' rights.',
    foundedDate: '2005-05-01',
    ideology: ['Socialism', 'Worker Rights'],
    parentPartyName: 'Old Labour Front',
    isActive: true,
    isNationalParty: true,
    dataAiHint: 'party logo purple',
    tags: ['democratic-socialism', 'labor-rights', 'equality'],
  },
  {
    id: 'party5',
    name: 'People\'s Progressive Front',
    nepaliName: 'जन प्रगतिशील मोर्चा',
    abbreviation: 'PPF',
    slug: 'peoples-progressive-front',
    leadership: [
      { name: 'Rajiv Singh', role: 'Party President', politicianId: 'p-fictional-rajiv' },
      { name: 'Maria Flores', role: 'Secretary-General' }
    ],
    leadershipHistory: ppfLeadershipHistory,
    contactInfo: {
      website: 'https://ppfront.example.org',
      email: 'contact@ppfront.example.org',
      phone: '555-0055'
    },
    headquartersAddress: '5 People\'s Avenue, Unity City, UC 50005',
    logoUrl: 'https://placehold.co/200x200.png?text=PPF',
    flagUrl: 'https://placehold.co/150x100.png?text=PPF+Flag',
    dataAiHint: 'party logo orange and green',
    electionSymbolUrl: 'https://placehold.co/100x100.png?text=Symbol5',
    partyColorHex: '#FF8C00', // Dark Orange
    history: 'Formed in 2000 from a major progressive faction of the Old People\'s Party, the PPF merged with the Green Agrarian Union in 2008, significantly broadening its appeal. Advocates for social democracy, environmental sustainability, and grassroots empowerment.',
    aboutParty: 'The People\'s Progressive Front (PPF) emerged in early 2000 from a significant ideological split within the Old People\'s Party, driven by a desire for more radical progressive reforms and grassroots democracy. Under the initial leadership of Arthur Pendelton and later Sofia Chen, the PPF established itself as a voice for workers, farmers, and marginalized communities. A key milestone was the 2008 merger with the Green Agrarian Union, which integrated deep ecological concerns and rural advocacy into the party\'s platform. The PPF champions policies aimed at reducing inequality, transitioning to a green economy, and strengthening local governance structures. It faces ongoing challenges from more radical splinter groups like the Youth Forward Bloc.',
    foundedDate: '2000-01-15',
    registrationNumber: 'NAT-025-2000',
    ideology: ['Social Democracy', 'Agrarianism', 'Environmental Justice', 'Grassroots Democracy'],
    detailedIdeologyDescription: 'PPF combines principles of social democracy with a strong emphasis on environmental sustainability and agrarian justice. Key policies include land reform, support for cooperatives, investment in public services, progressive taxation, and robust climate action. The party believes in decentralized power and active citizen participation in decision-making.',
    partyManifestoUrl: 'https://ppfront.example.org/manifesto-current.pdf',
    historicalManifestos: ppfHistoricalManifestos,
    internationalAffiliations: ['Global Progressive Forum'],
    wings: [
      { name: 'Farmers United Wing', keyLeaders: [{name: 'Old MacDonald'}], description: 'Represents the interests of small and medium-scale farmers.' },
      { name: 'Eco-Socialist Youth Cadre', keyLeaders: [], description: 'The party\'s energetic youth branch, focused on climate action and social equality.' },
      { name: 'Workers\' Solidarity Front', description: 'Advocates for labor rights and fair employment practices.'}
    ],
    alliances: [
        { name: 'Left-Green Alliance (Local Elections)', partnerPartyIds: ['party3-fictional'], partnerPartyNames: ['Green Future Party'], startDate: '2022-03-01', endDate: '2022-11-30', purpose: 'Collaboration for local council elections in specific regions.', status: 'Concluded'}
    ],
    splitMergerHistory: ppfSplitMergerHistory,
    stancesOnIssues: ppfStances,
    fundingSources: ppfFundingSources,
    intraPartyElections: ppfIntraPartyElections,
    electionHistory: ppfElectionHistory,
    isActive: true,
    isNationalParty: true,
    controversyIds: ['c-fictional-ppf-funding-source-inquiry'], // Fictional controversy ID
    tags: ['progressive', 'agrarian-socialism', 'environmental-justice', 'decentralization'],
    revisionHistory: [
      { id: 'rev-party-ppf-001', date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), author: 'FoundingMember', event: 'Initial Party Data Entry', details: 'Party profile created with formation data.'}
    ]
  }
];

export function getPartyById(id: string): Party | undefined {
  return mockParties.find(p => p.id === id);
}

export function getPartyNameById(id: string): string | undefined {
  return mockParties.find(p => p.id === id)?.name;
}
