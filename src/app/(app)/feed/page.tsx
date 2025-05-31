"use client";
import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Rss, RefreshCw } from 'lucide-react';
import type { SummarizeUpdatesInput } from '@/ai/flows/summarize-updates';
import { summarizeUpdates } from '@/ai/flows/summarize-updates';
import {
  getPoliticianById,
  getPartyById,
  getPromiseById,
  getBillById,
  getConstituencyById,
  getCommitteeById,
  getControversyById,
  getElectionById,
  getNewsArticleByIdOrSlug,
} from '@/lib/mock-data'; // Adjust path as necessary

const followSources = [
  { key: 'govtrackr_followed_politicians', getter: getPoliticianById, type: 'Politician' },
  { key: 'govtrackr_followed_parties', getter: getPartyById, type: 'Party' },
  { key: 'govtrackr_followed_promises', getter: getPromiseById, type: 'Promise' },
  { key: 'govtrackr_followed_bills', getter: getBillById, type: 'Bill' },
  { key: 'govtrackr_followed_constituencies', getter: getConstituencyById, type: 'Constituency' },
  { key: 'govtrackr_followed_committees', getter: getCommitteeById, type: 'Committee' },
  { key: 'govtrackr_followed_controversies', getter: getControversyById, type: 'Controversy' },
  { key: 'govtrackr_followed_elections', getter: getElectionById, type: 'Election' },
  { key: 'govtrackr_bookmarked_articles', getter: getNewsArticleByIdOrSlug, type: 'News Bookmark' },
];

export default function FeedPage() {
  const [followedItemsData, setFollowedItemsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summaryText, setSummaryText] = useState<string | null>(null); // For future use
  const [genkitFormattedUpdates, setGenkitFormattedUpdates] = useState<SummarizeUpdatesInput['updates']>([]);

  const fetchFollowedDataAndSummarize = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setSummaryText(null); // Clear previous summary
    setGenkitFormattedUpdates([]); // Clear previously formatted updates
    // setFollowedItemsData([]); // Optionally clear raw data too if desired, or rely on overwrite
    const allItems: any[] = [];

    for (const source of followSources) {
      try {
        const storedValue = localStorage.getItem(source.key);
        if (storedValue) {
          const ids: string[] = JSON.parse(storedValue);
          if (Array.isArray(ids)) {
            for (const id of ids) {
              const item = await source.getter(id); // Assuming getters are async or can be awaited
              if (item) {
                allItems.push({ ...item, type: source.type, id: item.id || id });
              }
            }
          }
        }
      } catch (e) {
        console.error(`Error fetching data for ${source.key}:`, e);
        // Optionally set a generic error or per-source error
        setError(`Failed to load some feed items. Please try refreshing.`);
      }
    }
    setFollowedItemsData(allItems);

    const formattedUpdates: SummarizeUpdatesInput['updates'] = allItems.map(item => {
      let title = 'N/A';
      let content = 'No specific details available.';
      let sourceName = 'Unknown Source';
      let url = '/';

      switch (item.type) {
        case 'Politician':
          title = item.name || 'Unnamed Politician';
          content = item.positions?.[0]?.title || item.bio?.substring(0, 150) || 'No specific details available.';
          if (item.bio && item.bio.length > 150) content += '...';
          sourceName = `Politician: ${title}`;
          url = `/politicians/${item.id}`;
          break;
        case 'Party':
          title = item.name || 'Unnamed Party';
          content = item.aboutParty?.substring(0, 150) || item.history?.substring(0, 150) || 'No specific details available.';
          if ((item.aboutParty && item.aboutParty.length > 150) || (item.history && item.history.length > 150)) content += '...';
          sourceName = `Party: ${title}`;
          url = `/parties/${item.id}`;
          break;
        case 'Promise':
          title = item.title || 'Untitled Promise';
          content = `${item.description?.substring(0, 100) || 'No description.'}... (Status: ${item.status})`;
          sourceName = `Promise: ${title.substring(0,30)}...`;
          url = `/promises/${item.slug || item.id}`;
          break;
        case 'Bill':
          title = item.title || 'Untitled Bill';
          content = `${item.summary?.substring(0, 100) || 'No summary.'}... (Status: ${item.status})`;
          sourceName = `Bill: ${item.billNumber || title}`;
          url = `/bills/${item.slug || item.id}`;
          break;
        case 'Constituency':
          title = item.name || 'Unnamed Constituency';
          content = `Type: ${item.type}, District: ${item.district}, Province: ${item.province}. Population: ${item.population || 'N/A'}.`;
          sourceName = `Constituency: ${title}`;
          url = `/constituencies/${item.slug || item.id}`;
          break;
        case 'Committee':
          title = item.name || 'Unnamed Committee';
          content = `Type: ${item.committeeType}. House: ${item.house || 'N/A'}. Mandate: ${item.mandate?.substring(0,100) || 'N/A'}...`;
          sourceName = `Committee: ${title}`;
          url = `/committees/${item.slug || item.id}`;
          break;
        case 'Controversy':
          title = item.title || 'Untitled Controversy';
          content = `${item.description?.substring(0, 100) || 'No description.'}... (Status: ${item.status}, Severity: ${item.severityIndicator})`;
          sourceName = `Controversy: ${title.substring(0,30)}...`;
          url = `/controversies/${item.slug || item.id}`;
          break;
        case 'Election':
          title = item.name || 'Unnamed Election';
          content = `Type: ${item.electionType}, Date: ${new Date(item.date).toLocaleDateString()}. Status: ${item.status}.`;
          sourceName = `Election: ${title}`;
          url = `/elections/${item.slug || item.id}`;
          break;
        case 'News Bookmark': // Matches the type defined in followSources
          title = item.title || 'Untitled Bookmark';
          content = item.summary?.substring(0, 150) || 'No summary available.';
          if (item.summary && item.summary.length > 150) content += '...';
          sourceName = `Bookmark: ${item.sourceName || 'Unknown Source'}`;
          url = item.url || (item.slug ? `/news/${item.slug}` : `/news/${item.id}`);
          break;
        default:
          console.error(`Unknown item type for Genkit formatting: ${item.type}`, item);
          // Keep default values or skip
          break;
      }
      return { title, content, source: sourceName, url };
    });

    setGenkitFormattedUpdates(formattedUpdates);

    if (formattedUpdates.length === 0) {
      setSummaryText("There are no updates to summarize from your followed items right now. Explore and follow more content!");
      setIsLoading(false);
      return;
    }

    try {
      const summaryOutput = await summarizeUpdates({
        updates: formattedUpdates,
        userPreferences: "Focus on recent activities, significant changes, and new items. Keep summaries concise and engaging."
      });
      setSummaryText(summaryOutput.summary);
    } catch (e) {
      console.error("Error generating summary:", e);
      const errorMessage = e instanceof Error ? e.message : String(e);
      setError(`Could not generate your feed summary: ${errorMessage}`);
      setSummaryText(null);
    } finally {
      setIsLoading(false);
    }
  }, []); // No dependencies for now, getters are stable

  useEffect(() => {
    fetchFollowedDataAndSummarize();
  }, [fetchFollowedDataAndSummarize]);

  return (
    <div>
      <PageHeader
        title="Your Feed"
        description="Personalized updates from politicians, parties, and topics you follow."
        actions={
          <Button variant="outline" onClick={fetchFollowedDataAndSummarize} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Feed
          </Button>
        }
      />
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center gap-2">
            <Rss className="text-primary"/>Today's Briefing
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <p className="text-muted-foreground">Generating your personalized briefing...</p>}
          {error && <p className="text-destructive">{error}</p>}

          {!isLoading && !error && summaryText && (
            <div className="space-y-4">
              <p className="text-foreground/90 whitespace-pre-line">{summaryText}</p>
            </div>
          )}

          {/* Fallback messages if summaryText is null/empty after loading and no error */}
          {!isLoading && !error && !summaryText && followedItemsData.length > 0 && (
             <p className="text-muted-foreground">Could not generate a summary for your feed at this time. Please try refreshing.</p>
          )}

          {/* This case is now handled by the specific summaryText set when formattedUpdates.length === 0 */}
          {/* {!isLoading && !error && !summaryText && followedItemsData.length === 0 && (
            <p className="text-muted-foreground">You are not following any items yet. Explore the site and follow politicians, parties, bills, etc., to see them here!</p>
          )} */}

        </CardContent>
      </Card>

      {/*
        Optionally, keep the display of formatted items for debugging or if summary is brief.
        For now, it's removed to focus on the summary.
      */}
      {/*
      {!isLoading && genkitFormattedUpdates.length > 0 && (
        <Card className="mt-6">
          <CardHeader><CardTitle>Details for Summary</CardTitle></CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {genkitFormattedUpdates.map((update, index) => (
                <li key={index}>
                  <strong>{update.title}</strong> ({update.source})
                  <p className="text-xs text-muted-foreground">{update.content}</p>
                  <a href={update.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-xs">
                    View Item
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      */}

      {/* Placeholder for more detailed individual feed items if needed, can be removed if not planned */}
      {/*
      <div className="mt-8">
        <h3 className="font-headline text-2xl mb-4">Recent Activities (Detailed View)</h3>
        <p className="text-muted-foreground">
          (A more detailed breakdown of activities from followed entities will appear here in future updates.)
        </p>
      </div>
      */}
    </div>
  );
}
