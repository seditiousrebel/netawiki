
import type { Controversy, InvolvedEntity } from '@/types/gov';

const mockControversiesData: Controversy[] = [
  {
    id: 'c1',
    slug: 'project-nova-funding-scandal',
    title: 'Project Nova Funding Scandal',
    description: 'Allegations surrounding the misappropriation of funds allocated for "Project Nova", a major infrastructure initiative. Several high-profile figures are implicated.',
    involvedEntities: [
      { type: 'politician', id: 'p1', name: 'Alice Democratia', role: 'Overseeing Committee Chair (alleged involvement)' },
      { type: 'organization', id: 'org1', name: 'Nova Corp Inc.', role: 'Primary Contractor' }
    ],
    dates: { started: '2023-05-10' },
    period: 'Mid-2023 to Present',
    severityIndicator: 'High',
    status: 'Under Investigation',
    tags: ['corruption', 'public funds', 'infrastructure'],
    updates: [
      { date: '2023-05-10', description: 'Whistleblower report filed regarding irregularities in Project Nova contracts.' },
      { date: '2023-06-15', description: 'Investigative journalism piece published by "The Daily Chronicle" detailing potential conflicts of interest.', sourceUrl: 'https://example.com/daily-chronicle-nova' },
      { date: '2023-07-01', description: 'Official investigation launched by the National Accountability Bureau.' },
    ],
    evidenceLinks: [
      { url: 'https://example.com/whistleblower-report-summary', description: 'Summary of Whistleblower Report', dateAdded: '2023-05-12' },
    ],
    mediaCoverageLinks: [
      { url: 'https://example.com/news1-nova', title: 'Nova Project Under Scrutiny', sourceName: 'National News Network', date: '2023-06-16' },
    ],
    dataAiHint: 'financial documents investigation',
  },
  {
    id: 'c2',
    slug: 'election-campaign-speech-incident',
    title: 'Election Campaign Speech Incident',
    description: 'Controversial statements made by Bob Republicanus during a campaign rally in Northwood led to public outcry and calls for an apology.',
    involvedEntities: [
      { type: 'politician', id: 'p2', name: 'Bob Republicanus', role: 'Speaker' },
      { type: 'party', id: 'party2', name: 'Red Alliance Group', role: 'Associated Party' }
    ],
    dates: { started: '2024-02-20', ended: '2024-03-05' },
    severityIndicator: 'Medium',
    status: 'Investigation Concluded', // Assuming party/internal investigation
    summaryOutcome: "Bob Republicanus issued a public apology and clarified his remarks. The party conducted an internal review and issued a statement.",
    tags: ['hate-speech', 'election-ethics', 'public-statement'],
    updates: [
      { date: '2024-02-20', description: 'Bob Republicanus delivers controversial speech at Northwood rally.' },
      { date: '2024-02-22', description: 'Public backlash and media coverage intensifies.' },
      { date: '2024-02-25', description: 'Red Alliance Group issues a statement acknowledging the incident and promising a review.' },
      { date: '2024-03-01', description: 'Bob Republicanus issues a formal apology via social media.', sourceUrl: 'https://twitter.com/BobRepub/status/example' },
    ],
    officialResponses: [
      { entityName: 'Bob Republicanus', responseText: 'I sincerely apologize for my remarks...', date: '2024-03-01', sourceUrl: 'https://twitter.com/BobRepub/status/example'},
      { entityName: 'Red Alliance Group Spokesperson', responseText: 'The party does not condone divisive rhetoric...', date: '2024-02-25'}
    ],
    mediaCoverageLinks: [
      { url: 'https://example.com/news-bob-speech', title: 'Republicanus Speech Sparks Outrage', sourceName: 'Independent Herald', date: '2024-02-21' },
    ],
    dataAiHint: 'political rally crowd',
  },
  {
    id: 'c3',
    slug: 'another-controversy',
    title: 'Environmental Policy Dispute',
    description: 'A significant dispute arose over a new environmental policy affecting industrial zones.',
    involvedEntities: [
      { type: 'politician', id: 'p1', name: 'Alice Democratia', role: 'Policy Proponent' },
      { type: 'organization', id: 'org2', name: 'Industrial Alliance Group', role: 'Policy Opponent' },
    ],
    dates: { started: '2022-01-15' },
    severityIndicator: 'Medium',
    status: 'Ongoing',
    tags: ['environment', 'policy', 'industry'],
    updates: [
      { date: '2022-01-15', description: 'New environmental regulations announced.' },
      { date: '2022-02-01', description: 'Industrial Alliance Group voices strong opposition.' },
    ],
    dataAiHint: 'factory smokestack protest',
  }
];

export const mockControversies = mockControversiesData;

export function getControversyById(id: string): Controversy | undefined {
  return mockControversies.find(c => c.id === id);
}

export function getControversiesByPoliticianId(politicianId: string): Controversy[] {
  return mockControversies.filter(controversy =>
    controversy.involvedEntities.some(entity => entity.type === 'politician' && entity.id === politicianId)
  );
}

export function getControversiesByPartyId(partyId: string): Controversy[] {
  return mockControversies.filter(controversy =>
    controversy.involvedEntities.some(entity => entity.type === 'party' && entity.id === partyId)
  );
}
