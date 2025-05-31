

import type { Politician, Party, PromiseItem, Bill, Controversy, InvolvedEntity, ControversyUpdate, ControversyEvidenceLink, ControversyOfficialResponse, ControversyMediaCoverage, ControversyLegalProceeding, NewsArticleLink } from '@/types/gov';

// Import data arrays from the new modular files
import { mockPoliticians as _mockPoliticians } from './data/politicians';
import { mockParties as _mockParties } from './data/parties';
import { mockPromises as _mockPromises } from './data/promises';
import { mockBills as _mockBills } from './data/bills';
import { mockControversies as _mockControversies } from './data/controversies';
import { mockNewsArticles as _mockNewsArticles, getNewsByPartyId as _getNewsByPartyId, getNewsByPoliticianId as _getNewsByPoliticianId } from './data/news';


// Re-export all the arrays to maintain the existing API
export const mockPoliticians: Politician[] = _mockPoliticians;
export const mockParties: Party[] = _mockParties;
export const mockPromises: PromiseItem[] = _mockPromises;
export const mockBills: Bill[] = _mockBills;
export const mockControversies: Controversy[] = _mockControversies;
export const mockNewsArticles: NewsArticleLink[] = _mockNewsArticles;


// Re-export all the getter functions directly from their source files
export { getPoliticianById } from './data/politicians';
export { getPartyById, getPartyNameById } from './data/parties';
export { getPromisesByPolitician, getPromisesByPartyId } from './data/promises';
export { getBillById, getBillsBySponsor } from './data/bills';
export { getControversyById, getControversiesByPoliticianId, getControversiesByPartyId } from './data/controversies';
export { getNewsByPartyId, getNewsByPoliticianId } from './data/news';

// Re-export types that might be used by pages directly (though ideally pages import from @/types/gov)
export type {
    Controversy,
    InvolvedEntity,
    ControversyUpdate,
    ControversyEvidenceLink,
    ControversyOfficialResponse,
    ControversyMediaCoverage,
    ControversyLegalProceeding,
    PromiseItem,
    NewsArticleLink
};

