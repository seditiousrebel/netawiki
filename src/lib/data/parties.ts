
import type { Party } from '@/types/gov';

export const mockParties: Party[] = [
  {
    id: 'party1',
    name: 'Blue Unity Party',
    leadership: [{ name: 'Eleanor Vanguard', role: 'Party Chair' }],
    contactInfo: { website: 'https://blueunity.example.com' },
    logoUrl: 'https://placehold.co/200x200.png',
    dataAiHint: 'party logo',
    history: 'Founded in 1990 with a focus on social justice and environmental protection.',
    electionSymbolUrl: 'https://placehold.co/100x100.png',
    ideology: ['Progressivism', 'Environmentalism'],
    foundedDate: '1990-07-04',
  },
  {
    id: 'party2',
    name: 'Red Alliance Group',
    leadership: [{ name: 'Marcus Standard', role: 'Party Leader' }],
    contactInfo: { website: 'https://redalliance.example.com' },
    logoUrl: 'https://placehold.co/200x200.png',
    dataAiHint: 'party logo',
    history: 'Established in 1985, advocating for free markets and individual liberties.',
    electionSymbolUrl: 'https://placehold.co/100x100.png',
    ideology: ['Conservatism', 'Libertarianism'],
    foundedDate: '1985-02-15',
  },
];

export function getPartyById(id: string): Party | undefined {
  return mockParties.find(p => p.id === id);
}
