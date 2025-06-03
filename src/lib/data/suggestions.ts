// src/lib/data/suggestions.ts
import type {
  EditSuggestion, // Added import for EditSuggestion
  PendingEdit,
  EntityRevision,
  Politician,
  Party,
  // Bill,
  // Committee,
  // Constituency,
  // Election,
  // NewsArticleLink,
  // PromiseItem,
  ContactInfo,
  PartyAffiliation,
  PoliticalJourneyEvent,
  EducationEntry,
  // AssetDeclaration,
  // CriminalRecord,
  // CommitteeMembership,
  // StatementQuote,
  // LeadershipMember,
} from '@/types/gov';
import { mockPoliticians, mockParties, mockBills } from '../mock-data'; // Added mockBills

// String literal union for entity types that PendingEdit might refer to.
// This can be expanded as more entity types support pending edits.
export type HandledEntityType =
  | 'Politician'
  | 'Party'
  | 'Bill'
  | 'Committee'
  | 'Constituency'
  | 'Election'
  | 'News'
  | 'Promise'; // This type can be used for PendingEdit.entityType if strict typing is desired later.

/*
// Old EditSuggestion and NewEntrySuggestion types are removed or commented out.
// EditSuggestion is imported from @/types/gov but its usage here (mockEditSuggestions) is removed.
// NewEntrySuggestion was defined locally.

export interface NewEntrySuggestion {
  id: string;
  entityType: EntityType;
  data: Partial<AllEntityData>;
  reason: string;
  evidenceUrl: string;
  status: 'PendingNewEntry' | 'ApprovedNewEntry' | 'RejectedNewEntry';
  submittedBy: string;
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export let mockEditSuggestions: EditSuggestion[] = [ ... ]; // Removed
export let mockNewEntrySuggestions: NewEntrySuggestion[] = [ ... ]; // Removed
*/


// Mock data for Edit Suggestions
export let mockEditSuggestions: EditSuggestion[] = [
  {
    id: 'es-p1-bio',
    contentType: 'politician',
    contentId: 'p1', // Alice Democratia
    fieldName: 'bio',
    oldValue: mockPoliticians.find(p => p.id === 'p1')?.bio,
    suggestedValue: 'Alice Democratia is a dedicated public servant with over a decade of experience in governance, championing transparency, citizen engagement, and has recently launched a new initiative for digital literacy.',
    reason: 'Updated bio to include new digital literacy initiative.',
    evidenceUrl: 'https://example.com/news/alice-digital-literacy',
    status: 'Approved',
    submittedBy: 'user123', // User making the suggestion
    submittedAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    reviewedBy: 'admin001',
    reviewedAt: new Date(Date.now() - 86400000 * 4).toISOString(), // 4 days ago
    adminFeedback: 'Great addition. Verified with the press release.',
  },
  {
    id: 'es-p2-contact',
    contentType: 'politician',
    contentId: 'p2', // Bob Republicanus
    fieldName: 'contactInfo.phone',
    oldValue: mockPoliticians.find(p => p.id === 'p2')?.contactInfo.phone,
    suggestedValue: '555-0205',
    reason: 'Bob changed his primary contact number.',
    evidenceUrl: 'https://example.com/bob-republicanus-website-update',
    status: 'Pending',
    submittedBy: 'user-staffer-br-001',
    submittedAt: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
    adminFeedback: '', // No feedback yet
  },
  {
    id: 'es-b1-summary',
    contentType: 'bill',
    contentId: 'b1', // Clean Energy Act 2024
    fieldName: 'summary',
    oldValue: mockBills.find(b => b.id === 'b1')?.summary,
    suggestedValue: 'A comprehensive bill aimed at promoting renewable energy sources, setting new targets for carbon emission reduction, and providing incentives for green technology adoption. This version clarifies the scope for solar panel subsidies.',
    reason: 'Added clarification on solar panel subsidies based on recent amendment discussion.',
    status: 'Rejected',
    submittedBy: 'user123',
    submittedAt: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
    reviewedBy: 'admin002',
    reviewedAt: new Date(Date.now() - 86400000 * 8).toISOString(), // 8 days ago
    adminFeedback: 'The amendment regarding solar panel subsidies was not approved in the committee. Sticking to the original summary.',
  },
];

export let mockPendingEdits: PendingEdit[] = [
  {
    id: 'pe-new-p1', // This was already here, ensuring fields are aligned
    entityType: 'Politician',
    // entityId is undefined for new entities
    proposedData: {
      id: 'p-new-jqp', // New entities need an ID in their proposedData for simulation
      name: 'John Q. Public',
      nepaliName: 'जोन क्यू पब्लिक',
      partyAffiliations: [{ partyId: 'new-party-1', partyName: 'Peoples Voice', role: 'Founder', startDate: '2024-01-01' }],
      positions: [{ title: 'Community Organizer', startDate: '2023-01-01' }],
      contactInfo: { email: 'john.public@example.com', website: 'https://jqpublic.example.org' } as ContactInfo,
      photoUrl: 'https://placehold.co/300x300.png?text=JQP',
      politicalJourney: [{ date: '2023-01-01', event: 'Founded Peoples Voice movement' }] as PoliticalJourneyEvent[],
      bio: 'John Q. Public is a new voice advocating for community rights and transparency.',
      politicalIdeology: ['Grassroots Activism', 'Community Empowerment'],
      languagesSpoken: ['English'],
      constituencyId: 'const-local-anytown-central',
      province: 'Capital Province',
      dateOfBirth: '1985-07-22',
      gender: 'Male',
      education: [{ institution: 'Community College', degree: 'Associate Degree', field: 'Social Work' }] as EducationEntry[],
      isActiveInPolitics: true,
      revisionHistory: [], // Initialize revision history
    } as Politician, // Type assertion
    reasonForChange: 'New prominent local political figure with significant community backing.',
    evidenceUrl: 'https://example.com/news/jqp-emerges',
    submittedByUserId: 'user123', // Changed to user123
    submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    status: 'PENDING',
    adminFeedback: 'Under review. Please provide additional sources for claimed support levels.', // Added feedback
  },
  {
    id: 'pe-edit-p1',
    entityType: 'Politician',
    entityId: 'p1', // Editing Alice Democratia
    proposedData: {
      // Start with a copy of Alice's data and modify it
      // In a real app, this would be a more sophisticated merge or specific field updates
      // For mock, we create a new object representing the *complete* proposed state
      ...mockPoliticians.find(p => p.id === 'p1'), // Get current Alice's data
      bio: 'Alice Democratia is a highly experienced public servant with over 15 years in governance, known for her dedication to transparency, citizen engagement, and pioneering environmental policies.',
      contactInfo: { // Example of updating a nested object
        ...(mockPoliticians.find(p => p.id === 'p1')?.contactInfo || {}),
        phone: '555-1234', // New phone number
        website: 'https://alice.democratia.gov', // New website
      },
      // Ensure all required fields of Politician are present if ...spread doesn't guarantee it or if it's partial
      // For this mock, we assume the spread of a full Politician object is sufficient
    } as Politician,
    reasonForChange: 'Updated biography with recent achievements and new contact information. Also corrected spelling of an award.',
    evidenceUrl: 'https://example.com/news/alice-democratia-achievements-2024',
    submittedByUserId: 'user-campaign-manager-002', // Not user123
    submittedAt: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
    status: 'APPROVED', // Changed status for variety
    approvedByUserId: 'admin001',
    reviewedAt: new Date(Date.now() - 86400000 * 0.5).toISOString(), // 12 hours ago
    adminFeedback: 'Excellent update. All changes verified and approved.',
  },
  {
    id: 'pe-new-party1',
    entityType: 'Party',
    proposedData: {
      id: 'party-new-progressive-union', // New entities need an ID
      name: 'Progressive Union',
      abbreviation: 'PU',
      ideology: ['Social Democracy', 'Environmentalism'],
      logoUrl: 'https://placehold.co/200x100.png?text=PU+Logo',
      electionSymbolUrl: 'https://placehold.co/100x100.png?text=Tree',
      partyColorHex: '#34A853',
      history: 'Founded in 2024 to bring together progressive voices.',
      contactInfo: { website: 'https://progressiveunion.example.org' },
      leadership: [{name: 'Jane Doe', role: 'Interim Leader'}],
      revisionHistory: [], // Initialize revision history
    } as Party,
    reasonForChange: 'Newly formed political party with growing support. Their manifesto is now available.',
    evidenceUrl: 'https://example.com/news/progressive-union-launch',
    submittedByUserId: 'user123', // Changed to user123
    submittedAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    status: 'DENIED', // Changed status for variety
    deniedByUserId: 'admin002',
    reviewedAt: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
    adminFeedback: 'Party registration still pending with the election commission. Cannot add at this time.',
  },
];

export const approvePendingEdit = (id: string, adminId: string, adminFeedback?: string): boolean => {
  const pendingEditIndex = mockPendingEdits.findIndex(pe => pe.id === id);
  if (pendingEditIndex === -1) {
    console.error(`PendingEdit with ID ${id} not found.`);
    return false;
  }

  const pendingEdit = mockPendingEdits[pendingEditIndex];

  // Update PendingEdit status
  mockPendingEdits[pendingEditIndex] = {
    ...pendingEdit,
    status: 'APPROVED',
    approvedByUserId: adminId,
    reviewedAt: new Date().toISOString(),
    adminFeedback: adminFeedback || pendingEdit.adminFeedback, // Preserve existing feedback if new one isn't provided
  };

  let targetEntity: Politician | Party | undefined; // Add other entity types as needed

  // Simulate Main Entity Update
  if (pendingEdit.entityId) { // It's an EDIT to an existing entity
    if (pendingEdit.entityType === 'Politician') {
      const politicianIndex = mockPoliticians.findIndex(p => p.id === pendingEdit.entityId);
      if (politicianIndex !== -1) {
        mockPoliticians[politicianIndex] = pendingEdit.proposedData as Politician;
        targetEntity = mockPoliticians[politicianIndex];
      } else {
        console.error(`Politician with ID ${pendingEdit.entityId} not found in mockPoliticians.`);
        // Revert PendingEdit status if entity not found? Or handle as error.
        return false;
      }
    } else if (pendingEdit.entityType === 'Party') {
      const partyIndex = mockParties.findIndex(p => p.id === pendingEdit.entityId);
      if (partyIndex !== -1) {
        mockParties[partyIndex] = pendingEdit.proposedData as Party;
        targetEntity = mockParties[partyIndex];
      } else {
        console.error(`Party with ID ${pendingEdit.entityId} not found in mockParties.`);
        return false;
      }
    }
    // Add else if blocks for other entity types (Bill, Committee, etc.)
  } else { // It's a NEW entity creation
    if (!pendingEdit.proposedData.id) {
        console.error('New entity proposedData is missing an ID.');
        return false; // ID is crucial for linking and future edits
    }
    if (pendingEdit.entityType === 'Politician') {
      mockPoliticians.push(pendingEdit.proposedData as Politician);
      targetEntity = pendingEdit.proposedData as Politician;
    } else if (pendingEdit.entityType === 'Party') {
      mockParties.push(pendingEdit.proposedData as Party);
      targetEntity = pendingEdit.proposedData as Party;
    }
    // Add else if blocks for other entity types
  }

  // Simulate EntityRevision Creation if targetEntity was found/created
  if (targetEntity) {
    const newRevision: EntityRevision = {
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      date: new Date().toISOString(),
      author: pendingEdit.submittedByUserId, // Could also be adminId if admin made direct edit
      event: pendingEdit.entityId ? 'Entity Updated' : 'Entity Created',
      details: adminFeedback || `Approved suggestion ${pendingEdit.id}`,
      suggestionId: pendingEdit.id,
      entitySnapshot: JSON.parse(JSON.stringify(pendingEdit.proposedData)), // Deep clone
    };

    if (!targetEntity.revisionHistory) {
      targetEntity.revisionHistory = [];
    }
    targetEntity.revisionHistory.push(newRevision);
    console.log(`Revision history updated for entity ${targetEntity.id}`);
  } else {
    console.warn(`Target entity not processed for pending edit ${id}, revision history not updated.`);
    // This case should ideally be prevented by earlier checks (e.g., entity not found during edit)
  }
  
  console.log(`PendingEdit ${id} approved by ${adminId}.`);
  return true;
};

export const rejectPendingEdit = (id: string, adminId: string, adminFeedback?: string): boolean => {
  const pendingEditIndex = mockPendingEdits.findIndex(pe => pe.id === id);
  if (pendingEditIndex === -1) {
    console.error(`PendingEdit with ID ${id} not found.`);
    return false;
  }

  mockPendingEdits[pendingEditIndex] = {
    ...mockPendingEdits[pendingEditIndex],
    status: 'DENIED',
    deniedByUserId: adminId,
    reviewedAt: new Date().toISOString(),
    adminFeedback: adminFeedback || mockPendingEdits[pendingEditIndex].adminFeedback,
  };
  
  console.log(`PendingEdit ${id} rejected by ${adminId}.`);
  return true;
};

/*
// Old action functions are removed or commented out
export const approveEditSuggestion = (id: string, adminId: string) => { ... };
export const rejectEditSuggestion = (id: string, adminId: string) => { ... };
export const approveNewEntrySuggestion = (id: string, adminId: string) => { ... };
export const rejectNewEntrySuggestion = (id: string, adminId: string) => { ... };
*/
