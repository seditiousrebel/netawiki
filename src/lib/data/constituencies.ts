
import type { Constituency, ConstituencyType } from '@/types/gov';
import { mockPoliticians } from './politicians';

const getRepresentativeName = (id: string): string | undefined => mockPoliticians.find(p => p.id === id)?.name;

export const mockConstituencies: Constituency[] = [
  {
    id: 'const-fed-ktm-1',
    slug: 'kathmandu-1-federal',
    name: 'Kathmandu Constituency 1',
    code: 'KTM-1',
    type: 'Federal' as ConstituencyType,
    district: 'Kathmandu',
    province: 'Bagmati Province',
    currentRepresentativeIds: ['p1'], // Assuming Alice Democratia represents this (example)
    currentRepresentativeNames: [getRepresentativeName('p1') || 'N/A'],
    population: 250000,
    registeredVoters: 180000,
    areaSqKm: 15.5,
    keyDemographics: {
      literacyRate: 85.5,
      ethnicGroups: [{ name: 'Newar', percentage: 40 }, { name: 'Brahmin/Chhetri', percentage: 35 }, { name: 'Other', percentage: 25 }]
    },
    historicalElectionResults: [
      { electionId: 'gen2024', electionName: 'General Election 2024 (Placeholder)', winnerPoliticianId: 'p1', winnerPoliticianName: getRepresentativeName('p1'), winningPartyId: 'party1', winningPartyName: 'Blue Unity Party' }
    ],
    developmentProjects: [
      { id: 'proj-ktm1-road', name: 'Ring Road Expansion (KTM-1 Section)', status: 'Ongoing', budget: 'NPR 500M', expectedCompletion: '2025-12-31' }
    ],
    localIssues: [
      { id: 'issue-ktm1-traffic', title: 'Traffic Congestion in Core Areas', dateReported: '2023-01-10', status: 'Open' }
    ],
    dataAiHint: 'city map Kathmandu',
    tags: ['urban', 'capital-city', 'federal'],
  },
  {
    id: 'const-prov-bag-ktm-pa-1a',
    slug: 'bagmati-ktm-provincial-area-1a',
    name: 'Bagmati KTM Provincial Area 1A',
    code: 'BAG-PA-1A',
    type: 'Provincial' as ConstituencyType,
    district: 'Kathmandu',
    province: 'Bagmati Province',
    currentRepresentativeIds: ['p2'], // Assuming Bob R. (for example purpose)
    currentRepresentativeNames: [getRepresentativeName('p2') || 'N/A'],
    population: 120000,
    registeredVoters: 85000,
    areaSqKm: 10.2,
    dataAiHint: 'urban sprawl cityscape',
    tags: ['provincial', 'urban'],
  },
  {
    id: 'const-fed-np-5',
    slug: 'northern-province-federal-5',
    name: 'Northern Province Federal Constituency 5',
    code: 'NP-FED-5',
    type: 'Federal' as ConstituencyType,
    district: 'Northland County',
    province: 'Northern Province',
    currentRepresentativeIds: ['p2'],
    currentRepresentativeNames: [getRepresentativeName('p2') || 'N/A'],
    population: 180000,
    registeredVoters: 130000,
    areaSqKm: 500.7,
    keyDemographics: {
      literacyRate: 65.2,
    },
    dataAiHint: 'mountain valley rural',
    tags: ['rural', 'mountainous', 'federal'],
  },
  {
    id: 'const-local-cc-downtown',
    slug: 'capital-city-downtown-local',
    name: 'Capital City Downtown Ward 5',
    code: 'CC-LOCAL-W5',
    type: 'Local' as ConstituencyType, // Assuming local wards are also constituencies
    district: 'Capital District',
    province: 'Capital Province',
    currentRepresentativeIds: ['p3'], // Carol Independenta
    currentRepresentativeNames: [getRepresentativeName('p3') || 'N/A'],
    population: 30000,
    registeredVoters: 22000,
    dataAiHint: 'downtown street market',
    tags: ['local-ward', 'urban-core'],
  },
  {
    id: 'const-state-senate-capital', // Conceptual for Alice
    slug: 'capital-province-senate',
    name: 'Capital Province Senate District',
    type: 'Provincial' as ConstituencyType, // Or could be 'Federal' depending on structure
    district: 'Statewide', // Not tied to a specific district
    province: 'Capital Province',
    currentRepresentativeIds: ['p1'],
    currentRepresentativeNames: [getRepresentativeName('p1') || 'N/A'],
    tags: ['provincial-senate', 'statewide'],
    dataAiHint: 'government building capital',
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

    