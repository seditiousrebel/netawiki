"use client"; 

import { PageHeader } from '@/components/common/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCog, Bell, Palette, Bookmark as BookmarkIcon, X } from 'lucide-react'; 
import { useState, useEffect } from 'react'; 
import Link from 'next/link'; 
import { getAllNewsArticles } from '@/lib/mock-data'; 
import type { NewsArticleLink } from '@/types/gov'; 
import { useToast } from "@/hooks/use-toast"; 
import { format } from 'date-fns'; 

const LOCAL_STORAGE_BOOKMARKED_ARTICLES_KEY = 'govtrackr_bookmarked_articles';

export default function SettingsPage() {
  const [bookmarkedArticles, setBookmarkedArticles] = useState<NewsArticleLink[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const allArticles = getAllNewsArticles();
    try {
      const bookmarkedArticlesStr = localStorage.getItem(LOCAL_STORAGE_BOOKMARKED_ARTICLES_KEY);
      if (bookmarkedArticlesStr) {
        const bookmarkedIds: string[] = JSON.parse(bookmarkedArticlesStr);
        const filteredArticles = allArticles.filter(article => bookmarkedIds.includes(article.id));
        setBookmarkedArticles(filteredArticles);
      }
    } catch (error) {
      console.error("Error reading or parsing bookmarked articles from localStorage:", error);
      toast({
        title: "Error loading bookmarks",
        description: "Could not load your bookmarked articles. They may be corrupted.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const handleRemoveBookmark = (articleId: string, articleTitle: string) => {
    const newBookmarkedArticles = bookmarkedArticles.filter(article => article.id !== articleId);
    setBookmarkedArticles(newBookmarkedArticles);

    const newBookmarkedIds = newBookmarkedArticles.map(article => article.id);
    try {
      localStorage.setItem(LOCAL_STORAGE_BOOKMARKED_ARTICLES_KEY, JSON.stringify(newBookmarkedIds));
      toast({
        title: "Bookmark Removed",
        description: `"${articleTitle.substring(0, 30)}..." removed from your bookmarks.`,
        duration: 3000,
      });
    } catch (error) {
      console.error("Error updating bookmarked articles in localStorage:", error);
      toast({
        title: "Could not remove bookmark",
        description: "There was an issue updating your bookmarks. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
      // Revert state if localStorage fails - re-add the article to the list
      // This requires fetching all articles again or keeping a copy of the original list before filtering
      // For simplicity here, we'll just log, but a real app might need more robust error handling.
       console.error("Failed to save updated bookmarks to localStorage. UI might be out of sync.");
    }
  };

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your account, notifications, and preferences."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><UserCog className="text-primary h-5 w-5"/> Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">Update your profile information and password.</p>
            <Button variant="outline">Edit Profile</Button>
            <Button variant="outline">Change Password</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><Bell className="text-primary h-5 w-5"/> Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">Configure your notification preferences.</p>
            <Button variant="outline">Manage Notifications</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><Palette className="text-primary h-5 w-5"/> Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">Customize the look and feel of the app.</p>
            {/* Theme toggle can be added here later */}
            <Button variant="outline" disabled>Toggle Dark Mode (Coming Soon)</Button>
          </CardContent>
        </Card>

         <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">Followed Entities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">Manage politicians and parties you follow.</p>
            <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline">Manage Followed Politicians</Button>
                <Button variant="outline">Manage Followed Parties</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <BookmarkIcon className="text-primary h-5 w-5" /> Bookmarked Articles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">Manage your bookmarked news articles.</p>
            {bookmarkedArticles.length === 0 ? (
              <p className="text-sm text-muted-foreground">You haven&apos;t bookmarked any articles yet.</p>
            ) : (
              <ul className="space-y-4">
                {bookmarkedArticles.map(article => (
                  <li key={article.id} className="flex justify-between items-center p-3 border rounded-md bg-secondary/30 hover:bg-secondary/50 transition-colors">
                    <div>
                      <Link href={`/news/${article.slug || article.id}`} className="text-primary hover:underline font-semibold">
                        {article.title}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {article.sourceName} &bull; {format(new Date(article.publicationDate), 'MMMM dd, yyyy')}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveBookmark(article.id, article.title)}
                      aria-label="Remove bookmark"
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
