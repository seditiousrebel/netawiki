
"use client";

import React, { useState, useEffect } from 'react';
import { getElectionById, getCandidatesByElectionId, getPoliticianById, getPartyById, getNewsByElectionId } from '@/lib/mock-data';
import { PageHeader } from '@/components/common/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CalendarDays, Users, VoteIcon, MapPin, BarChart3, UserCircle, Flag, ExternalLink, CheckCircle, Award, Newspaper, History, Star, UserPlus } from 'lucide-react';
import type { Election, ElectionCandidate, ElectionStatus, Politician, Party, NewsArticleLink, ElectionTimelineEvent } from '@/types/gov';
import { format } from 'date-fns';
import Image from 'next/image';
import { TimelineDisplay, formatElectionTimelineEventsForTimeline } from '@/components/common/timeline-display';
import { useToast } from "@/hooks/use-toast";

const LOCAL_STORAGE_FOLLOWED_ELECTIONS_KEY = 'govtrackr_followed_elections';

function getElectionStatusBadgeVariant(status: ElectionStatus) {
  // Same as list page, can be refactored to a common util if needed
  switch (status) {
    case 'Concluded': return 'bg-green-500 text-white';
    case 'Ongoing': case 'Counting': return 'bg-blue-500 text-white';
    case 'Scheduled': case 'Upcoming': return 'bg-yellow-500 text-black';
    case 'Postponed': case 'Cancelled': return 'bg-red-500 text-white';
    default: return 'bg-secondary text-secondary-foreground';
  }
}

export default function ElectionDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = React.use(paramsPromise);
  const election = getElectionById(params.id);
  const candidates = election ? getCandidatesByElectionId(election.id) : [];
  const relatedNews = election ? getNewsByElectionId(election.id) : [];
  const timelineItems = election?.timelineEvents ? formatElectionTimelineEventsForTimeline(election.timelineEvents) : [];
  const { toast } = useToast();

  const [isFollowingElection, setIsFollowingElection] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    if (election) {
      try {
        const followedItemsStr = localStorage.getItem(LOCAL_STORAGE_FOLLOWED_ELECTIONS_KEY);
        if (followedItemsStr) {
          const followedIds: string[] = JSON.parse(followedItemsStr);
          setIsFollowingElection(followedIds.includes(election.id));
        }
      } catch (error) {
        console.error("Error reading followed elections from localStorage:", error);
      }
    }
  }, [election]);


  if (!election) {
    return (
      <div className="text-center py-10">
        <VoteIcon className="mx-auto h-12 w-12 text-destructive" />
        <p className="mt-4 text-xl font-semibold">Election Not Found</p>
        <p className="text-muted-foreground">The election you are looking for does not exist or may have been removed.</p>
        <Link href="/elections" className="mt-6 inline-block">
          <Button variant="outline">Back to Elections List</Button>
        </Link>
      </div>
    );
  }

  const handleFollowElectionToggle = () => {
    if (!election) return;
    const newFollowingState = !isFollowingElection;
    setIsFollowingElection(newFollowingState);

    try {
      const followedItemsStr = localStorage.getItem(LOCAL_STORAGE_FOLLOWED_ELECTIONS_KEY);
      let followedIds: string[] = followedItemsStr ? JSON.parse(followedItemsStr) : [];

      if (newFollowingState) {
        if (!followedIds.includes(election.id)) {
          followedIds.push(election.id);
        }
      } else {
        followedIds = followedIds.filter(id => id !== election.id);
      }
      localStorage.setItem(LOCAL_STORAGE_FOLLOWED_ELECTIONS_KEY, JSON.stringify(followedIds));
       toast({
        title: newFollowingState ? `Following Election: "${election.name.substring(0,30)}..."` : `Unfollowed Election: "${election.name.substring(0,30)}..."`,
        description: newFollowingState ? "You'll receive updates for this election (demo)." : "You will no longer receive updates (demo).",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error updating followed elections in localStorage:", error);
      toast({
        title: "Could not update follow status",
        description: "There was an issue saving your follow preference. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
      setIsFollowingElection(!newFollowingState); // Revert state
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
    console.log("Election Rating Submitted:", { electionId: election.id, rating: currentRating });
    toast({
      title: "Review Submitted (Demo)",
      description: `You rated this election ${currentRating} star(s).`,
      duration: 5000,
    });
  };


  return (
    <div>
      <PageHeader
        title={election.name}
        description={
          <div className="flex flex-wrap gap-2 items-center mt-1 text-sm">
            <Badge variant="outline" className={getElectionStatusBadgeVariant(election.status)}>
              {election.status}
            </Badge>
            <Badge variant="secondary">{election.electionType}</Badge>
            <span className="text-muted-foreground flex items-center gap-1">
              <CalendarDays className="h-4 w-4" /> {format(new Date(election.date), 'MMMM dd, yyyy')}
            </span>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2"><VoteIcon className="text-primary"/>Election Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {election.description && <p className="text-foreground/80 mb-4 whitespace-pre-line">{election.description}</p>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                {election.country && <div><strong>Country:</strong> {election.country}</div>}
                {election.province && <div><strong>Province:</strong> {election.province}</div>}
                {election.districts && election.districts.length > 0 && <div><strong>District(s):</strong> {election.districts.join(', ')}</div>}
                {election.constituencyIds && election.constituencyIds.length > 0 && (
                  <div><strong>Constituencies:</strong> {election.constituencyIds.join(', ')} (Detailed list below)</div>
                )}
                {election.totalRegisteredVoters && <div className="flex items-center gap-1"><strong>Registered Voters:</strong> <Users className="h-4 w-4 text-muted-foreground"/> {election.totalRegisteredVoters.toLocaleString()}</div>}
                {election.totalVotesCast && <div className="flex items-center gap-1"><strong>Votes Cast:</strong> <Users className="h-4 w-4 text-muted-foreground"/> {election.totalVotesCast.toLocaleString()}</div>}
                {election.voterTurnoutPercentage && <div className="flex items-center gap-1"><strong>Voter Turnout:</strong> <BarChart3 className="h-4 w-4 text-muted-foreground"/> {election.voterTurnoutPercentage}%</div>}
                {election.pollingStationsCount && <div><strong>Polling Stations:</strong> {election.pollingStationsCount.toLocaleString()}</div>}
              </div>
               {election.tags && election.tags.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <h3 className="font-semibold text-md mb-1">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {election.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {timelineItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2"><History className="text-primary"/>Election Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <TimelineDisplay items={timelineItems} />
              </CardContent>
            </Card>
          )}

          {candidates.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2"><Users className="text-primary"/>Candidates</CardTitle>
                <CardDescription>List of candidates participating in this election.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {candidates.map(candidate => {
                  const politician = getPoliticianById(candidate.politicianId);
                  const party = candidate.partyId ? getPartyById(candidate.partyId) : null;
                  return (
                    <Card key={candidate.id} className="shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-3">
                                {politician?.photoUrl && (
                                    <Image src={politician.photoUrl} alt={candidate.politicianName || 'Candidate'} width={48} height={48} className="rounded-full h-12 w-12 object-cover" data-ai-hint={politician.dataAiHint || "candidate photo"} />
                                )}
                                <div>
                                    <CardTitle className="text-lg font-semibold">
                                    {politician ? (
                                        <Link href={`/politicians/${politician.id}`} className="text-primary hover:underline">
                                        {candidate.politicianName}
                                        </Link>
                                    ) : (
                                        candidate.politicianName || 'N/A'
                                    )}
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        {candidate.constituencyName && <span className="flex items-center gap-1"><MapPin className="h-3 w-3"/>{candidate.constituencyName}</span>}
                                    </CardDescription>
                                </div>
                            </div>
                             {candidate.isWinner && (
                                <Badge variant="default" className="bg-green-500 text-white text-xs whitespace-nowrap self-start">
                                    <Award className="h-3 w-3 mr-1"/> Winner
                                </Badge>
                            )}
                        </div>

                      </CardHeader>
                      <CardContent className="text-sm space-y-1.5 pt-0 pl-6 ml-[calc(48px+0.75rem)]"> {/* Indent content to align with name */}
                        {party && (
                          <div className="flex items-center gap-1">
                            <Flag className="h-4 w-4 text-muted-foreground"/> Party: {' '}
                            <Link href={`/parties/${party.id}`} className="text-primary hover:underline">
                              {party.name}
                            </Link>
                            {candidate.partySymbolUrl && <Image src={candidate.partySymbolUrl} alt={`${party.name} Symbol`} width={20} height={20} className="ml-1" data-ai-hint={party.dataAiHint || "party symbol"} />}
                          </div>
                        )}
                        {!party && candidate.partyName && (
                             <div className="flex items-center gap-1"><Flag className="h-4 w-4 text-muted-foreground"/> Affiliation: {candidate.partyName}</div>
                        )}
                        {candidate.ballotNumber && <div className="flex items-center gap-1">Ballot No: <Badge variant="outline">{candidate.ballotNumber}</Badge></div>}
                        <div className="flex items-center gap-1">Status: <Badge variant={candidate.status === "Elected" ? "default" : "secondary"} className={candidate.status === "Elected" ? "bg-green-600 text-white" : ""}>{candidate.status}</Badge></div>
                        {candidate.votesReceived !== undefined && <div className="flex items-center gap-1">Votes: {candidate.votesReceived.toLocaleString()} {candidate.votePercentage !== undefined && `(${candidate.votePercentage}%)`}</div>}

                        <div className="flex flex-wrap gap-2 mt-2">
                            {candidate.manifestoUrl && <Button variant="link" size="sm" asChild className="p-0 h-auto text-xs"><a href={candidate.manifestoUrl} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-3 w-3 mr-1"/>Manifesto</a></Button>}
                            {candidate.campaignWebsite && <Button variant="link" size="sm" asChild className="p-0 h-auto text-xs"><a href={candidate.campaignWebsite} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-3 w-3 mr-1"/>Campaign Site</a></Button>}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" /> Rate this Election
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

          {/* Revision History Card - Assuming election.revisionHistory is available */}
          {election.revisionHistory && election.revisionHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                  <History className="h-5 w-5 text-primary"/> Revision History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {election.revisionHistory.map((event) => (
                    <li key={event.id} className="border-b pb-3 last:border-b-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-md">{event.event}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(event.date).toLocaleDateString()} by {event.author}
                        </span>
                      </div>
                      {event.details && <p className="text-sm text-foreground/80 mb-1">{event.details}</p>}
                      {event.suggestionId && (
                        <p className="text-xs text-muted-foreground">
                          Based on suggestion: <Badge variant="outline" className="font-mono text-xs">{event.suggestionId}</Badge>
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-1 space-y-6">
           {relatedNews.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2"><Newspaper className="text-primary"/>Related News</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {relatedNews.map((news: NewsArticleLink) => (
                    <li key={news.id} className="text-sm border-b pb-2 last:border-b-0">
                      <a href={news.url || `/news/${news.slug || news.id}`} target={news.url ? "_blank" : "_self"} rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
                        {news.title}
                      </a>
                      <p className="text-xs text-muted-foreground">{news.sourceName} - {format(new Date(news.publicationDate), 'MM/dd/yyyy')}</p>
                      {news.summary && <p className="text-xs text-foreground/80 mt-1 line-clamp-2">{news.summary}</p>}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
           <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">Voter Turnout Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">(Detailed voter turnout analysis will be displayed here in future updates.)</p>
            </CardContent>
          </Card>
           <Button
            onClick={handleFollowElectionToggle}
            className="w-full"
            variant={isFollowingElection ? "outline" : "default"}
          >
            {isFollowingElection ? <CheckCircle className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
            {isFollowingElection ? `Following Election` : `Follow Election`}
          </Button>
        </div>
      </div>
    </div>
  );
}


    