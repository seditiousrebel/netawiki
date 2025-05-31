
import type { NewsArticleLink, NewsArticleCategory } from '@/types/gov';

export const mockNewsArticles: NewsArticleLink[] = [
  { 
    id: 'news1',
    slug: 'bup-climate-policy-park-promise',
    title: "BUP Unveils New Climate Policy, References Park Promise", 
    url: "https://example.com/news/bup-climate", 
    sourceName: "National Times", 
    publicationDate: "2024-05-10", 
    summary: "The Blue Unity Party today announced a comprehensive new policy aimed at accelerating the transition to renewable energy sources. This includes renewed commitment to the 'Improve Public Parks Statewide' initiative.",
    category: "Environment" as NewsArticleCategory,
    topics: ["climate change", "renewable energy", "public parks"],
    isAggregated: true,
    authorName: "Jane Doe",
    dataAiHint: "solar panels wind turbines",
    taggedPartyIds: ['party1'],
    taggedPromiseIds: ['pr1'],
  },
  { 
    id: 'news2',
    slug: 'vanguard-conference-address',
    title: "Party Chair Vanguard Addresses Annual Conference", 
    url: "https://example.com/news/vanguard-conference", 
    sourceName: "Capital City Gazette", 
    publicationDate: "2024-04-20", 
    summary: "Eleanor Vanguard outlined the party's vision for the upcoming year, focusing on economic equity and social programs.",
    isAggregated: true,
    authorName: "John Smith",
    category: "Politics" as NewsArticleCategory,
    topics: ["party politics", "economic policy"],
    dataAiHint: "conference speech podium",
    taggedPartyIds: ['party1'],
    taggedPoliticianIds: ['p3-nonexistent'] 
  },
  { 
    id: 'news3',
    slug: 'rag-tax-reform-broken-promises',
    title: "RAG Proposes Tax Reform Package, Cites Broken Promise Concerns", 
    url: "https://example.com/news/rag-tax-reform", 
    sourceName: "Economic Daily", 
    publicationDate: "2024-06-01", 
    summary: "The Red Alliance Group introduced a new tax reform package aimed at stimulating business investment, highlighting the current administration's failure to deliver on the 'Reduce Corporate Taxes by 5%' promise.",
    isAggregated: true,
    category: "Economy" as NewsArticleCategory,
    topics: ["tax reform", "business investment"],
    dataAiHint: "financial chart graph",
    taggedPartyIds: ['party2'],
    taggedPromiseIds: ['pr3']
  },
  {
    id: 'news4',
    slug: 'infrastructure-talks-clean-energy-act',
    title: "Cross-Party Talks on Infrastructure Begin, Clean Energy Act Discussed",
    url: "https://example.com/news/infrastructure-talks",
    sourceName: "Political Review Weekly",
    publicationDate: "2024-07-01",
    summary: "Leaders from BUP and RAG met today to discuss potential bipartisan cooperation on the upcoming national infrastructure bill. Senator Alice Democratia and Representative Bob Republicanus were present. The Clean Energy Act (S. 567) was a key topic.",
    isAggregated: true,
    category: "Legislative" as NewsArticleCategory,
    topics: ["bipartisanship", "infrastructure", "energy policy"],
    dataAiHint: "politicians meeting handshake",
    taggedPartyIds: ['party1', 'party2'],
    taggedPoliticianIds: ['p1', 'p2'],
    taggedBillIds: ['b1']
  },
  {
    id: 'news5',
    slug: 'gfp-rally-emission-standards',
    title: "Green Future Party Rallies for Stricter Emission Standards",
    url: "https://example.com/news/gfp-rally",
    sourceName: "Environmental Watch",
    publicationDate: "2024-06-15",
    summary: "The Green Future Party organized a large rally in the capital demanding stricter emission standards for industries.",
    isAggregated: true,
    category: "Environment" as NewsArticleCategory,
    topics: ["activism", "pollution control"],
    dataAiHint: "protest rally signs",
    taggedPartyIds: ['party3-fictional']
  },
  {
    id: 'news6',
    slug: 'democratia-education-reform-speech',
    title: "Senator Democratia Speaks on Education Reform & Teacher Salaries",
    url: "https://example.com/news/democratia-education",
    sourceName: "Education Today",
    publicationDate: "2024-07-10",
    summary: "Senator Alice Democratia outlined her vision for comprehensive education reform at a town hall meeting, praising the recent fulfillment of the teacher salary increase promise.",
    category: "Social Issues" as NewsArticleCategory,
    topics: ["education", "teacher welfare"],
    isAggregated: true,
    dataAiHint: "teacher classroom students",
    taggedPoliticianIds: ['p1'],
    taggedPartyIds: ['party1'],
    taggedPromiseIds: ['pr2']
  },
  {
    id: 'news7',
    slug: 'republicanus-economic-policy-debate',
    title: "Rep. Republicanus Debates Economic Policy",
    url: "https://example.com/news/republicanus-economy",
    sourceName: "Financial Chronicle",
    publicationDate: "2024-07-05",
    summary: "Representative Bob Republicanus engaged in a spirited debate on current economic policies with leading economists.",
    isAggregated: true,
    category: "Economy" as NewsArticleCategory,
    dataAiHint: "debate podium discussion",
    taggedPoliticianIds: ['p2'],
    taggedPartyIds: ['party2']
  },
  {
    id: 'news8',
    slug: 'digital-literacy-act-gains-traction',
    title: "Digital Literacy Act (H.R. 1230) Gains Traction, Public Support Grows",
    url: "https://example.com/news/digital-literacy-act-support",
    sourceName: "Tech Forward News",
    publicationDate: "2024-01-25",
    summary: "The Digital Literacy For All Act (H.R. 1230) is receiving widespread public support as it moves through legislative stages. Experts laud its potential impact.",
    isAggregated: true,
    category: "Legislative" as NewsArticleCategory,
    topics: ["technology", "education bill"],
    dataAiHint: "people using computers learning",
    taggedBillIds: ['b2'],
    taggedPoliticianIds: ['p2', 'p1']
  },
  {
    id: 'internal-news1',
    slug: 'analysis-election-turnout-trends',
    title: "In-Depth Analysis: Voter Turnout Trends in Recent Elections",
    sourceName: "GovTrackr Internal Analysis",
    publicationDate: "2024-07-20",
    authorName: "Dr. Analyst Expert",
    authorId: "author1",
    category: "Elections" as NewsArticleCategory,
    topics: ["voter behavior", "election analysis", "demographics"],
    summary: "A comprehensive look at voter turnout patterns over the last three election cycles, exploring regional and demographic shifts.",
    fullContent: `
## Voter Turnout: A Shifting Landscape

Recent election cycles have shown some interesting trends in voter participation across the nation. This analysis dives into the data from the 2022 Local Elections, the 2023 Bagmati Provincial Election, and preliminary data from the upcoming 2024 General Election registrations.

### Key Observations:

1.  **Urban vs. Rural Divide**: While urban centers historically showed higher turnout, recent data suggests a narrowing gap, with rural participation increasing by an average of 3% in the last provincial election.
2.  **Youth Engagement**: Voters aged 18-25 have shown a significant uptick in registration and turnout, particularly in metropolitan areas. This cohort's participation increased by nearly 5% in Kathmandu during the 2022 local elections compared to previous cycles.
3.  **Impact of Digital Campaigns**: Areas with higher internet penetration and active online campaigning saw a marginally higher turnout, suggesting digital outreach plays an increasingly important role.

### Regional Spotlights:

*   **Bagmati Province**: Saw the highest overall turnout in 2023 (65.5%), driven by strong participation in both urban and semi-urban areas.
*   **Madhesh Province**: Historically lower turnout, but showed a 2% increase in the last local elections, indicating growing political engagement.

### Looking Ahead to 2024:

With over 18 million registered voters for the 2024 General Election, understanding these trends is crucial for all political stakeholders. GovTrackr will continue to monitor and analyze these developments.

*This is a sample internal article. More detailed charts and data will be available in the full report.*
    `,
    isFactCheck: false,
    isAggregated: false,
    dataAiHint: "election data charts",
    taggedElectionIds: ["provBag2023", "localKath2022", "gen2024"],
  },
  {
    id: 'internal-news2',
    slug: 'fact-check-infrastructure-spending-claim',
    title: "Fact Check: Senator X's Claim on Infrastructure Spending",
    sourceName: "GovTrackr Fact Check",
    publicationDate: "2024-07-22",
    authorName: "Fact Check Team",
    category: "Fact Check" as NewsArticleCategory,
    topics: ["infrastructure", "government spending", "political claims"],
    summary: "We examine Senator X's recent statement that infrastructure spending has increased by 50% in the last fiscal year.",
    fullContent: `
## Claim: "Infrastructure spending has increased by 50% in the last fiscal year." - Senator X, July 15, 2024

During a recent press conference, Senator X stated that national infrastructure spending saw a 50% increase in the recently concluded fiscal year. GovTrackr Fact Check investigated this claim.

### Our Findings:

Based on official budget documents released by the Ministry of Finance and reports from the National Planning Commission:

*   Total allocated budget for infrastructure in FY 2022/23: NPR 300 Billion.
*   Total allocated budget for infrastructure in FY 2023/24: NPR 380 Billion.

The actual increase in allocated budget is ((380 - 300) / 300) * 100 = **26.67%**.

While there was a significant increase in infrastructure spending allocation, it was not 50% as claimed. Data on actual disbursed amounts versus allocated amounts is still pending for the full fiscal year 2023/24.

### Conclusion:

Senator X's claim that infrastructure spending increased by 50% in the last fiscal year is **Mostly False**. While spending did increase substantially, the figure cited is an overstatement of the allocated budget increase.

*GovTrackr Fact Check relies on publicly available data and official reports. If new data emerges, this assessment may be updated.*
    `,
    isFactCheck: true,
    isAggregated: false,
    dataAiHint: "fact check truth magnifying glass",
    taggedPoliticianIds: ["p1"], // Assuming Senator X is Alice Democratia for linking
    taggedPromiseIds: ["pr1"], // Related to infrastructure
  }
];

export function getAllNewsArticles(): NewsArticleLink[] {
  return [...mockNewsArticles].sort((a,b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime());
}

export function getNewsArticleByIdOrSlug(idOrSlug: string): NewsArticleLink | undefined {
  return mockNewsArticles.find(article => article.id === idOrSlug || article.slug === idOrSlug);
}

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

export function getNewsByControversyId(controversyId: string): NewsArticleLink[] {
  return mockNewsArticles.filter(article => 
    article.taggedControversyIds?.includes(controversyId)
  ).sort((a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime());
}

export function getNewsByElectionId(electionId: string): NewsArticleLink[] {
  return mockNewsArticles.filter(article => 
    article.taggedElectionIds?.includes(electionId)
  ).sort((a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime());
}
