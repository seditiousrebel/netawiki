
"use client";

import React, { useState, useEffect } from 'react';
import { getBillById, getNewsByBillId } from '@/lib/mock-data';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Users, CalendarDays, CheckSquare, XSquare, ExternalLink, Landmark, FileText, ListCollapse, BookOpen, Info, Tag, Layers, Building, Clock, GitBranch, ShieldCheck, Newspaper, Star, UserPlus, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { TimelineDisplay, formatBillTimelineEventsForTimeline } from '@/components/common/timeline-display';
import type { VoteRecord, BillTimelineEvent, NewsArticleLink, Bill } from '@/types/gov';
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';

const LOCAL_STORAGE_FOLLOWED_BILLS_KEY = 'govtrackr_followed_bills';

export default function BillDetailsPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = React.use(paramsPromise);
  const bill = getBillById(params.id);
  const { toast } = useToast();

  const [relatedNews, setRelatedNews] = useState<NewsArticleLink[]>([]);
  const [isFollowingBill, setIsFollowingBill] = useState(false);
  const [currentBillRating, setCurrentBillRating] = useState(0);
  const [hoverBillRating, setHoverBillRating] = useState(0);

  useEffect(() => {
    if (bill) {
      setRelatedNews(getNewsByBillId(bill.id));
      try {
        const followedBillsStr = localStorage.getItem(LOCAL_STORAGE_FOLLOWED_BILLS_KEY);
        if (followedBillsStr) {
          const followedBillIds: string[] = JSON.parse(followedBillsStr);
          setIsFollowingBill(followedBillIds.includes(bill.id));
        }
      } catch (error) {
        console.error("Error reading followed bills from localStorage:", error);
      }
    }
  }, [bill]);

  if (!bill) {
    return <p>Bill not found.</p>;
  }

  const handleSuggestEdit = () => {
    toast({
      title: "Suggest Edit Feature",
      description: "This functionality is under development. Approved suggestions will update the content. You can see mock suggestions being managed on the /admin/suggestions page.",
      duration: 6000,
    });
  };

  const handleFollowBillToggle = () => {
    if (!bill) return;
    const newFollowingState = !isFollowingBill;
    setIsFollowingBill(newFollowingState);

    try {
      const followedBillsStr = localStorage.getItem(LOCAL_STORAGE_FOLLOWED_BILLS_KEY);
      let followedBillIds: string[] = followedBillsStr ? JSON.parse(followedBillsStr) : [];

      if (newFollowingState) {
        if (!followedBillIds.includes(bill.id)) {
          followedBillIds.push(bill.id);
        }
      } else {
        followedBillIds = followedBillIds.filter(id => id !== bill.id);
      }
      localStorage.setItem(LOCAL_STORAGE_FOLLOWED_BILLS_KEY, JSON.stringify(followedBillIds));
       toast({
        title: newFollowingState ? `Following Bill` : `Unfollowed Bill`,
        description: newFollowingState ? `You'll now receive updates for "${bill.title.substring(0,30)}..." (demo).` : `You will no longer receive updates for "${bill.title.substring(0,30)}..." (demo).`,
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
    console.log("Bill Rating Submitted:", { billId: bill.id, rating: currentBillRating });
    toast({
      title: "Review Submitted (Demo)",
      description: `You rated this bill ${currentBillRating} star(s).`,
      duration: 5000,
    });
  };

  const timelineItems = bill.timelineEvents ? formatBillTimelineEventsForTimeline(bill.timelineEvents) : [];

  return (
    <div>
      <PageHeader
        title={`${bill.title} (${bill.billNumber})`}
        description={
            <div className="flex flex-wrap gap-2 items-center mt-1">
                <Badge variant={bill.status === 'Became Law' ? 'default' : 'secondary'} className={bill.status === 'Became Law' ? 'bg-green-500 text-white' : ''}>
                    {bill.status}
                </Badge>
                {bill.billType && <Badge variant="outline">{bill.billType}</Badge>}
            </div>
        }
        actions={
          <Button variant="outline" onClick={handleSuggestEdit}>
            <Edit className="mr-2 h-4 w-4" /> Suggest Edit
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2"><FileText className="text-primary"/> Summary & Purpose</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 whitespace-pre-line">{bill.summary}</p>
              {bill.purpose && (
                <div className="mt-4 pt-4 border-t">
                  <h3 className="font-semibold text-md mb-1">Purpose:</h3>
                  <p className="text-sm text-muted-foreground italic">{bill.purpose}</p>
                </div>
              )}
              {bill.fullTextUrl && (
                 <a href={bill.fullTextUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block">
                  <Button variant="link" className="p-0 h-auto text-primary items-center">
                    Read Full Text <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
               </a>
              )}
            </CardContent>
          </Card>

          {timelineItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2"><ListCollapse className="text-primary"/> Bill Journey</CardTitle>
              </CardHeader>
              <CardContent>
                <TimelineDisplay items={timelineItems} />
              </CardContent>
            </Card>
          )}

          {bill.votingResults && (bill.votingResults.house || bill.votingResults.senate) && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl">Voting Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {bill.votingResults.house && (
                  <div>
                    <h3 className="font-semibold text-md mb-1">House Vote ({format(new Date(bill.votingResults.house.date), 'MM/dd/yyyy')}): 
                      <Badge variant={bill.votingResults.house.passed ? "default" : "destructive"} className="ml-2">
                        {bill.votingResults.house.passed ? 'Passed' : 'Failed'}
                      </Badge>
                    </h3>
                    <ul className="text-sm list-disc list-inside pl-2">
                      {bill.votingResults.house.records.slice(0,3).map((vote: VoteRecord, idx: number) => (
                        <li key={`house-vote-${idx}`}>
                           <Link href={`/politicians/${vote.politicianId}`} className="text-primary hover:underline">{vote.politicianName}</Link>: {vote.vote}
                        </li>
                      ))}
                      {bill.votingResults.house.records.length > 3 && <li className="text-muted-foreground">...and more</li>}
                    </ul>
                  </div>
                )}
                 {bill.votingResults.senate && (
                  <div>
                    <h3 className="font-semibold text-md mb-1">Senate Vote ({format(new Date(bill.votingResults.senate.date), 'MM/dd/yyyy')}):
                      <Badge variant={bill.votingResults.senate.passed ? "default" : "destructive"} className="ml-2">
                        {bill.votingResults.senate.passed ? 'Passed' : 'Failed'}
                      </Badge>
                    </h3>
                     <ul className="text-sm list-disc list-inside pl-2">
                      {bill.votingResults.senate.records.slice(0,3).map((vote: VoteRecord, idx: number) => (
                        <li key={`senate-vote-${idx}`}>
                           <Link href={`/politicians/${vote.politicianId}`} className="text-primary hover:underline">{vote.politicianName}</Link>: {vote.vote}
                        </li>
                      ))}
                      {bill.votingResults.senate.records.length > 3 && <li className="text-muted-foreground">...and more</li>}
                    </ul>
                  </div>
                )}
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
        </div>

        <div className="lg:col-span-1 space-y-6">
           <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2"><Info className="text-primary"/> Legislative Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {bill.billType && <p><span className="font-semibold">Type:</span> {bill.billType}</p>}
              {bill.responsibleMinistry && <p><span className="font-semibold">Responsible Ministry:</span> {bill.responsibleMinistry}</p>}
              {bill.houseOfIntroduction && <p><span className="font-semibold">Introduced In:</span> {bill.houseOfIntroduction}</p>}
              {bill.parliamentarySession && <p><span className="font-semibold">Session:</span> {bill.parliamentarySession}</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2"><Clock className="text-primary"/> Key Dates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5 text-sm text-muted-foreground">
              <p><ShieldCheck className="inline-block h-4 w-4 mr-1 text-primary/70" /> Status: 
                 <Badge variant={bill.status === 'Became Law' ? 'default' : 'secondary'} 
                        className={`ml-1 ${bill.status === 'Became Law' ? 'bg-green-500 text-white' : ''}`}>
                    {bill.status}
                </Badge>
              </p>
              <p><CalendarDays className="inline-block h-4 w-4 mr-1 text-primary/70" /> Introduced: {format(new Date(bill.introducedDate), 'MMMM dd, yyyy')}</p>
              {bill.keyDates?.committeeReferral && <p><GitBranch className="inline-block h-4 w-4 mr-1 text-primary/70" /> Committee Referral: {format(new Date(bill.keyDates.committeeReferral), 'MMMM dd, yyyy')}</p>}
              {bill.keyDates?.passedLowerHouse && <p><CheckSquare className="inline-block h-4 w-4 mr-1 text-green-600" /> Passed Lower House: {format(new Date(bill.keyDates.passedLowerHouse), 'MMMM dd, yyyy')}</p>}
              {bill.keyDates?.passedUpperHouse && <p><CheckSquare className="inline-block h-4 w-4 mr-1 text-green-600" /> Passed Upper House: {format(new Date(bill.keyDates.passedUpperHouse), 'MMMM dd, yyyy')}</p>}
              {bill.keyDates?.assent && <p><CheckSquare className="inline-block h-4 w-4 mr-1 text-green-600" /> Assented: {format(new Date(bill.keyDates.assent), 'MMMM dd, yyyy')}</p>}
              {bill.keyDates?.effectiveDate && <p><CheckSquare className="inline-block h-4 w-4 mr-1 text-green-600" /> Effective: {format(new Date(bill.keyDates.effectiveDate), 'MMMM dd, yyyy')}</p>}
              {bill.lastActionDate && <p><CalendarDays className="inline-block h-4 w-4 mr-1 text-primary/70" /> Last Action: {format(new Date(bill.lastActionDate), 'MMMM dd, yyyy')}</p>}
              {bill.lastActionDescription && <p className="text-xs mt-1">{bill.lastActionDescription}</p>}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2"><Users className="text-primary"/> Sponsors</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {bill.sponsors.map(sponsor => (
                  <li key={sponsor.id} className="text-sm">
                    <Link href={`/politicians/${sponsor.id}`} className="text-primary hover:underline">
                      {sponsor.name}
                    </Link>
                    <span className="text-muted-foreground text-xs"> ({sponsor.type})</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          {bill.committees && bill.committees.length > 0 && (
             <Card>
                <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2"><Landmark className="text-primary"/> Committees</CardTitle>
                </CardHeader>
                <CardContent>
                <ul className="space-y-1">
                    {bill.committees.map((committee, idx) => (
                    <li key={idx} className="text-sm text-foreground/80">{committee}</li>
                    ))}
                </ul>
                </CardContent>
            </Card>
          )}

          {bill.impact && (
             <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-xl flex items-center gap-2"><Layers className="text-primary"/> Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/80">{bill.impact}</p>
                </CardContent>
            </Card>
          )}
          
          {bill.tags && bill.tags.length > 0 && (
             <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-xl flex items-center gap-2"><Tag className="text-primary"/> Tags</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                    {bill.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                </CardContent>
            </Card>
          )}
          <Button
            onClick={handleFollowBillToggle}
            className="w-full"
            variant={isFollowingBill ? "outline" : "default"}
          >
            {isFollowingBill ? <CheckCircle className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
            {isFollowingBill ? `Following Bill` : `Follow Bill`}
          </Button>
        </div>
      </div>
    </div>
  );
}
