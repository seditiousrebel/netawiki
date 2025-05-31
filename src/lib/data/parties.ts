
import type { Party } from '@/types/gov';

export const mockParties: Party[] = [
  {
    id: 'party1',
    name: 'Blue Unity Party',
    nepaliName: 'निलो एकता पार्टी',
    abbreviation: 'BUP',
    slug: 'blue-unity-party',
    leadership: [
      { name: 'Eleanor Vanguard', role: 'Party Chair', politicianId: 'p3' }, // Assuming Eleanor is a placeholder for a politician
      { name: 'John Smith', role: 'General Secretary' }
    ],
    contactInfo: { 
      website: 'https://blueunity.example.com',
      email: 'info@blueunity.example.com',
      phone: '555-0011'
    },
    headquartersAddress: '1 Unity Plaza, Capital City, CP 10001',
    logoUrl: 'https://placehold.co/200x200.png',
    flagUrl: 'https://placehold.co/150x100.png?text=BUP+Flag',
    dataAiHint: 'party logo blue',
    electionSymbolUrl: 'https://placehold.co/100x100.png?text=Symbol1',
    partyColorHex: '#3072BA', // Patriotic Blue
    history: 'Founded in 1990 with a focus on social justice and environmental protection. (Short history for list views)',
    aboutParty: 'The Blue Unity Party (BUP) was established in 1990 by a coalition of progressive thinkers and activists. Our core mission is to champion social justice, safeguard the environment for future generations, and promote inclusive economic growth. The party is structured with a national committee, regional chapters, and various specialized wings to address diverse community needs. We believe in grassroots engagement and transparent governance.',
    foundedDate: '1990-07-04',
    registrationNumber: 'NAT-001-1990',
    ideology: ['Progressivism', 'Environmentalism', 'Social Democracy'],
    detailedIdeologyDescription: 'BUP advocates for policies that support a strong social safety net, investment in renewable energy, universal healthcare, and equal opportunities for all citizens. We believe in a regulated market economy that serves the public good.',
    partyManifestoUrl: 'https://blueunity.example.com/manifesto-2024.pdf',
    internationalAffiliations: ['Progressive Alliance International'],
    wings: [
      { name: 'Youth Wing', keyLeaders: [{name: 'Sarah Young', politicianId: 'p1'}], description: 'Engaging young people in political discourse and action.' },
      { name: 'Women\'s Wing', keyLeaders: [{name: 'Maria Garcia'}], description: 'Advocating for gender equality and women\'s empowerment.' },
      { name: 'Student Front', keyLeaders: [], description: 'Mobilizing students for progressive causes.'}
    ],
    isActive: true,
    isNationalParty: true,
    controversyIds: ['c1'],
  },
  {
    id: 'party2',
    name: 'Red Alliance Group',
    nepaliName: 'रातो गठबन्धन समूह',
    abbreviation: 'RAG',
    slug: 'red-alliance-group',
    leadership: [
      { name: 'Marcus Standard', role: 'Party Leader', politicianId: 'p2' },
      { name: 'Linda Fiscal', role: 'Chief Whip'}
    ],
    contactInfo: { 
      website: 'https://redalliance.example.com',
      email: 'contact@redalliance.example.com',
      phone: '555-0022'
    },
    headquartersAddress: '100 Freedom Road, Libertyville, LP 20002',
    logoUrl: 'https://placehold.co/200x200.png',
    flagUrl: 'https://placehold.co/150x100.png?text=RAG+Flag',
    dataAiHint: 'party logo red',
    electionSymbolUrl: 'https://placehold.co/100x100.png?text=Symbol2',
    partyColorHex: '#BA3030', // A shade of red
    history: 'Established in 1985, advocating for free markets and individual liberties. (Short history for list views)',
    aboutParty: 'The Red Alliance Group (RAG) was formed in 1985 by a group of entrepreneurs and constitutional scholars dedicated to the principles of free markets, limited government, and individual liberty. Our mission is to foster an environment where businesses can thrive and citizens are empowered. The party structure includes a policy advisory council and state-level caucuses.',
    foundedDate: '1985-02-15',
    registrationNumber: 'NAT-005-1985',
    ideology: ['Conservatism', 'Libertarianism', 'Free Market Economy'],
    detailedIdeologyDescription: 'RAG supports policies that promote fiscal responsibility, lower taxation, deregulation, and a strong national defense. We believe in personal responsibility and the power of the individual.',
    partyManifestoUrl: 'https://redalliance.example.com/platform-2024.pdf',
    parentPartyId: 'partyOldConservative', // Fictional
    parentPartyName: 'Old Conservative Union (Historical)',
    splinterPartyIds: ['partyNeoLibertarian'], // Fictional
    splinterPartyNames: ['Neo-Libertarian Movement'],
    wings: [
      { name: 'Business Council', description: 'Connecting with and supporting the business community.' },
      { name: 'Veterans Affairs Wing', keyLeaders: [{name: 'Colonel Strong'}]}
    ],
    isActive: true,
    isNationalParty: true,
    controversyIds: ['c2'],
  },
];

export function getPartyById(id: string): Party | undefined {
  return mockParties.find(p => p.id === id);
}

export function getPartyNameById(id: string): string | undefined {
  return mockParties.find(p => p.id === id)?.name;
}
