// src/lib/schemas.ts
import type { FormFieldSchema, FieldType } from '@/components/common/suggest-new-entry-form';
import type { EntityType } from '@/lib/data/suggestions'; // For the main Record key type
// Import all necessary entity types and sub-types from gov.ts
// Not all of these will be used directly in schemas if we are selective,
// but importing them allows for easier reference if needed.
import type {
  Politician,
  Party,
  Bill,
  Committee,
  Constituency,
  Election,
  NewsArticleLink,
  PromiseItem,
  ContactInfo,     // Imported for Politician data structure
  PartyAffiliation, // Imported for Politician data structure
  PoliticalJourneyEvent, // Imported for Politician data structure
  EducationEntry, // Imported for Politician data structure
  AssetDeclaration, // Imported for Politician data structure
  CriminalRecord, // Imported for Politician data structure
  CommitteeMembership, // Imported for Politician data structure
  StatementQuote, // Imported for Politician data structure
  LeadershipMember, // Imported for Party data structure
  BillTimelineEvent, // For Bill.timelineEvents (if fully implemented)
  VoteRecord,      // For Bill.votingResults (if fully implemented)
  // Add other sub-types if they are directly used as `objectSchema` or `arrayItemSchema` objects
  // For example, if positions for Politician was its own named type:
  // PositionEntry
} from '@/types/gov';

// --- Reusable Sub-Schemas ---

export const contactInfoSchema: FormFieldSchema[] = [
  { name: 'email', label: 'Email', type: 'email', placeholder: 'contact@example.com' },
  { name: 'phone', label: 'Phone', type: 'text', placeholder: '+1-123-456-7890' },
  { name: 'officePhone', label: 'Office Phone', type: 'text', placeholder: '+1-123-456-7891' },
  { name: 'address', label: 'Address', type: 'textarea', placeholder: 'Main Street, City' },
  { name: 'permanentAddress', label: 'Permanent Address', type: 'textarea', placeholder: 'Permanent Address details' },
  { name: 'temporaryAddress', label: 'Temporary Address', type: 'textarea', placeholder: 'Temporary Address details' },
  { name: 'website', label: 'Website URL', type: 'url', placeholder: 'https://example.com' },
  { name: 'twitter', label: 'Twitter URL', type: 'url', placeholder: 'https://twitter.com/username' },
  { name: 'facebook', label: 'Facebook URL', type: 'url', placeholder: 'https://facebook.com/profile' },
  { name: 'linkedin', label: 'LinkedIn URL', type: 'url', placeholder: 'https://linkedin.com/in/username' },
  { name: 'instagram', label: 'Instagram URL', type: 'url', placeholder: 'https://instagram.com/username' },
];

export const politicalJourneyEventSchema: FormFieldSchema[] = [
  { name: 'date', label: 'Date', type: 'date', required: true },
  { name: 'event', label: 'Event Title', type: 'text', required: true, placeholder: 'e.g., Joined Party X' },
  { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Details about the event' },
];

export const partyAffiliationSchema: FormFieldSchema[] = [
  { name: 'partyId', label: 'Party ID', type: 'text', placeholder: 'ID of the party' },
  { name: 'partyName', label: 'Party Name', type: 'text', required: true, placeholder: 'Name of the party' },
  { name: 'role', label: 'Role in Party', type: 'text', placeholder: 'e.g., Member, Treasurer' },
  { name: 'startDate', label: 'Start Date', type: 'date', required: true },
  { name: 'endDate', label: 'End Date (optional)', type: 'date' },
];

export const educationEntrySchema: FormFieldSchema[] = [
  { name: 'institution', label: 'Institution', type: 'text', required: true, placeholder: 'University Name' },
  { name: 'degree', label: 'Degree', type: 'text', required: true, placeholder: 'e.g., B.A., M.Sc.' },
  { name: 'field', label: 'Field of Study', type: 'text', placeholder: 'e.g., Political Science' },
  { name: 'graduationYear', label: 'Graduation Year', type: 'text', placeholder: 'e.g., 2010' }, // text for flexibility e.g. "Ongoing"
];

export const assetDeclarationSchema: FormFieldSchema[] = [
  { name: 'year', label: 'Year of Declaration', type: 'number', required: true, placeholder: 'e.g., 2023' },
  { name: 'description', label: 'Asset Description', type: 'textarea', required: true, placeholder: 'Details of the asset' },
  { name: 'value', label: 'Value', type: 'text', placeholder: 'e.g., $100,000 or Undisclosed' },
  { name: 'sourceUrl', label: 'Source URL (optional)', type: 'url', placeholder: 'Link to declaration document' },
];

export const criminalRecordSchema: FormFieldSchema[] = [
  { name: 'date', label: 'Date of Record/Offense', type: 'date', required: true },
  { name: 'caseNumber', label: 'Case Number (optional)', type: 'text', placeholder: 'Case ID' },
  { name: 'offense', label: 'Offense', type: 'text', required: true, placeholder: 'Nature of the offense' },
  { name: 'court', label: 'Court (optional)', type: 'text', placeholder: 'Court Name' },
  { name: 'status', label: 'Status', type: 'text', required: true, placeholder: 'e.g., Alleged, Convicted, Acquitted' }, // TODO: Convert to select with options from CriminalRecord['status']
  { name: 'summary', label: 'Summary (optional)', type: 'textarea', placeholder: 'Brief summary of the case' },
  { name: 'sourceUrl', label: 'Source URL (optional)', type: 'url', placeholder: 'Link to relevant document' },
];

export const committeeMembershipSchema: FormFieldSchema[] = [
  { name: 'committeeName', label: 'Committee Name', type: 'text', required: true },
  { name: 'role', label: 'Role', type: 'text', placeholder: 'e.g., Chair, Member' },
  { name: 'startDate', label: 'Start Date', type: 'date' },
  { name: 'endDate', label: 'End Date (or "Present")', type: 'date' },
];

const politicianPositionSchema: FormFieldSchema[] = [
    { name: 'title', label: 'Position Title', type: 'text', required: true, placeholder: 'e.g., Senator' },
    { name: 'startDate', label: 'Start Date', type: 'date', required: true },
    { name: 'endDate', label: 'End Date (optional)', type: 'date', placeholder: 'Leave blank if current' },
];


// --- Main Entity Schemas ---

export const politicianSchema: FormFieldSchema[] = [
  // { name: 'id', label: 'ID', type: 'text', placeholder: 'System generated or admin entry' }, // Usually not user-suggested
  { name: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'Enter full name' },
  { name: 'nepaliName', label: 'Nepali Name (Optional)', type: 'text', placeholder: 'नाम नेपालीमा' },
  { name: 'slug', label: 'Slug (URL friendly name)', type: 'text', placeholder: 'e.g., john-doe' },
  { name: 'gender', label: 'Gender', type: 'text', placeholder: 'Male, Female, Other' }, // TODO: Convert to select
  { name: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
  { name: 'dateOfDeath', label: 'Date of Death (Optional)', type: 'date' },
  {
    name: 'placeOfBirth',
    label: 'Place of Birth',
    type: 'object',
    objectSchema: [
      { name: 'district', label: 'District', type: 'text', placeholder: 'Birth district' },
      { name: 'address', label: 'Address Detail', type: 'text', placeholder: 'Village/Town/City' },
    ],
  },
  { name: 'partyId', label: 'Primary Party ID (Optional)', type: 'text', placeholder: 'ID of their current party' },
  { name: 'partyName', label: 'Primary Party Name (Optional)', type: 'text', placeholder: 'Name of their current party' },
  { name: 'photoUrl', label: 'Photo URL (Optional)', type: 'url', placeholder: 'Link to a profile photo' },
  { name: 'bio', label: 'Biography (Optional)', type: 'textarea', placeholder: 'A brief biography...' },
  { name: 'province', label: 'Province (Optional)', type: 'text', placeholder: 'e.g., Bagmati' },
  { name: 'constituency', label: 'Constituency Name (Optional)', type: 'text', placeholder: 'Name of their constituency' },
  { name: 'constituencyId', label: 'Constituency ID (Optional)', type: 'text', placeholder: 'ID of their constituency' },
  { name: 'isActiveInPolitics', label: 'Currently Active in Politics?', type: 'boolean' },
  {
    name: 'aliases',
    label: 'Aliases (Nicknames)',
    type: 'array',
    arrayItemSchema: { name: 'alias', label: 'Alias', type: 'text', placeholder: 'e.g., The People\'s Voice' } as FormFieldSchema,
    // If arrayItemSchema is just a FieldType for simple string array:
    // arrayItemSchema: 'text' // This would render simple text inputs for each alias
  },
  {
    name: 'positions',
    label: 'Positions Held',
    type: 'array',
    arrayItemSchema: { name: 'position', label: 'Position', type: 'object', objectSchema: politicianPositionSchema } as FormFieldSchema,
  },
  {
    name: 'contactInfo',
    label: 'Contact Information',
    type: 'object',
    objectSchema: contactInfoSchema,
  },
  {
    name: 'politicalJourney',
    label: 'Political Journey / Career Milestones',
    type: 'array',
    arrayItemSchema: { name: 'journeyEvent', label: 'Journey Event', type: 'object', objectSchema: politicalJourneyEventSchema } as FormFieldSchema,
  },
  {
    name: 'partyAffiliations',
    label: 'Party Affiliations (Historical)',
    type: 'array',
    arrayItemSchema: { name: 'affiliation', label: 'Party Affiliation', type: 'object', objectSchema: partyAffiliationSchema } as FormFieldSchema,
  },
  {
    name: 'education',
    label: 'Education History',
    type: 'array',
    arrayItemSchema: { name: 'educationEntry', label: 'Education Entry', type: 'object', objectSchema: educationEntrySchema } as FormFieldSchema,
  },
  {
    name: 'assetDeclarations',
    label: 'Asset Declarations',
    type: 'array',
    arrayItemSchema: { name: 'asset', label: 'Asset Declaration', type: 'object', objectSchema: assetDeclarationSchema } as FormFieldSchema,
  },
  {
    name: 'criminalRecords',
    label: 'Criminal Records (if any)',
    type: 'array',
    arrayItemSchema: { name: 'record', label: 'Criminal Record', type: 'object', objectSchema: criminalRecordSchema } as FormFieldSchema,
  },
  {
    name: 'committeeMemberships',
    label: 'Committee Memberships',
    type: 'array',
    arrayItemSchema: { name: 'membership', label: 'Committee Membership', type: 'object', objectSchema: committeeMembershipSchema } as FormFieldSchema,
  },
  { name: 'politicalIdeology', label: 'Political Ideologies (comma-separated)', type: 'textarea', placeholder: 'e.g., Socialism, Environmentalism' }, // Simple textarea for now
  { name: 'languagesSpoken', label: 'Languages Spoken (comma-separated)', type: 'textarea', placeholder: 'e.g., Nepali, English' }, // Simple textarea
  { name: 'tags', label: 'Tags (comma-separated)', type: 'textarea', placeholder: 'e.g., human-rights, fiscal-policy' }, // Simple textarea
  // controversyIds is likely admin managed or linked from elsewhere
];

export const leadershipMemberSchema: FormFieldSchema[] = [
  { name: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'Leader\'s Full Name' },
  { name: 'role', label: 'Role', type: 'text', required: true, placeholder: 'e.g., Chairperson, Secretary' },
  { name: 'politicianId', label: 'Politician ID (Optional)', type: 'text', placeholder: 'Link to Politician Profile' },
];

export const partySchema: FormFieldSchema[] = [
  // { name: 'id', label: 'ID', type: 'text', placeholder: 'System generated or admin entry' },
  { name: 'name', label: 'Party Name', type: 'text', required: true, placeholder: 'Full name of the party' },
  { name: 'nepaliName', label: 'Nepali Name (Optional)', type: 'text' },
  { name: 'abbreviation', label: 'Abbreviation (Optional)', type: 'text', placeholder: 'e.g., XYZ Party' },
  { name: 'slug', label: 'Slug (URL friendly name)', type: 'text', placeholder: 'e.g., xyz-party' },
  { name: 'headquartersAddress', label: 'Headquarters Address (Optional)', type: 'textarea' },
  { name: 'logoUrl', label: 'Logo URL (Optional)', type: 'url', placeholder: 'Link to party logo' },
  { name: 'flagUrl', label: 'Flag URL (Optional)', type: 'url', placeholder: 'Link to party flag' },
  { name: 'electionSymbolUrl', label: 'Election Symbol URL (Optional)', type: 'url', placeholder: 'Link to election symbol image' },
  { name: 'partyColorHex', label: 'Party Color (Hex Code, Optional)', type: 'text', placeholder: '#FF0000' },
  { name: 'history', label: 'Party History (Optional)', type: 'textarea', placeholder: 'Brief history of the party...' },
  { name: 'aboutParty', label: 'About Party (Optional)', type: 'textarea', placeholder: 'More details about the party...' },
  { name: 'foundedDate', label: 'Founded Date (Optional)', type: 'date' },
  { name: 'dissolvedDate', label: 'Dissolved Date (Optional)', type: 'date' },
  { name: 'registrationNumber', label: 'Registration Number (Optional)', type: 'text' },
  {
    name: 'contactInfo',
    label: 'Contact Information',
    type: 'object',
    objectSchema: contactInfoSchema,
  },
  {
    name: 'leadership',
    label: 'Current Leadership',
    type: 'array',
    arrayItemSchema: { name: 'leader', label: 'Leader', type: 'object', objectSchema: leadershipMemberSchema } as FormFieldSchema,
  },
  { name: 'ideology', label: 'Ideologies (comma-separated)', type: 'textarea', placeholder: 'e.g., Democracy, Social Justice' }, // Simple textarea
  { name: 'internationalAffiliations', label: 'International Affiliations (comma-separated)', type: 'textarea' }, // Simple textarea
  { name: 'tags', label: 'Tags (comma-separated)', type: 'textarea' },
  { name: 'isActive', label: 'Is Party Currently Active?', type: 'boolean' },
  { name: 'isNationalParty', label: 'Is Party a National Party?', type: 'boolean' },
  { name: 'detailedIdeologyDescription', label: 'Detailed Ideology', type: 'textarea', placeholder: 'Full description of party ideology.' },
  { name: 'partyManifestoUrl', label: 'Current Manifesto URL', type: 'url', placeholder: 'Link to current party manifesto.' },
  { name: 'parentPartyId', label: 'Parent Party ID (Optional)', type: 'text' },
  { name: 'parentPartyName', label: 'Parent Party Name (Optional)', type: 'text' },
  { name: 'splinterPartyIds', label: 'Splinter Party IDs (JSON Array)', type: 'textarea', placeholder: 'e.g., ["id1", "id2"]' }, // Simple JSON for now
  { name: 'splinterPartyNames', label: 'Splinter Party Names (JSON Array)', type: 'textarea', placeholder: 'e.g., ["Name1", "Name2"]' }, // Simple JSON for now
];

// --- Schemas for Party's complex array fields ---

export const historicalManifestoItemSchema: FormFieldSchema[] = [
  { name: 'year', label: 'Year', type: 'text', required: true, placeholder: 'e.g., 2018' },
  { name: 'url', label: 'URL', type: 'url', required: true, placeholder: 'Link to the manifesto document' },
  { name: 'description', label: 'Description (Optional)', type: 'textarea' },
];

export const leadershipEventItemSchema: FormFieldSchema[] = [ // For Party.leadershipHistory
  { name: 'role', label: 'Role', type: 'text', required: true, placeholder: 'e.g., President' },
  { name: 'name', label: 'Leader Name', type: 'text', required: true },
  { name: 'politicianId', label: 'Politician ID (Optional)', type: 'text' },
  { name: 'startDate', label: 'Start Date', type: 'date', required: true },
  { name: 'endDate', label: 'End Date (or "Present")', type: 'text', placeholder: 'YYYY-MM-DD or Present' },
];

export const partyWingKeyLeaderSchema: FormFieldSchema[] = [
    { name: 'name', label: 'Leader Name', type: 'text', required: true },
    { name: 'politicianId', label: 'Politician ID (Optional)', type: 'text' },
];

export const partyWingItemSchema: FormFieldSchema[] = [ // For Party.wings
  { name: 'name', label: 'Wing Name', type: 'text', required: true },
  { name: 'description', label: 'Description (Optional)', type: 'textarea' },
  {
    name: 'keyLeaders',
    label: 'Key Leaders',
    type: 'array',
    arrayItemSchema: { name: 'leader', label: 'Key Leader', type: 'object', objectSchema: partyWingKeyLeaderSchema } as FormFieldSchema,
  }
];

export const partyAllianceItemSchema: FormFieldSchema[] = [ // For Party.alliances
  { name: 'name', label: 'Alliance Name', type: 'text', required: true },
  { name: 'partnerPartyIds', label: 'Partner Party IDs (JSON Array)', type: 'textarea', placeholder: 'e.g., ["partyId1", "partyId2"]', required: true },
  { name: 'partnerPartyNames', label: 'Partner Party Names (JSON Array)', type: 'textarea', placeholder: 'e.g., ["Party Name 1", "Party Name 2"]' },
  { name: 'startDate', label: 'Start Date', type: 'date', required: true },
  { name: 'endDate', label: 'End Date (or "Ongoing")', type: 'text', placeholder: 'YYYY-MM-DD or Ongoing' },
  { name: 'purpose', label: 'Purpose (Optional)', type: 'textarea' },
  { name: 'status', label: 'Status', type: 'text', placeholder: 'e.g., Active, Dissolved' }, // TODO: Select: Active | Dissolved | Inactive
];

export const partySplitMergerInvolvedPartySchema: FormFieldSchema[] = [
    { name: 'id', label: 'Party ID (Optional)', type: 'text'},
    { name: 'name', label: 'Party Name', type: 'text', required: true },
    { name: 'role', label: 'Role in Event', type: 'text', required: true, placeholder: 'e.g., MergedInto, SplitFrom' }, // TODO: Select
];

export const partySplitMergerItemSchema: FormFieldSchema[] = [ // For Party.splitMergerHistory
  { name: 'date', label: 'Date', type: 'date', required: true },
  { name: 'type', label: 'Event Type', type: 'text', required: true, placeholder: 'e.g., Split, Merger' }, // TODO: Select
  { name: 'description', label: 'Description', type: 'textarea', required: true },
  {
    name: 'involvedParties',
    label: 'Involved Parties',
    type: 'array',
    arrayItemSchema: { name: 'involvedParty', label: 'Involved Party', type: 'object', objectSchema: partySplitMergerInvolvedPartySchema } as FormFieldSchema,
  }
];

export const partyStanceItemSchema: FormFieldSchema[] = [ // For Party.stancesOnIssues
  { name: 'issueId', label: 'Issue ID/Slug', type: 'text', required: true },
  { name: 'issueTitle', label: 'Issue Title', type: 'text', required: true },
  { name: 'stance', label: 'Stance', type: 'text', required: true, placeholder: 'e.g., Supports, Opposes, Neutral' }, // TODO: Select
  { name: 'statement', label: 'Statement (Optional)', type: 'textarea' },
  { name: 'statementUrl', label: 'Statement URL (Optional)', type: 'url' },
  { name: 'dateOfStance', label: 'Date of Stance (Optional)', type: 'date' },
  { name: 'isBill', label: 'Is this a Bill?', type: 'boolean' },
];

export const fundingSourceItemSchema: FormFieldSchema[] = [ // For Party.fundingSources
  { name: 'year', label: 'Year', type: 'text', required: true, placeholder: 'e.g., 2023' },
  { name: 'sourceName', label: 'Source Name', type: 'text', required: true },
  { name: 'amount', label: 'Amount (Optional)', type: 'text', placeholder: 'e.g., $10,000 or Major Contributor' },
  { name: 'type', label: 'Funding Type', type: 'text', required: true, placeholder: 'e.g., Donation, Grant' }, // TODO: Select
  { name: 'description', label: 'Description (Optional)', type: 'textarea' },
  { name: 'sourceUrl', label: 'Source URL (Optional)', type: 'url' },
];

export const intraPartyElectionItemSchema: FormFieldSchema[] = [ // For Party.intraPartyElections
  { name: 'date', label: 'Date', type: 'date', required: true },
  { name: 'electionTitle', label: 'Election Title', type: 'text', required: true },
  { name: 'description', label: 'Description (Optional)', type: 'textarea' },
  { name: 'resultsSummary', label: 'Results Summary (Optional)', type: 'textarea' },
  { name: 'documentUrl', label: 'Document URL (Optional)', type: 'url' },
];

export const electionPerformanceRecordItemSchema: FormFieldSchema[] = [ // For Party.electionHistory
  { name: 'electionYear', label: 'Election Year', type: 'text', required: true, placeholder: 'e.g., 2018' },
  { name: 'electionType', label: 'Election Type', type: 'text', required: true, placeholder: 'e.g., General, Local' }, // TODO: Select
  { name: 'seatsContested', label: 'Seats Contested (Optional)', type: 'number' },
  { name: 'seatsWon', label: 'Seats Won', type: 'number', required: true },
  { name: 'votePercentage', label: 'Vote Percentage (Optional)', type: 'number', placeholder: 'e.g., 45.5' },
  { name: 'notes', label: 'Notes (Optional)', type: 'textarea' },
];

// Add these complex array fields to the partySchema
const existingPartySchemaFields = partySchema.slice(); // Get a copy
export const fullPartySchema: FormFieldSchema[] = [
    ...existingPartySchemaFields,
    { name: 'historicalManifestos', label: 'Historical Manifestos', type: 'array', arrayItemSchema: { name: 'manifesto', label: 'Manifesto', type: 'object', objectSchema: historicalManifestoItemSchema } as FormFieldSchema },
    { name: 'leadershipHistory', label: 'Leadership History', type: 'array', arrayItemSchema: { name: 'event', label: 'Leadership Event', type: 'object', objectSchema: leadershipEventItemSchema } as FormFieldSchema },
    { name: 'wings', label: 'Party Wings', type: 'array', arrayItemSchema: { name: 'wing', label: 'Wing', type: 'object', objectSchema: partyWingItemSchema } as FormFieldSchema },
    { name: 'alliances', label: 'Alliances', type: 'array', arrayItemSchema: { name: 'alliance', label: 'Alliance', type: 'object', objectSchema: partyAllianceItemSchema } as FormFieldSchema },
    { name: 'splitMergerHistory', label: 'Split/Merger History', type: 'array', arrayItemSchema: { name: 'event', label: 'Split/Merger Event', type: 'object', objectSchema: partySplitMergerItemSchema } as FormFieldSchema },
    { name: 'stancesOnIssues', label: 'Stances on Issues', type: 'array', arrayItemSchema: { name: 'stance', label: 'Stance', type: 'object', objectSchema: partyStanceItemSchema } as FormFieldSchema },
    { name: 'fundingSources', label: 'Funding Sources', type: 'array', arrayItemSchema: { name: 'source', label: 'Funding Source', type: 'object', objectSchema: fundingSourceItemSchema } as FormFieldSchema },
    { name: 'intraPartyElections', label: 'Intra-Party Elections', type: 'array', arrayItemSchema: { name: 'election', label: 'Internal Election', type: 'object', objectSchema: intraPartyElectionItemSchema } as FormFieldSchema },
    { name: 'electionHistory', label: 'Election Performance History', type: 'array', arrayItemSchema: { name: 'record', label: 'Election Record', type: 'object', objectSchema: electionPerformanceRecordItemSchema } as FormFieldSchema },
];


const billSponsorSchema: FormFieldSchema[] = [
    { name: 'id', label: 'Sponsor Politician ID', type: 'text', required: true },
    { name: 'name', label: 'Sponsor Name', type: 'text', required: true },
    { name: 'type', label: 'Sponsor Type', type: 'text', placeholder: 'Primary or Co-Sponsor', required: true }, // TODO: Select
];

export const billSchema: FormFieldSchema[] = [
  { name: 'title', label: 'Bill Title', type: 'text', required: true },
  { name: 'billNumber', label: 'Bill Number', type: 'text', required: true, placeholder: 'e.g., HR-123, S-456' },
  { name: 'summary', label: 'Summary', type: 'textarea', required: true },
  { name: 'purpose', label: 'Purpose (Optional)', type: 'textarea' },
  { name: 'billType', label: 'Bill Type', type: 'text', placeholder: 'e.g., Government, Private Member' }, // TODO: Select
  { name: 'status', label: 'Current Status', type: 'text', required: true, placeholder: 'e.g., Introduced, Passed' }, // TODO: Select
  { name: 'introducedDate', label: 'Date Introduced', type: 'date', required: true },
  { name: 'fullTextUrl', label: 'Full Text URL (Optional)', type: 'url' },
  {
    name: 'sponsors',
    label: 'Sponsors',
    type: 'array',
    arrayItemSchema: { name: 'sponsor', label: 'Sponsor', type: 'object', objectSchema: billSponsorSchema } as FormFieldSchema,
  },
  { name: 'slug', label: 'Slug', type: 'text', placeholder: 'URL-friendly identifier' },
  { name: 'responsibleMinistry', label: 'Responsible Ministry', type: 'text', placeholder: 'e.g., Ministry of Finance' },
  { name: 'houseOfIntroduction', label: 'House of Introduction', type: 'text', placeholder: 'e.g., Lower, Upper' }, // TODO: Select
  { name: 'parliamentarySession', label: 'Parliamentary Session', type: 'text', placeholder: 'e.g., 42nd Parliament, 2nd Session' },
  { name: 'lastActionDate', label: 'Last Action Date', type: 'date' },
  { name: 'lastActionDescription', label: 'Last Action Description', type: 'textarea' },
  { name: 'impact', label: 'Impact Statement', type: 'textarea', placeholder: 'Briefly, what laws it amends/repeals' },
  { name: 'tags', label: 'Tags', type: 'array', arrayItemSchema: { name: 'tag', label: 'Tag', type: 'text', placeholder: 'Enter a tag' } as FormFieldSchema },
  { name: 'committees', label: 'Referred Committees', type: 'array', arrayItemSchema: { name: 'committee', label: 'Committee Name', type: 'text', placeholder: 'Name of committee' } as FormFieldSchema },
];

// --- Schemas for Bill's complex fields ---
export const keyDatesSchema: FormFieldSchema[] = [
  { name: 'introduced', label: 'Introduced', type: 'date'},
  { name: 'committeeReferral', label: 'Committee Referral', type: 'date'},
  { name: 'firstReading', label: 'First Reading', type: 'date'},
  { name: 'secondReading', label: 'Second Reading', type: 'date'},
  { name: 'thirdReading', label: 'Third Reading', type: 'date'},
  { name: 'passedLowerHouse', label: 'Passed Lower House', type: 'date'},
  { name: 'passedUpperHouse', label: 'Passed Upper House', type: 'date'},
  { name: 'assent', label: 'Assent', type: 'date'},
  { name: 'gazettePublication', label: 'Gazette Publication', type: 'date'},
  { name: 'effectiveDate', label: 'Effective Date', type: 'date'},
];

export const billTimelineEventItemSchema: FormFieldSchema[] = [
  { name: 'date', label: 'Date', type: 'date', required: true },
  { name: 'event', label: 'Event', type: 'text', required: true, placeholder: 'e.g., First Reading' },
  { name: 'description', label: 'Description (Optional)', type: 'textarea' },
  { name: 'relatedDocumentUrl', label: 'Related Document URL (Optional)', type: 'url' },
  { name: 'actor', label: 'Actor (Optional)', type: 'text', placeholder: 'e.g., Committee Name, Politician Name' },
];

export const voteRecordItemSchema: FormFieldSchema[] = [
  { name: 'politicianId', label: 'Politician ID', type: 'text', required: true },
  { name: 'politicianName', label: 'Politician Name', type: 'text', required: true },
  { name: 'vote', label: 'Vote', type: 'text', required: true, placeholder: 'Yea, Nay, Abstain, Not Voting' }, // TODO: Select
];

export const billVotingResultsChamberSchema: FormFieldSchema[] = [
  { name: 'date', label: 'Vote Date', type: 'date', required: true },
  { name: 'passed', label: 'Passed?', type: 'boolean', required: true },
  {
    name: 'records',
    label: 'Vote Records',
    type: 'array',
    arrayItemSchema: { name: 'voteRecord', label: 'Vote Record', type: 'object', objectSchema: voteRecordItemSchema } as FormFieldSchema,
  },
];

// Update billSchema to include these complex types
const existingBillSchemaFields = billSchema.slice(0, billSchema.findIndex(f => f.name === 'sponsors') +1); // Keep fields up to and including sponsors
const remainingBillSchemaFields = billSchema.slice(billSchema.findIndex(f => f.name === 'sponsors') + 1);

export const fullBillSchema: FormFieldSchema[] = [
    ...existingBillSchemaFields, // title, billNumber, summary, purpose, billType, status, introducedDate, fullTextUrl, sponsors
    { name: 'keyDates', label: 'Key Dates', type: 'object', objectSchema: keyDatesSchema, placeholder: 'Various key dates of the bill' },
    { name: 'timelineEvents', label: 'Timeline Events', type: 'array', arrayItemSchema: { name: 'event', label: 'Timeline Event', type: 'object', objectSchema: billTimelineEventItemSchema } as FormFieldSchema },
    {
        name: 'votingResults',
        label: 'Voting Results',
        type: 'object',
        objectSchema: [
            { name: 'house', label: 'House Voting Results', type: 'object', objectSchema: billVotingResultsChamberSchema, required: false },
            { name: 'senate', label: 'Senate Voting Results', type: 'object', objectSchema: billVotingResultsChamberSchema, required: false },
        ]
    },
    ...remainingBillSchemaFields, // slug, responsibleMinistry, etc. added earlier
];


const committeeMemberSchema: FormFieldSchema[] = [
    { name: 'politicianId', label: 'Politician ID', type: 'text', required: true },
    { name: 'politicianName', label: 'Member Name', type: 'text', required: true },
    { name: 'role', label: 'Role', type: 'text', required: true, placeholder: 'e.g., Chairperson, Member' }, // TODO: Select
    { name: 'startDate', label: 'Start Date', type: 'date' },
    { name: 'endDate', label: 'End Date (or Present)', type: 'date' },
];

export const committeeSchema: FormFieldSchema[] = [
  { name: 'name', label: 'Committee Name', type: 'text', required: true },
  { name: 'nepaliName', label: 'Nepali Name (Optional)', type: 'text' },
  { name: 'committeeType', label: 'Committee Type', type: 'text', required: true, placeholder: 'e.g., Thematic, Special' }, // TODO: Select
  { name: 'house', label: 'House', type: 'text', placeholder: 'e.g., House of Representatives' }, // TODO: Select
  { name: 'mandate', label: 'Mandate/Terms of Reference (Optional)', type: 'textarea' },
  {
    name: 'members',
    label: 'Members',
    type: 'array',
    arrayItemSchema: { name: 'member', label: 'Member', type: 'object', objectSchema: committeeMemberSchema } as FormFieldSchema,
  },
  { name: 'slug', label: 'Slug', type: 'text', placeholder: 'URL-friendly identifier' },
  { name: 'isActive', label: 'Is Active?', type: 'boolean' },
  { name: 'establishmentDate', label: 'Establishment Date', type: 'date' },
  { name: 'dissolutionDate', label: 'Dissolution Date (Optional)', type: 'date' },
  { name: 'tags', label: 'Tags', type: 'array', arrayItemSchema: { name: 'tag', label: 'Tag', type: 'text', placeholder: 'Enter a tag' } as FormFieldSchema },
];

// --- Schemas for Committee's complex fields ---
export const billReferredItemSchema: FormFieldSchema[] = [
  { name: 'billId', label: 'Bill ID', type: 'text', required: true },
  { name: 'billName', label: 'Bill Name', type: 'text', required: true },
  { name: 'billNumber', label: 'Bill Number (Optional)', type: 'text' },
  { name: 'referralDate', label: 'Referral Date', type: 'date', required: true },
  { name: 'status', label: 'Status in Committee', type: 'text', placeholder: 'e.g., Under Review' }, // TODO: Select
  { name: 'committeeReportId', label: 'Committee Report ID (Optional)', type: 'text' },
];

export const committeeReportItemSchema: FormFieldSchema[] = [
  { name: 'id', label: 'Report ID', type: 'text', required: false }, // Often system generated
  { name: 'title', label: 'Report Title', type: 'text', required: true },
  { name: 'publicationDate', label: 'Publication Date', type: 'date', required: true },
  { name: 'reportUrl', label: 'Report URL', type: 'url', required: true },
  { name: 'summary', label: 'Summary (Optional)', type: 'textarea' },
  { name: 'reportType', label: 'Report Type (Optional)', type: 'text', placeholder: 'e.g., Annual, Inquiry' }, // TODO: Select
];

export const committeeMeetingItemSchema: FormFieldSchema[] = [
  { name: 'id', label: 'Meeting ID', type: 'text', required: false }, // Often system generated
  { name: 'date', label: 'Date', type: 'date', required: true },
  { name: 'title', label: 'Title (Optional)', type: 'text', placeholder: 'e.g., Discussion on Bill X' },
  { name: 'agendaUrl', label: 'Agenda URL (Optional)', type: 'url' },
  { name: 'minutesUrl', label: 'Minutes URL (Optional)', type: 'url' },
  { name: 'summary', label: 'Summary (Optional)', type: 'textarea' },
  { name: 'liveStreamUrl', label: 'Live Stream URL (Optional)', type: 'url' },
];

export const committeeActivityEventItemSchema: FormFieldSchema[] = [
  { name: 'date', label: 'Date', type: 'date', required: true },
  { name: 'event', label: 'Event', type: 'text', required: true, placeholder: 'e.g., New Inquiry Launched' },
  { name: 'description', label: 'Description (Optional)', type: 'textarea' },
  { name: 'relatedDocumentUrl', label: 'Related Document URL (Optional)', type: 'url' },
];

// Update committeeSchema to include these complex types
export const fullCommitteeSchema: FormFieldSchema[] = [
  ...committeeSchema.filter(f => !['tags'].includes(f.name)), // Remove tags if it was already in the simple one, to avoid duplication
  { name: 'contactInfo', label: 'Contact Information', type: 'object', objectSchema: contactInfoSchema, required: false },
  { name: 'billsReferred', label: 'Bills Referred', type: 'array', arrayItemSchema: { name: 'billReferred', label: 'Bill Referred', type: 'object', objectSchema: billReferredItemSchema } as FormFieldSchema },
  { name: 'reports', label: 'Committee Reports', type: 'array', arrayItemSchema: { name: 'report', label: 'Committee Report', type: 'object', objectSchema: committeeReportItemSchema } as FormFieldSchema },
  { name: 'meetings', label: 'Committee Meetings', type: 'array', arrayItemSchema: { name: 'meeting', label: 'Committee Meeting', type: 'object', objectSchema: committeeMeetingItemSchema } as FormFieldSchema },
  { name: 'activityTimeline', label: 'Activity Timeline', type: 'array', arrayItemSchema: { name: 'activityEvent', label: 'Activity Event', type: 'object', objectSchema: committeeActivityEventItemSchema } as FormFieldSchema },
  // Ensure 'tags' is correctly placed if it wasn't in the base or if it needs specific object schema for items
  { name: 'tags', label: 'Tags', type: 'array', arrayItemSchema: { name: 'tagItem', label: 'Tag', type: 'text', placeholder:'Enter tag' } as FormFieldSchema, required: false },
];


export const constituencySchema: FormFieldSchema[] = [
  { name: 'name', label: 'Constituency Name', type: 'text', required: true },
  { name: 'code', label: 'Code (Optional)', type: 'text', placeholder: 'e.g., KTM-1' },
  { name: 'type', label: 'Type', type: 'text', required: true, placeholder: 'e.g., Federal, Provincial' }, // TODO: Select
  { name: 'district', label: 'District', type: 'text', required: true },
  { name: 'province', label: 'Province', type: 'text', required: true },
  { name: 'population', label: 'Population (Optional)', type: 'number' },
  { name: 'registeredVoters', label: 'Registered Voters (Optional)', type: 'number' },
  { name: 'areaSqKm', label: 'Area (sq km) (Optional)', type: 'number' },
  // More complex fields like demographics, historical results, projects are admin-managed for now.
  { name: 'slug', label: 'Slug', type: 'text', placeholder: 'URL-friendly identifier' },
  { name: 'dataAiHint', label: 'AI Hint for Image', type: 'textarea', placeholder: 'Hint for image generation' },
  { name: 'currentRepresentativeIds', label: 'Current Rep IDs (JSON Array)', type: 'textarea', placeholder: 'e.g., ["repId1", "repId2"]'},
  { name: 'currentRepresentativeNames', label: 'Current Rep Names (JSON Array)', type: 'textarea', placeholder: 'e.g., ["Rep Name 1", "Rep Name 2"]'},
  { name: 'tags', label: 'Tags', type: 'array', arrayItemSchema: { name: 'tag', label: 'Tag', type: 'text', placeholder: 'Enter a tag' } as FormFieldSchema },
];

// --- Schemas for Constituency's complex fields ---
export const keyDemographicEthnicGroupItemSchema: FormFieldSchema[] = [
  { name: 'name', label: 'Group Name', type: 'text', required: true },
  { name: 'percentage', label: 'Percentage', type: 'number', required: true, placeholder: 'e.g., 30.5' },
];

export const keyDemographicsSchema: FormFieldSchema[] = [
  { name: 'literacyRate', label: 'Literacy Rate (Optional)', type: 'number', placeholder: 'e.g., 75.5' },
  {
    name: 'ethnicGroups',
    label: 'Ethnic Groups',
    type: 'array',
    arrayItemSchema: { name: 'ethnicGroup', label: 'Ethnic Group', type: 'object', objectSchema: keyDemographicEthnicGroupItemSchema } as FormFieldSchema,
  },
];

export const historicalElectionResultItemSchema: FormFieldSchema[] = [
  { name: 'electionId', label: 'Election ID', type: 'text', required: true },
  { name: 'electionName', label: 'Election Name', type: 'text', required: true },
  { name: 'winnerPoliticianId', label: 'Winner Politician ID (Optional)', type: 'text' },
  { name: 'winnerPoliticianName', label: 'Winner Politician Name (Optional)', type: 'text' },
  { name: 'winningPartyId', label: 'Winning Party ID (Optional)', type: 'text' },
  { name: 'winningPartyName', label: 'Winning Party Name (Optional)', type: 'text' },
  { name: 'detailsUrl', label: 'Details URL (Optional)', type: 'url' },
];

export const developmentProjectItemSchema: FormFieldSchema[] = [
  { name: 'id', label: 'Project ID', type: 'text', required: false }, // Often system generated
  { name: 'name', label: 'Project Name', type: 'text', required: true },
  { name: 'status', label: 'Status', type: 'text', required: true, placeholder: 'e.g., Planned, Ongoing, Completed' }, // TODO: Select
  { name: 'description', label: 'Description (Optional)', type: 'textarea' },
  { name: 'budget', label: 'Budget (Optional)', type: 'text', placeholder: 'e.g., NPR 500 Million' },
  { name: 'startDate', label: 'Start Date (Optional)', type: 'date' },
  { name: 'expectedCompletion', label: 'Expected Completion (Optional)', type: 'text', placeholder: 'e.g., YYYY-MM-DD or Q4 2025' },
  { name: 'actualCompletionDate', label: 'Actual Completion Date (Optional)', type: 'date' },
  { name: 'implementingAgency', label: 'Implementing Agency (Optional)', type: 'text' },
  { name: 'sourceOfFunding', label: 'Source of Funding (Optional)', type: 'text' },
];

export const localIssueDocumentSchema: FormFieldSchema[] = [
    { name: 'name', label: 'Document Name', type: 'text', required: true },
    { name: 'url', label: 'Document URL', type: 'url', required: true },
];

export const localIssueItemSchema: FormFieldSchema[] = [
  { name: 'id', label: 'Issue ID', type: 'text', required: false }, // Often system generated
  { name: 'title', label: 'Issue Title', type: 'text', required: true },
  { name: 'description', label: 'Description (Optional)', type: 'textarea' },
  { name: 'reportedBy', label: 'Reported By (Optional)', type: 'text' },
  { name: 'dateReported', label: 'Date Reported (Optional)', type: 'date' },
  { name: 'status', label: 'Status', type: 'text', placeholder: 'e.g., Open, Addressed' }, // TODO: Select
  { name: 'resolutionDetails', label: 'Resolution Details (Optional)', type: 'textarea' },
  { name: 'severity', label: 'Severity (Optional)', type: 'text', placeholder: 'e.g., Low, Medium, High' }, // TODO: Select
  {
    name: 'relatedDocuments',
    label: 'Related Documents',
    type: 'array',
    arrayItemSchema: { name: 'document', label: 'Document', type: 'object', objectSchema: localIssueDocumentSchema } as FormFieldSchema,
  },
];

// Update constituencySchema to include these complex types
const existingConstituencySchemaFields = constituencySchema.slice();
export const fullConstituencySchema: FormFieldSchema[] = [
    ...existingConstituencySchemaFields.filter(f => !['tags', 'currentRepresentativeIds', 'currentRepresentativeNames', 'slug', 'dataAiHint'].includes(f.name)), // Remove fields that will be re-added with proper types or structure
    { name: 'slug', label: 'Slug', type: 'text', placeholder: 'URL-friendly identifier' },
    { name: 'dataAiHint', label: 'AI Hint for Image', type: 'textarea', placeholder: 'Hint for image generation' },
    { name: 'currentRepresentativeIds', label: 'Current Rep IDs (JSON Array)', type: 'textarea', placeholder: 'e.g., ["repId1", "repId2"]'},
    { name: 'currentRepresentativeNames', label: 'Current Rep Names (JSON Array)', type: 'textarea', placeholder: 'e.g., ["Rep Name 1", "Rep Name 2"]'},
    { name: 'keyDemographics', label: 'Key Demographics', type: 'object', objectSchema: keyDemographicsSchema, required: false },
    { name: 'historicalElectionResults', label: 'Historical Election Results', type: 'array', arrayItemSchema: { name: 'electionResult', label: 'Historical Election Result', type: 'object', objectSchema: historicalElectionResultItemSchema } as FormFieldSchema },
    { name: 'developmentProjects', label: 'Development Projects', type: 'array', arrayItemSchema: { name: 'devProject', label: 'Development Project', type: 'object', objectSchema: developmentProjectItemSchema } as FormFieldSchema },
    { name: 'localIssues', label: 'Local Issues', type: 'array', arrayItemSchema: { name: 'localIssue', label: 'Local Issue', type: 'object', objectSchema: localIssueItemSchema } as FormFieldSchema },
    { name: 'tags', label: 'Tags', type: 'array', arrayItemSchema: { name: 'tagItem', label: 'Tag', type: 'text', placeholder:'Enter tag' } as FormFieldSchema, required: false },
];


export const electionSchema: FormFieldSchema[] = [
  { name: 'name', label: 'Election Name', type: 'text', required: true, placeholder: 'e.g., General Election 2024' },
  { name: 'electionType', label: 'Election Type', type: 'text', required: true, placeholder: 'e.g., General, Provincial' }, // TODO: Select
  { name: 'date', label: 'Election Date', type: 'date', required: true },
  { name: 'description', label: 'Description (Optional)', type: 'textarea' },
  { name: 'status', label: 'Status', type: 'text', required: true, placeholder: 'e.g., Scheduled, Concluded' }, // TODO: Select
  // Voter turnout, timeline events etc. are results, typically admin-managed.
];

// NewsSchema (for NewsArticleLink)
export const newsSchema: FormFieldSchema[] = [
  { name: 'title', label: 'Article Title', type: 'text', required: true },
  { name: 'url', label: 'Article URL (if external)', type: 'url' },
  { name: 'sourceName', label: 'Source Name', type: 'text', required: true, placeholder: 'e.g., The Kathmandu Post, GovTrackr Internal' },
  { name: 'publicationDate', label: 'Publication Date', type: 'date', required: true },
  { name: 'summary', label: 'Summary/Abstract (Optional)', type: 'textarea' },
  { name: 'category', label: 'Category', type: 'text', placeholder: 'e.g., Politics, Elections' }, // TODO: Select
  { name: 'topics', label: 'Topics/Keywords (comma-separated)', type: 'textarea', placeholder: 'e.g., budget, healthcare' }, // Simple textarea for now
  // fullContent, author details, isFactCheck etc. for more detailed internal news management.
];

const promiseEvidenceLinkSchema: FormFieldSchema[] = [
    { name: 'url', label: 'Evidence URL', type: 'url', required: true },
    { name: 'description', label: 'Description (Optional)', type: 'text' },
    { name: 'type', label: 'Type (Optional)', type: 'text', placeholder: 'e.g., document, article'}, // TODO: Select
];

// PromiseSchema (for PromiseItem)
export const promiseSchema: FormFieldSchema[] = [
  { name: 'title', label: 'Promise Title', type: 'text', required: true },
  { name: 'description', label: 'Detailed Description', type: 'textarea', required: true },
  { name: 'category', label: 'Category (Optional)', type: 'text', placeholder: 'e.g., Infrastructure, Education' },
  { name: 'status', label: 'Current Status', type: 'text', required: true, placeholder: 'e.g., Pending, In Progress, Fulfilled' }, // TODO: Select
  { name: 'datePromised', label: 'Date Promised (Optional)', type: 'date' },
  { name: 'expectedFulfillmentDate', label: 'Expected Fulfillment Date (Optional)', type: 'date' },
  {
    name: 'evidenceLinks',
    label: 'Evidence Links',
    type: 'array',
    arrayItemSchema: { name: 'evidence', label: 'Evidence Link', type: 'object', objectSchema: promiseEvidenceLinkSchema } as FormFieldSchema,
  },
  // politicianId, partyId, sourceType etc. can be linked or have more complex UI later.
];

// --- Controversy Schema ---
export const involvedEntitySchema: FormFieldSchema[] = [
  { name: 'type', label: 'Type', type: 'text', required: true, placeholder: 'politician, party, or organization' },
  { name: 'id', label: 'Entity ID', type: 'text', required: true, placeholder: 'ID of the entity' },
  { name: 'name', label: 'Entity Name', type: 'text', required: true },
  { name: 'role', label: 'Role in Controversy (Optional)', type: 'text' },
];

export const controversySchema: FormFieldSchema[] = [
  { name: 'title', label: 'Controversy Title', type: 'text', required: true },
  { name: 'description', label: 'Description', type: 'textarea', required: true },
  {
    name: 'severityIndicator',
    label: 'Severity Indicator',
    type: 'text', // Ideally 'select' with options: 'Low', 'Medium', 'High', 'Critical'
    required: true,
    placeholder: 'Low, Medium, High, or Critical',
  },
  {
    name: 'status',
    label: 'Current Status',
    type: 'text', // Ideally 'select' with options from ControversyStatus
    required: true,
    placeholder: 'e.g., Alleged, Under Investigation',
  },
  { name: 'period', label: 'Period (e.g., Mid-2023 or YYYY-MM-DD)', type: 'text', placeholder: 'General timeframe of the controversy' },
  { name: 'dates.started', label: 'Date Started (Optional)', type: 'date'},
  { name: 'dates.ended', label: 'Date Ended (Optional)', type: 'date'},
  { name: 'tags', label: 'Tags (JSON Array)', type: 'textarea', placeholder: 'e.g., ["corruption", "ethics"]' },
  {
    name: 'involvedEntities',
    label: 'Involved Entities',
    type: 'array',
    arrayItemSchema: { name: 'entity', label: 'Involved Entity', type: 'object', objectSchema: involvedEntitySchema } as FormFieldSchema,
    required: false,
  },
  { name: 'summaryOutcome', label: 'Summary Outcome (Optional)', type: 'textarea', placeholder: 'Brief summary of the outcome if concluded.'},
  { name: 'dataAiHint', label: 'AI Hint for Image (Optional)', type: 'text', placeholder: 'Keywords for image generation' },
  // Complex arrays like updates, evidenceLinks, officialResponses, mediaCoverageLinks, legalProceedings
  // are typically managed via the detail page after creation, not usually in the "new entry" form.
  // If needed for suggestion, they'd be JSON textareas initially.
];


// --- Suggestion Schema ---
export type SuggestionStatus = 'PendingNewEntry' | 'PendingUpdate' | 'PendingEntityUpdate' | 'PendingFieldEdit' | 'Approved' | 'Rejected';
export type SuggestionType = 'NEW_ENTITY' | 'EDIT_ENTITY_FULL' | 'EDIT_ENTITY_FIELD';

export interface SuggestionBase {
  id: string; // Generated by the backend or data layer
  suggesterId?: string; // ID of the user who made the suggestion
  submittedAt: string; // ISO date string
  status: SuggestionStatus;
  reason: string; // General reason for NEW_ENTITY or single field edit
  reasonForChange?: string; // Specific reason for EDIT_ENTITY_FULL
  evidenceUrl?: string;
  adminNotes?: string; // Notes from admin reviewing the suggestion
}

export interface NewEntitySuggestion extends SuggestionBase {
  suggestionType: 'NEW_ENTITY';
  entityType: EntityType;
  suggestedData: Record<string, any>; // The full data for the new entity
}

export interface EntityFieldEditSuggestion extends SuggestionBase {
  suggestionType: 'EDIT_ENTITY_FIELD';
  entityType: EntityType;
  entityId: string;
  fieldPath: string;
  oldValue?: any;
  suggestedValue: any;
}

export interface FullEntityEditSuggestion extends SuggestionBase {
  suggestionType: 'EDIT_ENTITY_FULL';
  entityType: EntityType;
  entityId: string;
  suggestedData: Record<string, any>; // The complete proposed new state of the entity
  // 'reasonForChange' from SuggestionBase will be used here primarily.
}

export type Suggestion = NewEntitySuggestion | EntityFieldEditSuggestion | FullEntityEditSuggestion;

// --- Main Schemas Export ---

export const entitySchemas: Record<EntityType, FormFieldSchema[]> = {
  Politician: politicianSchema,
  Party: fullPartySchema,
  Bill: fullBillSchema,
  Committee: fullCommitteeSchema,
  Constituency: fullConstituencySchema, // Use the extended schema for Constituency
  Election: electionSchema,
  News: newsSchema, // Mapped from NewsArticleLink
  Promise: promiseSchema, // Mapped from PromiseItem
  Controversy: controversySchema, // Added Controversy schema
};

// Helper to get a specific schema
export const getEntitySchema = (entityType: EntityType): FormFieldSchema[] | undefined => {
  return entitySchemas[entityType];
};
