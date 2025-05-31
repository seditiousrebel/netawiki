
import type { Politician, Party, PromiseItem, Bill } from '@/types/gov';

// Import data arrays from the new modular files
import { mockPoliticians as _mockPoliticians } from './data/politicians';
import { mockParties as _mockParties } from './data/parties';
import { mockPromises as _mockPromises } from './data/promises';
import { mockBills as _mockBills } from './data/bills';

// Re-export all the arrays to maintain the existing API
export const mockPoliticians: Politician[] = _mockPoliticians;
export const mockParties: Party[] = _mockParties;
export const mockPromises: PromiseItem[] = _mockPromises;
export const mockBills: Bill[] = _mockBills;

// Re-export all the getter functions directly from their source files
export { getPoliticianById } from './data/politicians';
export { getPartyById } from './data/parties';
export { getPromisesByPolitician } from './data/promises';
export { getBillById, getBillsBySponsor } from './data/bills';
