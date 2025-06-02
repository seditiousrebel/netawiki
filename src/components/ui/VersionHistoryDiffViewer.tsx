import React from 'react';
import type { EntityRevision, Politician, ContactInfo, Position, PoliticalJourneyEvent, PartyAffiliation, EducationEntry, AssetDeclaration, CriminalRecord, CommitteeMembership, PlaceOfBirth } from '@/types/gov';

// --- START OF TEMPORARY MOCK DATA ---

const basePoliticianSnapshot: Omit<Politician, 'id'> = {
  name: 'John Public',
  nepaliName: 'जोन पब्लिक',
  slug: 'john-public',
  gender: 'Male',
  dateOfBirth: '1975-03-20',
  placeOfBirth: {
    district: 'Lalitpur',
    address: 'Patan Durbar Square',
  } as PlaceOfBirth,
  partyId: 'party-alpha',
  partyName: 'Alpha Party',
  photoUrl: 'https://example.com/john_public.jpg',
  province: 'Bagmati',
  constituency: 'Lalitpur-3',
  constituencyId: 'const-ltp-3',
  isActiveInPolitics: true,
  education: [
    { institution: 'Tribhuvan University', degree: 'M.A. in Sociology', field: 'Sociology', graduationYear: '2002' },
  ] as EducationEntry[],
  criminalRecords: [] as CriminalRecord[],
  politicalIdeology: ['Local Development', 'Community Empowerment'] as string[],
  languagesSpoken: ['Nepali', 'Newari', 'English'] as string[],
  tags: ['local-development', 'lalitpur', 'cultural-heritage'],
  dataAiHint: 'A friendly male politician, John Public, in his late 40s.',
};

const mockRevision1: EntityRevision<Politician> = {
  id: 'revision-001-politician-jp',
  entityId: 'politician-jp-001',
  entityType: 'Politician',
  date: '2023-01-15T10:00:00Z',
  author: 'Admin User',
  event: 'Initial profile creation.',
  entitySnapshot: {
    ...basePoliticianSnapshot,
    id: 'politician-jp-001',
    bio: 'John Public has served the people of Lalitpur for many years. He is a strong advocate for local development and cultural preservation.',
    aliases: ['JP', "The People's Man"],
    positions: [
      { title: 'Ward Chairperson', startDate: '2010-05-01', endDate: '2015-04-30' },
      { title: 'Member of Provincial Assembly', startDate: '2017-12-10', endDate: '2022-11-01' },
    ] as Position[],
    contactInfo: {
      email: 'john.public.initial@example.com',
      phone: '+977-9811111111',
      officePhone: '+01-5500001',
      address: 'Provincial Assembly Office, Lalitpur',
      website: 'https://johnpublic-initial.np',
    } as ContactInfo,
    politicalJourney: [
      { date: '2005-01-10', event: 'Joined Alpha Party', description: 'Began official political affiliation.' },
      { date: '2010-05-01', event: 'Elected Ward Chairperson', description: 'First major electoral victory.' },
    ] as PoliticalJourneyEvent[],
    partyAffiliations: [
      { partyId: 'party-alpha', partyName: 'Alpha Party', role: 'District Committee Member', startDate: '2008-01-01', endDate: '2022-12-31' },
    ] as PartyAffiliation[],
    assetDeclarations: [
      { year: 2022, description: 'Apartment in Lalitpur, ancestral land in Kavre', value: 'NPR 15,000,000' },
    ] as AssetDeclaration[],
    committeeMemberships: [
      { committeeName: 'Provincial Committee on Local Governance', role: 'Member', startDate: '2018-02-01', endDate: '2022-11-01' },
    ] as CommitteeMembership[],
  },
};

const mockRevision2: EntityRevision<Politician> = {
  id: 'revision-002-politician-jp',
  entityId: 'politician-jp-001',
  entityType: 'Politician',
  date: '2023-08-20T14:30:00Z',
  author: 'System Update',
  event: 'Updated bio, added new position, and modified contact information.',
  entitySnapshot: {
    ...basePoliticianSnapshot,
    id: 'politician-jp-001',
    bio: 'John Public, a dedicated public servant, has represented Lalitpur with distinction for over a decade. His focus remains on sustainable local development, cultural heritage, and enhancing community participation in governance. He recently spearheaded a successful water management project.',
    aliases: ['JP', "The People's Man", 'Mr. Development'],
    positions: [
      { title: 'Member of Provincial Assembly', startDate: '2017-12-10', endDate: '2022-11-01' },
      { title: 'Provincial Minister for Infrastructure Development', startDate: '2023-02-01', endDate: 'Present' },
    ] as Position[],
    contactInfo: {
      ...mockRevision1.entitySnapshot.contactInfo,
      email: 'john.public.minister@example.com',
      website: 'https://johnpublicminister.np',
      linkedin: 'https://linkedin.com/in/johnpublicminister',
    } as ContactInfo,
    politicalJourney: [
      ...(mockRevision1.entitySnapshot.politicalJourney || []),
      { date: '2023-02-01', event: 'Appointed Provincial Minister for Infrastructure', description: 'Took oath for the new ministerial role.' },
    ] as PoliticalJourneyEvent[],
    partyAffiliations: [
      { partyId: 'party-alpha', partyName: 'Alpha Party', role: 'Senior Leader & Provincial Incharge', startDate: '2008-01-01', endDate: 'Present' },
    ] as PartyAffiliation[],
    assetDeclarations: [
      { year: 2022, description: 'Apartment in Lalitpur, ancestral land in Kavre', value: 'NPR 16,500,000 (Re-evaluated)' },
      { year: 2023, description: 'Investment in Local Cooperative', value: 'NPR 2,000,000' },
    ] as AssetDeclaration[],
    committeeMemberships: [
      { committeeName: 'Provincial Infrastructure Development Board', role: 'Chairperson (Ex-officio)', startDate: '2023-02-15', endDate: 'Present' },
    ] as CommitteeMembership[],
    // Added a new field not present in revision 1 for testing removal/addition highlighting
    awards: ['Community Service Award 2023'] 
  },
};
// --- END OF TEMPORARY MOCK DATA ---

interface VersionHistoryDiffViewerProps {
  revision1: EntityRevision<any>;
  revision2: EntityRevision<any>;
}

const getDisplayValue = (value: any): string => {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (value === null || value === undefined) return 'N/A';
  if (Array.isArray(value)) return `${value.length} items`;
  if (typeof value === 'object') return '{...}';
  return String(value);
};

const renderSnapshotDiffContent = (
  snapshot1: Record<string, any>,
  snapshot2: Record<string, any>,
  path: string = ''
): JSX.Element[] => {
  const allKeys = new Set([...Object.keys(snapshot1), ...Object.keys(snapshot2)]);
  const elements: JSX.Element[] = [];

  allKeys.forEach(key => {
    const val1 = snapshot1[key];
    const val2 = snapshot2[key];
    const currentPath = path ? `${path}.${key}` : key;

    let val1Display = getDisplayValue(val1);
    let val2Display = getDisplayValue(val2);
    let highlightClassVal1 = '';
    let highlightClassVal2 = '';

    if (JSON.stringify(val1) !== JSON.stringify(val2)) {
      if (val1 === undefined) { // Added in revision2
        highlightClassVal2 = 'bg-green-100 p-0.5 rounded';
        val1Display = 'N/A (Field Added)';
      } else if (val2 === undefined) { // Removed in revision2
        highlightClassVal1 = 'bg-red-100 p-0.5 rounded line-through';
        val2Display = 'N/A (Field Removed)';
      } else { // Modified
        highlightClassVal2 = 'bg-yellow-100 p-0.5 rounded';
      }
    }

    if (typeof val1 === 'object' && val1 !== null && !Array.isArray(val1) || 
        typeof val2 === 'object' && val2 !== null && !Array.isArray(val2)) {
      elements.push(
        <div key={currentPath} className="mb-2 col-span-3">
          <strong className="text-sm font-semibold capitalize">{key}:</strong>
          <div className="ml-4 pl-4 border-l border-gray-300 grid grid-cols-3 gap-2">
            {/* Header for nested object columns - conceptual, actual fields will align below */}
            <div className="col-span-1"></div> {/* Placeholder for key name column within nested */}
            <div className="col-span-1 font-xs text-gray-500 italic">Revision 1</div>
            <div className="col-span-1 font-xs text-gray-500 italic">Revision 2</div>
            {renderSnapshotDiffContent(val1 || {}, val2 || {}, currentPath)}
          </div>
        </div>
      );
    } else if (Array.isArray(val1) || Array.isArray(val2)) {
      const arr1 = Array.isArray(val1) ? val1 : [];
      const arr2 = Array.isArray(val2) ? val2 : [];
      const maxLen = Math.max(arr1.length, arr2.length);
      const arrayDiffElements: JSX.Element[] = [];

      for (let i = 0; i < maxLen; i++) {
        const item1 = arr1[i];
        const item2 = arr2[i];
        let itemHighlight = '';
        if (JSON.stringify(item1) !== JSON.stringify(item2)) {
          itemHighlight = 'bg-yellow-50'; // Light yellow for changed array items
        }
        if (item1 !== undefined || item2 !== undefined) {
          arrayDiffElements.push(
            <div key={`${currentPath}[${i}]`} className={`flex justify-between text-xs py-0.5 ${itemHighlight}`}>
              <div className="w-1/2 pr-1 break-all">{item1 !== undefined ? (typeof item1 === 'object' ? JSON.stringify(item1) : getDisplayValue(item1)) : 'N/A'}</div>
              <div className="w-1/2 pl-1 break-all">{item2 !== undefined ? (typeof item2 === 'object' ? JSON.stringify(item2) : getDisplayValue(item2)) : 'N/A'}</div>
            </div>
          );
        }
      }
       elements.push(
        <React.Fragment key={currentPath}>
          <div className="font-semibold capitalize col-span-1 py-1">{key} (Array):</div>
          <div className={`col-span-2 p-1 border rounded-md ${highlightClassVal2 || highlightClassVal1}`}>
             {arrayDiffElements.length > 0 ? arrayDiffElements : <span className="text-gray-400 text-xs">No items or no changes.</span>}
          </div>
        </React.Fragment>
      );
    } else {
      elements.push(
        <React.Fragment key={currentPath}>
          <div className="font-semibold capitalize col-span-1 py-0.5">{key}:</div>
          <div className={`col-span-1 py-0.5 ${highlightClassVal1}`}>{val1Display}</div>
          <div className={`col-span-1 py-0.5 ${highlightClassVal2}`}>{val2Display}</div>
        </React.Fragment>
      );
    }
  });
  return elements;
};

const RevisionMetadataCard: React.FC<{ revision: EntityRevision<any> }> = ({ revision }) => (
  <div className="mb-4 p-3 border rounded-md bg-gray-50 shadow-sm">
    <h3 className="text-md font-semibold text-gray-700">
      Revision ID: <span className="font-normal text-gray-600">{revision.id}</span>
    </h3>
    <p className="text-xs text-gray-500">
      Date: <span className="font-medium text-gray-600">{new Date(revision.date).toLocaleString()}</span>
    </p>
    <p className="text-xs text-gray-500">
      Author: <span className="font-medium text-gray-600">{revision.author}</span>
    </p>
    <p className="text-xs text-gray-500">
      Event: <span className="font-medium text-gray-600">{revision.event}</span>
    </p>
  </div>
);

const VersionHistoryDiffViewer: React.FC<VersionHistoryDiffViewerProps> = ({ revision1, revision2 }) => {
  if (!revision1 || !revision2) {
    return <div className="p-4 text-red-500">Error: Both revisions must be provided.</div>;
  }

  return (
    <div className="p-4 bg-white text-xs">
      <div className="flex space-x-6">
        <div className="w-1/2">
          <RevisionMetadataCard revision={revision1} />
        </div>
        <div className="w-1/2">
          <RevisionMetadataCard revision={revision2} />
        </div>
      </div>

      <div className="mt-4 p-3 border rounded-lg shadow-sm">
        <div className="grid grid-cols-3 gap-2 mb-2 pb-1 border-b">
          <div className="font-bold text-gray-600">Field</div>
          <div className="font-bold text-gray-600">Revision 1 ({new Date(revision1.date).toLocaleDateString()})</div>
          <div className="font-bold text-blue-600">Revision 2 ({new Date(revision2.date).toLocaleDateString()})</div>
        </div>
        {renderSnapshotDiffContent(revision1.entitySnapshot, revision2.entitySnapshot)}
      </div>
    </div>
  );
};

// Example Usage (can be removed or kept for testing)
export const ExampleVersionHistoryViewer: React.FC = () => (
  <div className="p-8 bg-gray-100 min-h-screen">
    <h1 className="text-2xl font-bold mb-6 text-center">Politician Version History Comparison</h1>
    <VersionHistoryDiffViewer revision1={mockRevision1} revision2={mockRevision2} />
  </div>
);

export default VersionHistoryDiffViewer;
</code_block>
