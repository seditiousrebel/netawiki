
import type { Party, LeadershipEvent, PartyAlliance, PartySplitMergerEvent, PartyStance, FundingSource, IntraPartyElection, HistoricalManifesto, ElectionPerformanceRecord } from '@/types/gov';

const bupLeadershipHistory: LeadershipEvent[] = [
  { name: 'Arthur Founder', role: 'Founding Chair', startDate: '1990-07-04', endDate: '1998-06-30' },
  { name: 'Eleanor Vanguard', role: 'Party Chair', startDate: '1998-07-01', politicianId: 'p3-nonexistent', endDate: 'Present' },
  { name: 'Old Secretary', role: 'General Secretary', startDate: '1990-07-04', endDate: '2005-12-31'},
  { name: 'John Smith', role: 'General Secretary', startDate: '2006-01-01', endDate: 'Present' }
];

const ragLeadershipHistory: LeadershipEvent[] = [
  { name: 'Senator Oldguard', role: 'Founding Leader', startDate: '1985-02-15', endDate: '1995-01-01' },
  { name: 'Marcus Standard', role: 'Party Leader', startDate: '1995-01-02', politicianId: 'p2', endDate: 'Present' },
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
  }
];

const bupSplitMergerHistory: PartySplitMergerEvent[] = [
  { date: '1990-07-04', type: 'Formation', description: 'Formed from a coalition of progressive groups.'},
  { date: '2005-11-20', type: 'Merger', description: 'Merged with the Environmental Action League.', involvedParties: [{name: 'Environmental Action League', role: 'PartnerInMerger'}]}
];

const ragSplitMergerHistory: PartySplitMergerEvent[] = [
   { date: '1985-02-15', type: 'Formation', description: 'Established as a new conservative entity.'},
   { date: '1992-03-10', type: 'Split', description: 'A faction split to form the "Traditional Values Party".', involvedParties: [{name: 'Traditional Values Party', role: 'EmergedAs'}]},
];


const bupStances: PartyStance[] = [
  { issueId: 'b1', issueTitle: 'Clean Energy Act 2024', stance: 'Supports', statement: 'BUP strongly supports the Clean Energy Act as it aligns with our core environmental principles.', statementUrl: 'https://blueunity.example.com/stances/clean-energy-act', dateOfStance: '2024-03-20', isBill: true },
  { issueId: 'national-healthcare-reform', issueTitle: 'National Healthcare Reform', stance: 'Supports', statement: 'We advocate for comprehensive healthcare reform to ensure universal access.', dateOfStance: '2023-11-01', isBill: false },
];

const ragStances: PartyStance[] = [
  { issueId: 'b2', issueTitle: 'Digital Literacy For All Act', stance: 'Supports', statement: 'RAG believes digital literacy is crucial for economic competitiveness.', dateOfStance: '2023-10-05', isBill: true },
  { issueId: 'tax-cut-proposal-2025', issueTitle: 'Proposed Tax Cuts 2025', stance: 'Supports', statement: 'Lowering taxes will stimulate investment and job creation.', statementUrl: 'https://redalliance.example.com/stances/tax-cuts-2025', dateOfStance: '2024-05-15', isBill: false },
];

const bupFundingSources: FundingSource[] = [
    { year: '2023', sourceName: 'EcoFuture Foundation', amount: '$50,000', type: 'Grant', description: 'For environmental advocacy programs.', sourceUrl: 'https://example.com/ecofuture-grant-report.pdf' },
    { year: '2023', sourceName: 'Public Donations (Aggregated)', amount: '$120,000', type: 'Donation', description: 'Collected through online platform and fundraising events.'},
    { year: '2022', sourceName: 'Tech Innovators LLC', amount: 'Significant Contributor (Undisclosed)', type: 'Corporate Contribution', description: 'Support for technology in governance initiatives.'}
];

const bupIntraPartyElections: IntraPartyElection[] = [
    { date: '2022-08-15', electionTitle: 'National Convention - Party Chairperson Election', resultsSummary: 'Eleanor Vanguard re-elected as Party Chair with 75% of delegate votes.', documentUrl: 'https://blueunity.example.com/election-results-2022.pdf'},
    { date: '2023-03-01', electionTitle: 'Youth Wing Leadership Election', description: 'Election for the new President of the Blue Unity Youth Wing.', resultsSummary: 'Sarah Young elected President.'}
];

const bupHistoricalManifestos: HistoricalManifesto[] = [
  { year: '2019', url: 'https://blueunity.example.com/manifesto-2019.pdf', description: 'Manifesto for the 2019 General Elections.' },
  { year: '2014', url: 'https://blueunity.example.com/manifesto-2014.pdf', description: 'Party platform for the 2014 National Assembly elections.' },
];

const bupElectionHistory: ElectionPerformanceRecord[] = [
  { electionYear: '2019', electionType: 'General', seatsContested: 150, seatsWon: 65, votePercentage: 35.5, notes: 'Formed a coalition government.' },
  { electionYear: '2020', electionType: 'Local', seatsWon: 320, notes: 'Gained majority in 5 key municipalities.' },
  { electionYear: '2024', electionType: 'General', seatsContested: 160, seatsWon: 72, votePercentage: 38.2, notes: 'Increased seat share.' },
];

const ragElectionHistory: ElectionPerformanceRecord[] = [
  { electionYear: '2019', electionType: 'General', seatsContested: 140, seatsWon: 55, votePercentage: 30.1 },
  { electionYear: '2024', electionType: 'General', seatsContested: 155, seatsWon: 60, votePercentage: 32.5, notes: 'Main opposition party.' },
];


export const mockParties: Party[] = [
  {
    id: 'party1',
    name: 'Blue Unity Party',
    nepaliName: 'निलो एकता पार्टी',
    abbreviation: 'BUP',
    slug: 'blue-unity-party',
    leadership: [
      { name: 'Eleanor Vanguard', role: 'Party Chair', politicianId: 'p3-nonexistent' },
      { name: 'Alice Democratia', role: 'Policy Head', politicianId: 'p1' },
      { name: 'John Smith', role: 'General Secretary' }
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
    history: 'Founded in 1990 with a focus on social justice and environmental protection. (Short history for list views)',
    aboutParty: 'The Blue Unity Party (BUP) was established in 1990 by a coalition of progressive thinkers and activists. Our core mission is to champion social justice, safeguard the environment for future generations, and promote inclusive economic growth. The party is structured with a national committee, regional chapters, and various specialized wings to address diverse community needs. We believe in grassroots engagement and transparent governance.',
    foundedDate: '1990-07-04',
    registrationNumber: 'NAT-001-1990',
    ideology: ['Progressivism', 'Environmentalism', 'Social Democracy'],
    detailedIdeologyDescription: 'BUP advocates for policies that support a strong social safety net, investment in renewable energy, universal healthcare, and equal opportunities for all citizens. We believe in a regulated market economy that serves the public good.',
    partyManifestoUrl: 'https://blueunity.example.com/manifesto-2024.pdf',
    historicalManifestos: bupHistoricalManifestos,
    internationalAffiliations: ['Progressive Alliance International'],
    wings: [
      { name: 'Youth Wing', keyLeaders: [{name: 'Sarah Young', politicianId: 'p1'}], description: 'Engaging young people in political discourse and action.' },
      { name: 'Women\'s Wing', keyLeaders: [{name: 'Maria Garcia'}], description: 'Advocating for gender equality and women\'s empowerment.' },
      { name: 'Student Front', keyLeaders: [], description: 'Mobilizing students for progressive causes.'}
    ],
    alliances: bupAlliances,
    splitMergerHistory: bupSplitMergerHistory,
    stancesOnIssues: bupStances,
    fundingSources: bupFundingSources,
    intraPartyElections: bupIntraPartyElections,
    electionHistory: bupElectionHistory,
    isActive: true,
    isNationalParty: true,
    controversyIds: ['c1'],
    tags: ['centrist', 'social-liberalism', 'green-policy'],
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
      { name: 'Marcus Standard', role: 'Party Leader', politicianId: 'p2' },
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
    history: 'Established in 1985, advocating for free markets and individual liberties. (Short history for list views)',
    aboutParty: 'The Red Alliance Group (RAG) was formed in 1985 by a group of entrepreneurs and constitutional scholars dedicated to the principles of free markets, limited government, and individual liberty. Our mission is to foster an environment where businesses can thrive and citizens are empowered. The party structure includes a policy advisory council and state-level caucuses.',
    foundedDate: '1985-02-15',
    registrationNumber: 'NAT-005-1985',
    ideology: ['Conservatism', 'Libertarianism', 'Free Market Economy'],
    detailedIdeologyDescription: 'RAG supports policies that promote fiscal responsibility, lower taxation, deregulation, and a strong national defense. We believe in personal responsibility and the power of the individual.',
    partyManifestoUrl: 'https://redalliance.example.com/platform-2024.pdf',
    parentPartyId: 'partyOldConservative',
    parentPartyName: 'Old Conservative Union (Historical)',
    splinterPartyIds: ['partyNeoLibertarian'],
    splinterPartyNames: ['Neo-Libertarian Movement'],
    wings: [
      { name: 'Business Council', description: 'Connecting with and supporting the business community.' },
      { name: 'Veterans Affairs Wing', keyLeaders: [{name: 'Colonel Strong (Bob R.)', politicianId: 'p2' }]}
    ],
    splitMergerHistory: ragSplitMergerHistory,
    stancesOnIssues: ragStances,
    electionHistory: ragElectionHistory,
    isActive: false,
    isNationalParty: false,
    controversyIds: ['c2'],
    tags: ['right-wing', 'economic-conservatism', 'nationalism'],
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
  }
];

export function getPartyById(id: string): Party | undefined {
  return mockParties.find(p => p.id === id);
}

export function getPartyNameById(id: string): string | undefined {
  return mockParties.find(p => p.id === id)?.name;
}
