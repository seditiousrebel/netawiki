
import type { PromiseItem, PromiseStatus } from '@/types/gov';

export const mockPromises: PromiseItem[] = [
  {
    id: 'pr1',
    politicianId: 'p1',
    partyId: 'party1', // Blue Unity Party
    title: 'Improve Public Parks',
    description: 'Invest $5 million in upgrading and maintaining public parks across the state.',
    dueDate: '2025-12-31',
    status: 'In Progress' as PromiseStatus,
    evidenceLinks: [{ url: 'https://example.com/park-project-updates', description: 'Park Project Updates' }],
    category: 'Infrastructure',
    datePromised: '2020-02-01',
  },
  {
    id: 'pr2',
    politicianId: 'p1',
    // partyId: 'party1', // Can also be linked to party if it was a party promise
    title: 'Increase Teacher Salaries',
    description: 'Raise average teacher salaries by 10% within the first term.',
    dueDate: '2024-06-30',
    status: 'Fulfilled' as PromiseStatus,
    evidenceLinks: [{ url: 'https://example.com/teacher-salary-report', description: 'Salary Report 2024' }],
    category: 'Education',
    datePromised: '2020-03-15',
    dateCompleted: '2024-05-20',
  },
  {
    id: 'pr3',
    politicianId: 'p2',
    partyId: 'party2', // Red Alliance Group
    title: 'Reduce Business Taxes',
    description: 'Implement a 5% reduction in corporate taxes to stimulate economic growth.',
    dueDate: '2023-09-01',
    status: 'Broken' as PromiseStatus,
    evidenceLinks: [],
    category: 'Economy',
    datePromised: '2018-03-01',
  },
  {
    id: 'pr4',
    politicianId: 'p2',
    // partyId: 'party2', // Can also be linked
    title: 'Fund Small Business Startups',
    description: 'Allocate $10 million in grants for small business startups.',
    status: 'Pending' as PromiseStatus,
    evidenceLinks: [],
    category: 'Economy',
    datePromised: '2018-05-10',
  },
  {
    id: 'pr5',
    // politicianId: undefined, // Example of a purely party promise
    partyId: 'party1', // Blue Unity Party
    title: 'National Digital Literacy Program',
    description: 'Launch a nationwide program to enhance digital literacy for all age groups.',
    dueDate: '2026-12-31',
    status: 'Pending' as PromiseStatus,
    evidenceLinks: [{ url: 'https://blueunity.example.com/manifesto-2024.pdf#digital-literacy', description: 'Manifesto Commitment' }],
    category: 'Education',
    datePromised: '2024-01-10',
  },
];

export function getPromisesByPolitician(politicianId: string): PromiseItem[] {
  return mockPromises.filter(p => p.politicianId === politicianId);
}

export function getPromisesByPartyId(partyId: string): PromiseItem[] {
  return mockPromises.filter(p => p.partyId === partyId);
}
