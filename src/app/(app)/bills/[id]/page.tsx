
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { getBillById, getNewsByBillId, getCommitteeByName } from '@/lib/mock-data';
import { PageHeader } from '@/components/common/page-header';
import { useNotificationStore } from "@/lib/notifications";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Users, CalendarDays, CheckSquare, XSquare, ExternalLink, Landmark, FileText, ListCollapse, BookOpen, Info, Tag, Layers, Building, Clock, GitBranch, ShieldCheck, Newspaper, Star, UserPlus, CheckCircle, History, Trash2, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { TimelineDisplay, formatBillTimelineEventsForTimeline } from '@/components/common/timeline-display';
import type { VoteRecord, BillTimelineEvent, NewsArticleLink, Bill } from '@/types/gov';
import { useToast } from "@/hooks/use-toast";
import { TimelineEventForm } from '@/components/common/forms/TimelineEventForm';
import { billTimelineEventItemSchema } from '@/lib/schemas';
import { format } from 'date-fns';
import { getCurrentUser, canAccess, ADMIN_ROLES, isUserLoggedIn } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { SuggestEntityEditForm } from '@/components/common/SuggestEntityEditForm'; 
import { entitySchemas } from '@/lib/schemas'; 
import type { EntityType } from '@/lib/data/suggestions'; 

const LOCAL_STORAGE_FOLLOWED_BILLS_KEY = 'govtrackr_followed_bills';

// Helper to generate slug from name
const toSlug = (name: string) => name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

export default function BillDetailsPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = React.use(paramsPromise);
  const initialBill = getBillById(params.id); // Renamed to initialBill
  const { toast } = useToast();
  const currentUser = getCurrentUser();
  const router = useRouter();

  const [relatedNews, setRelatedNews] = useState<NewsArticleLink[]>([]);
  const [isFollowingBill, setIsFollowingBill] = useState(false);
  const [currentBillRating, setCurrentBillRating] = useState(0);
  const [hoverBillRating, setHoverBillRating] = useState(0);
  const { addNotification } = useNotificationStore();
  const notificationTriggered = useRef(false);

  const [isSuggestEntityEditModalOpen, setIsSuggestEntityEditModalOpen] = useState(false);
  const [currentBillData, setCurrentBillData] = useState<Bill | null>(null);
  const [isBillTimelineEventModalOpen, setIsBillTimelineEventModalOpen] = useState(false);
  const [editingBillTimelineEvent, setEditingBillTimelineEvent] = useState<BillTimelineEvent | null>(null);

  useEffect(() => {
    if (initialBill) {
      setCurrentBillData(JSON.parse(JSON.stringify(initialBill))); // Deep copy
    }
  }, [initialBill]);

  useEffect(() => {
    if (currentBillData && !notificationTriggered.current) {
      const timeoutId = setTimeout(() => {
        addNotification(
          `The status of bill '${currentBillData.title}' has been updated to 'In Committee'.`,
          'info',
          `/bills/${currentBillData.id}`
        );
      }, 4000);
      notificationTriggered.current = true;
      return () => clearTimeout(timeoutId);
    }
  }, [currentBillData, addNotification]);

  useEffect(() => {
    if (currentBillData) {
      setRelatedNews(getNewsByBillId(currentBillData.id));
      try {
        const followedBillsStr = localStorage.getItem(LOCAL_STORAGE_FOLLOWED_BILLS_KEY);
        if (followedBillsStr) {
          const followedBillIds: string[] = JSON.parse(followedBillsStr);
          setIsFollowingBill(followedBillIds.includes(currentBillData.id));
        }
      } catch (error) {
        console.error("Error reading followed bills from localStorage:", error);
      }
    }
  }, [currentBillData]);

  if (!currentBillData) {
    return (
      <div className="container mx-auto py-10 text-center">
        <FileText className="mx-auto h-16 w-16 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold text-foreground">Bill Not Found</h1>
        <p className="mt-2 text-muted-foreground">
          The bill you are looking for does not exist or may have been removed.
        </p>
        <Button asChild className="mt-6">
          <Link href="/bills">Back to Bills List</Link>
        </Button>
      </div>
    );
  }

  const openSuggestBillEditModal = () => { 
    if (!isUserLoggedIn()) {
      router.push('/auth/login');
      return;
    }
    if (!currentBillData) return;
    setIsSuggestEntityEditModalOpen(true);
  };

  const handleBillEntityEditSuggestionSubmit = (submission: {
    formData: Record<string, any>;
    reason: string;
    evidenceUrl: string;
  }) => {
    if (!currentBillData) return;

    console.log("Full Bill edit suggestion submitted:", {
      entityType: "Bill" as EntityType,
      entityId: currentBillData.id,
      suggestedData: submission.formData,
      reason: submission.reason,
      evidenceUrl: submission.evidenceUrl,
      submittedAt: new Date().toISOString(),
      status: "PendingEntityUpdate"
    });

    toast({
      title: "Changes Suggested",
      description: `Your proposed changes for bill "${currentBillData.title}" have been submitted for review. Thank you!`,
      duration: 5000,
    });
    setIsSuggestEntityEditModalOpen(false);
  };

  const handleFollowBillToggle = () => {
    if (!currentBillData) return;
    const newFollowingState = !isFollowingBill;
    setIsFollowingBill(newFollowingState);

    try {
      const followedBillsStr = localStorage.getItem(LOCAL_STORAGE_FOLLOWED_BILLS_KEY);
      let followedBillIds: string[] = followedBillsStr ? JSON.parse(followedBillsStr) : [];

      if (newFollowingState) {
        if (!followedBillIds.includes(currentBillData.id)) {
          followedBillIds.push(currentBillData.id);
        }
      } else {
        followedBillIds = followedBillIds.filter(id => id !== currentBillData.id);
      }
      localStorage.setItem(LOCAL_STORAGE_FOLLOWED_BILLS_KEY, JSON.stringify(followedBillIds));
       toast({
        title: newFollowingState ? `Following Bill` : `Unfollowed Bill`,
        description: newFollowingState ? `You'll now receive updates for "${currentBillData.title.substring(0,30)}..." (demo).` : `You will no longer receive updates for "${currentBillData.title.substring(0,30)}..." (demo).`,
        duration: 3000,
      });
    } catch (error) {
      console.error("Error updating followed bills in localStorage:", error);
      toast({
        title: "Could not update follow status",
        description: "There was an issue saving your follow preference. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
      setIsFollowingBill(!newFollowingState); // Revert state
    }
  };

  const handleBillRatingSubmit = () => {
    if (currentBillRating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a star rating before submitting.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    console.log("Bill Rating Submitted:", { billId: currentBillData.id, rating: currentBillRating });
    toast({
      title: "Review Submitted (Demo)",
      description: `You rated this bill ${currentBillRating} star(s).`,
      duration: 5000,
    });
  };

  const timelineItems = currentBillData.timelineEvents ? formatBillTimelineEventsForTimeline(currentBillData.timelineEvents) : [];

  function handleDeleteBill() {
    if (!currentBillData) return;
    alert(`Mock delete action for bill: ${currentBillData.title} (${currentBillData.billNumber})`);
  }

  const handleOpenAddBillTimelineEventModal = () => {
    setEditingBillTimelineEvent(null);
    setIsBillTimelineEventModalOpen(true);
  };

  const handleOpenEditBillTimelineEventModal = (eventId: string) => {
    const eventToEdit = currentBillData?.timelineEvents?.find(e => e.id === eventId);
    if (eventToEdit) {
      setEditingBillTimelineEvent(eventToEdit);
      setIsBillTimelineEventModalOpen(true);
    }
  };

  const handleBillTimelineEventFormSubmit = (values: any) => {
    if (!currentBillData) return;
    let updatedEvents = [...(currentBillData.timelineEvents || [])];
    if (editingBillTimelineEvent) {
      updatedEvents = updatedEvents.map(e => e.id === editingBillTimelineEvent.id ? { ...e, ...values } : e);
    } else {
      updatedEvents.push({ ...values, id: `bill-evt-${Date.now().toString()}` });
    }
    const updatedBill = { ...currentBillData, timelineEvents: updatedEvents };
    setCurrentBillData(updatedBill);
    // TODO: Mock persistence for 'updatedBill'
    console.log('Updated Bill Data with Timeline Changes:', updatedBill);
    toast({ title: 'Bill Timeline Event Saved (Mock)', description: 'Changes are reflected locally.' });
    setIsBillTimelineEventModalOpen(false);
    setEditingBillTimelineEvent(null);
  };

  const handleDeleteBillTimelineEvent = (eventId: string) => {
    if (!currentBillData) return;
    const updatedEvents = (currentBillData.timelineEvents || []).filter(e => e.id !== eventId);
    const updatedBill = { ...currentBillData, timelineEvents: updatedEvents };
    setCurrentBillData(updatedBill);
    // TODO: Mock persistence for 'updatedBill'
    console.log('Updated Bill Data after Deleting Timeline Event:', updatedBill);
    toast({ title: 'Bill Timeline Event Deleted (Mock)', description: 'Changes are reflected locally.' });
  };

  return (
    <div>
      <PageHeader
        title={
          <span className="flex items-center">
            {currentBillData.title}
            {currentBillData.billNumber && <span className="ml-1 flex items-center">({currentBillData.billNumber})</span>}
          </span>
        }
        description={
            <div className="flex flex-wrap gap-2 items-center mt-1">
                <Badge variant={currentBillData.status === 'Became Law' ? 'default' : 'secondary'} className={`${currentBillData.status === 'Became Law' ? 'bg-green-500 text-white' : ''}`}>
                    {currentBillData.status}
                </Badge>
                {currentBillData.billType && <Badge variant="outline">{currentBillData.billType}</Badge>}
            </div>
        }
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleFollowBillToggle}
            >
              {isFollowingBill ? <CheckCircle className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
              {isFollowingBill ? 'Following' : 'Follow'}
            </Button>
            <Button variant="outline" onClick={openSuggestBillEditModal}>
              <Edit className="mr-2 h-4 w-4" /> Propose Changes to Bill
            </Button>
            {canAccess(currentUser.role, ADMIN_ROLES) && (
              <Button variant="destructive" onClick={handleDeleteBill}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete Bill
              </Button>
            )}
          </div>
        }
      />

      {currentBillData && isSuggestEntityEditModalOpen && entitySchemas.Bill && (
        <SuggestEntityEditForm
          isOpen={isSuggestEntityEditModalOpen}
          onOpenChange={setIsSuggestEntityEditModalOpen}
          entityType="Bill"
          entitySchema={entitySchemas.Bill}
          currentEntityData={currentBillData}
          onSubmit={handleBillEntityEditSuggestionSubmit}
        />
      )}

      {isBillTimelineEventModalOpen && (
        <TimelineEventForm
          isOpen={isBillTimelineEventModalOpen}
          onOpenChange={setIsBillTimelineEventModalOpen}
          eventData={editingBillTimelineEvent}
          onSubmit={handleBillTimelineEventFormSubmit}
          entitySchema={billTimelineEventItemSchema}
          // Optionally pass a custom dialog title if TimelineEventForm supports it
          // dialogTitle={editingBillTimelineEvent ? 'Edit Bill Timeline Event' : 'Add Bill Timeline Event'}
        />
      )}

      <div id="bill-details-export-area" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-headline text-xl flex items-center gap-2"><FileText className="text-primary"/> Summary & Purpose</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 whitespace-pre-line">{currentBillData.summary}</p>
              {currentBillData.purpose && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-md mb-1">Purpose:</h3>
                  </div>
                  <p className="text-sm text-muted-foreground italic">{currentBillData.purpose}</p>
                </div>
              )}
              {currentBillData.fullTextUrl && (
                 <div className="mt-4 flex items-center">
                   <a href={currentBillData.fullTextUrl} target="_blank" rel="noopener noreferrer" className="inline-block">
                    <Button variant="link" className="p-0 h-auto text-primary items-center">
                      Read Full Text <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                 </a>
                 </div>
              )}
            </CardContent>
          </Card>

          {timelineItems.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline text-xl flex items-center gap-2"><ListCollapse className="text-primary"/> Bill Journey</CardTitle>
              </CardHeader>
              <CardContent>
                <TimelineDisplay
                  items={timelineItems}
                  onEditItem={handleOpenEditBillTimelineEventModal}
                  onDeleteItem={handleDeleteBillTimelineEvent}
                />
                <Button onClick={handleOpenAddBillTimelineEventModal} className="mt-4">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Bill Timeline Event
                </Button>
              </CardContent>
            </Card>
          )}

          {currentBillData.votingResults && (currentBillData.votingResults.house || currentBillData.votingResults.senate) && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline text-xl">Voting Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentBillData.votingResults.house && (
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-md mb-1 flex items-center">House Vote ({format(new Date(currentBillData.votingResults.house.date), 'MM/dd/yyyy')}):
                        <Badge variant={currentBillData.votingResults.house.passed ? "default" : "destructive"} className={`ml-2 ${currentBillData.votingResults.house.passed ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                          {currentBillData.votingResults.house.passed ? 'Passed' : 'Failed'}
                        </Badge>
                      </h3>
                    </div>
                    <ul className="text-sm list-disc list-inside pl-2">
                      {currentBillData.votingResults.house.records.slice(0,3).map((vote: VoteRecord, idx: number) => (
                        <li key={`house-vote-${idx}`} className="flex justify-between items-center">
                           <span><Link href={`/politicians/${vote.politicianId}`} className="text-primary hover:underline">{vote.politicianName}</Link>: {vote.vote}</span>
                        </li>
                      ))}
                      {currentBillData.votingResults.house.records.length > 3 && <li className="text-muted-foreground">...and more</li>}
                    </ul>
                  </div>
                )}
                 {currentBillData.votingResults.senate && (
                  <div>
                     <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-md mb-1 flex items-center">Senate Vote ({format(new Date(currentBillData.votingResults.senate.date), 'MM/dd/yyyy')}):
                          <Badge variant={currentBillData.votingResults.senate.passed ? "default" : "destructive"} className={`ml-2 ${currentBillData.votingResults.senate.passed ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                            {currentBillData.votingResults.senate.passed ? 'Passed' : 'Failed'}
                          </Badge>
                        </h3>
                      </div>
                     <ul className="text-sm list-disc list-inside pl-2">
                      {currentBillData.votingResults.senate.records.slice(0,3).map((vote: VoteRecord, idx: number) => (
                        <li key={`senate-vote-${idx}`} className="flex justify-between items-center">
                           <span><Link href={`/politicians/${vote.politicianId}`} className="text-primary hover:underline">{vote.politicianName}</Link>: {vote.vote}</span>
                        </li>
                      ))}
                      {currentBillData.votingResults.senate.records.length > 3 && <li className="text-muted-foreground">...and more</li>}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {relatedNews && relatedNews.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2"><Newspaper className="text-primary"/> Related News</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {relatedNews.map((news: NewsArticleLink, idx: number) => (
                    <li key={idx} className="text-sm border-b pb-2 last:border-b-0">
                      <a href={news.url || `/news/${news.slug || news.id}`} target={news.url && news.isAggregated ? "_blank" : "_self"} rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
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

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" /> Rate this Bill
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
                        (hoverBillRating || currentBillRating) >= star
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300 hover:text-yellow-300'
                      }`}
                      onMouseEnter={() => setHoverBillRating(star)}
                      onMouseLeave={() => setHoverBillRating(0)}
                      onClick={() => setCurrentBillRating(star)}
                    />
                  ))}
                </div>
              </div>
              <Button onClick={handleBillRatingSubmit} className="w-full sm:w-auto" disabled={currentBillRating === 0}>
                Submit Review
              </Button>
            </CardContent>
          </Card>

          {bill.revisionHistory && bill.revisionHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                  <History className="h-5 w-5 text-primary"/> Revision History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {bill.revisionHistory.map((event) => (
                    <li key={event.id} className="border-b pb-3 last:border-b-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-md">{event.event}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(event.date), 'MM/dd/yyyy')} by {event.author}
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
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-headline text-xl flex items-center gap-2"><Info className="text-primary"/> Legislative Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {bill.billType && <div className="flex justify-between"><span><span className="font-semibold">Type:</span> {bill.billType}</span> </div>}
              {bill.responsibleMinistry && <div className="flex justify-between"><span><span className="font-semibold">Responsible Ministry:</span> {bill.responsibleMinistry}</span> </div>}
              {bill.houseOfIntroduction && <div className="flex justify-between"><span><span className="font-semibold">Introduced In:</span> {bill.houseOfIntroduction}</span> </div>}
              {bill.parliamentarySession && <div className="flex justify-between"><span><span className="font-semibold">Session:</span> {bill.parliamentarySession}</span> </div>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-headline text-xl flex items-center gap-2"><Clock className="text-primary"/> Key Dates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5 text-sm text-muted-foreground">
              <div className="flex justify-between items-center"><span className="flex items-center gap-1"><ShieldCheck className="inline-block h-4 w-4 mr-1 text-primary/70" /> Status:
                 <Badge variant={bill.status === 'Became Law' ? 'default' : 'secondary'}
                        className={`ml-1 ${bill.status === 'Became Law' ? 'bg-green-500 text-white' : ''}`}>
                    {bill.status}
                </Badge></span> 
              </div>
              {bill.introducedDate && <div className="flex justify-between items-center"><span className="flex items-center gap-1"><CalendarDays className="inline-block h-4 w-4 mr-1 text-primary/70" /> Introduced: {format(new Date(bill.introducedDate), 'MMMM dd, yyyy')}</span> </div>}
              {bill.keyDates?.committeeReferral && <div className="flex justify-between items-center"><span className="flex items-center gap-1"><GitBranch className="inline-block h-4 w-4 mr-1 text-primary/70" /> Committee Referral: {format(new Date(bill.keyDates.committeeReferral), 'MMMM dd, yyyy')}</span> </div>}
              {bill.keyDates?.firstReading && <div className="flex justify-between items-center"><span className="flex items-center gap-1"><CalendarDays className="inline-block h-4 w-4 mr-1 text-primary/70" /> First Reading: {format(new Date(bill.keyDates.firstReading), 'MMMM dd, yyyy')}</span> </div>}
              {bill.keyDates?.secondReading && <div className="flex justify-between items-center"><span className="flex items-center gap-1"><CalendarDays className="inline-block h-4 w-4 mr-1 text-primary/70" /> Second Reading: {format(new Date(bill.keyDates.secondReading), 'MMMM dd, yyyy')}</span> </div>}
              {bill.keyDates?.thirdReading && <div className="flex justify-between items-center"><span className="flex items-center gap-1"><CalendarDays className="inline-block h-4 w-4 mr-1 text-primary/70" /> Third Reading: {format(new Date(bill.keyDates.thirdReading), 'MMMM dd, yyyy')}</span> </div>}
              {bill.keyDates?.passedLowerHouse && <div className="flex justify-between items-center"><span className="flex items-center gap-1"><CheckSquare className="inline-block h-4 w-4 mr-1 text-green-600" /> Passed Lower House: {format(new Date(bill.keyDates.passedLowerHouse), 'MMMM dd, yyyy')}</span> </div>}
              {bill.keyDates?.passedUpperHouse && <div className="flex justify-between items-center"><span className="flex items-center gap-1"><CheckSquare className="inline-block h-4 w-4 mr-1 text-green-600" /> Passed Upper House: {format(new Date(bill.keyDates.passedUpperHouse), 'MMMM dd, yyyy')}</span> </div>}
              {bill.keyDates?.assent && <div className="flex justify-between items-center"><span className="flex items-center gap-1"><CheckSquare className="inline-block h-4 w-4 mr-1 text-green-600" /> Assented: {format(new Date(bill.keyDates.assent), 'MMMM dd, yyyy')}</span> </div>}
              {bill.keyDates?.effectiveDate && <div className="flex justify-between items-center"><span className="flex items-center gap-1"><CheckSquare className="inline-block h-4 w-4 mr-1 text-green-600" /> Effective: {format(new Date(bill.keyDates.effectiveDate), 'MMMM dd, yyyy')}</span> </div>}
              {bill.lastActionDate && <div className="flex justify-between items-center"><span className="flex items-center gap-1"><CalendarDays className="inline-block h-4 w-4 mr-1 text-primary/70" /> Last Action: {format(new Date(bill.lastActionDate), 'MMMM dd, yyyy')}</span> </div>}
              {bill.lastActionDescription && <p className="text-xs mt-1 pl-5 flex justify-between"><span>{bill.lastActionDescription}</span> </p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-headline text-xl flex items-center gap-2"><Users className="text-primary"/> Sponsors</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {bill.sponsors.map((sponsor, idx) => (
                  <li key={sponsor.id} className="text-sm flex justify-between items-center">
                    <Link href={`/politicians/${sponsor.id}`} className="text-primary hover:underline">
                      {sponsor.name}
                    </Link>
                    <span className="text-muted-foreground text-xs">({sponsor.type})</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {bill.committees && bill.committees.length > 0 && (
             <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="font-headline text-xl flex items-center gap-2"><Landmark className="text-primary"/> Committees</CardTitle>
                </CardHeader>
                <CardContent>
                <ul className="space-y-1">
                    {bill.committees.map((committeeName, idx) => {
                      const committee = getCommitteeByName(committeeName);
                      return (
                        <li key={idx} className="text-sm text-foreground/80 flex justify-between items-center">
                           {committee && committee.id ? ( 
                            <Link href={`/committees/${committee.slug || committee.id}`} className="text-primary hover:underline">
                                {committeeName}
                            </Link>
                           ) : (
                             <span>{committeeName}</span>
                           )}
                        </li>
                      );
                    })}
                </ul>
                </CardContent>
            </Card>
          )}

          {bill.impact && (
             <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="font-headline text-xl flex items-center gap-2"><Layers className="text-primary"/> Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/80 whitespace-pre-line">{bill.impact}</p>
                </CardContent>
            </Card>
          )}

          {bill.tags && bill.tags.length > 0 && (
             <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="font-headline text-xl flex items-center gap-2"><Tag className="text-primary"/> Tags</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                    {bill.tags.map((tag) => (
                      <Link key={tag} href={`/search?tag=${encodeURIComponent(tag)}`} passHref>
                        <Badge variant="secondary" className="hover:bg-primary/20 transition-colors cursor-pointer">{tag}</Badge>
                      </Link>
                    ))}
                </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
