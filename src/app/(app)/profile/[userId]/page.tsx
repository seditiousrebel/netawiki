
"use client";

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { UserCircle, Mail, CalendarDays, Heart, Edit3, Award, Star, CheckCheck, ExternalLink, Building, FileText, Newspaper, ShieldAlert, ListChecks, PackageOpen, MessageSquare, CheckCircle, XCircle, Clock, Search, Loader2 } from 'lucide-react'; // Added icons, Search, Loader2
import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Added Button
import {
  getPoliticianById,
  getPartyById,
  getPromiseById,
  getBillById,
  getNewsArticleByIdOrSlug,
  mockNewsArticles, // Fallback
} from '@/lib/mock-data';
import {
  mockEditSuggestions, // Import mock edit suggestions
  mockPendingEdits, // Import mock pending edits
} from '@/lib/data/suggestions'; // Corrected path
import type { Politician, Party, PromiseItem, Bill, NewsArticleLink, EditSuggestion, PendingEdit } from '@/types/gov'; // Added EditSuggestion, PendingEdit

// localStorage keys
const LOCAL_STORAGE_FOLLOWED_POLITICIANS_KEY = 'govtrackr_followed_politicians';
const LOCAL_STORAGE_FOLLOWED_PARTIES_KEY = 'govtrackr_followed_parties';
const LOCAL_STORAGE_FOLLOWED_PROMISES_KEY = 'govtrackr_followed_promises';
const LOCAL_STORAGE_FOLLOWED_BILLS_KEY = 'govtrackr_followed_bills';
const LOCAL_STORAGE_BOOKMARKED_NEWS_KEY = 'govtrackr_bookmarked_news';

interface FollowedItem {
  id: string;
  name: string;
  type: string;
  link: string;
  icon?: React.ElementType;
}

// Mock user data for now, can be replaced with actual user data if available
const MOCK_USER = {
  name: 'Demo User',
  email: 'user@example.com',
  joinDate: 'January 1, 2024',
  avatarFallback: 'DU',
  // avatarImage: 'https://placehold.co/100x100.png' // Optional: if you want a placeholder image
};

export default function UserProfilePage({ params: paramsPromise }: { params: Promise<{ userId: string }> }) {
  const params = React.use(paramsPromise);
  const { userId } = params; // Get userId from params

  const [followedItems, setFollowedItems] = useState<FollowedItem[]>([]);
  const [loadingFollowed, setLoadingFollowed] = useState(true);
  const [userEditSuggestions, setUserEditSuggestions] = useState<EditSuggestion[]>([]);
  const [userNewEntrySuggestions, setUserNewEntrySuggestions] = useState<PendingEdit[]>([]);


  // For now, userId from params is not used, profile displays for a generic mock user.
  // In a real app, params.userId would be used to fetch specific user data.

  const getNewsArticleFallback = (idOrSlug: string): NewsArticleLink | undefined => {
    return mockNewsArticles.find(news => news.id === idOrSlug || news.slug === idOrSlug);
  };
  const actualGetNewsArticleByIdOrSlug = typeof getNewsArticleByIdOrSlug === 'function' ? getNewsArticleByIdOrSlug : getNewsArticleFallback;

  useEffect(() => {
    setLoadingFollowed(true);
    const items: FollowedItem[] = [];

    const getArrayFromLocalStorage = (key: string): string[] => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : [];
      } catch (error) {
        console.error(`Error parsing localStorage key "${key}":`, error);
        return [];
      }
    };

    const followedPoliticianIds = getArrayFromLocalStorage(LOCAL_STORAGE_FOLLOWED_POLITICIANS_KEY);
    followedPoliticianIds.forEach(id => {
      const politician = getPoliticianById(id);
      if (politician) {
        items.push({ id: politician.id, name: politician.name, type: 'Politician', link: `/politicians/${politician.id}`, icon: UserCircle });
      }
    });

    const followedPartyIds = getArrayFromLocalStorage(LOCAL_STORAGE_FOLLOWED_PARTIES_KEY);
    followedPartyIds.forEach(id => {
      const party = getPartyById(id);
      if (party) {
        items.push({ id: party.id, name: party.name, type: 'Party', link: `/parties/${party.id}`, icon: Building });
      }
    });

    const followedPromiseIds = getArrayFromLocalStorage(LOCAL_STORAGE_FOLLOWED_PROMISES_KEY);
    followedPromiseIds.forEach(id => {
      const promise = getPromiseById(id);
      if (promise) {
        items.push({ id: promise.id, name: promise.title, type: 'Promise', link: `/promises#${promise.id}`, icon: ListChecks });
      }
    });

    const followedBillIds = getArrayFromLocalStorage(LOCAL_STORAGE_FOLLOWED_BILLS_KEY);
    followedBillIds.forEach(id => {
      const bill = getBillById(id);
      if (bill) {
        items.push({ id: bill.id, name: bill.title, type: 'Bill', link: `/bills/${bill.id}`, icon: FileText });
      }
    });

    const bookmarkedNewsIds = getArrayFromLocalStorage(LOCAL_STORAGE_BOOKMARKED_NEWS_KEY);
    bookmarkedNewsIds.forEach(id => {
      const news = actualGetNewsArticleByIdOrSlug(id);
      if (news) {
        items.push({ id: news.id, name: news.title, type: 'News', link: news.url || (news.slug ? `/news/${news.slug}` : '#'), icon: Newspaper });
      }
    });

    // For demonstration, adding a mock followed controversy as it's not in localStorage yet
    // items.push({ id: 'c1', name: 'Water Rights Debate', type: 'Controversy', link: '/controversies/c1', icon: ShieldAlert });


    setFollowedItems(items);
    setLoadingFollowed(false);
  }, []); // Removed userId from dependency array as it's from params and won't change for this instance

  useEffect(() => {
    // Filter suggestions for the current user
    const filteredEditSuggestions = mockEditSuggestions.filter(
      (suggestion) => suggestion.submittedBy === userId
    );
    setUserEditSuggestions(filteredEditSuggestions);

    const filteredNewEntrySuggestions = mockPendingEdits.filter(
      (suggestion) => suggestion.submittedByUserId === userId
    );
    setUserNewEntrySuggestions(filteredNewEntrySuggestions);
  }, [userId]); // Re-filter if userId changes (though not expected in this page structure)

  const getEntityName = (suggestion: EditSuggestion | PendingEdit): string => {
    if ('contentType' in suggestion) { // It's an EditSuggestion
      const { contentType, contentId } = suggestion;
      switch (contentType) {
        case 'politician':
          return getPoliticianById(contentId)?.name || 'Unknown Politician';
        case 'party':
          return getPartyById(contentId)?.name || 'Unknown Party';
        case 'bill':
          return getBillById(contentId)?.title || 'Unknown Bill';
        // Add other cases as needed
        default:
          return `Entity ID: ${contentId}`;
      }
    } else { // It's a PendingEdit (New Entry)
      const { entityType, proposedData } = suggestion;
      return proposedData.name || proposedData.title || `New ${entityType}`;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
      case 'denied':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <PageHeader title="User Profile" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Information Card - Will be implemented in next step */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle className="h-6 w-6 text-primary" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  {MOCK_USER.avatarImage && <AvatarImage src={MOCK_USER.avatarImage} alt={MOCK_USER.name} />}
                  <AvatarFallback>{MOCK_USER.avatarFallback}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-semibold">{MOCK_USER.name}</h2>
                  <p className="text-sm text-muted-foreground">@{params.userId === "current-user" ? "demouser123" : params.userId}</p>
                  {/* Displaying a mock username or the userId from param */}
                </div>
              </div>
              <div>
                <div className="flex items-center text-sm text-muted-foreground mb-1">
                  <Mail className="h-4 w-4 mr-2 text-primary" />
                  <span>{MOCK_USER.email}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4 mr-2 text-primary" />
                  <span>Joined: {MOCK_USER.joinDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          {/* Followed Items Card - Will be implemented in next step */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-primary" />
                Followed Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingFollowed ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <p className="ml-2 text-sm text-muted-foreground">Loading followed items...</p>
                </div>
              ) : followedItems.length > 0 ? (
                <ul className="space-y-3">
                  {followedItems.map(item => (
                    <li key={`${item.type}-${item.id}`} className="flex items-center justify-between p-2 hover:bg-accent/50 rounded-md transition-colors">
                      <Link href={item.link} className="flex items-center gap-3 group">
                        {item.icon && <item.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />}
                        <span className="group-hover:text-primary transition-colors">{item.name}</span>
                      </Link>
                      <Badge variant="outline" className="text-xs">{item.type}</Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-6">
                  <Heart className="mx-auto h-10 w-10 text-muted-foreground opacity-50" />
                  <h3 className="mt-2 text-md font-medium">Nothing Followed Yet</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    You haven't followed any items. Use the "Follow" button on politicians, parties, bills, etc.
                  </p>
                  <Button asChild className="mt-4" size="sm">
                    <Link href="/explore">Explore & Follow</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contributions Card - Will be implemented in next step */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit3 className="h-6 w-6 text-primary" />
                My Contributions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-sm">
              {/* Edit Suggestions Section */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-md font-semibold flex items-center">
                    <Edit3 className="h-5 w-5 mr-2 text-primary" />
                    Edit Suggestions ({userEditSuggestions.length})
                  </h3>
                  <Badge variant="secondary">
                    {userEditSuggestions.filter(s => s.status === 'Approved').length} Approved, {' '}
                    {userEditSuggestions.filter(s => s.status === 'Pending').length} Pending, {' '}
                    {userEditSuggestions.filter(s => s.status === 'Rejected').length} Rejected
                  </Badge>
                </div>
                {userEditSuggestions.length > 0 ? (
                  <ul className="space-y-3">
                    {userEditSuggestions.map(suggestion => (
                      <li key={suggestion.id} className="p-3 border rounded-md bg-muted/20 hover:bg-muted/40 transition-colors">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-primary-foreground">
                            Edit for {suggestion.contentType}: {getEntityName(suggestion)} (Field: {suggestion.fieldName})
                          </span>
                          <Badge variant={
                            suggestion.status === 'Approved' ? 'default' :
                            suggestion.status === 'Rejected' ? 'destructive' : 'outline'
                          } className="flex items-center gap-1 text-xs">
                            {getStatusIcon(suggestion.status)}
                            {suggestion.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1 truncate" title={String(suggestion.suggestedValue)}>
                          Suggested: {String(suggestion.suggestedValue).substring(0, 100)}{String(suggestion.suggestedValue).length > 100 ? '...' : ''}
                        </p>
                        {suggestion.adminFeedback && (
                           <p className="text-xs text-amber-600 dark:text-amber-400 border-l-2 border-amber-500 pl-2 mt-1">
                            Admin Feedback: {suggestion.adminFeedback}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground text-xs">No edit suggestions submitted yet.</p>
                )}
              </div>

              {/* New Entry Suggestions Section */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-md font-semibold flex items-center">
                    <PackageOpen className="h-5 w-5 mr-2 text-primary" /> {/* Using PackageOpen for new entries */}
                    New Entry Suggestions ({userNewEntrySuggestions.length})
                  </h3>
                   <Badge variant="secondary">
                    {userNewEntrySuggestions.filter(s => s.status === 'APPROVED').length} Approved, {' '}
                    {userNewEntrySuggestions.filter(s => s.status === 'PENDING').length} Pending, {' '}
                    {userNewEntrySuggestions.filter(s => s.status === 'DENIED').length} Rejected
                  </Badge>
                </div>
                {userNewEntrySuggestions.length > 0 ? (
                  <ul className="space-y-3">
                    {userNewEntrySuggestions.map(suggestion => (
                      <li key={suggestion.id} className="p-3 border rounded-md bg-muted/20 hover:bg-muted/40 transition-colors">
                        <div className="flex items-center justify-between mb-1">
                           <span className="font-medium text-primary-foreground">
                            New {suggestion.entityType}: {getEntityName(suggestion)}
                          </span>
                           <Badge variant={
                            suggestion.status === 'APPROVED' ? 'default' :
                            suggestion.status === 'DENIED' ? 'destructive' : 'outline'
                          } className="flex items-center gap-1 text-xs">
                            {getStatusIcon(suggestion.status)}
                            {suggestion.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">Reason: {suggestion.reasonForChange}</p>
                        {suggestion.adminFeedback && (
                          <p className="text-xs text-amber-600 dark:text-amber-400 border-l-2 border-amber-500 pl-2 mt-1">
                            Admin Feedback: {suggestion.adminFeedback}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground text-xs">No new entry suggestions submitted yet.</p>
                )}
              </div>

              {/* Placeholder for Ratings & Reviews - can be implemented later */}
              {/* <div className="flex justify-between items-center p-2 bg-muted/30 rounded-md">
                <span>Ratings & Reviews Submitted:</span>
                <Badge variant="secondary">0</Badge>
              </div> */}
            </CardContent>
          </Card>

          {/* Gamification/Badges Card - Kept as is */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-6 w-6 text-primary" />
                Achievements & Badges
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2 text-center">Total Contribution Score</h3>
                <p className="text-4xl font-bold text-primary text-center">175</p>
                <p className="text-xs text-muted-foreground text-center mt-1">Keep contributing to earn more points and badges!</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-md font-medium mb-1">Badges Earned:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { icon: Award, title: "Community Helper", description: "Submitted 5+ approved suggestions.", color: "text-green-500" },
                    { icon: Star, title: "Fact Finder", description: "First to suggest a critical data update.", color: "text-yellow-500" },
                    { icon: CheckCheck, title: "Prolific Reviewer", description: "Provided 10+ helpful reviews.", color: "text-blue-500" },
                  ].map((badge, index) => (
                    <div key={index} className="flex flex-col items-center text-center p-3 border rounded-lg bg-card shadow-sm">
                      <badge.icon className={`h-10 w-10 mb-2 ${badge.color}`} />
                      <h4 className="text-sm font-semibold mb-0.5">{badge.title}</h4>
                      <p className="text-xs text-muted-foreground">{badge.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
