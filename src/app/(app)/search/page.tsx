"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageHeader } from '@/components/common/page-header';
import { EntityCard } from '@/components/common/entity-card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react'; // Using Loader2 for spinner
import {
  mockPoliticians,
  mockParties,
  mockBills,
  mockPromises,
  mockNews,
  mockControversies,
  mockElections,
  mockCommittees,
  mockConstituencies,
  // Assuming individual getters might be needed if not all data is in the main array object
  getPoliticianById, // Example, may not be needed if tags are in main objects
} from '@/lib/mock-data';
import type { Politician, Party, Bill, PromiseItem, NewsArticleLink, Controversy, Election, Committee, Constituency } from '@/types/gov';

interface SearchResult {
  id: string;
  name: string; // or title
  type: string;
  description?: string;
  link: string;
  imageUrl?: string;
  category?: string; // e.g., party name for politician, or primary tag
  tags?: string[];
}

function SearchResultsPageContent() {
  const searchParams = useSearchParams();
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // For global text search later
  const [searchTag, setSearchTag] = useState('');

  useEffect(() => {
    const tag = searchParams.get('tag');
    const query = searchParams.get('q'); // For global search later

    setIsLoading(true);
    setSearchResults([]);
    const results: SearchResult[] = [];
    const finalQuery = query || ''; // Use q if present, otherwise empty (tag search handled below)
    const finalTag = tag || '';

    if (finalQuery) { // Global search takes precedence
      setSearchTerm(finalQuery);
      setSearchTag('');
      const lowerCaseQuery = finalQuery.toLowerCase();

      // Helper function to check if any string in an array of strings contains the query
      const arrayFieldContainsQuery = (fields: (string | undefined)[]) =>
        fields.some(field => field && field.toLowerCase().includes(lowerCaseQuery));

      // Politician Search
      mockPoliticians.forEach(p => {
        if (
          arrayFieldContainsQuery([
            p.name,
            p.nepaliName,
            p.bio,
            ...(p.aliases || []),
            ...(p.positions.map(pos => pos.title))
          ])
        ) {
          results.push({
            id: p.id, name: p.name, type: 'Politician', description: p.positions[0]?.title || 'Public Figure',
            link: `/politicians/${p.id}`, imageUrl: p.photoUrl, category: p.partyName || 'Independent', tags: p.tags
          });
        }
      });

      // Party Search
      mockParties.forEach(p => {
        if (
          arrayFieldContainsQuery([
            p.name,
            p.nepaliName,
            p.abbreviation,
            p.history,
            p.aboutParty,
            ...(p.ideology || [])
          ])
        ) {
          results.push({
            id: p.id, name: p.name, type: 'Party', description: p.ideology?.join(', ') || `Founded: ${p.foundedDate || 'N/A'}`,
            link: `/parties/${p.id}`, imageUrl: p.logoUrl, category: p.isNationalParty ? "National Party" : "Regional Party", tags: p.tags
          });
        }
      });

      // Bill Search
      mockBills.forEach(b => {
        if (
          arrayFieldContainsQuery([
            b.title,
            b.billNumber,
            b.summary,
            b.purpose
          ])
        ) {
          results.push({
            id: b.id, name: b.title, type: 'Bill', description: b.summary.substring(0, 100) + '...',
            link: `/bills/${b.id}`, category: b.status, tags: b.tags
          });
        }
      });

      // Promise Search
      mockPromises.forEach(p => {
        if (
          arrayFieldContainsQuery([
            p.title,
            p.description,
            p.category
          ])
        ) {
          results.push({
            id: p.id, name: p.title, type: 'Promise', description: p.description.substring(0,100) + '...',
            link: `/promises#${p.id}`, category: p.status, tags: p.tags
          });
        }
      });

      // News Search
      mockNews.forEach(n => {
        if (
          arrayFieldContainsQuery([
            n.title,
            n.summary,
            n.fullContent,
            n.sourceName,
            n.category,
            ...(n.topics || [])
          ])
        ) {
          results.push({
            id: n.id, name: n.title, type: 'News', description: n.summary?.substring(0,100) + '...' || 'News article',
            link: n.url || (n.slug ? `/news/${n.slug}` : '#'), imageUrl: n.dataAiHint, category: n.sourceName, tags: n.topics
          });
        }
      });

      // Controversy Search
      mockControversies.forEach(c => {
        if (
          arrayFieldContainsQuery([
            c.title,
            c.description,
            c.summaryOutcome
          ])
        ) {
          results.push({
            id: c.id, name: c.title, type: 'Controversy', description: c.description.substring(0,100) + '...',
            link: `/controversies/${c.id}`, category: c.status, tags: c.tags
          });
        }
      });

      // Election Search
      mockElections.forEach(e => {
        if (
          arrayFieldContainsQuery([
            e.name,
            e.electionType,
            e.description
          ])
        ) {
          results.push({
            id: e.id, name: e.name, type: 'Election', description: e.description || `Type: ${e.electionType}`,
            link: `/elections/${e.id}`, category: e.electionType, tags: e.tags
          });
        }
      });

      // Committee Search
      mockCommittees.forEach(c => {
        if (
          arrayFieldContainsQuery([
            c.name,
            c.nepaliName,
            c.mandate
          ])
        ) {
          results.push({
            id: c.id, name: c.name, type: 'Committee', description: c.mandate?.substring(0,100) + '...' || `Type: ${c.committeeType}`,
            link: `/committees/${c.id}`, category: c.committeeType, tags: c.tags
          });
        }
      });

      // Constituency Search
      mockConstituencies.forEach(c => {
        if (
          arrayFieldContainsQuery([
            c.name,
            c.code,
            c.district,
            c.province
          ])
        ) {
          results.push({
            id: c.id, name: c.name, type: 'Constituency', description: `A ${c.type} constituency in ${c.district}, ${c.province}.`,
            link: `/constituencies/${c.id}`, category: c.type, tags: c.tags
          });
        }
      });
      setSearchResults(results);

    } else if (finalTag) { // Tag search
      setSearchTag(finalTag);
      setSearchTerm('');
      // Filter Politicians
      mockPoliticians.filter(p => p.tags?.includes(tag)).forEach(p => {
        results.push({
          id: p.id,
          name: p.name,
          type: 'Politician',
          description: p.positions[0]?.title || 'Public Figure',
          link: `/politicians/${p.id}`,
          imageUrl: p.photoUrl,
          category: p.partyName || (p.partyAffiliations && p.partyAffiliations.length > 0 ? p.partyAffiliations[0].partyName : 'Independent'),
          tags: p.tags
        });
      });

      // Filter Parties
      mockParties.filter(p => p.tags?.includes(tag)).forEach(p => {
        results.push({
          id: p.id,
          name: p.name,
          type: 'Party',
          description: p.ideology?.slice(0, 2).join(', ') || `Political Party founded on ${p.foundedDate || 'unknown date'}.`,
          link: `/parties/${p.id}`,
          imageUrl: p.logoUrl,
          category: p.isNationalParty ? "National Party" : "Regional Party",
          tags: p.tags
        });
      });

      // Filter Bills
      mockBills.filter(b => b.tags?.includes(tag)).forEach(b => {
        results.push({
          id: b.id,
          name: b.title,
          type: 'Bill',
          description: b.summary.substring(0, 100) + '...',
          link: `/bills/${b.id}`,
          category: b.status,
          tags: b.tags
        });
      });

      // Filter Promises
      mockPromises.filter(p => p.tags?.includes(tag)).forEach(p => {
        results.push({
          id: p.id,
          name: p.title,
          type: 'Promise',
          description: p.description.substring(0,100) + '...',
          link: `/promises#${p.id}`,
          category: p.status,
          tags: p.tags
        });
      });

      // Filter News (using topics or category as tags)
      mockNews.filter(n => n.topics?.includes(tag) || (n.category && n.category.toLowerCase() === tag.toLowerCase())).forEach(n => {
        results.push({
          id: n.id,
          name: n.title,
          type: 'News',
          description: n.summary?.substring(0,100) + '...' || 'News article',
          link: n.url || (n.slug ? `/news/${n.slug}` : '#'),
          imageUrl: n.dataAiHint, // Assuming dataAiHint might contain an image URL or representative string
          category: n.sourceName,
          tags: n.topics
        });
      });

      // Filter Controversies
      mockControversies.filter(c => c.tags?.includes(tag)).forEach(c => {
        results.push({
          id: c.id,
          name: c.title,
          type: 'Controversy',
          description: c.description.substring(0,100) + '...',
          link: `/controversies/${c.id}`,
          category: c.status,
          tags: c.tags
        });
      });

      // Filter Elections
       mockElections.filter(e => e.tags?.includes(tag)).forEach(e => {
        results.push({
          id: e.id,
          name: e.name,
          type: 'Election',
          description: e.description || `An election of type: ${e.electionType}.`,
          link: `/elections/${e.id}`, // Assuming election detail pages exist
          category: e.electionType,
          tags: e.tags
        });
      });

      // Filter Committees
      mockCommittees.filter(c => c.tags?.includes(tag)).forEach(c => {
        results.push({
          id: c.id,
          name: c.name,
          type: 'Committee',
          description: c.mandate?.substring(0,100) + '...' || `A committee of type: ${c.committeeType}.`,
          link: `/committees/${c.id}`, // Assuming committee detail pages exist
          category: c.committeeType,
          tags: c.tags
        });
      });

      // Filter Constituencies
      mockConstituencies.filter(c => c.tags?.includes(tag)).forEach(c => {
        results.push({
          id: c.id,
          name: c.name,
          type: 'Constituency',
          description: `A ${c.type} constituency in ${c.district}, ${c.province}.`,
          link: `/constituencies/${c.id}`, // Assuming constituency detail pages exist
          category: c.type,
          tags: c.tags
        });
      });

      setSearchResults(results);
    } else { // No query and no tag
      setSearchTerm('');
      setSearchTag('');
      setSearchResults([]); // Ensure results are cleared if no params
    }
    setIsLoading(false);
  }, [searchParams]);

  const pageTitle = finalQuery // Use finalQuery for title determination
    ? `Search Results for: "${finalQuery}"`
    : finalTag
    ? `Results for Tag: "${finalTag}"`
    : "Search";

  const pageDescription = finalQuery
    ? `Displaying results for your query "${finalQuery}".`
    : finalTag
    ? `Displaying all content tagged with "${finalTag}".`
    : "Enter a search term in the header or click on a tag to find relevant content.";

  const groupedResults = searchResults.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = [];
    }
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title={pageTitle}
        description={pageDescription}
      />

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-lg">Loading search results...</p>
        </div>
      ) : searchResults.length === 0 ? (
        <p className="text-center text-muted-foreground py-10">
          No results found for "{finalQuery || finalTag}".
        </p>
      ) : (
        <div className="space-y-10">
          {Object.entries(groupedResults).map(([type, items]) => (
            <section key={type}>
              <h2 className="text-2xl font-headline mb-4 capitalize">{type} ({items.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map(item => (
                  <EntityCard
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    imageUrl={item.imageUrl}
                    description={item.description}
                    viewLink={item.link}
                    category={item.category}
                    // imageAiHint could be added if relevant for specific types
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

// Wrap with Suspense because useSearchParams() needs it.
export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><Loader2 className="h-12 w-12 animate-spin text-primary" /><p className="ml-3">Loading page...</p></div>}>
      <SearchResultsPageContent />
    </Suspense>
  );
}
