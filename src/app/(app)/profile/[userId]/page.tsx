"use client";

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { UserCircle, Mail, CalendarDays, Heart, Edit3, Award, Star, CheckCheck, ExternalLink, Building, FileText, Newspaper, ShieldAlert, ListChecks } from 'lucide-react';
import Link from 'next/link';
import {
  getPoliticianById,
  getPartyById,
  getPromiseById,
  getBillById,
  getNewsArticleByIdOrSlug, // Assuming this getter exists from previous tasks
  mockNews // Fallback
} from '@/lib/mock-data';
import type { Politician, Party, PromiseItem, Bill, NewsArticleLink } from '@/types/gov';

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

export default function UserProfilePage({ params }: { params: { userId: string } }) {
  const [followedItems, setFollowedItems] = useState<FollowedItem[]>([]);
  const [loadingFollowed, setLoadingFollowed] = useState(true);

  // For now, userId from params is not used, profile displays for a generic mock user.
  // In a real app, params.userId would be used to fetch specific user data.

  const getNewsArticleFallback = (idOrSlug: string): NewsArticleLink | undefined => {
    return mockNews.find(news => news.id === idOrSlug || news.slug === idOrSlug);
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
  }, []);

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
                <p>Loading followed items...</p>
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
                <p className="text-muted-foreground">No followed items yet. Start following politicians, parties, and more to see them here!</p>
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
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-2 bg-muted/30 rounded-md">
                <span>Edit Suggestions Submitted:</span>
                <Badge variant="secondary">5</Badge>
              </div>
              <ul className="list-disc list-inside pl-4 text-xs text-muted-foreground">
                <li>Approved: <span className="font-semibold">3</span></li>
                <li>Rejected: <span className="font-semibold">1</span></li>
                <li>Pending: <span className="font-semibold">1</span></li>
              </ul>

              <div className="flex justify-between items-center p-2 bg-muted/30 rounded-md">
                <span>New Entry Suggestions Submitted:</span>
                <Badge variant="secondary">2</Badge>
              </div>
              <ul className="list-disc list-inside pl-4 text-xs text-muted-foreground">
                <li>Approved: <span className="font-semibold">1</span></li>
                <li>Pending: <span className="font-semibold">1</span></li>
              </ul>

              <div className="flex justify-between items-center p-2 bg-muted/30 rounded-md">
                <span>Ratings & Reviews Submitted:</span>
                <Badge variant="secondary">12</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Gamification/Badges Card - Will be implemented in next step */}
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
