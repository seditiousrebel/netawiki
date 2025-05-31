
export type ContactInfo = {
  email?: string;
  phone?: string; // Personal/General Phone
  officePhone?: string; // New
  address?: string; // General/Office Address
  permanentAddress?: string; // New
  temporaryAddress?: string; // New
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

export type PartyAffiliation = {
  partyId: string;
  partyName: string;
  role?: string;
  startDate: string;
  endDate?: string; // Undefined or 'Present' if current
};

export type LeadershipMember = {
  name: string;
  role: string;
};

export type PromiseStatus = 'Pending' | 'In Progress' | 'Fulfilled' | 'Partially Fulfilled' | 'Broken' | 'Stalled' | 'Modified' | 'Cancelled';

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

export type StatementQuote = {
  id: string;
  quoteText: string;
  sourceName: string;
  sourceUrl?: string;
  dateOfStatement: string; // ISO Date string
};

export interface Politician {
  id: string;
  name: string; // English Name
  nepaliName?: string; // New
  aliases?: string[]; // New - e.g., Nicknames
  slug?: string; // New - for URL
  gender?: 'Male' | 'Female' | 'Other' | string; // Allow string for flexibility, but define common options
  dateOfBirth?: string;
  dateOfDeath?: string; // New
  placeOfBirth?: { // New
    district?: string;
    address?: string;
  };
  partyId?: string; // Link to Party (current primary)
  partyName?: string; // Denormalized for quick display (current primary)
  partyAffiliations?: PartyAffiliation[]; // New: For historical party affiliations
  positions: Array<{ title: string; startDate: string; endDate?: string }>;
  contactInfo: ContactInfo;
  photoUrl: string; // URL to image
  politicalJourney: PoliticalJourneyEvent[];
  bio?: string; // Biography/About Me (rich text, suggestible)
  politicalIdeology?: string[]; // New - tags/text
  languagesSpoken?: string[]; // New
  constituency?: string;
  province?: string;
  education?: EducationEntry[];
  assetDeclarations?: AssetDeclaration[];
  criminalRecords?: CriminalRecord[];
  committeeMemberships?: CommitteeMembership[];
  statementsAndQuotes?: StatementQuote[];
  
  isActiveInPolitics?: boolean; // New
  lastActivityDate?: string; // New: ISO date string

  overallRating?: number; // e.g., 1-5 stars (User Rating Average)
  userRatingCount?: number; // New
  voteScore?: number; // e.g., 0-100% (hypothetical or derived)
  promiseFulfillmentRate?: number; // e.g., 0-100%
  popularityScore?: number; // New field for popularity
  
  dataAiHint?: string;
  controversyIds?: string[]; // New: Link to controversies
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
  controversyIds?: string[]; // New: Link to controversies
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
  verificationStatus?: 'Verified' | 'Unverified' | 'Pending'; 
}

export interface EditSuggestion {
  id: string;
  contentType: 'politician' | 'party' | 'promise' | 'bill' | 'controversy';
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

// --- Controversy Related Types ---
export type InvolvedEntityType = 'politician' | 'party' | 'organization';

export interface InvolvedEntity {
  type: InvolvedEntityType;
  id: string; // ID of the politician, party, etc.
  name: string; // Name for display
  role?: string; // Role in the controversy
}

export interface ControversyUpdate {
  date: string; // ISO Date string
  description: string;
  sourceUrl?: string;
}

export interface ControversyEvidenceLink {
  url: string;
  description?: string;
  dateAdded?: string;
}

export interface ControversyOfficialResponse {
  entityName: string; // Name of the entity responding (e.g., Politician's Office, Party Spokesperson)
  responseText: string;
  date: string; // ISO Date string
  sourceUrl?: string;
}

export interface ControversyMediaCoverage {
  url: string;
  title: string;
  sourceName: string; // e.g., "National Times"
  date?: string; // ISO Date string
}

export interface ControversyLegalProceeding {
  caseNumber?: string;
  court?: string;
  status?: string; // e.g., "Ongoing", "Concluded"
  outcome?: string;
  date?: string; // Date of proceeding or update
  summary?: string;
}

export interface Controversy {
  id: string;
  slug?: string;
  title: string;
  description: string; // Can be rich text or markdown
  involvedEntities: InvolvedEntity[];
  dates?: {
    started?: string; // ISO Date string
    ended?: string; // ISO Date string
  };
  period?: string; // General description like "2020-2021" if specific dates are not known
  severityIndicator: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Alleged' | 'Under Investigation' | 'Investigation Concluded' | 'Legal Action Initiated' | 'Proven' | 'Cleared' | 'Dismissed' | 'Ongoing';
  tags?: string[]; // e.g., ["corruption", "ethics-violation", "scandal"]
  updates?: ControversyUpdate[]; // Chronological updates
  evidenceLinks?: ControversyEvidenceLink[];
  officialResponses?: ControversyOfficialResponse[];
  mediaCoverageLinks?: ControversyMediaCoverage[];
  legalProceedings?: ControversyLegalProceeding[];
  summaryOutcome?: string; // Overall summary of the outcome
  dataAiHint?: string; // For main image if any
}
