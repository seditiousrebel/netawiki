import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { summarizeUpdates } from '@/ai/flows/summarize-updates'; // GenAI flow
import { Rss, RefreshCw } from 'lucide-react';

// Mock function to simulate fetching updates
async function getMockUpdatesForUser() {
  // In a real app, this would fetch updates based on user's followed entities
  return [
    { title: "Senator Alice comments on new bill", content: "Senator Alice expressed concerns regarding the new infrastructure bill, highlighting potential environmental impacts.", source: "Capitol News", url: "https://example.com/news/alice-bill-comments" },
    { title: "Blue Unity Party releases new platform", content: "The Blue Unity Party today unveiled its updated platform, focusing on climate change and healthcare reform.", source: "Party Press Release", url: "https://example.com/blue-unity-platform" },
    { title: "Promise Tracker Update: Park Project", content: "The public parks improvement project led by Senator Alice is now 50% complete according to recent reports.", source: "GovTrackr Internal", url: "https://example.com/promises/pr1-update" },
  ];
}

// This component must be a Client Component if it uses hooks like useState or useEffect for the summary.
// However, if we want to use the Server Action directly on load, it can be a Server Component.
// Let's make it a Server Component that fetches and displays the summary.
export default async function FeedPage() {
  let summaryResult = null;
  let error = null;

  try {
    const updates = await getMockUpdatesForUser();
    if (updates.length > 0) {
      summaryResult = await summarizeUpdates({ 
        updates, 
        userPreferences: "Focus on environmental policy and healthcare reform. Keep summaries brief." 
      });
    }
  } catch (e) {
    console.error("Error generating summary:", e);
    error = "Could not generate your feed summary at this time.";
  }

  return (
    <div>
      <PageHeader
        title="Your Feed"
        description="Personalized updates from politicians and parties you follow."
        actions={
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh Feed
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
          {error && <p className="text-destructive">{error}</p>}
          {!summaryResult && !error && (
            <p className="text-muted-foreground">No new updates to summarize, or your feed is being generated. Check back soon!</p>
          )}
          {summaryResult && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Summary:</h3>
              <p className="text-foreground/90 whitespace-pre-line">{summaryResult.summary}</p>
              <p className="text-xs text-muted-foreground pt-2 border-t">
                {summaryResult.progress}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Placeholder for individual feed items if not summarizing all */}
      <div className="mt-8">
        <h3 className="font-headline text-2xl mb-4">Recent Activities</h3>
        <p className="text-muted-foreground">
          (Individual feed items from followed entities will appear here in future updates.)
        </p>
         {/* Example of how individual items might look (static for now) */}
        <div className="mt-4 space-y-4">
            <Card>
                <CardContent className="p-4">
                    <p className="font-semibold">Senator Alice comments on new bill</p>
                    <p className="text-sm text-muted-foreground">Capitol News - 2 hours ago</p>
                </CardContent>
            </Card>
             <Card>
                <CardContent className="p-4">
                    <p className="font-semibold">Blue Unity Party releases new platform</p>
                    <p className="text-sm text-muted-foreground">Party Press Release - 5 hours ago</p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
