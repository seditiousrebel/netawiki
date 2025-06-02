"use client";

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import Link from 'next/link';
// Removed direct imports from mock-data as activities are now self-contained or resolved by mock-activity
import { getFollowedItems, FollowableEntityType } from '@/lib/user';
import { getMockActivities, ActivityItem } from '@/lib/mock-activity';

// localStorage keys removed

interface FeedItem { // This structure is kept as the target for mapping
  type: FollowableEntityType | string; // Use FollowableEntityType or string for custom types
  date: string;
  text: string;
  link?: string;
  title?: string;
  source?: string;
  actorName?: string; // Politician name, Party name, or ActivityItem.actorName
}

export default function FeedPage() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fallback function for news articles removed as it's not used with mock-activity

  useEffect(() => {
    setLoading(true);
    const allActivities = getMockActivities();
    const followedEntityKeys = new Set<string>(); // Stores keys like "politician:id1", "party:id2"

    const relevantEntityTypes: FollowableEntityType[] = ['politician', 'party', 'promise', 'bill', 'news'];

    relevantEntityTypes.forEach(type => {
      const ids = getFollowedItems(type);
      ids.forEach(id => followedEntityKeys.add(`${type}:${id}`));
    });

    const userFeedActivities = allActivities.filter(activity => {
      return followedEntityKeys.has(`${activity.entityType}:${activity.entityId}`);
    });

    const mappedFeedItems: FeedItem[] = userFeedActivities.map(activity => ({
      type: activity.entityType, // Retains the specific entity type
      date: activity.timestamp,
      title: activity.title, // Uses the title from ActivityItem
      text: activity.description, // Uses description from ActivityItem
      link: activity.link,
      actorName: activity.entityName || activity.actorName, // Uses entityName or actorName from ActivityItem
      source: activity.entityType === 'news' ? activity.actorName : undefined, // If news, actorName is the source
    }));

    // Sort all updates by date
    mappedFeedItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setFeedItems(mappedFeedItems);
    setLoading(false);

  }, [refreshTrigger]);


  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div>
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
