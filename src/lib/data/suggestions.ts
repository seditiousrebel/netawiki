// src/lib/data/suggestions.ts
import type { EditSuggestion } from '@/types/gov';

// --- New Entry Suggestion Types and Data --- (assuming these types are defined elsewhere or inline if not too complex)
interface NewEntrySuggestionData {
  name: string;
  partyName?: string;
  positions?: string;
  bio?: string;
  contactInfo?: { email?: string };
  photoUrl?: string;
}

export interface NewEntrySuggestion {
  id: string;
  entityType: string;
  data: NewEntrySuggestionData;
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
      name: 'John Q. Public',
      partyName: 'People\'s Voice Party',
      positions: 'Community Organizer, Activist',
      bio: 'John Q. Public has been a vocal advocate for community rights and transparency for over a decade. He believes in grassroots movements to effect change.',
      contactInfo: { email: 'john.public@example.com' },
      photoUrl: 'https://example.com/photos/john_q_public.jpg',
    },
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
      name: 'Future Forward Alliance',
    },
    reason: 'Newly formed political party gaining traction.',
    evidenceUrl: 'https://example.com/ffa_announcement',
    status: 'ApprovedNewEntry',
    submittedBy: 'analystY',
    submittedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    reviewedBy: 'admin01',
    reviewedAt: new Date(Date.now() - 86400000).toISOString(),
  }
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
