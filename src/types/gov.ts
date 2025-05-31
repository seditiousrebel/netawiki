export type ContactInfo = {
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  twitter?: string;
  facebook?: string;
  linkedin?: string;
  instagram?: string;
};

export type PoliticalJourneyEvent = {
  date: string; // Consider using Date object if precise date manipulation is needed
  event: string;
  description?: string;
};

export type LeadershipMember = {
  name: string;
  role: string;
};

export type PromiseStatus = 'Pending' | 'In Progress' | 'Fulfilled' | 'Broken';

export type EducationEntry = {
  institution: string;
  degree: string;
  field?: string;
  graduationYear?: string;
};

export type AssetDeclaration = {
  year: number;
  description: string;
  value?: string; // Changed from number to string to allow for ranges or "Undisclosed"
  sourceUrl?: string;
};

export type CriminalRecord = {
  date: string; // Date of record or offense
  caseNumber?: string;
  offense: string;
  court?: string;
  status: 'Alleged' | 'Under Investigation' | 'Charges Filed' | 'Convicted' | 'Acquitted' | 'Dismissed' | 'Appealed';
  summary?: string;
  sourceUrl?: string;
};

export type CommitteeMembership = {
  committeeName: string;
  role?: string; // e.g., Chair, Member
  startDate?: string;
  endDate?: string; // 'Present' if ongoing
};

export interface Politician {
  id: string;
  name: string;
  partyId?: string; // Link to Party
  partyName?: string; // Denormalized for quick display
  positions: Array<{ title: string; startDate: string; endDate?: string }>;
  contactInfo: ContactInfo;
  photoUrl: string; // URL to image
  politicalJourney: PoliticalJourneyEvent[];
  bio?: string;
  district?: string; // e.g., "California's 12th congressional district"
  dateOfBirth?: string;
  gender?: string;
  education?: EducationEntry[];
  assetDeclarations?: AssetDeclaration[];
  criminalRecords?: CriminalRecord[];
  committeeMemberships?: CommitteeMembership[];
  overallRating?: number; // e.g., 1-5 stars
  voteScore?: number; // e.g., 0-100%
  dataAiHint?: string;
}

export interface Party {
  id: string;
  name: string;
  leadership: LeadershipMember[];
  contactInfo: ContactInfo;
  logoUrl: string; // URL to image
  history: string; // Could be markdown or a structured object
  electionSymbolUrl: string; // URL to image
  ideology?: string[];
  foundedDate?: string;
  dataAiHint?: string;
}

export interface PromiseItem {
  id: string;
  politicianId: string; // Link to Politician
  title: string;
  description: string;
  dueDate?: string;
  status: PromiseStatus;
  evidenceLinks: Array<{ url: string; description?: string }>;
  category?: string; // e.g., "Economy", "Healthcare"
  datePromised?: string;
  dateCompleted?: string;
}

export type VoteOption = 'Yea' | 'Nay' | 'Abstain' | 'Not Voting';

export type VoteRecord = {
  politicianId: string;
  politicianName: string; // Denormalized
  vote: VoteOption;
};

export type Amendment = {
  date: string;
  description: string;
  status?: 'Proposed' | 'Adopted' | 'Rejected';
};

export interface Bill {
  id:string;
  title: string;
  billNumber: string; // e.g., "H.R. 1234"
  summary: string;
  sponsors: Array<{ id: string; name: string; type: 'Primary' | 'Co-Sponsor' }>; // Politician IDs/Names
  votingResults?: {
    house?: { date: string; records: VoteRecord[]; passed: boolean };
    senate?: { date: string; records: VoteRecord[]; passed: boolean };
  };
  amendmentHistory: Amendment[];
  status: 'Introduced' | 'In Committee' | 'Passed House' | 'Passed Senate' | 'To President' | 'Became Law' | 'Failed';
  introducedDate: string;
  lastActionDate?: string;
  lastActionDescription?: string;
  fullTextUrl?: string;
  committees?: string[]; // e.g., "House Committee on Ways and Means"
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  followedPoliticians: string[]; // Politician IDs
  followedParties: string[]; // Party IDs
  newsFeedPreferences?: Record<string, any>; // Flexible preferences
}

export interface EditSuggestion {
  id: string;
  contentType: 'politician' | 'party' | 'promise' | 'bill';
  contentId: string; // ID of the item being edited
  fieldName: string; // e.g., 'bio', 'promise.description'
  oldValue: any;
  suggestedValue: any;
  reason?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedBy: string; // User ID
  submittedAt: string; // ISO Date string
  reviewedBy?: string; // Admin User ID
  reviewedAt?: string; // ISO Date string
}
