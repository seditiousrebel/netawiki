
"use client";

import { getPromiseById, getPoliticianById, getPartyById, getNewsByPromiseId } from '@/lib/mock-data';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
// import { getCurrentUser, canAccess, EDITOR_ROLES } from '@/lib/auth'; // No longer needed for this button
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TimelineDisplay, formatPromiseStatusUpdatesForTimeline } from '@/components/common/timeline-display';
import { Edit, Users2, User, ClipboardList, AlertTriangle, Info, FileText, CalendarClock, CalendarCheck2, Percent, Landmark, Link2, ExternalLink, History, CheckCircle, RefreshCw, XCircle, Star, UserPlus, Newspaper, Tag, Trash2 } from 'lucide-react'; // Removed Download
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import type { PromiseItem, PromiseStatus, PromiseEvidenceLink, PromiseStatusUpdate, NewsArticleLink } from '@/types/gov';
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
// import { exportElementAsPDF } from '@/lib/utils'; // Removed PDF export
import { getCurrentUser, canAccess, ADMIN_ROLES, isUserLoggedIn } from '@/lib/auth';
import { useRouter } from 'next/navigation';
// import { SuggestEditForm } from '@/components/common/suggest-edit-form'; // Removed
import { SuggestEntityEditForm } from '@/components/common/SuggestEntityEditForm'; // Added
import { entitySchemas } from '@/lib/schemas'; // Added
import type { EntityType } from '@/lib/data/suggestions'; // Added

const LOCAL_STORAGE_FOLLOWED_PROMISES_KEY = 'govtrackr_followed_promises';

function getStatusVisuals(status: PromiseStatus): { icon: React.ReactNode; badgeClass: string; } {
  switch (status) {
    case 'Fulfilled':
      return { icon: <CheckCircle className="h-5 w-5 text-green-700" />, badgeClass: 'border-green-500 text-green-700 bg-green-50' };
    case 'In Progress':
      return { icon: <RefreshCw className="h-5 w-5 text-blue-700 animate-spin-slow" />, badgeClass: 'border-blue-500 text-blue-700 bg-blue-50' };
    case 'Pending':
      return { icon: <CalendarClock className="h-5 w-5 text-yellow-700" />, badgeClass: 'border-yellow-500 text-yellow-700 bg-yellow-50' };
    case 'Broken':
      return { icon: <XCircle className="h-5 w-5 text-red-700" />, badgeClass: 'border-red-500 text-red-700 bg-red-50' };
    case 'Stalled':
      return { icon: <AlertTriangle className="h-5 w-5 text-orange-600" />, badgeClass: 'border-orange-500 text-orange-600 bg-orange-50' };
    case 'Modified':
      return { icon: <Info className="h-5 w-5 text-purple-600" />, badgeClass: 'border-purple-500 text-purple-600 bg-purple-50' };
    case 'Cancelled':
      return { icon: <XCircle className="h-5 w-5 text-slate-600" />, badgeClass: 'border-slate-500 text-slate-600 bg-slate-50' };
    case 'Partially Fulfilled':
      return { icon: <CheckCircle className="h-5 w-5 text-teal-600" />, badgeClass: 'border-teal-500 text-teal-600 bg-teal-50' };
    default:
      return { icon: <AlertTriangle className="h-5 w-5 text-gray-700" />, badgeClass: 'border-gray-500 text-gray-700 bg-gray-50' };
  }
}

export default function PromiseDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = React.use(paramsPromise);
  const promise = getPromiseById(params.id);
  const { toast } = useToast();
  const currentUser = getCurrentUser();
  const router = useRouter();
  // const [isGeneratingPdf, setIsGeneratingPdf] = useState(false); // Removed For PDF export

  const [isFollowingPromise, setIsFollowingPromise] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [relatedNews, setRelatedNews] = useState<NewsArticleLink[]>([]);

  // const [isSuggestEditModalOpen, setIsSuggestEditModalOpen] = useState(false); // Old form state - Removed
  // const [suggestionFieldName, setSuggestionFieldName] = useState(''); // Old form state - Removed
  // const [suggestionOldValue, setSuggestionOldValue] = useState<string | any>(''); // Old form state - Removed
  const [isPromiseSuggestEntityEditModalOpen, setIsPromiseSuggestEntityEditModalOpen] = useState(false); // New form state

  useEffect(() => {
    if (promise) {
      try {
        const followedPromisesStr = localStorage.getItem(LOCAL_STORAGE_FOLLOWED_PROMISES_KEY);
        if (followedPromisesStr) {
          const followedPromiseIds: string[] = JSON.parse(followedPromisesStr);
          setIsFollowingPromise(followedPromiseIds.includes(promise.id));
        }
      } catch (error) {
        console.error("Error reading followed promises from localStorage:", error);
      }
      setRelatedNews(getNewsByPromiseId(promise.id));
    }
  }, [promise]);

  if (!promise) {
    return (
      <div className="text-center py-10">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
        <p className="mt-4 text-xl font-semibold">Promise Not Found</p>
        <p className="text-muted-foreground">The promise you are looking for does not exist or may have been removed.</p>
        <Link href="/promises" className="mt-6 inline-block">
          <Button variant="outline">Back to Promises List</Button>
        </Link>
      </div>
    );
  }

  // const handleSuggestEditClick = (fieldName: string, oldValue: any) => { // Old form handler - Removed
  //   if (!isUserLoggedIn()) {
  //     router.push('/auth/login');
  //     return;
  //   }
  //   setSuggestionFieldName(fieldName);
  //   setSuggestionOldValue(oldValue);
  //   setIsSuggestEditModalOpen(true);
  // };

  // const handlePromiseSuggestionSubmit = (suggestion: { suggestedValue: string; reason: string; evidenceUrl: string }) => { // Old form handler - Removed
  //   console.log("Promise Edit Suggestion:", {
  //     entityType: "Promise",
  //     entityName: promise?.title,
  //     fieldName: suggestionFieldName,
  //     oldValue: suggestionOldValue,
  //     ...suggestion,
  //   });
  //   toast({
  //     title: "Suggestion Submitted",
  //     description: `Edit suggestion for ${suggestionFieldName} on promise '${promise?.title}' submitted for review.`,
  //     duration: 5000,
  //   });
  //   setIsSuggestEditModalOpen(false);
  // };

  const openSuggestPromiseEditModal = () => { // New form handler
    if (!isUserLoggedIn()) {
      router.push('/auth/login');
      return;
    }
    if (!promise) return;
    setIsPromiseSuggestEntityEditModalOpen(true);
  };

  const handleFullPromiseEditSuggestionSubmit = (submission: { // New form handler
    formData: Record<string, any>;
    reason: string;
    evidenceUrl: string;
  }) => {
    if (!promise) return;

    console.log("Full Promise edit suggestion submitted:", {
      entityType: "Promise" as EntityType,
      entityId: promise.id,
      suggestedData: submission.formData,
      reason: submission.reason,
      evidenceUrl: submission.evidenceUrl,
      submittedAt: new Date().toISOString(),
      status: "PendingEntityUpdate"
    });

    toast({
      title: "Changes Suggested",
      description: `Your proposed changes for promise "${promise.title}" have been submitted for review. Thank you!`,
      duration: 5000,
    });
    setIsPromiseSuggestEntityEditModalOpen(false);
  };

  const handleFollowPromiseToggle = () => {
    if (!promise) return;
    const newFollowingState = !isFollowingPromise;
    setIsFollowingPromise(newFollowingState);

    try {
      const followedPromisesStr = localStorage.getItem(LOCAL_STORAGE_FOLLOWED_PROMISES_KEY);
      let followedPromiseIds: string[] = followedPromisesStr ? JSON.parse(followedPromisesStr) : [];

      if (newFollowingState) {
        if (!followedPromiseIds.includes(promise.id)) {
          followedPromiseIds.push(promise.id);
        }
      } else {
        followedPromiseIds = followedPromiseIds.filter(id => id !== promise.id);
      }
      localStorage.setItem(LOCAL_STORAGE_FOLLOWED_PROMISES_KEY, JSON.stringify(followedPromiseIds));
       toast({
        title: newFollowingState ? `Following Promise` : `Unfollowed Promise`,
        description: newFollowingState ? `You'll now receive updates for "${promise.title.substring(0,30)}..." (demo).` : `You will no longer receive updates for "${promise.title.substring(0,30)}..." (demo).`,
        duration: 3000,
      });
    } catch (error) {
      console.error("Error updating followed promises in localStorage:", error);
      toast({
        title: "Could not update follow status",
        description: "There was an issue saving your follow preference. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
      setIsFollowingPromise(!newFollowingState); // Revert state
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
    console.log("Promise Rating Submitted:", { promiseId: promise.id, rating: currentRating });
    toast({
      title: "Review Submitted (Demo)",
      description: `You rated this promise ${currentRating} star(s).`,
      duration: 5000,
    });
  };


  const promiser = promise.politicianId
    ? getPoliticianById(promise.politicianId)
    : promise.partyId
    ? getPartyById(promise.partyId)
    : null;

  const promiserLink = promiser ? (
    promise.politicianId ? (
      <Link href={`/politicians/${promiser.id}`} className="text-primary hover:underline flex items-center gap-1">
        <User className="h-4 w-4"/> {promiser.name}
      </Link>
    ) : (
      <Link href={`/parties/${promiser.id}`} className="text-primary hover:underline flex items-center gap-1">
        <Users2 className="h-4 w-4"/> {promiser.name}
      </Link>
    )
  ) : <span className="flex items-center gap-1"><ClipboardList className="h-4 w-4"/> Unknown Promiser</span>;

  const { icon: statusIcon, badgeClass } = getStatusVisuals(promise.status);
  const timelineItems = promise.statusUpdateHistory ? formatPromiseStatusUpdatesForTimeline(promise.statusUpdateHistory) : [];

  // Removed handleExportPdf function

  const handleDeletePromise = () => {
    if (!promise) return;
    alert(`Mock delete action for promise: ${promise.title}`);
  };


  return (
    <div>
      <PageHeader
        title={promise.title}
        description={<div className="text-sm text-muted-foreground">Promised by: {promiserLink}</div>}
        actions={
          <div className="flex gap-2">
            {isUserLoggedIn() && canAccess(currentUser.role, ADMIN_ROLES) && (
              <Button variant="outline" onClick={openSuggestPromiseEditModal}>
                <Edit className="mr-2 h-4 w-4" /> Propose Changes to Promise
              </Button>
            )}
            {/* Export button removed */}
            {canAccess(currentUser.role, ADMIN_ROLES) && (
              <Button variant="destructive" onClick={handleDeletePromise}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete Promise
              </Button>
            )}
          </div>
        }
      />

      {/* <SuggestEditForm // Old form instance - Removed
        isOpen={isSuggestEditModalOpen}
        onOpenChange={setIsSuggestEditModalOpen}
        entityType="Promise"
        entityName={promise?.title || ''}
        fieldName={suggestionFieldName}
        oldValue={suggestionOldValue}
        onSubmit={handlePromiseSuggestionSubmit}
      /> */}

      {promise && isPromiseSuggestEntityEditModalOpen && entitySchemas.Promise && ( // New form instance
        <SuggestEntityEditForm
          isOpen={isPromiseSuggestEntityEditModalOpen}
          onOpenChange={setIsPromiseSuggestEntityEditModalOpen}
          entityType="Promise"
          entitySchema={entitySchemas.Promise}
          currentEntityData={promise}
          onSubmit={handleFullPromiseEditSuggestionSubmit}
        />
      )}

      <div id="promise-details-export-area" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2"><Info className="text-primary"/>Promise Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground/80 whitespace-pre-line">{promise.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                {promise.category && (
                  <div><strong>Category:</strong> <Badge variant="secondary">{promise.category}{promise.subCategory && ` > ${promise.subCategory}`}</Badge></div>
                )}
                {promise.geographicScope && (
                  <div><strong>Scope:</strong> <Badge variant="outline">{promise.geographicScope}</Badge></div>
                )}
                {promise.sourceType && (
                  <div><strong>Source:</strong> {promise.sourceType}
                    {promise.sourceDetails && <span className="text-muted-foreground text-xs italic ml-1">({promise.sourceDetails})</span>}
                  </div>
                )}
                {promise.responsibleAgency && (
                  <div className="flex items-center gap-1"><strong>Responsible:</strong> <Landmark className="h-4 w-4 text-muted-foreground inline-block mr-1"/>{promise.responsibleAgency}</div>
                )}
                 {promise.datePromised && (
                    <div className="flex items-center gap-1"><strong>Promised on:</strong> <CalendarClock className="h-4 w-4 text-muted-foreground inline-block mr-1"/>{format(new Date(promise.datePromised), 'MM/dd/yyyy')}</div>
                 )}
                 {promise.expectedFulfillmentDate && (
                    <div className="flex items-center gap-1"><strong>Expected by:</strong> <CalendarClock className="h-4 w-4 text-muted-foreground inline-block mr-1"/>{format(new Date(promise.expectedFulfillmentDate), 'MM/dd/yyyy')}</div>
                 )}
                 {promise.actualFulfillmentDate && promise.status === 'Fulfilled' && (
                    <div className="flex items-center gap-1 text-green-600"><strong>Fulfilled on:</strong> <CalendarCheck2 className="h-4 w-4 inline-block mr-1"/>{format(new Date(promise.actualFulfillmentDate), 'MM/dd/yyyy')}</div>
                 )}
              </div>
            </CardContent>
          </Card>

          {timelineItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2"><History className="text-primary"/>Status Update History</CardTitle>
              </CardHeader>
              <CardContent>
                <TimelineDisplay items={timelineItems} />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" /> Rate or Endorse this Promise
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
           {relatedNews && relatedNews.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2"><Newspaper className="text-primary"/> Related News</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {relatedNews.map((news: NewsArticleLink, idx: number) => (
                    <li key={idx} className="text-sm border-b pb-2 last:border-b-0">
                      <a href={news.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
                        {news.title}
                      </a>
                      <p className="text-xs text-muted-foreground">{news.sourceName} - {format(new Date(news.publicationDate), 'MM/dd/yyyy')}</p>
                      {news.summary && <p className="text-xs text-foreground/80 mt-1">{news.summary}</p>}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Revision History Card - Assuming promise.revisionHistory is available */}
          {promise.revisionHistory && promise.revisionHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                  <History className="h-5 w-5 text-primary"/> Revision History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {promise.revisionHistory.map((event) => (
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
              <CardTitle className="font-headline text-xl flex items-center gap-2">
                {statusIcon} Current Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Badge variant="outline" className={`text-base py-1 px-3 w-full justify-center ${badgeClass}`}>
                {promise.status}
              </Badge>

              {promise.fulfillmentPercentage !== undefined && ['In Progress', 'Partially Fulfilled', 'Fulfilled'].includes(promise.status) && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                      <Percent className="h-4 w-4 text-primary/70"/> Progress:
                    </span>
                    <span className="text-lg font-semibold text-primary">{promise.fulfillmentPercentage}%</span>
                  </div>
                  <Progress value={promise.fulfillmentPercentage} className="h-3" />
                </div>
              )}

              {promise.reasonForStatus && ['Broken', 'Stalled', 'Modified', 'Cancelled'].includes(promise.status) && (
                <div className="mt-2 p-3 bg-muted/50 rounded-md">
                  <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5 mb-1"><Info className="h-4 w-4 text-primary/70"/>Reason for Status:</h4>
                  <p className="text-sm text-foreground/70">{promise.reasonForStatus}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {promise.tags && promise.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                  <Tag className="h-5 w-5 text-primary"/> Tags
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {promise.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </CardContent>
            </Card>
          )}

          {promise.evidenceLinks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2"><Link2 className="text-primary"/>Evidence</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {promise.evidenceLinks.map((link: PromiseEvidenceLink, idx: number) => (
                    <li key={idx} className="text-sm">
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1.5">
                        <ExternalLink className="h-4 w-4 shrink-0" />
                        <span className="truncate">{link.description || link.url}</span>
                      </a>
                      {link.type && <Badge variant="outline" className="ml-2 text-xs px-1.5 py-0">{link.type}</Badge>}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
           <Button
            onClick={handleFollowPromiseToggle}
            className="w-full"
            variant={isFollowingPromise ? "outline" : "default"}
          >
            {isFollowingPromise ? <CheckCircle className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
            {isFollowingPromise ? `Following Promise` : `Follow Promise`}
          </Button>
        </div>
      </div>
    </div>
  );
}

