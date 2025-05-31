
import type { Constituency, ConstituencyType, KeyDemographics, HistoricalElectionResult, DevelopmentProject, LocalIssue } from '@/types/gov';
import { mockPoliticians } from './politicians';

const getRepresentativeName = (id: string): string | undefined => mockPoliticians.find(p => p.id === id)?.name;

const kathmandu1Demographics: KeyDemographics = {
  literacyRate: 85.5,
  ethnicGroups: [{ name: 'Newar', percentage: 40 }, { name: 'Brahmin/Chhetri', percentage: 35 }, { name: 'Other', percentage: 25 }]
};

const kathmandu1HistoricalResults: HistoricalElectionResult[] = [
  { electionId: 'gen2024', electionName: 'General Election 2024 (Placeholder)', winnerPoliticianId: 'p1', winnerPoliticianName: getRepresentativeName('p1'), winningPartyId: 'party1', winningPartyName: 'Blue Unity Party' },
  { electionId: 'gen2019', electionName: 'General Election 2019 (Placeholder)', winnerPoliticianId: 'p-prev1', winnerPoliticianName: 'Previous Rep A', winningPartyId: 'party2', winningPartyName: 'Red Alliance Group' }
];

const kathmandu1Projects: DevelopmentProject[] = [
  { id: 'proj-ktm1-road', name: 'Ring Road Expansion (KTM-1 Section)', status: 'Ongoing', budget: 'NPR 500M', expectedCompletion: '2025-12-31', description: 'Widening and upgrading the existing Ring Road segment within the constituency to ease traffic flow.', implementingAgency: 'Department of Roads' },
  { id: 'proj-ktm1-water', name: 'New Water Supply Network', status: 'Planned', budget: 'NPR 300M', expectedCompletion: '2026-06-30', description: 'Installation of new pipelines to improve drinking water access.', sourceOfFunding: 'National Urban Development Fund'}
];

const kathmandu1Issues: LocalIssue[] = [
  { id: 'issue-ktm1-traffic', title: 'Traffic Congestion in Core Areas', dateReported: '2023-01-10', status: 'Open', description: 'Severe traffic jams during peak hours in areas like New Road and Ason.', severity: 'High' },
  { id: 'issue-ktm1-waste', title: 'Waste Management Challenges', dateReported: '2023-05-20', status: 'Monitoring', description: 'Irregular garbage collection and lack of proper disposal sites in some neighborhoods.', severity: 'Medium', resolutionDetails: 'New collection schedule implemented, monitoring effectiveness.' }
];

export const mockConstituencies: Constituency[] = [
  {
    id: 'const-fed-ktm-1',
    slug: 'kathmandu-1-federal',
    name: 'Kathmandu Constituency 1',
    code: 'KTM-1',
    type: 'Federal' as ConstituencyType,
    district: 'Kathmandu',
    province: 'Bagmati Province',
    currentRepresentativeIds: ['p1'],
    currentRepresentativeNames: [getRepresentativeName('p1') || 'N/A'],
    population: 250000,
    registeredVoters: 180000,
    areaSqKm: 15.5,
    keyDemographics: kathmandu1Demographics,
    historicalElectionResults: kathmandu1HistoricalResults,
    developmentProjects: kathmandu1Projects,
    localIssues: kathmandu1Issues,
    dataAiHint: 'city map Kathmandu',
    tags: ['urban', 'capital-city', 'federal', 'high-density'],
    revisionHistory: [
      {
        id: 'rev-constituency-001',
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
        author: 'EditorBob',
        event: 'Constituency Boundary Updated',
        details: 'Minor adjustments to boundary map based on new survey data from the Department of Survey.',
        suggestionId: 'sugg_const_boundary_xyz'
      },
      {
        id: 'rev-constituency-002',
        date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
        author: 'System',
        event: 'Constituency Record Created',
        details: 'Initial record for Kathmandu Constituency 1 created.',
      }
    ]
  },
  {
    id: 'const-prov-bag-ktm-pa-1a',
    slug: 'bagmati-ktm-provincial-area-1a',
    name: 'Bagmati KTM Provincial Area 1A',
    code: 'BAG-PA-1A',
    type: 'Provincial' as ConstituencyType,
    district: 'Kathmandu',
    province: 'Bagmati Province',
    currentRepresentativeIds: ['p2'],
    currentRepresentativeNames: [getRepresentativeName('p2') || 'N/A'],
    population: 120000,
    registeredVoters: 85000,
    areaSqKm: 10.2,
    keyDemographics: { literacyRate: 82.1 },
    developmentProjects: [
      { id: 'proj-bag1a-school', name: 'Community School Renovation', status: 'Completed', budget: 'NPR 50M', actualCompletionDate: '2023-12-01' }
    ],
    localIssues: [
      { id: 'issue-bag1a-drainage', title: 'Monsoon Drainage Problems', status: 'Addressed', severity: 'Medium', dateReported: '2022-06-01', resolutionDetails: 'Drainage system upgraded.'}
    ],
    dataAiHint: 'urban sprawl cityscape',
    tags: ['provincial', 'urban', 'suburban'],
  },
  {
    id: 'const-fed-np-5',
    slug: 'northern-province-federal-5',
    name: 'Northern Province Federal Constituency 5',
    code: 'NP-FED-5',
    type: 'Federal' as ConstituencyType,
    district: 'Northland County',
    province: 'Northern Province',
    currentRepresentativeIds: ['p2'], // Bob Republicanus is already listed in KTM-1A, this is for example diversity
    currentRepresentativeNames: [getRepresentativeName('p2') || 'N/A'],
    population: 180000,
    registeredVoters: 130000,
    areaSqKm: 500.7,
    keyDemographics: {
      literacyRate: 65.2,
      ethnicGroups: [{ name: 'Highlander Group A', percentage: 60}, { name: 'Valley Group B', percentage: 25}]
    },
    developmentProjects: [
      { id: 'proj-np5-road', name: 'Rural Road Connectivity Program', status: 'Ongoing', budget: 'NPR 200M'}
    ],
    localIssues: [
      { id: 'issue-np5-healthcare', title: 'Lack of Access to Advanced Healthcare', status: 'Open', severity: 'High'}
    ],
    dataAiHint: 'mountain valley rural',
    tags: ['rural', 'mountainous', 'federal', 'agriculture'],
  },
  {
    id: 'const-local-cc-downtown',
    slug: 'capital-city-downtown-local',
    name: 'Capital City Downtown Ward 5',
    code: 'CC-LOCAL-W5',
    type: 'Local' as ConstituencyType,
    district: 'Capital District',
    province: 'Capital Province',
    currentRepresentativeIds: ['p3'],
    currentRepresentativeNames: [getRepresentativeName('p3') || 'N/A'],
    population: 30000,
    registeredVoters: 22000,
    areaSqKm: 2.5,
    keyDemographics: { literacyRate: 90.0 },
    historicalElectionResults: [
      { electionId: 'local2022', electionName: 'Local Ward Election 2022', winnerPoliticianId: 'p3', winnerPoliticianName: getRepresentativeName('p3')}
    ],
    dataAiHint: 'downtown street market',
    tags: ['local-ward', 'urban-core', 'business-hub'],
  },
  {
    id: 'const-state-senate-capital',
    slug: 'capital-province-senate',
    name: 'Capital Province Senate District',
    type: 'Provincial' as ConstituencyType,
    district: 'Statewide',
    province: 'Capital Province',
    currentRepresentativeIds: ['p1'], // Alice Democratia is already in KTM-1, this shows broader representation
    currentRepresentativeNames: [getRepresentativeName('p1') || 'N/A'],
    population: 2500000, // Larger population for a senate district
    registeredVoters: 1800000,
    dataAiHint: 'government building capital',
    tags: ['provincial-senate', 'statewide', 'legislative-district'],
  }
];

export function getAllConstituencies(): Constituency[] {
  return mockConstituencies;
}

export function getConstituencyById(id: string): Constituency | undefined {
  return mockConstituencies.find(c => c.id === id || c.slug === id);
}

export function getConstituencyByCode(code: string): Constituency | undefined {
  return mockConstituencies.find(c => c.code === code);
}

export function getConstituenciesByProvince(province: string): Constituency[] {
  return mockConstituencies.filter(c => c.province === province);
}

export function getConstituenciesByDistrict(district: string): Constituency[] {
  return mockConstituencies.filter(c => c.district === district);
}

    