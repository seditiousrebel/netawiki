
"use client";

import { getControversyById } from '@/lib/mock-data';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Users, CalendarDays, FileText, ExternalLink, ShieldAlert, AlertTriangle, MessageSquare, Building, Tag, ListChecks, Scale, Briefcase, Milestone, Newspaper, BookOpen, Star, UserPlus, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import type { Controversy, InvolvedEntity, ControversyUpdate, ControversyEvidenceLink, ControversyOfficialResponse, ControversyMediaCoverage, ControversyLegalProceeding } from '@/types/gov';
import { useToast } from "@/hooks/use-toast";
import { TimelineDisplay, formatControversyUpdatesForTimeline } from '@/components/common/timeline-display';
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const LOCAL_STORAGE_FOLLOWED_CONTROVERSIES_KEY = 'govtrackr_followed_controversies';

export default function ControversyDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = React.use(paramsPromise);
  const controversy = getControversyById(params.id);
  const { toast } = useToast();

  const [isFollowingControversy, setIsFollowingControversy] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    if (controversy) {
      try {
        const followedItemsStr = localStorage.getItem(LOCAL_STORAGE_FOLLOWED_CONTROVERSIES_KEY);
        if (followedItemsStr) {
          const followedIds: string[] = JSON.parse(followedItemsStr);
          setIsFollowingControversy(followedIds.includes(controversy.id));
        }
      } catch (error) {
        console.error("Error reading followed controversies from localStorage:", error);
      }
    }
  }, [controversy]);

  if (!controversy) {
    return (
      <div className="text-center py-10">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
        <p className="mt-4 text-xl font-semibold">Controversy Not Found</p>
        <p className="text-muted-foreground">The controversy you are looking for does not exist or may have been removed.</p>
        <Link href="/controversies" className="mt-6 inline-block">
          <Button variant="outline">Back to Controversies List</Button>
        </Link>
      </div>
    );
  }

  const handleSuggestEdit = () => {
    toast({
      title: "Suggest Edit Feature",
      description: "This functionality is under development. Approved suggestions will update the content. You can see mock suggestions being managed on the /admin/suggestions page.",
      duration: 6000,
    });
  };

  const handleFollowToggle = () => {
    if (!controversy) return;
    const newFollowingState = !isFollowingControversy;
    setIsFollowingControversy(newFollowingState);

    try {
      const followedItemsStr = localStorage.getItem(LOCAL_STORAGE_FOLLOWED_CONTROVERSIES_KEY);
      let followedIds: string[] = followedItemsStr ? JSON.parse(followedItemsStr) : [];

      if (newFollowingState) {
        if (!followedIds.includes(controversy.id)) {
          followedIds.push(controversy.id);
        }
      } else {
        followedIds = followedIds.filter(id => id !== controversy.id);
      }
      localStorage.setItem(LOCAL_STORAGE_FOLLOWED_CONTROVERSIES_KEY, JSON.stringify(followedIds));
       toast({
        title: newFollowingState ? `Following "${controversy.title.substring(0,30)}..."` : `Unfollowed "${controversy.title.substring(0,30)}..."`,
        description: newFollowingState ? "You'll receive updates for this controversy (demo)." : "You will no longer receive updates (demo).",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error updating followed controversies in localStorage:", error);
      toast({
        title: "Could not update follow status",
        description: "There was an issue saving your follow preference. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
      setIsFollowingControversy(!newFollowingState); // Revert state
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
    console.log("Controversy Rating Submitted:", { controversyId: controversy.id, rating: currentRating });
    toast({
      title: "Review Submitted (Demo)",
      description: `You rated this controversy ${currentRating} star(s).`,
      duration: 5000,
    });
  };
  
  const getEntityIcon = (type: InvolvedEntity['type']) => {
    switch(type) {
      case 'politician': return <Users className="h-4 w-4 text-primary/80" />;
      case 'party': return <Briefcase className="h-4 w-4 text-primary/80" />; 
      case 'organization': return <Building className="h-4 w-4 text-primary/80" />;
      default: return <Users className="h-4 w-4 text-primary/80" />;
    }
  };

  const timelineItems = formatControversyUpdatesForTimeline(controversy.updates || []);

  return (
    <div>
      <PageHeader
        title={controversy.title}
        description={
          <div className="flex flex-wrap gap-2 items-center mt-1 text-sm">
            <Badge variant={controversy.status === 'Proven' || controversy.status === 'Legal Action Initiated' ? 'destructive' : 'secondary'}>{controversy.status}</Badge>
            <Badge variant={
                controversy.severityIndicator === 'Critical' || controversy.severityIndicator === 'High' ? 'destructive' :
                controversy.severityIndicator === 'Medium' ? 'secondary' : 'outline'
            }>
                Severity: {controversy.severityIndicator}
            </Badge>
            {controversy.dates?.started && <span className="text-muted-foreground">Started: {format(new Date(controversy.dates.started), 'MM/dd/yyyy')}</span>}
            {controversy.dates?.ended && <span className="text-muted-foreground">Ended: {format(new Date(controversy.dates.ended), 'MM/dd/yyyy')}</span>}
            {controversy.period && !controversy.dates?.started && <span className="text-muted-foreground">Period: {controversy.period}</span>}
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
              <CardTitle className="font-headline text-xl flex items-center gap-2"><FileText className="text-primary"/> Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 whitespace-pre-line">{controversy.description}</p>
              {controversy.summaryOutcome && (
                <div className="mt-4 pt-4 border-t">
                  <h3 className="font-semibold text-md mb-1 flex items-center gap-1"><Milestone className="h-4 w-4 text-primary/70"/>Outcome Summary:</h3>
                  <p className="text-sm text-foreground/80 italic">{controversy.summaryOutcome}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {timelineItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2"><CalendarDays className="text-primary"/> Chronological Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <TimelineDisplay items={timelineItems} />
              </CardContent>
            </Card>
          )}

          {controversy.officialResponses && controversy.officialResponses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2"><MessageSquare className="text-primary"/> Official Responses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {controversy.officialResponses.map((response, idx) => (
                  <div key={idx} className="text-sm border-l-4 border-primary/50 pl-3 py-1 bg-muted/30 rounded-r-sm">
                    <p className="font-semibold">{response.entityName} <span className="text-xs text-muted-foreground">({format(new Date(response.date), 'MM/dd/yyyy')})</span></p>
                    <blockquote className="italic text-foreground/80 mt-1">"{response.responseText}"</blockquote>
                    {response.sourceUrl && <a href={response.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs flex items-center gap-1 mt-1.5">View Source <ExternalLink className="h-3 w-3"/></a>}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {controversy.legalProceedings && controversy.legalProceedings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2"><Scale className="text-primary"/> Legal Proceedings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {controversy.legalProceedings.map((lp, idx) => (
                  <div key={idx} className="text-sm border-b pb-3 last:border-b-0">
                    {lp.court && <p className="font-semibold">{lp.court}{lp.caseNumber && ` (Case: ${lp.caseNumber})`}</p>}
                    {lp.status && <p>Status: <Badge variant="outline">{lp.status}</Badge></p>}
                    {lp.outcome && <p className="text-foreground/90">Outcome: {lp.outcome}</p>}
                    {lp.summary && <p className="text-muted-foreground text-xs mt-1">{lp.summary}</p>}
                    {lp.date && <p className="text-xs text-muted-foreground mt-1">Last Update: {format(new Date(lp.date), 'MM/dd/yyyy')}</p>}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" /> Rate this Controversy
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

        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2"><Users className="text-primary"/> Involved Entities</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {controversy.involvedEntities.map((entity, idx) => (
                  <li key={idx} className="text-sm flex items-start gap-2">
                    {getEntityIcon(entity.type)}
                    <div>
                      <Link 
                        href={entity.type === 'politician' ? `/politicians/${entity.id}` : entity.type === 'party' ? `/parties/${entity.id}` : '#'} 
                        className={entity.type === 'politician' || entity.type === 'party' ? "text-primary hover:underline font-semibold" : "font-semibold"}
                      >
                        {entity.name}
                      </Link>
                      <span className="text-xs text-muted-foreground block"> ({entity.type.charAt(0).toUpperCase() + entity.type.slice(1)})</span>
                      {entity.role && <p className="text-xs text-foreground/80 italic mt-0.5">{entity.role}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          {controversy.tags && controversy.tags.length > 0 && (
             <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-xl flex items-center gap-2"><Tag className="text-primary"/> Tags</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                    {controversy.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                </CardContent>
            </Card>
          )}

          {controversy.evidenceLinks && controversy.evidenceLinks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2"><ListChecks className="text-primary"/> Evidence</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {controversy.evidenceLinks.map((link, idx) => (
                    <li key={idx} className="border-b pb-1.5 last:pb-0 last:border-b-0">
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                        {link.description || link.url} <ExternalLink className="h-3 w-3 shrink-0"/>
                      </a>
                      <div className="text-xs text-muted-foreground">
                        {link.type && <Badge variant="outline" className="mr-1 text-[0.7rem] px-1 py-0">{link.type}</Badge>}
                        {link.dateAdded && <span>Added: {format(new Date(link.dateAdded), 'MM/dd/yyyy')}</span>}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

           {controversy.mediaCoverageLinks && controversy.mediaCoverageLinks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2"><Newspaper className="text-primary"/> Media Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {controversy.mediaCoverageLinks.map((link, idx) => (
                    <li key={idx} className="border-b pb-1.5 last:pb-0 last:border-b-0">
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
                        {link.title}
                      </a>
                      <p className="text-xs text-muted-foreground">
                        {link.sourceName} {link.date && ` - ${format(new Date(link.date), 'MM/dd/yyyy')}`}
                      </p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          <Button
            onClick={handleFollowToggle}
            className="w-full"
            variant={isFollowingControversy ? "outline" : "default"}
          >
            {isFollowingControversy ? <CheckCircle className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
            {isFollowingControversy ? `Following Controversy` : `Follow Controversy`}
          </Button>
        </div>
      </div>
    </div>
  );
}
    
