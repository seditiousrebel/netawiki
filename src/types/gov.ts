
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
  politicianId?: string; // Optional link to Politician profile
};

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
  tags?: string[];
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

export type PartyWing = {
  name: string;
  keyLeaders?: Array<{name: string, politicianId?: string}>;
  description?: string;
};

export type LeadershipEvent = {
  role: string;
  name: string;
  politicianId?: string;
  startDate: string; // ISO Date
  endDate?: string; // ISO Date or 'Present'
};

export interface PartyAlliance {
  name: string; // e.g., "Progressive Front", "United Democratic Alliance"
  partnerPartyIds: string[]; // IDs of other parties in the alliance
  partnerPartyNames?: string[]; // Denormalized for display convenience
  startDate: string; // ISO Date
  endDate?: string; // ISO Date or 'Ongoing'
  purpose?: string;
  status?: 'Active' | 'Dissolved' | 'Inactive';
}

export type PartySplitMergerEvent = {
  date: string; // ISO Date
  type: 'Split' | 'Merger' | 'Formation' | 'Dissolution' | 'Reformation';
  description: string; // e.g., "Merged with XYZ Party to form ABC United" or "Split from QRS Party"
  involvedParties?: Array<{ id?: string; name: string; role: 'MergedInto' | 'SplitFrom' | 'EmergedAs' | 'PartnerInMerger' | 'DissolvedInto' | 'ReformedFrom' }>;
};

export type PartyStance = {
  issueId: string; // Could be a bill ID, or a general issue ID/slug
  issueTitle: string; // e.g., "Clean Energy Act 2024" or "Healthcare Reform Policy"
  stance: 'Supports' | 'Opposes' | 'Neutral' | 'Under Review' | string; // Allow custom string for nuance
  statement?: string; // Brief official statement or reasoning
  statementUrl?: string; // Link to official statement
  dateOfStance?: string; // ISO Date
  isBill?: boolean; // Helper to know if issueId refers to a Bill
};

export type FundingSource = {
  year: string;
  sourceName: string;
  amount?: string; // e.g., "$10,000", "Major Contributor", "Up to $50,000"
  type: 'Donation' | 'Grant' | 'Membership Fees' | 'Corporate Contribution' | 'Other';
  description?: string;
  sourceUrl?: string; // Link to disclosure document or source report
};

export type IntraPartyElection = {
  date: string; // ISO Date string
  electionTitle: string; // e.g., "Party Chairperson Election", "Central Committee Elections"
  description?: string;
  resultsSummary?: string; // e.g., "John Doe elected Chairperson with 60% of votes."
  documentUrl?: string; // Link to official results or announcement
};

export type HistoricalManifesto = {
  year: string;
  url: string;
  description?: string;
};

export type ElectionPerformanceRecord = {
  electionYear: string;
  electionType: 'General' | 'Local' | 'Provincial' | 'National Assembly' | 'Other';
  seatsContested?: number;
  seatsWon: number;
  votePercentage?: number;
  notes?: string; // e.g., "Formed coalition government", "Significant gains in X region"
};

export type NewsArticleLink = {
  id: string;
  title: string;
  url: string;
  sourceName: string;
  publicationDate: string; // ISO Date string
  summary?: string;
  taggedPartyIds?: string[];
  taggedPoliticianIds?: string[];
  taggedPromiseIds?: string[];
  taggedBillIds?: string[]; // New
};

export interface Party {
  id: string;
  name: string;
  nepaliName?: string;
  abbreviation?: string;
  slug?: string;
  leadership: LeadershipMember[];
  leadershipHistory?: LeadershipEvent[];
  contactInfo: ContactInfo;
  headquartersAddress?: string;
  logoUrl: string;
  flagUrl?: string;
  electionSymbolUrl: string;
  partyColorHex?: string;
  history: string;
  aboutParty?: string;
  foundedDate?: string;
  dissolvedDate?: string;
  registrationNumber?: string;
  ideology?: string[];
  detailedIdeologyDescription?: string;
  partyManifestoUrl?: string;
  historicalManifestos?: HistoricalManifesto[];
  parentPartyId?: string;
  parentPartyName?: string;
  splinterPartyIds?: string[];
  splinterPartyNames?: string[];
  internationalAffiliations?: string[];
  wings?: PartyWing[];
  alliances?: PartyAlliance[];
  splitMergerHistory?: PartySplitMergerEvent[];
  stancesOnIssues?: PartyStance[];
  fundingSources?: FundingSource[];
  intraPartyElections?: IntraPartyElection[];
  electionHistory?: ElectionPerformanceRecord[];
  isActive?: boolean;
  isNationalParty?: boolean;
  dataAiHint?: string;
  controversyIds?: string[];
  tags?: string[];
}

export type VoteOption = 'Yea' | 'Nay' | 'Abstain' | 'Not Voting';

export type VoteRecord = {
  politicianId: string;
  politicianName: string; // Denormalized
  vote: VoteOption;
};

export type BillTimelineEvent = {
  date: string; // ISO Date string
  event: string; // e.g., "Introduced in Senate", "First Reading", "Amendment X Proposed", "Passed Committee Y", "Voted Yea/Nay"
  description?: string;
  relatedDocumentUrl?: string;
  actor?: string; // e.g., Politician name, Committee name
};

export type BillStatus =
  | 'Introduced'
  | 'In Committee'
  | 'First Reading'
  | 'Second Reading'
  | 'Third Reading'
  | 'Passed Lower House'
  | 'Passed Upper House'
  | 'Awaiting Assent'
  | 'Became Law'
  | 'Failed'
  | 'Rejected'
  | 'Withdrawn';

export interface Bill {
  id: string;
  slug?: string;
  title: string;
  billNumber: string;
  summary: string;
  purpose?: string;
  billType?: 'Government' | 'Private Member' | 'Constitutional Amendment' | string;
  responsibleMinistry?: string;
  houseOfIntroduction?: 'Lower' | 'Upper' | 'Provincial Assembly' | string;
  parliamentarySession?: string;
  keyDates?: {
    introduced?: string;
    committeeReferral?: string;
    firstReading?: string;
    secondReading?: string;
    thirdReading?: string;
    passedLowerHouse?: string;
    passedUpperHouse?: string;
    assent?: string;
    gazettePublication?: string;
    effectiveDate?: string;
  };
  sponsors: Array<{ id: string; name: string; type: 'Primary' | 'Co-Sponsor' }>;
  votingResults?: {
    house?: { date: string; records: VoteRecord[]; passed: boolean };
    senate?: { date: string; records: VoteRecord[]; passed: boolean };
  };
  timelineEvents: BillTimelineEvent[]; // Replaces amendmentHistory
  status: BillStatus;
  introducedDate: string;
  lastActionDate?: string;
  lastActionDescription?: string;
  fullTextUrl?: string;
  committees?: string[];
  impact?: string; // Briefly, what laws it amends/repeals
  tags?: string[];
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


// --- Promise Related Types ---
export type PromiseStatus =
  | 'Pending'
  | 'In Progress'
  | 'Fulfilled'
  | 'Partially Fulfilled'
  | 'Broken'
  | 'Stalled'
  | 'Modified'
  | 'Cancelled';

export interface PromiseEvidenceLink {
  url: string;
  description?: string;
  type?: 'document' | 'image' | 'video' | 'article' | 'official_report' | 'other';
  submittedBy?: string; // User ID or name
  submissionDate?: string; // ISO Date
}

export interface PromiseStatusUpdate {
  date: string; // ISO Date
  status: PromiseStatus;
  description?: string; // Reason for change or update details
  updatedBy?: string; // User ID or 'System' or Admin ID
  fulfillmentPercentage?: number; // Optional: record percentage at this update point
}

export interface PromiseItem {
  id: string;
  slug?: string;
  title: string;
  description: string; // Full description
  category?: string; // e.g., Infrastructure, Education
  subCategory?: string; // e.g., Road Construction, Curriculum Development

  politicianId?: string; // Link to Politician if specific to one
  partyId?: string; // Link to Party if a party promise

  datePromised?: string; // ISO Date
  sourceType?: 'Election Manifesto' | 'Public Speech' | 'Interview' | 'Parliamentary Record' | 'Press Release' | 'Social Media' | 'Other';
  sourceDetails?: string; // e.g., Manifesto Page No., Speech Date & Venue, URL & Timestamp
  relatedElectionId?: string; // Link to an Election entity (future)
  geographicScope?: 'National' | 'Provincial' | 'District' | 'Local Body' | 'Constituency' | string; // More granular

  status: PromiseStatus;
  expectedFulfillmentDate?: string; // ISO Date, was dueDate
  actualFulfillmentDate?: string; // ISO Date, was dateCompleted
  fulfillmentPercentage?: number; // 0-100, can be updated over time
  reasonForStatus?: string; // Especially for Broken, Stalled, Modified, Cancelled
  responsibleAgency?: string; // Government agency/ministry responsible

  evidenceLinks: PromiseEvidenceLink[];
  statusUpdateHistory?: PromiseStatusUpdate[]; // Timeline of status changes
  tags?: string[];

  // Future considerations (not implemented in this phase)
  // commentsCount?: number;
  // verificationRating?: number;
  // sdgTags?: string[]; // UN Sustainable Development Goals
  // userFollowersCount?: number;
}

    