
import type { Controversy, InvolvedEntity, ControversyUpdate, ControversyEvidenceLink, ControversyOfficialResponse, ControversyMediaCoverage, ControversyLegalProceeding } from '@/types/gov';

const mockControversiesData: Controversy[] = [
  {
    id: 'c1',
    slug: 'project-nova-funding-scandal',
    title: 'Project Nova Funding Scandal',
    description: 'Allegations surrounding the misappropriation of funds allocated for "Project Nova", a major infrastructure initiative. Several high-profile figures are implicated in what could be a multi-million dollar embezzlement scheme. Initial reports suggest irregularities in procurement processes and inflated invoices.',
    involvedEntities: [
      { type: 'politician', id: 'p1', name: 'Alice Democratia', role: 'Overseeing Committee Chair (alleged dereliction of duty)' },
      { type: 'organization', id: 'org1', name: 'Nova Corp Inc.', role: 'Primary Contractor (under investigation for fraud)' },
      { type: 'party', id: 'party1', name: 'Blue Unity Party', role: 'Party in Power during project approval (facing questions on oversight)'}
    ],
    dates: { started: '2023-05-10' },
    period: 'Mid-2023 to Present',
    severityIndicator: 'High',
    status: 'Under Investigation',
    tags: ['corruption', 'public-funds', 'infrastructure-project', 'procurement-fraud', 'governance'],
    updates: [
      { date: '2023-05-10', description: 'Whistleblower report filed with the National Integrity Commission regarding irregularities in Project Nova contracts and payments.' },
      { date: '2023-06-15', description: 'Investigative journalism piece published by "The Daily Chronicle" detailing potential conflicts of interest, shell companies, and unexplained wealth of individuals connected to Nova Corp.', sourceUrl: 'https://example.com/daily-chronicle-nova-expose' },
      { date: '2023-07-01', description: 'Official investigation launched by the National Accountability Bureau (NAB) based on preliminary findings.' },
      { date: '2023-09-20', description: 'NAB raids offices of Nova Corp Inc. and seizes financial records.', sourceUrl: 'https://example.com/news/nab-raids-nova-corp' },
      { date: '2024-01-15', description: 'Parliamentary hearing scheduled to question involved parties, including Alice Democratia.'}
    ],
    evidenceLinks: [
      { url: 'https://example.com/whistleblower-report-summary', description: 'Summary of Whistleblower Report (Public Version)', dateAdded: '2023-05-12', type: 'document' },
      { url: 'https://example.com/leaked-invoices-nova', description: 'Allegedly Leaked Inflated Invoices (Unverified)', dateAdded: '2023-06-20', type: 'document' },
    ],
    officialResponses: [
        { entityName: "Alice Democratia's Office", responseText: "Senator Democratia is fully cooperating with the investigation and is confident that she will be cleared of any wrongdoing. She has always upheld the highest standards of integrity.", date: '2023-07-05', sourceUrl: 'https://example.com/alice-response-nova'},
        { entityName: "Nova Corp Inc. Legal Team", responseText: "Nova Corp denies all allegations of fraud and is committed to transparency. We are working with authorities to resolve this matter.", date: '2023-07-03'}
    ],
    mediaCoverageLinks: [
      { url: 'https://example.com/news1-nova', title: 'Nova Project Under Scrutiny: Millions Missing?', sourceName: 'National News Network', date: '2023-06-16' },
      { url: 'https://example.com/editorial-nova-scandal', title: 'Editorial: The Nova Scandal Demands Accountability', sourceName: 'The Independent Voice', date: '2023-07-10' },
    ],
    legalProceedings: [
        { court: 'National Accountability Court', caseNumber: 'NAB-REF-005-2023', status: 'Preliminary Hearings', date: '2024-02-01', summary: 'Initial hearings to determine admissibility of evidence and frame charges.'}
    ],
    dataAiHint: 'financial documents investigation',
    revisionHistory: [
      {
        id: 'rev-controversy-c1-001',
        date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
        author: 'SystemUpdate',
        event: 'Controversy Status Change',
        details: 'Status changed from "Alleged" to "Under Investigation" based on NAB official announcement.',
      },
      {
        id: 'rev-controversy-c1-002',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        author: 'EditorJane',
        event: 'New Evidence Link Added',
        details: 'Added link to leaked financial audit summary.',
        suggestionId: 'sugg_cont_c1_evidence_new'
      }
    ]
  },
  {
    id: 'c2',
    slug: 'election-campaign-speech-incident-northwood',
    title: 'Election Campaign Speech Incident (Northwood Rally)',
    description: 'Controversial statements made by Bob Republicanus during a campaign rally in Northwood on February 20, 2024, led to public outcry and calls for an apology. The remarks were perceived by many as divisive and insensitive.',
    involvedEntities: [
      { type: 'politician', id: 'p2', name: 'Bob Republicanus', role: 'Speaker (candidate)' },
      { type: 'party', id: 'party2', name: 'Red Alliance Group', role: 'Associated Political Party' }
    ],
    dates: { started: '2024-02-20', ended: '2024-03-05' }, // Assuming end date is when apology/party statement was made
    period: 'Late February 2024',
    severityIndicator: 'Medium',
    status: 'Investigation Concluded', // Assuming party/internal investigation, or public sentiment settled
    summaryOutcome: "Bob Republicanus issued a public apology via social media and a press statement, clarifying his remarks and expressing regret for any offense caused. The Red Alliance Group conducted an internal review and issued a statement emphasizing its commitment to inclusive rhetoric. No formal legal action was pursued.",
    tags: ['election-ethics', 'public-statement', 'campaign-conduct', 'divisive-rhetoric'],
    updates: [
      { date: '2024-02-20', description: 'Bob Republicanus delivers controversial speech at Northwood campaign rally.' },
      { date: '2024-02-21', description: 'Video clips of the speech go viral on social media, sparking public backlash and condemnation from civil society groups.' },
      { date: '2024-02-22', description: 'Major news outlets pick up the story, featuring critical analysis and public reactions.' },
      { date: '2024-02-25', description: 'Red Alliance Group issues a statement acknowledging the incident, stating the remarks do not reflect party values and promising an internal review.' },
      { date: '2024-03-01', description: 'Bob Republicanus issues a formal apology via Twitter and a press release.', sourceUrl: 'https://twitter.com/BobRepub/status/example-apology' },
      { date: '2024-03-05', description: 'Red Alliance Group announces completion of internal review, reiterates commitment to respectful campaigning.'}
    ],
    evidenceLinks: [
      { url: 'https://example.com/rally-speech-transcript', description: 'Partial Transcript of Rally Speech', dateAdded: '2024-02-21', type: 'document' },
      { url: 'https://example.com/civil-society-condemnation.pdf', description: 'Joint Statement from Civil Society Organizations', dateAdded: '2024-02-23', type: 'official_report' }
    ],
    officialResponses: [
      { entityName: 'Bob Republicanus', responseText: 'I sincerely apologize for my remarks made at the Northwood rally. It was never my intention to cause offense, and I understand how my words could have been misinterpreted. I am committed to fostering unity.', date: '2024-03-01', sourceUrl: 'https://twitter.com/BobRepub/status/example-apology'},
      { entityName: 'Red Alliance Group Spokesperson', responseText: 'The party does not condone divisive rhetoric. We have reviewed the incident and spoken with Mr. Republicanus. We are committed to ensuring our campaign communications are respectful and inclusive.', date: '2024-02-25'}
    ],
    mediaCoverageLinks: [
      { url: 'https://example.com/news-bob-speech', title: 'Republicanus Speech Sparks Outrage and Demands for Apology', sourceName: 'Independent Herald', date: '2024-02-21' },
      { url: 'https://example.com/analysis-northwood-gaffe', title: 'Analysis: The Political Fallout of the Northwood Gaffe', sourceName: 'Political Spectrum Today', date: '2024-02-28' },
    ],
    dataAiHint: 'political rally crowd',
  },
  {
    id: 'c3',
    slug: 'environmental-policy-dispute-industrial-zones',
    title: 'Environmental Policy Dispute (Industrial Zones)',
    description: 'A significant dispute arose over a new environmental policy, "Green Zones Initiative," which proposed stricter emission standards and land-use regulations for industrial zones. The policy, championed by Alice Democratia, faced strong opposition from industry groups.',
    involvedEntities: [
      { type: 'politician', id: 'p1', name: 'Alice Democratia', role: 'Policy Proponent (as Senator)' },
      { type: 'organization', id: 'org2', name: 'National Industrial Alliance', role: 'Primary Opponent (Lobby Group)' },
      { type: 'party', id: 'party1', name: 'Blue Unity Party', role: 'Supporting Party'},
      { type: 'party', id: 'party2', name: 'Red Alliance Group', role: 'Opposing Party (raised concerns about economic impact)'}
    ],
    dates: { started: '2022-01-15' },
    period: 'Early 2022 - Ongoing',
    severityIndicator: 'Medium',
    status: 'Ongoing',
    tags: ['environment', 'policy-dispute', 'industry-regulations', 'lobbying', 'economic-impact'],
    updates: [
      { date: '2022-01-15', description: 'Draft "Green Zones Initiative" policy announced by Senator Alice Democratia\'s office.' },
      { date: '2022-02-01', description: 'National Industrial Alliance voices strong opposition, citing potential job losses and economic slowdown. Launches "Save Our Jobs" campaign.', sourceUrl: 'https://example.com/nia-opposition-statement'},
      { date: '2022-03-10', description: 'Public consultation period begins for the draft policy.' },
      { date: '2022-05-20', description: 'Heated debate in parliamentary committee discussing the policy. Red Alliance Group members raise concerns.'},
      { date: '2022-07-01', description: 'Policy referred back for revisions after significant feedback from stakeholders.'}
    ],
    evidenceLinks: [
        { url: 'https://example.com/green-zones-draft-policy.pdf', description: 'Draft Text of Green Zones Initiative', type: 'document', dateAdded: '2022-01-16'},
        { url: 'https://example.com/nia-economic-impact-report.pdf', description: 'NIA Report on Potential Economic Impact', type: 'official_report', dateAdded: '2022-02-10'}
    ],
    officialResponses: [
        { entityName: "Senator Alice Democratia", responseText: "The Green Zones Initiative is crucial for our long-term environmental health and sustainable development. We are committed to working with all stakeholders to address concerns and refine the policy.", date: '2022-02-05'},
        { entityName: "National Industrial Alliance", responseText: "While we support environmental protection, this policy in its current form is unworkable and will harm our economy. We urge a more balanced approach.", date: '2022-02-02'}
    ],
    mediaCoverageLinks: [
        {url: 'https://example.com/news/green-zones-battle', title: 'Battle Lines Drawn Over New Green Zones Policy', sourceName: 'Policy Watch', date: '2022-02-08'}
    ],
    dataAiHint: 'factory smokestack protest',
  }
];

export const mockControversies = mockControversiesData;

export function getControversyById(id: string): Controversy | undefined {
  return mockControversies.find(c => c.id === id || c.slug === id);
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

    