
import type { Politician, Party, PromiseItem, Bill } from '@/types/gov'; // Keep PromiseStatus if it's used by types here, but it's likely only in promises.ts now

// Import data arrays and getter functions from the new modular files
import { mockPoliticians as _mockPoliticians, getPoliticianById as _getPoliticianById } from './data/politicians';
import { mockParties as _mockParties, getPartyById as _getPartyById } from './data/parties';
import { mockPromises as _mockPromises, getPromisesByPolitician as _getPromisesByPolitician } from './data/promises';
import { mockBills as _mockBills, getBillById as _getBillById } from './data/bills';

// Re-export all the arrays to maintain the existing API
export const mockPoliticians: Politician[] = _mockPoliticians;
export const mockParties: Party[] = _mockParties;
export const mockPromises: PromiseItem[] = _mockPromises;
export const mockBills: Bill[] = _mockBills;

// Re-export all the getter functions to maintain the existing API
export function getPoliticianById(id: string): Politician | undefined {
  return _getPoliticianById(id);
}

export function getPartyById(id: string): Party | undefined {
  return _getPartyById(id);
}

export function getPromisesByPolitician(politicianId: string): PromiseItem[] {
  return _getPromisesByPolitician(politicianId);
}

export function getBillById(id: string): Bill | undefined {
  return _getBillById(id);
}
