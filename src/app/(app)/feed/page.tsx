"use client";

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import {
  getPoliticianById,
  getPartyById,
  getPromiseById,
  getBillById,
  getBillsBySponsor,
  getNewsArticleByIdOrSlug, // Assuming this exists or will be created
  mockPoliticians, // Fallback if specific getters fail or for direct use
  mockParties,
  mockPromises,
  mockBills,
  mockNews
} from '@/lib/mock-data';
import type { Politician, Party, PromiseItem, Bill, NewsArticleLink, StatementQuote, PartyStance, ElectionPerformanceRecord, PromiseStatusUpdate, BillTimelineEvent } from '@/types/gov';

// localStorage keys
const LOCAL_STORAGE_FOLLOWED_POLITICIANS_KEY = 'govtrackr_followed_politicians';
const LOCAL_STORAGE_FOLLOWED_PARTIES_KEY = 'govtrackr_followed_parties';
const LOCAL_STORAGE_FOLLOWED_PROMISES_KEY = 'govtrackr_followed_promises';
const LOCAL_STORAGE_FOLLOWED_BILLS_KEY = 'govtrackr_followed_bills';
const LOCAL_STORAGE_BOOKMARKED_NEWS_KEY = 'govtrackr_bookmarked_news';

interface FeedItem {
  type: string;
  date: string;
  text: string;
  link?: string;
  title?: string;
  source?: string;
  actorName?: string; // Politician name, Party name
}

export default function FeedPage() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Placeholder for getNewsArticleByIdOrSlug if not in mock-data
  const getNewsArticleFallback = (idOrSlug: string): NewsArticleLink | undefined => {
    return mockNews.find(news => news.id === idOrSlug || news.slug === idOrSlug);
  };

  const actualGetNewsArticleByIdOrSlug = typeof getNewsArticleByIdOrSlug === 'function' ? getNewsArticleByIdOrSlug : getNewsArticleFallback;


  useEffect(() => {
    setLoading(true);
    const generatedUpdates: FeedItem[] = [];

    // Helper to safely parse localStorage
    const getArrayFromLocalStorage = (key: string): string[] => {
      try {
        const item = localStorage.getItem(key);
        if (item) {
          const parsed = JSON.parse(item);
          return Array.isArray(parsed) ? parsed : [];
        }
      } catch (error) {
        console.error(`Error parsing localStorage key "${key}":`, error);
      }
      return [];
    };

    const followedPoliticianIds = getArrayFromLocalStorage(LOCAL_STORAGE_FOLLOWED_POLITICIANS_KEY);
    const followedPartyIds = getArrayFromLocalStorage(LOCAL_STORAGE_FOLLOWED_PARTIES_KEY);
    const followedPromiseIds = getArrayFromLocalStorage(LOCAL_STORAGE_FOLLOWED_PROMISES_KEY);
    const followedBillIds = getArrayFromLocalStorage(LOCAL_STORAGE_FOLLOWED_BILLS_KEY);
    const bookmarkedNewsIds = getArrayFromLocalStorage(LOCAL_STORAGE_BOOKMARKED_NEWS_KEY);

    // Process Politicians
    followedPoliticianIds.forEach(id => {
      const politician = getPoliticianById(id);
      if (politician) {
        const sponsoredBills = getBillsBySponsor(id);
        sponsoredBills.forEach(bill => {
          generatedUpdates.push({
            type: 'NewBillSponsorship',
            date: bill.introducedDate || new Date().toISOString(),
            actorName: politician.name,
            title: bill.title,
            link: `/bills/${bill.id}`,
            text: `${politician.name} sponsored a new bill: ${bill.title}`,
          });
        });

        if (politician.statementsAndQuotes && politician.statementsAndQuotes.length > 0) {
          const recentStatement = [...politician.statementsAndQuotes].sort((a,b) => new Date(b.dateOfStatement).getTime() - new Date(a.dateOfStatement).getTime())[0];
          if(recentStatement) {
            generatedUpdates.push({
              type: 'NewStatement',
              date: recentStatement.dateOfStatement,
              actorName: politician.name,
              title: `Statement by ${politician.name}`,
              text: `${politician.name} made a statement: "${recentStatement.quoteText.substring(0, 100)}..."`,
              // link: could link to politician page section if available, e.g. /politicians/${politician.id}#statements
            });
          }
        }
      }
    });

    // Process Parties
    followedPartyIds.forEach(id => {
      const party = getPartyById(id);
      if (party) {
        if (party.stancesOnIssues && party.stancesOnIssues.length > 0) {
           const recentStance = [...party.stancesOnIssues].sort((a,b) => new Date(b.dateOfStance || 0).getTime() - new Date(a.dateOfStance || 0).getTime())[0];
           if(recentStance) {
            generatedUpdates.push({
              type: 'PartyStanceUpdate',
              date: recentStance.dateOfStance || new Date().toISOString(),
              actorName: party.name,
              title: `Stance on ${recentStance.issueTitle}`,
              text: `${party.name} updated its stance on ${recentStance.issueTitle} to ${recentStance.stance}`,
              link: `/parties/${party.id}`, // Could add #stances if such an anchor exists
            });
           }
        }
        if (party.electionHistory && party.electionHistory.length > 0) {
          const recentElection = [...party.electionHistory].sort((a,b) => parseInt(b.electionYear) - parseInt(a.electionYear))[0];
          if(recentElection) {
            generatedUpdates.push({
              type: 'PartyElectionResult',
              date: `${recentElection.electionYear}-01-01`, // Approximate date
              actorName: party.name,
              title: `Election Result ${recentElection.electionYear} for ${party.name}`,
              text: `${party.name} election result from ${recentElection.electionYear}: Won ${recentElection.seatsWon} seat(s).`,
              link: `/parties/${party.id}`, // Could add #election-history
            });
          }
        }
      }
    });

    // Process Promises
    followedPromiseIds.forEach(id => {
      const promise = getPromiseById(id); // Assuming getPromiseById is available
      if (promise && promise.statusUpdateHistory && promise.statusUpdateHistory.length > 0) {
        const recentUpdate = [...promise.statusUpdateHistory].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
        if(recentUpdate) {
          generatedUpdates.push({
            type: 'PromiseStatusUpdate',
            date: recentUpdate.date,
            title: promise.title,
            link: `/promises#${promise.id}`,
            text: `Status of promise "${promise.title}" updated to ${recentUpdate.status}`,
          });
        }
      }
    });

    // Process Bills
    followedBillIds.forEach(id => {
      const bill = getBillById(id); // Assuming getBillById is available
      if (bill && bill.timelineEvents && bill.timelineEvents.length > 0) {
        const recentEvent = [...bill.timelineEvents].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
        if(recentEvent) {
          generatedUpdates.push({
            type: 'BillTimelineUpdate',
            date: recentEvent.date,
            title: bill.title,
            link: `/bills/${bill.id}`,
            text: `Update on bill "${bill.title}": ${recentEvent.event}`,
          });
        }
      }
    });

    // Process Bookmarked News
    bookmarkedNewsIds.forEach(id => {
      const news = actualGetNewsArticleByIdOrSlug(id);
      if (news) {
        generatedUpdates.push({
          type: 'BookmarkedNewsUpdate',
          date: news.publicationDate,
          title: news.title,
          source: news.sourceName,
          link: news.url || (news.slug ? `/news/${news.slug}` : undefined),
          text: `From your bookmarks: "${news.title}" by ${news.sourceName}`,
        });
      }
    });

    // Sort all updates by date
    generatedUpdates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setFeedItems(generatedUpdates);
    setLoading(false);

  }, [refreshTrigger]);


  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="Your Activity Feed"
        description="Updates from politicians, parties, promises, bills, and news you follow or bookmark."
        actions={<Button variant="outline" onClick={handleRefresh} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Refresh Feed
        </Button>}
      />

      <h2 className="text-2xl font-headline mb-6">Recent Activities</h2>
      {/* Loading and content display logic will be added in a subsequent step */}
       {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-3 text-lg">Loading your feed...</p>
        </div>
      ) : feedItems.length > 0 ? (
        <div className="space-y-6">
          {feedItems.map((item, index) => (
            <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg font-medium">
                    {item.link ? <Link href={item.link} className="hover:underline text-primary">{item.title || item.type.replace(/([A-Z])/g, ' $1').trim()}</Link> : (item.title || item.type.replace(/([A-Z])/g, ' $1').trim())}
                </CardTitle>
                {item.actorName && <CardDescription>By: {item.actorName}</CardDescription>}
                {item.source && <CardDescription>Source: {item.source}</CardDescription>}
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-foreground">{item.text}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-10">No new updates based on your followed items. Explore and follow more content!</p>
      )}
    </div>
  );
}
