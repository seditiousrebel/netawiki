
import type { Election, ElectionCandidate, ElectionStatus, ElectionType, ElectionCandidateStatus, ElectionTimelineEvent } from '@/types/gov';

const generalElection2024Timeline: ElectionTimelineEvent[] = [
  { date: '2024-08-01', event: 'Official Election Announcement', description: 'The Election Commission officially announced the date and schedule for the 2024 General Election.'},
  { date: '2024-09-15', event: 'Voter Registration Deadline', description: 'Last day for citizens to register or update their voter information.'},
  { date: '2024-10-01', event: 'Candidate Nomination Period Opens', description: 'Parties and independent candidates can file their nominations.'},
  { date: '2024-10-10', event: 'Candidate Nomination Deadline', description: 'Final day for submitting candidate nominations.'},
  { date: '2024-10-15', event: 'Campaign Period Officially Begins', description: 'Candidates and parties are permitted to start their official campaigns.', relatedDocumentUrl: 'https://example.com/campaign-rules.pdf'},
  { date: '2024-11-13', event: 'Campaign Silence Period Starts', description: 'All campaigning must cease 48 hours before voting day.'},
  { date: '2024-11-15', event: 'Voting Day', description: 'Polling stations open across the country for citizens to cast their votes.'},
  { date: '2024-11-16', event: 'Vote Counting Begins', description: 'Counting of votes commences at designated centers.'},
  { date: '2024-11-20', event: 'Preliminary Results Announcement (Expected)', description: 'Initial results and trends expected to be announced.'},
];

export const mockElections: Election[] = [
  {
    id: 'gen2024',
    slug: 'general-election-2024',
    name: 'National General Election 2024',
    electionType: 'General' as ElectionType,
    date: '2024-11-15',
    description: 'The upcoming general election to elect members of the Federal Parliament.',
    country: 'Nepal',
    status: 'Scheduled' as ElectionStatus,
    totalRegisteredVoters: 18000000,
    pollingStationsCount: 22000,
    timelineEvents: generalElection2024Timeline,
    tags: ['parliamentary', 'federal'],
    dataAiHint: 'election voting poll',
    revisionHistory: [
      {
        id: 'rev-election-gen2024-001',
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
        author: 'EditorAlice',
        event: 'Election Candidate List Updated',
        details: 'Added candidate John Doe (Independent) to KTM-2 constituency after successful registration appeal.',
        suggestionId: 'sugg_election_candidate_new_xyz'
      },
      {
        id: 'rev-election-gen2024-002',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        author: 'SystemUpdate',
        event: 'Polling Station Count Updated',
        details: 'Total polling stations increased from 21950 to 22000 based on EC final list.',
      }
    ]
  },
  {
    id: 'provBag2023',
    slug: 'provincial-election-bagmati-2023',
    name: 'Bagmati Provincial Assembly Election 2023',
    electionType: 'Provincial' as ElectionType,
    date: '2023-05-20',
    description: 'Election for members of the Bagmati Provincial Assembly.',
    country: 'Nepal',
    province: 'Bagmati Province',
    status: 'Concluded' as ElectionStatus,
    voterTurnoutPercentage: 65.5,
    totalRegisteredVoters: 3500000,
    totalVotesCast: 2292500,
    timelineEvents: [
        { date: '2023-03-01', event: 'Election Announced' },
        { date: '2023-04-15', event: 'Voting Day' },
        { date: '2023-04-20', event: 'Results Declared' }
    ],
    tags: ['provincial-assembly', 'bagmati'],
    dataAiHint: 'regional map government',
  },
  {
    id: 'localKath2022',
    slug: 'local-election-kathmandu-2022',
    name: 'Kathmandu Metropolitan City Local Election 2022',
    electionType: 'Local Body' as ElectionType,
    date: '2022-05-13',
    description: 'Election for Mayor, Deputy Mayor, Ward Chairs, and members of Kathmandu Metropolitan City.',
    country: 'Nepal',
    districts: ['Kathmandu'],
    status: 'Concluded' as ElectionStatus,
    voterTurnoutPercentage: 60.2,
    tags: ['municipal', 'mayoralty', 'local-government'],
    dataAiHint: 'city hall urban',
  },
];

export const mockElectionCandidates: ElectionCandidate[] = [
  // Candidates for General Election 2024 (gen2024)
  {
    id: 'gen2024-p1-c101',
    electionId: 'gen2024',
    politicianId: 'p1', // Alice Democratia
    politicianName: 'Alice Democratia',
    partyId: 'party1', // Blue Unity Party
    partyName: 'Blue Unity Party',
    partySymbolUrl: 'https://placehold.co/50x50.png?text=BUP',
    constituencyId: 'KTM-1',
    constituencyName: 'Kathmandu Constituency 1',
    status: 'Nominated' as ElectionCandidateStatus,
    manifestoUrl: 'https://example.com/alice-gen2024-manifesto.pdf',
    ballotNumber: '5A'
  },
  {
    id: 'gen2024-p2-c101',
    electionId: 'gen2024',
    politicianId: 'p2', // Bob Republicanus
    politicianName: 'Bob Republicanus',
    partyId: 'party2', // Red Alliance Group
    partyName: 'Red Alliance Group',
    partySymbolUrl: 'https://placehold.co/50x50.png?text=RAG',
    constituencyId: 'KTM-1',
    constituencyName: 'Kathmandu Constituency 1',
    status: 'Nominated' as ElectionCandidateStatus,
    campaignWebsite: 'https://bob-for-ktm1.example.com',
    ballotNumber: '12B'
  },
  // Candidates for Bagmati Provincial Election 2023 (provBag2023) - Assuming p1 won
  {
    id: 'provBag2023-p1-provX',
    electionId: 'provBag2023',
    politicianId: 'p1',
    politicianName: 'Alice Democratia',
    partyId: 'party1',
    partyName: 'Blue Unity Party',
    partySymbolUrl: 'https://placehold.co/50x50.png?text=BUP',
    constituencyId: 'BAG-KTM-PA-1A', // Example provincial constituency
    constituencyName: 'Bagmati KTM Provincial Area 1A',
    votesReceived: 25600,
    votePercentage: 55.2,
    isWinner: true,
    status: 'Elected' as ElectionCandidateStatus,
  },
  {
    id: 'provBag2023-pxx-provX', // Another candidate
    electionId: 'provBag2023',
    politicianId: 'pX1', // Fictional opponent
    politicianName: 'Opponent One',
    partyId: 'party2',
    partyName: 'Red Alliance Group',
    partySymbolUrl: 'https://placehold.co/50x50.png?text=RAG',
    constituencyId: 'BAG-KTM-PA-1A',
    constituencyName: 'Bagmati KTM Provincial Area 1A',
    votesReceived: 18200,
    votePercentage: 39.8,
    isWinner: false,
    status: 'Defeated' as ElectionCandidateStatus,
  },
  // Candidates for Kathmandu Local Election 2022 (localKath2022) - Assuming p3 was a mayoral candidate
   {
    id: 'localKath2022-p3-mayor',
    electionId: 'localKath2022',
    politicianId: 'p3', // Carol Independenta
    politicianName: 'Carol Independenta',
    // partyId: undefined, // Independent
    // partyName: 'Independent',
    constituencyId: 'KMC-Mayor', // Special ID for mayoral race
    constituencyName: 'Kathmandu Mayor',
    votesReceived: 75000,
    isWinner: false, // Example: Came in second
    status: 'Defeated' as ElectionCandidateStatus,
    ballotNumber: 'SymbolX'
  },
  {
    id: 'localKath2022-pWinner-mayor',
    electionId: 'localKath2022',
    politicianId: 'pMayorWinner',
    politicianName: 'Mayor Winner Name',
    partyId: 'party1',
    partyName: 'Blue Unity Party',
    partySymbolUrl: 'https://placehold.co/50x50.png?text=BUP',
    constituencyId: 'KMC-Mayor',
    constituencyName: 'Kathmandu Mayor',
    votesReceived: 95000,
    isWinner: true,
    status: 'Elected' as ElectionCandidateStatus,
  },
];

export function getElectionById(id: string): Election | undefined {
  return mockElections.find(e => e.id === id || e.slug === id);
}

export function getCandidatesByElectionId(electionId: string): ElectionCandidate[] {
  return mockElectionCandidates.filter(c => c.electionId === electionId);
}

