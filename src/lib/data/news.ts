
import type { NewsArticleLink } from '@/types/gov';

export const mockNewsArticles: NewsArticleLink[] = [
  { 
    id: 'news1',
    title: "BUP Unveils New Climate Policy, References Park Promise", 
    url: "https://example.com/news/bup-climate", 
    sourceName: "National Times", 
    publicationDate: "2024-05-10", 
    summary: "The Blue Unity Party today announced a comprehensive new policy aimed at accelerating the transition to renewable energy sources. This includes renewed commitment to the 'Improve Public Parks Statewide' initiative.",
    taggedPartyIds: ['party1'],
    taggedPromiseIds: ['pr1'],
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
    title: "RAG Proposes Tax Reform Package, Cites Broken Promise Concerns", 
    url: "https://example.com/news/rag-tax-reform", 
    sourceName: "Economic Daily", 
    publicationDate: "2024-06-01", 
    summary: "The Red Alliance Group introduced a new tax reform package aimed at stimulating business investment, highlighting the current administration's failure to deliver on the 'Reduce Corporate Taxes by 5%' promise.",
    taggedPartyIds: ['party2'],
    taggedPromiseIds: ['pr3']
  },
  {
    id: 'news4',
    title: "Cross-Party Talks on Infrastructure Begin, Clean Energy Act Discussed",
    url: "https://example.com/news/infrastructure-talks",
    sourceName: "Political Review Weekly",
    publicationDate: "2024-07-01",
    summary: "Leaders from BUP and RAG met today to discuss potential bipartisan cooperation on the upcoming national infrastructure bill. Senator Alice Democratia and Representative Bob Republicanus were present. The Clean Energy Act (S. 567) was a key topic.",
    taggedPartyIds: ['party1', 'party2'],
    taggedPoliticianIds: ['p1', 'p2'],
    taggedBillIds: ['b1']
  },
  {
    id: 'news5',
    title: "Green Future Party Rallies for Stricter Emission Standards",
    url: "https://example.com/news/gfp-rally",
    sourceName: "Environmental Watch",
    publicationDate: "2024-06-15",
    summary: "The Green Future Party organized a large rally in the capital demanding stricter emission standards for industries.",
    taggedPartyIds: ['party3-fictional']
  },
  {
    id: 'news6',
    title: "Senator Democratia Speaks on Education Reform & Teacher Salaries",
    url: "https://example.com/news/democratia-education",
    sourceName: "Education Today",
    publicationDate: "2024-07-10",
    summary: "Senator Alice Democratia outlined her vision for comprehensive education reform at a town hall meeting, praising the recent fulfillment of the teacher salary increase promise.",
    taggedPoliticianIds: ['p1'],
    taggedPartyIds: ['party1'],
    taggedPromiseIds: ['pr2']
  },
  {
    id: 'news7',
    title: "Rep. Republicanus Debates Economic Policy",
    url: "https://example.com/news/republicanus-economy",
    sourceName: "Financial Chronicle",
    publicationDate: "2024-07-05",
    summary: "Representative Bob Republicanus engaged in a spirited debate on current economic policies with leading economists.",
    taggedPoliticianIds: ['p2'],
    taggedPartyIds: ['party2']
  },
  {
    id: 'news8',
    title: "Digital Literacy Act (H.R. 1230) Gains Traction, Public Support Grows",
    url: "https://example.com/news/digital-literacy-act-support",
    sourceName: "Tech Forward News",
    publicationDate: "2024-01-25",
    summary: "The Digital Literacy For All Act (H.R. 1230) is receiving widespread public support as it moves through legislative stages. Experts laud its potential impact.",
    taggedBillIds: ['b2'],
    taggedPoliticianIds: ['p2', 'p1']
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

export function getNewsByPromiseId(promiseId: string): NewsArticleLink[] {
  return mockNewsArticles.filter(article => 
    article.taggedPromiseIds?.includes(promiseId)
  ).sort((a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime());
}

export function getNewsByBillId(billId: string): NewsArticleLink[] {
  return mockNewsArticles.filter(article => 
    article.taggedBillIds?.includes(billId)
  ).sort((a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime());
}
