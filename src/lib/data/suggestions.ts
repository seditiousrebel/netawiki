// src/lib/data/suggestions.ts
import type {
  EditSuggestion,
  Politician,
  Party,
  Bill,
  Committee,
  Constituency,
  Election,
  NewsArticleLink, // Representing 'News'
  PromiseItem,     // Representing 'Promise'
  ContactInfo,     // Imported for Politician data structure
  PartyAffiliation, // Imported for Politician data structure
  PoliticalJourneyEvent, // Imported for Politician data structure
  EducationEntry, // Imported for Politician data structure
  AssetDeclaration, // Imported for Politician data structure
  CriminalRecord, // Imported for Politician data structure
  CommitteeMembership, // Imported for Politician data structure
  StatementQuote, // Imported for Politician data structure
  LeadershipMember, // Imported for Party data structure
  BillTimelineEvent, // Imported for Bill data structure
  VoteRecord, // Imported for Bill data structure
} from '@/types/gov';

// Union type for all possible entity data structures in a new entry suggestion
export type AllEntityData =
  | Politician
  | Party
  | Bill
  | Committee
  | Constituency
  | Election
  | NewsArticleLink
  | PromiseItem;

// String literal union for entity types
export type EntityType =
  | 'Politician'
  | 'Party'
  | 'Bill'
  | 'Committee'
  | 'Constituency'
  | 'Election'
  | 'News'
  | 'Promise';

// No longer needed, will be removed by replacing NewEntrySuggestion interface
// interface NewEntrySuggestionData { ... }

export interface NewEntrySuggestion {
  id: string;
  entityType: EntityType; // Constrained to specific entity type names
  data: Partial<AllEntityData>; // Data is a partial of any of the AllEntityData types
  reason: string;
  evidenceUrl: string;
  status: 'PendingNewEntry' | 'ApprovedNewEntry' | 'RejectedNewEntry';
  submittedBy: string;
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export let mockEditSuggestions: EditSuggestion[] = [
  {
    id: 's1',
    contentType: 'politician',
    contentId: 'p1',
    fieldName: 'bio',
    oldValue: 'Alice Democratia is a dedicated public servant...',
    suggestedValue: 'Alice Democratia is a highly experienced public servant with over 15 years in governance...',
    reason: 'Updated bio with more current information about her experience.',
    evidenceUrl: 'https://example.com/news/alice-democratia-experience',
    status: 'Pending',
    submittedBy: 'user456',
    submittedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
  {
    id: 's2',
    contentType: 'party',
    contentId: 'party2',
    fieldName: 'history',
    oldValue: 'Established in 1985, advocating for free markets...',
    suggestedValue: 'Established in 1985, the Red Alliance Group has consistently advocated for robust free markets and individual liberties, adapting its platform over decades.',
    reason: 'More detailed and accurate historical summary.',
    evidenceUrl: 'https://example.com/party/red-alliance/history-update',
    status: 'Approved',
    submittedBy: 'user789',
    submittedAt: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
    reviewedBy: 'admin01',
    reviewedAt: new Date(Date.now() - 86400000).toISOString(),
  },
   {
    id: 's3',
    contentType: 'promise',
    contentId: 'pr3',
    fieldName: 'status',
    oldValue: 'Broken',
    suggestedValue: 'Pending',
    reason: 'This promise was re-evaluated and is now considered pending further review.',
    evidenceUrl: '', // No evidence provided for this one
    status: 'Rejected',
    submittedBy: 'user101',
    submittedAt: new Date(Date.now() - 3 * 86400000).toISOString(), // 3 days ago
    reviewedBy: 'admin02',
    reviewedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

export let mockNewEntrySuggestions: NewEntrySuggestion[] = [
  {
    id: 'new-s1',
    entityType: 'Politician',
    data: {
      // Conforms to Partial<Politician>
      name: 'John Q. Public',
      partyName: "People's Voice Party", // Example: will be part of partyAffiliations or direct partyId
      positions: [{ title: 'Community Organizer', startDate: '2020-01-01' }, { title: 'Activist', startDate: '2018-05-01'}],
      bio: 'John Q. Public has been a vocal advocate for community rights and transparency for over a decade. He believes in grassroots movements to effect change.',
      contactInfo: { email: 'john.public@example.com' },
      photoUrl: 'https://example.com/photos/john_q_public.jpg',
      // Example of other Politician fields (optional due to Partial)
      politicalJourney: [{ date: '2018-01-01', event: 'Started community activism' }],
      gender: 'Male',
    } as Partial<Politician>, // Explicit cast for clarity, though structurally compatible
    reason: 'This individual is a prominent new figure in local politics and should be listed.',
    evidenceUrl: 'https://example.com/news/jqp_profile',
    status: 'PendingNewEntry',
    submittedBy: 'citizenX',
    submittedAt: new Date(Date.now() - 86400000 * 0.5).toISOString(), // 0.5 days ago
  },
  {
    id: 'new-s2',
    entityType: 'Party',
    data: {
      // Conforms to Partial<Party>
      name: 'Future Forward Alliance',
      abbreviation: 'FFA',
      ideology: ['Progressivism', 'Technological Advancement'],
      logoUrl: 'https://example.com/logos/ffa.png',
      electionSymbolUrl: 'https://example.com/symbols/ffa_symbol.png',
    } as Partial<Party>,
    reason: 'Newly formed political party gaining traction.',
    evidenceUrl: 'https://example.com/ffa_announcement',
    status: 'ApprovedNewEntry',
    submittedBy: 'analystY',
    submittedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    reviewedBy: 'admin01',
    reviewedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'new-s3',
    entityType: 'Bill',
    data: {
      // Conforms to Partial<Bill>
      title: 'Data Privacy Act 2024',
      billNumber: 'HR-2024-789',
      summary: 'A bill to enhance personal data protection and provide citizens with more control over their digital information.',
      status: 'Introduced',
      introducedDate: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
      sponsors: [{ id: 'p1', name: 'Alice Democratia', type: 'Primary' }],
      timelineEvents: [
        { date: new Date(Date.now() - 86400000 * 5).toISOString(), event: 'Bill introduced in the House' }
      ],
      billType: 'Government',
    } as Partial<Bill>,
    reason: 'Important new legislation regarding data privacy that needs to be tracked.',
    evidenceUrl: 'https://example.com/bills/hr-2024-789',
    status: 'PendingNewEntry',
    submittedBy: 'legalEagle',
    submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
  },
];

// Functions to simulate updating data (in a real app, these would be API calls)
export const approveEditSuggestion = (id: string, adminId: string) => {
  mockEditSuggestions = mockEditSuggestions.map(s =>
    s.id === id ? { ...s, status: 'Approved', reviewedBy: adminId, reviewedAt: new Date().toISOString() } : s
  );
};

export const rejectEditSuggestion = (id: string, adminId: string) => {
  mockEditSuggestions = mockEditSuggestions.map(s =>
    s.id === id ? { ...s, status: 'Rejected', reviewedBy: adminId, reviewedAt: new Date().toISOString() } : s
  );
};

export const approveNewEntrySuggestion = (id: string, adminId: string) => {
  mockNewEntrySuggestions = mockNewEntrySuggestions.map(s =>
    s.id === id ? { ...s, status: 'ApprovedNewEntry', reviewedBy: adminId, reviewedAt: new Date().toISOString() } : s
  );
};

export const rejectNewEntrySuggestion = (id: string, adminId: string) => {
  mockNewEntrySuggestions = mockNewEntrySuggestions.map(s =>
    s.id === id ? { ...s, status: 'RejectedNewEntry', reviewedBy: adminId, reviewedAt: new Date().toISOString() } : s
  );
};
