
import type { NewsArticleLink } from '@/types/gov';

export const mockNewsArticles: NewsArticleLink[] = [
  { 
    id: 'news1',
    title: "BUP Unveils New Climate Policy", 
    url: "https://example.com/news/bup-climate", 
    sourceName: "National Times", 
    publicationDate: "2024-05-10", 
    summary: "The Blue Unity Party today announced a comprehensive new policy aimed at accelerating the transition to renewable energy sources.",
    taggedPartyIds: ['party1'],
  },
  { 
    id: 'news2',
    title: "Party Chair Vanguard Addresses Annual Conference", 
    url: "https://example.com/news/vanguard-conference", 
    sourceName: "Capital City Gazette", 
    publicationDate: "2024-04-20", 
    summary: "Eleanor Vanguard outlined the party's vision for the upcoming year, focusing on economic equity and social programs.",
    taggedPartyIds: ['party1'],
    taggedPoliticianIds: ['p3-nonexistent'] // Assuming Vanguard has an ID p3
  },
  { 
    id: 'news3',
    title: "RAG Proposes Tax Reform Package", 
    url: "https://example.com/news/rag-tax-reform", 
    sourceName: "Economic Daily", 
    publicationDate: "2024-06-01", 
    summary: "The Red Alliance Group introduced a new tax reform package aimed at stimulating business investment.",
    taggedPartyIds: ['party2'],
  },
  {
    id: 'news4',
    title: "Cross-Party Talks on Infrastructure Begin",
    url: "https://example.com/news/infrastructure-talks",
    sourceName: "Political Review Weekly",
    publicationDate: "2024-07-01",
    summary: "Leaders from BUP and RAG met today to discuss potential bipartisan cooperation on the upcoming national infrastructure bill. Senator Alice Democratia and Representative Bob Republicanus were present.",
    taggedPartyIds: ['party1', 'party2'],
    taggedPoliticianIds: ['p1', 'p2']
  },
  {
    id: 'news5',
    title: "Green Future Party Rallies for Stricter Emission Standards",
    url: "https://example.com/news/gfp-rally",
    sourceName: "Environmental Watch",
    publicationDate: "2024-06-15",
    summary: "The Green Future Party organized a large rally in the capital demanding stricter emission standards for industries.",
    taggedPartyIds: ['party3-fictional']
  }
];

export function getNewsByPartyId(partyId: string): NewsArticleLink[] {
  return mockNewsArticles.filter(article => 
    article.taggedPartyIds?.includes(partyId)
  ).sort((a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime());
}

export function getNewsByPoliticianId(politicianId: string): NewsArticleLink[] {
  return mockNewsArticles.filter(article => 
    article.taggedPoliticianIds?.includes(politicianId)
  ).sort((a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime());
}
