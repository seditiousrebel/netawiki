import React from 'react';
import type { Politician, ContactInfo, PoliticalJourneyEvent, PartyAffiliation, Position, CommitteeMembership, EducationEntry, AssetDeclaration, CriminalRecord, PlaceOfBirth } from '@/types/gov';
import type { FullEntityEditSuggestion, EntityFieldEditSuggestion } from '@/lib/schemas'; // Assuming schemas.ts is the source

// --- START OF TEMPORARY MOCK DATA (due to issues with src/lib/mock-data.ts) ---

const mockCurrentPolitician: Politician = {
  id: 'politician-001',
  name: 'Jane Doe',
  nepaliName: 'जेन डो',
  slug: 'jane-doe',
  gender: 'Female',
  dateOfBirth: '1975-03-15',
  placeOfBirth: {
    district: 'Kathmandu',
    address: 'Old Baneshwor',
  } as PlaceOfBirth,
  partyId: 'party-002',
  partyName: 'Progressive People Party',
  photoUrl: 'https://example.com/jane-doe-old.jpg',
  bio: 'Jane Doe has been a prominent figure in national politics for over two decades, known for her advocacy in social justice and environmental protection. She started her career as a local activist and quickly rose through the ranks of her party.',
  province: 'Bagmati',
  constituency: 'Kathmandu-1',
  constituencyId: 'const-ktm-1',
  isActiveInPolitics: true,
  aliases: ['JD', "The People's Voice"],
  positions: [
    { title: 'Member of Parliament', startDate: '2010-05-01', endDate: '2015-05-01' },
    { title: 'Minister of Environment', startDate: '2016-01-10', endDate: '2018-12-20' },
  ] as Position[],
  contactInfo: {
    email: 'jane.doe.initial@example.com',
    phone: '+977-9800000001',
    officePhone: '+01-4000001',
    address: 'MP Quarter, Kathmandu',
    permanentAddress: 'Family Home, Pokhara',
    website: 'http://janedoeofficial.np',
    twitter: '@janedoe_np',
    facebook: 'facebook.com/janedoeofficial',
  } as ContactInfo,
  politicalJourney: [
    { date: '2000-01-15', event: 'Joined Progressive People Party', description: 'Became an active member of the youth wing.' },
    { date: '2008-06-01', event: 'Elected as Local Ward Representative', description: 'Served for two years focusing on community projects.' },
  ] as PoliticalJourneyEvent[],
  partyAffiliations: [
    { partyId: 'party-002', partyName: 'Progressive People Party', role: 'Senior Leader', startDate: '2000-01-15', endDate: 'Present' },
  ] as PartyAffiliation[],
  education: [
    { institution: 'National University', degree: 'Masters in Political Science', field: 'Political Science', graduationYear: '1998' },
  ] as EducationEntry[],
  assetDeclarations: [
    { year: 2022, description: 'House in Kathmandu, Land in Chitwan', value: 'NPR 50,000,000' },
  ] as AssetDeclaration[],
  criminalRecords: [] as CriminalRecord[],
  committeeMemberships: [
    { committeeName: 'Parliamentary Committee on Social Justice', role: 'Member', startDate: '2010-06-01', endDate: '2015-04-01' },
  ] as CommitteeMembership[],
  politicalIdeology: ['Social Democracy', 'Environmentalism'] as string[],
  languagesSpoken: ['Nepali', 'English', 'Maithili'] as string[],
  tags: ['social-justice', 'environment', 'women-rights'],
  dataAiHint: 'Experienced female politician, serious demeanor, traditional attire',
};

const mockPendingEditPolitician: FullEntityEditSuggestion = {
  id: 'suggestion-001',
  suggesterId: 'user-002',
  submittedAt: '2024-07-28T10:00:00Z',
  status: 'PendingEntityUpdate',
  reasonForChange: 'Updating profile with recent activities, new contact information, and expanded roles.',
  evidenceUrl: 'https://example.com/news-article-jane-doe-new-role.html',
  entityType: 'Politician',
  entityId: 'politician-001',
  suggestedData: {
    // id: 'politician-001', // ID should not change in an update typically
    name: 'Jane M. Doe (Updated)',
    nepaliName: 'जेन एम. डो (अद्यावधिक)',
    slug: 'jane-m-doe',
    gender: 'Female',
    dateOfBirth: '1975-03-15',
    placeOfBirth: {
        district: 'Kathmandu',
        address: 'Old Baneshwor',
    },
    partyId: 'party-002',
    partyName: 'Progressive People Party',
    photoUrl: 'https://example.com/jane-doe-new.jpg', // Changed
    bio: 'Jane Doe has been a prominent figure in national politics for over two decades, known for her advocacy in social justice and environmental protection. She started her career as a local activist and quickly rose through the ranks of her party. Recently, she has taken on an advisory role for international environmental policy and launched a new youth empowerment initiative.', // Changed
    province: 'Bagmati',
    constituency: 'Kathmandu-1',
    constituencyId: 'const-ktm-1',
    isActiveInPolitics: true,
    aliases: ['JD', "The People's Voice", 'Eco-Warrior Jane'], // Changed: Added one
    positions: [ // Changed: One existing kept, one new added, one old implicitly removed
      { title: 'Minister of Environment', startDate: '2016-01-10', endDate: '2018-12-20' },
      { title: 'Advisor, International Environmental Policy', startDate: '2024-07-01', endDate: 'Present' },
    ],
    contactInfo: { // Changed: email, website updated, LinkedIn and Instagram added
      email: 'jane.doe.updated@example.com',
      phone: '+977-9800000001',
      officePhone: '+01-4000001',
      address: 'MP Quarter, Kathmandu',
      permanentAddress: 'Family Home, Pokhara',
      website: 'https://janemdoe.np',
      twitter: '@janedoe_np', // Assuming this remained same
      facebook: 'facebook.com/janedoeofficial', // Assuming this remained same
      linkedin: 'linkedin.com/in/janemdoe',
      instagram: '@janemdoe_official_np',
    },
    politicalJourney: [ // Changed: Added one
      { date: '2000-01-15', event: 'Joined Progressive People Party', description: 'Became an active member of the youth wing.' },
      { date: '2008-06-01', event: 'Elected as Local Ward Representative', description: 'Served for two years focusing on community projects.' },
      { date: '2024-06-15', event: 'Launched Youth Empowerment Initiative', description: 'A national program to engage youth in political processes.' },
    ],
    partyAffiliations: [ // Changed: Role updated
        { partyId: 'party-002', partyName: 'Progressive People Party', role: 'Chief Advisor', startDate: '2000-01-15', endDate: 'Present' },
    ],
    education: [
        { institution: 'National University', degree: 'Masters in Political Science', field: 'Political Science', graduationYear: '1998' },
    ],
    assetDeclarations: [ // Changed: Value updated, new item added
        { year: 2022, description: 'House in Kathmandu, Land in Chitwan', value: 'NPR 55,000,000 (Re-evaluated)' },
        { year: 2023, description: 'Shares in Green Energy Co.', value: 'NPR 5,000,000' },
    ],
    criminalRecords: [],
    committeeMemberships: [ // Changed: Old one removed, new one added
        { committeeName: 'Advisory Board, Global Green Policy Institute', role: 'Honorary Member', startDate: '2024-07-10', endDate: 'Present'},
    ],
    politicalIdeology: ['Social Democracy', 'Environmentalism', 'Youth Empowerment'], // Changed: Added one
    tags: ['social-justice', 'environment', 'women-rights', 'youth-engagement', 'foreign-policy'], // Changed: Added two
    dataAiHint: 'Experienced female politician, vibrant, speaking at a podium with youth audience', // Changed
  } as Partial<Politician>, // Using Partial because not all fields of Politician might be in suggestedData for every edit type
};

// --- END OF TEMPORARY MOCK DATA ---

interface SideBySideDiffViewerProps {
  currentEntity: Record<string, any>;
  pendingEdit: FullEntityEditSuggestion | EntityFieldEditSuggestion;
}

const getDisplayValue = (value: any): string => {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (value === null || value === undefined) return 'N/A';
  if (Array.isArray(value)) return `${value.length} items`; // Simple array display for now
  if (typeof value === 'object') return '{...}'; // Simple object display
  return String(value);
};

const renderDiffContent = (current: Record<string, any>, suggested: Record<string, any>, path: string = '') => {
  const allKeys = new Set([...Object.keys(current), ...Object.keys(suggested)]);
  const elements: JSX.Element[] = [];

  allKeys.forEach(key => {
    const currentVal = current[key];
    const suggestedVal = suggested[key];
    const currentPath = path ? `${path}.${key}` : key;

    let highlightClass = '';
    let suggestedDisplay = getDisplayValue(suggestedVal);
    let currentDisplay = getDisplayValue(currentVal);

    if (JSON.stringify(currentVal) !== JSON.stringify(suggestedVal)) {
      highlightClass = 'bg-green-100'; // Highlight changes/additions in green
    }

    if (typeof currentVal === 'object' && currentVal !== null && typeof suggestedVal === 'object' && suggestedVal !== null && !Array.isArray(currentVal) && !Array.isArray(suggestedVal)) {
      elements.push(
        <div key={currentPath} className="mb-2">
          <strong className="text-sm font-semibold capitalize">{key}:</strong>
          <div className="ml-4 pl-4 border-l border-gray-300">
            {renderDiffContent(currentVal, suggestedVal, currentPath)}
          </div>
        </div>
      );
    } else if (Array.isArray(currentVal) || Array.isArray(suggestedVal)) {
      // Basic array diffing: show items that changed, added, or removed
      const currentArray = Array.isArray(currentVal) ? currentVal : [];
      const suggestedArray = Array.isArray(suggestedVal) ? suggestedVal : [];
      const maxLen = Math.max(currentArray.length, suggestedArray.length);
      const arrayDiffElements: JSX.Element[] = [];

      for (let i = 0; i < maxLen; i++) {
        const itemCurrent = currentArray[i];
        const itemSuggested = suggestedArray[i];
        let itemHighlight = '';
        if (JSON.stringify(itemCurrent) !== JSON.stringify(itemSuggested)) {
          itemHighlight = 'bg-yellow-100 p-1'; // Highlight individual array item changes
        }
        if (itemCurrent !== undefined || itemSuggested !== undefined) {
          arrayDiffElements.push(
            <div key={`${currentPath}[${i}]`} className={`flex justify-between ${itemHighlight}`}>
              <div className="w-1/2 pr-1">{itemCurrent !== undefined ? (typeof itemCurrent === 'object' ? JSON.stringify(itemCurrent, null, 2) : getDisplayValue(itemCurrent)) : 'N/A (Removed)'}</div>
              <div className="w-1/2 pl-1">{itemSuggested !== undefined ? (typeof itemSuggested === 'object' ? JSON.stringify(itemSuggested, null, 2) : getDisplayValue(itemSuggested)) : 'N/A (Removed)'}</div>
            </div>
          );
        }
      }
       elements.push(
        <div key={currentPath} className="mb-2">
          <strong className="text-sm font-semibold capitalize">{key} (Array):</strong>
          <div className={`ml-4 p-2 border rounded-md ${highlightClass}`}>
            {arrayDiffElements.length > 0 ? arrayDiffElements : <span className="text-gray-500">No changes or empty array.</span>}
          </div>
        </div>
      );


    } else {
      elements.push(
        <div key={currentPath} className="grid grid-cols-3 gap-2 mb-1 text-xs">
          <div className="font-semibold capitalize col-span-1">{key}:</div>
          <div className="col-span-1">{currentDisplay}</div>
          <div className={`col-span-1 ${highlightClass} p-0.5 rounded`}>{suggestedDisplay}</div>
        </div>
      );
    }
  });

  return <>{elements}</>;
};


const SideBySideDiffViewer: React.FC<SideBySideDiffViewerProps> = ({ currentEntity, pendingEdit }) => {
  const suggestedData = pendingEdit.suggestionType === 'EDIT_ENTITY_FIELD' 
    ? { [pendingEdit.fieldPath]: pendingEdit.suggestedValue } 
    : pendingEdit.suggestedData || {};
  
  const currentDataForDiff = pendingEdit.suggestionType === 'EDIT_ENTITY_FIELD'
    ? { [pendingEdit.fieldPath]: pendingEdit.oldValue }
    : currentEntity;


  return (
    <div className="flex space-x-4 p-4 border rounded-lg shadow-sm bg-white">
      <div className="w-1/2">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">Current Entity</h2>
        {/* This panel will show the relevant parts of currentEntity. For simplicity, 
            renderDiffContent will handle showing current vs suggested side-by-side internally per field.
            So, we call renderDiffContent once and it produces the two-column feel at the field level.
            The left panel header is conceptual; the actual rendering logic produces both columns.
         */}
      </div>
      <div className="w-1/2">
        <h2 className="text-lg font-semibold mb-3 text-blue-700">Suggested Changes</h2>
      </div>
      {/* The renderDiffContent function actually renders both columns for each field */}
    </div>
    // The actual rendering of side-by-side fields happens within renderDiffContent for each key.
    // The top-level div structure is a bit misleading if renderDiffContent handles both sides.
    // Let's adjust to have renderDiffContent render its output directly.
  );
};

// Corrected main component structure for clarity:
const SideBySideDiffViewerCorrected: React.FC<SideBySideDiffViewerProps> = ({ currentEntity, pendingEdit }) => {
  const suggestedChanges = pendingEdit.suggestionType === 'EDIT_ENTITY_FIELD'
    ? { [pendingEdit.fieldPath]: pendingEdit.suggestedValue }
    : pendingEdit.suggestedData || {};

  // If it's a field edit, we only want to diff that specific field against its old value.
  // Otherwise, we diff the full currentEntity against the full suggestedData.
  const currentDataForDiff = pendingEdit.suggestionType === 'EDIT_ENTITY_FIELD'
    ? { [pendingEdit.fieldPath]: (pendingEdit as EntityFieldEditSuggestion).oldValue }
    : currentEntity;
  
  const dataToDiffAgainst = pendingEdit.suggestionType === 'EDIT_ENTITY_FIELD'
    ? { [pendingEdit.fieldPath]: (pendingEdit as EntityFieldEditSuggestion).suggestedValue }
    : suggestedChanges;


  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white text-sm">
      <div className="grid grid-cols-3 gap-2 mb-2 pb-1 border-b">
        <div className="font-bold text-gray-600">Field</div>
        <div className="font-bold text-gray-600">Current Value</div>
        <div className="font-bold text-blue-600">Suggested Value</div>
      </div>
      {renderDiffContent(currentDataForDiff, dataToDiffAgainst)}
    </div>
  );
};


// Example Usage (can be removed or kept for testing)
export const ExampleDiffViewer: React.FC = () => (
  <div className="p-8 bg-gray-50 min-h-screen">
    <h1 className="text-2xl font-bold mb-6">Politician Profile Edit Suggestion</h1>
    <SideBySideDiffViewerCorrected currentEntity={mockCurrentPolitician} pendingEdit={mockPendingEditPolitician} />
  </div>
);

// Default export the corrected component
export default SideBySideDiffViewerCorrected;
// export { SideBySideDiffViewerCorrected as SideBySideDiffViewer }; // Alternative export

// Type guard for checking FullEntityEditSuggestion
// function isFullEntityEdit(edit: FullEntityEditSuggestion | EntityFieldEditSuggestion): edit is FullEntityEditSuggestion {
//   return edit.suggestionType === 'EDIT_ENTITY_FULL';
// }
// Type guard for checking EntityFieldEditSuggestion
// function isFieldEdit(edit: FullEntityEditSuggestion | EntityFieldEditSuggestion): edit is EntityFieldEditSuggestion {
//  return edit.suggestionType === 'EDIT_ENTITY_FIELD';
// }

// Note: The `suggestedData` in `mockPendingEditPolitician` is defined as `Partial<Politician>`.
// For a `FullEntityEditSuggestion`, it should ideally be the complete entity.
// The diffing logic should handle cases where keys might be missing if the types allow.
// The current mock for `FullEntityEditSuggestion` has most fields, which is good for testing.
// The type for `suggestedData` in `FullEntityEditSuggestion` is `Record<string, any>`,
// so it can indeed be partial if that's how edits are structured. For this component,
// it's better if `suggestedData` in `FullEntityEditSuggestion` contains the full new state.
// The mock has been updated to reflect this more closely.
// The `Partial<Politician>` cast on `mockPendingEditPolitician.suggestedData` was for initial mock setup;
// the actual `FullEntityEditSuggestion` type uses `Record<string, any>`.
// The mock data for `suggestedData` in `mockPendingEditPolitician` should represent the complete state of the entity after changes.
// I have updated the mock data to be more complete for `suggestedData`.
// Also, removed the `id` from `mockPendingEditPolitician.suggestedData` as it's usually not part of the "data to change".
// The `slug` and other identifiers would be part of `suggestedData` if they are changeable.
// The `currentEntity` and `suggestedData` should align in structure for the diff to work well.
// Added type assertions (e.g., `as Position[]`) to mock data for stricter typing.
// Simplified array diffing logic to show current and suggested side-by-side rather than complex patch calculations.
// Object diffing is recursive.
// Adjusted mock `suggestedData` to be a more complete representation for `FullEntityEditSuggestion`.
// Corrected `status: 'PendingUpdate'` to `'PendingEntityUpdate'` in mock.
// Corrected initial `SideBySideDiffViewer` structure to `SideBySideDiffViewerCorrected` which makes more sense.
