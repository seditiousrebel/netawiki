
"use client";

import React, { useState, useEffect } from 'react';
import { getNewsArticleByIdOrSlug, getPoliticianById, getPartyById, getBillById, getPromiseById, getControversyById, getElectionById } from '@/lib/mock-data';
import { PageHeader } from '@/components/common/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, CalendarDays, UserCircle, Tag, Link as LinkIcon, CheckSquare, ShieldQuestion, Newspaper, ArrowLeft, Users, Flag, FileText, ListChecks, VoteIcon, ShieldAlert, Bookmark, BookmarkCheck, Star, History, Download, Trash2, Edit } from 'lucide-react'; // Added Download, Trash2, Edit
import { format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { exportElementAsPDF } from '@/lib/utils'; // Assuming PDF export might be added
import { getCurrentUser, canAccess, ADMIN_ROLES, isUserLoggedIn } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { SuggestEditForm } from '@/components/common/suggest-edit-form';

const LOCAL_STORAGE_BOOKMARKED_ARTICLES_KEY = 'govtrackr_bookmarked_articles';

export default function NewsArticlePage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = React.use(paramsPromise);
  const article = getNewsArticleByIdOrSlug(params.id); // Corrected function name
  const { toast } = useToast();
  const currentUser = getCurrentUser();
  const router = useRouter();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false); // For PDF export

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const [isSuggestEditModalOpen, setIsSuggestEditModalOpen] = useState(false);
  const [suggestionFieldName, setSuggestionFieldName] = useState('');
  const [suggestionOldValue, setSuggestionOldValue] = useState<string | any>('');

  useEffect(() => {
    if (article) {
      try {
        const bookmarkedArticlesStr = localStorage.getItem(LOCAL_STORAGE_BOOKMARKED_ARTICLES_KEY);
        if (bookmarkedArticlesStr) {
          const bookmarkedArticleIds: string[] = JSON.parse(bookmarkedArticlesStr);
          setIsBookmarked(bookmarkedArticleIds.includes(article.id));
        }
      } catch (error) {
        console.error("Error reading bookmarked articles from localStorage:", error);
      }
    }
  }, [article]);

  if (!article) {
    return (
      <div className="text-center py-10">
        <Newspaper className="mx-auto h-12 w-12 text-destructive" />
        <p className="mt-4 text-xl font-semibold">Article Not Found</p>
        <p className="text-muted-foreground">The article you are looking for does not exist or may have been removed.</p>
        <Link href="/news" className="mt-6 inline-block">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to News List
          </Button>
        </Link>
      </div>
    );
  }

  const handleSuggestEditClick = (fieldName: string, oldValue: any) => {
    if (!isUserLoggedIn()) {
      router.push('/auth/login');
      return;
    }
    setSuggestionFieldName(fieldName);
    setSuggestionOldValue(oldValue);
    setIsSuggestEditModalOpen(true);
  };

  const handleNewsArticleSuggestionSubmit = (suggestion: { suggestedValue: string; reason: string; evidenceUrl: string }) => {
    console.log("News Article Edit Suggestion:", {
      entityType: "NewsArticle",
      entityName: article?.title,
      fieldName: suggestionFieldName,
      oldValue: suggestionOldValue,
      ...suggestion,
    });
    toast({
      title: "Suggestion Submitted",
      description: `Edit suggestion for ${suggestionFieldName} on article '${article?.title}' submitted for review.`,
      duration: 5000,
    });
    setIsSuggestEditModalOpen(false);
  };


  const handleBookmarkToggle = () => {
    if (!article) return;
    const newBookmarkState = !isBookmarked;
    setIsBookmarked(newBookmarkState);

    try {
      const bookmarkedArticlesStr = localStorage.getItem(LOCAL_STORAGE_BOOKMARKED_ARTICLES_KEY);
      let bookmarkedArticleIds: string[] = bookmarkedArticlesStr ? JSON.parse(bookmarkedArticlesStr) : [];

      if (newBookmarkState) {
        if (!bookmarkedArticleIds.includes(article.id)) {
          bookmarkedArticleIds.push(article.id);
        }
      } else {
        bookmarkedArticleIds = bookmarkedArticleIds.filter(id => id !== article.id);
      }
      localStorage.setItem(LOCAL_STORAGE_BOOKMARKED_ARTICLES_KEY, JSON.stringify(bookmarkedArticleIds));
      toast({
        title: newBookmarkState ? `Article Bookmarked` : `Bookmark Removed`,
        description: newBookmarkState ? `"${article.title.substring(0,30)}..." added to bookmarks.` : `"${article.title.substring(0,30)}..." removed from bookmarks.`,
        duration: 3000,
      });
    } catch (error) {
      console.error("Error updating bookmarked articles in localStorage:", error);
      toast({
        title: "Could not update bookmark",
        description: "There was an issue saving your bookmark preference. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
      setIsBookmarked(!newBookmarkState); // Revert state
    }
  };

  const handleRatingSubmit = () => {
    if (currentRating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a star rating before submitting.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    console.log("Article Rating Submitted:", { articleId: article.id, rating: currentRating });
    toast({
      title: "Review Submitted (Demo)",
      description: `You rated this article ${currentRating} star(s).`,
      duration: 5000,
    });
  };

  const renderTaggedEntities = () => {
    const entities: React.ReactNode[] = [];

    article.taggedPoliticianIds?.forEach(id => {
      const politician = getPoliticianById(id);
      if (politician) entities.push(
        <Link key={`pol-${id}`} href={`/politicians/${politician.id}`} className="text-primary hover:underline flex items-center gap-1 text-sm">
          <UserCircle className="h-4 w-4" /> {politician.name}
        </Link>
      );
    });
    article.taggedPartyIds?.forEach(id => {
      const party = getPartyById(id);
      if (party) entities.push(
        <Link key={`party-${id}`} href={`/parties/${party.id}`} className="text-primary hover:underline flex items-center gap-1 text-sm">
          <Flag className="h-4 w-4" /> {party.name}
        </Link>
      );
    });
     article.taggedBillIds?.forEach(id => {
      const bill = getBillById(id);
      if (bill) entities.push(
        <Link key={`bill-${id}`} href={`/bills/${bill.slug || bill.id}`} className="text-primary hover:underline flex items-center gap-1 text-sm">
          <FileText className="h-4 w-4" /> {bill.title} ({bill.billNumber})
        </Link>
      );
    });
    article.taggedPromiseIds?.forEach(id => {
      const promise = getPromiseById(id);
      if (promise) entities.push(
        <Link key={`promise-${id}`} href={`/promises/${promise.slug || promise.id}`} className="text-primary hover:underline flex items-center gap-1 text-sm">
          <ListChecks className="h-4 w-4" /> {promise.title}
        </Link>
      );
    });
    article.taggedControversyIds?.forEach(id => {
      const controversy = getControversyById(id);
      if (controversy) entities.push(
        <Link key={`controversy-${id}`} href={`/controversies/${controversy.slug || controversy.id}`} className="text-primary hover:underline flex items-center gap-1 text-sm">
          <ShieldAlert className="h-4 w-4" /> {controversy.title}
        </Link>
      );
    });
    article.taggedElectionIds?.forEach(id => {
      const election = getElectionById(id);
      if (election) entities.push(
        <Link key={`election-${id}`} href={`/elections/${election.slug || election.id}`} className="text-primary hover:underline flex items-center gap-1 text-sm">
          <VoteIcon className="h-4 w-4" /> {election.name}
        </Link>
      );
    });

    return entities.length > 0 ? (
      <div className="space-y-1.5">
        {entities.map((entity, index) => <div key={index}>{entity}</div>)}
      </div>
    ) : <p className="text-sm text-muted-foreground">No specific entities tagged.</p>;
  };

  async function handleExportPdf() {
    if (!article) return;
    const fileName = `article-${(article.slug || article.id).toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`;
    await exportElementAsPDF('news-article-export-area', fileName, setIsGeneratingPdf);
  }

  const handleDeleteArticle = () => {
    if (!article) return;
    alert(`Mock delete action for article: ${article.title}`);
  };


  return (
    <div>
      <PageHeader
        title={article.title}
        description={
          <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
            {article.authorName && <span className="flex items-center gap-1.5"><UserCircle className="h-4 w-4"/>By {article.authorName}</span>}
            <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4"/>Published: {format(new Date(article.publicationDate), 'MMMM dd, yyyy')}</span>
            <span className="flex items-center gap-1.5"><Newspaper className="h-4 w-4"/>Source: {article.sourceName}</span>
          </div>
        }
        actions={
          <div className="flex gap-2">
            {/* Original actions based on article type */}
            {article.isAggregated && article.url ? (
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="flex items-center gap-2">
                  View Original Article <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            ) : (
              <Link href="/news">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" /> Back to News
                </Button>
              </Link>
            )}
            {/* Suggest Edit, Export, and Delete buttons */}
            {!article.isAggregated && ( // Assuming suggest edit is not for aggregated articles
                 <Button variant="outline" onClick={() => handleSuggestEditClick('Full Content', article.fullContent || article.summary || '')} >
                    <Edit className="mr-2 h-4 w-4" /> Suggest Edit
                 </Button>
            )}
            <Button variant="outline" onClick={handleExportPdf} disabled={isGeneratingPdf}>
              <Download className="mr-2 h-4 w-4" /> {isGeneratingPdf ? 'Generating PDF...' : 'Export Article'}
            </Button>
            {canAccess(currentUser.role, ADMIN_ROLES) && (
              <Button variant="destructive" onClick={handleDeleteArticle}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete Article
              </Button>
            )}
          </div>
        }
      />

      <SuggestEditForm
        isOpen={isSuggestEditModalOpen}
        onOpenChange={setIsSuggestEditModalOpen}
        entityType="NewsArticle"
        entityName={article?.title || ''}
        fieldName={suggestionFieldName}
        oldValue={suggestionOldValue}
        onSubmit={handleNewsArticleSuggestionSubmit}
      />

      <div id="news-article-export-area" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {article.dataAiHint && (
            <div className="mb-6 rounded-lg overflow-hidden shadow-lg">
              <Image
                src={`https://placehold.co/800x400.png`}
                alt={article.title}
                width={800}
                height={400}
                className="w-full object-cover"
                data-ai-hint={article.dataAiHint}
              />
            </div>
          )}

          <div className="mb-4">
            <Button onClick={handleBookmarkToggle} variant={isBookmarked ? "default" : "outline"} className="w-full sm:w-auto">
              {isBookmarked ? <BookmarkCheck className="mr-2 h-4 w-4" /> : <Bookmark className="mr-2 h-4 w-4" />}
              {isBookmarked ? "Bookmarked" : "Bookmark Article"}
            </Button>
          </div>

          {article.isFactCheck && (
            <Card className="bg-yellow-50 border-yellow-300 shadow-md">
              <CardHeader>
                <CardTitle className="font-headline text-xl text-yellow-700 flex items-center gap-2">
                  <CheckSquare className="h-6 w-6"/> GovTrackr Fact Check
                </CardTitle>
              </CardHeader>
              {article.summary && <CardContent><p className="text-yellow-800 italic">{article.summary}</p></CardContent>}
            </Card>
          )}

          {article.fullContent ? (
            <Card>
              <CardContent className="pt-6 prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: article.fullContent.replace(/\n/g, '<br />') }} />
              </CardContent>
            </Card>
          ) : article.isAggregated && article.summary ? (
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-lg">Summary from {article.sourceName}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-foreground/80 whitespace-pre-line">{article.summary}</p>
                    {article.url && (
                        <a href={article.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block">
                            <Button variant="link" className="p-0 h-auto text-primary items-center">
                                Read full article on {article.sourceName} <ExternalLink className="ml-1 h-3 w-3" />
                            </Button>
                        </a>
                    )}
                </CardContent>
            </Card>
          ) : (
            <p className="text-muted-foreground">Full article content not available for this aggregated link. Please refer to the original source.</p>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" /> Rate this Article
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="mb-2 text-sm font-medium">Your Rating:</p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-7 w-7 cursor-pointer transition-colors ${
                        (hoverRating || currentRating) >= star
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300 hover:text-yellow-300'
                      }`}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setCurrentRating(star)}
                    />
                  ))}
                </div>
              </div>
              <Button onClick={handleRatingSubmit} className="w-full sm:w-auto" disabled={currentRating === 0}>
                Submit Review
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">Comments & Discussion</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">(Comments feature coming soon.)</p>
            </CardContent>
          </Card>

          {/* Revision History Card - Assuming article.revisionHistory is available */}
          {article.revisionHistory && article.revisionHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                  <History className="h-5 w-5 text-primary"/> Revision History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {article.revisionHistory.map((event) => (
                    <li key={event.id} className="border-b pb-3 last:border-b-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-md">{event.event}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(event.date).toLocaleDateString()} by {event.author}
                        </span>
                      </div>
                      {event.details && <p className="text-sm text-foreground/80 mb-1">{event.details}</p>}
                      {event.suggestionId && (
                        <div className="text-xs text-muted-foreground">
                          Based on suggestion: <Badge variant="outline" className="font-mono text-xs">{event.suggestionId}</Badge>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-lg flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary"/> Article Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {article.category && (
                <div className="text-sm">
                  <strong>Category:</strong> <Badge variant="secondary">{article.category}</Badge>
                </div>
              )}
              {article.topics && article.topics.length > 0 && (
                <div className="text-sm">
                  <strong>Topics:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {article.topics.map(topic => <Badge key={topic} variant="outline">{topic}</Badge>)}
                  </div>
                </div>
               )}
               {article.isFactCheck && (
                <div className="text-sm flex items-center gap-1 font-medium text-yellow-700">
                  <CheckSquare className="h-4 w-4"/> This is a Fact-Check article.
                </div>
              )}
               {article.isAggregated && (
                <div className="text-sm flex items-center gap-1">
                  <ShieldQuestion className="h-4 w-4"/> This article is aggregated from an external source.
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-lg flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-primary"/> Related Entities
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderTaggedEntities()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

