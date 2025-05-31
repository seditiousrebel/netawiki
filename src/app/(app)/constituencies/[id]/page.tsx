
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getConstituencyById, getPoliticianById, getNewsByConstituencyId } from '@/lib/mock-data';
import type { Constituency, Politician, NewsArticleLink, DevelopmentProject, LocalIssue } from '@/types/gov';
import { PageHeader } from '@/components/common/page-header';
// import { getCurrentUser, canAccess, EDITOR_ROLES } from '@/lib/auth'; // No longer needed for this button
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Users, User, Type, Code, Building, Globe, Landmark, History, Package, Newspaper, AlertTriangle, Edit, Info, CheckCircle, Layers, Star, UserPlus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';

const LOCAL_STORAGE_FOLLOWED_CONSTITUENCIES_KEY = 'govtrackr_followed_constituencies';

export default function ConstituencyDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = React.use(paramsPromise);
  const constituency = getConstituencyById(params.id);
  const relatedNews = constituency ? getNewsByConstituencyId(constituency.id) : [];
  const { toast } = useToast();
  // const currentUser = getCurrentUser(); // No longer needed for this button

  const [isFollowingConstituency, setIsFollowingConstituency] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    if (constituency) {
      try {
        const followedItemsStr = localStorage.getItem(LOCAL_STORAGE_FOLLOWED_CONSTITUENCIES_KEY);
        if (followedItemsStr) {
          const followedIds: string[] = JSON.parse(followedItemsStr);
          setIsFollowingConstituency(followedIds.includes(constituency.id));
        }
      } catch (error) {
        console.error("Error reading followed constituencies from localStorage:", error);
      }
    }
  }, [constituency]);


  if (!constituency) {
    return (
      <div className="text-center py-10">
        <MapPin className="mx-auto h-12 w-12 text-destructive" />
        <p className="mt-4 text-xl font-semibold">Constituency Not Found</p>
        <p className="text-muted-foreground">The constituency you are looking for does not exist.</p>
        <Link href="/constituencies" className="mt-6 inline-block">
          <Button variant="outline">Back to Constituencies List</Button>
        </Link>
      </div>
    );
  }
  
  const handleSuggestEdit = () => {
    toast({
      title: "Suggest Edit Feature",
      description: "This functionality is under development. Approved suggestions will update the content.",
      duration: 6000,
    });
  };

  const handleFollowToggle = () => {
    if (!constituency) return;
    const newFollowingState = !isFollowingConstituency;
    setIsFollowingConstituency(newFollowingState);

    try {
      const followedItemsStr = localStorage.getItem(LOCAL_STORAGE_FOLLOWED_CONSTITUENCIES_KEY);
      let followedIds: string[] = followedItemsStr ? JSON.parse(followedItemsStr) : [];

      if (newFollowingState) {
        if (!followedIds.includes(constituency.id)) {
          followedIds.push(constituency.id);
        }
      } else {
        followedIds = followedIds.filter(id => id !== constituency.id);
      }
      localStorage.setItem(LOCAL_STORAGE_FOLLOWED_CONSTITUENCIES_KEY, JSON.stringify(followedIds));
       toast({
        title: newFollowingState ? `Following "${constituency.name.substring(0,30)}..."` : `Unfollowed "${constituency.name.substring(0,30)}..."`,
        description: newFollowingState ? "You'll receive updates for this constituency (demo)." : "You will no longer receive updates (demo).",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error updating followed constituencies in localStorage:", error);
      toast({
        title: "Could not update follow status",
        description: "There was an issue saving your follow preference. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
      setIsFollowingConstituency(!newFollowingState); // Revert state
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
    console.log("Constituency Rating Submitted:", { constituencyId: constituency.id, rating: currentRating });
    toast({
      title: "Review Submitted (Demo)",
      description: `You rated this constituency ${currentRating} star(s).`,
      duration: 5000,
    });
  };


  return (
    <div>
      <PageHeader
        title={`${constituency.name} ${constituency.code ? `(${constituency.code})` : ''}`}
        description={
          <div className="flex flex-wrap gap-2 items-center mt-1 text-sm">
            <Badge variant="secondary">{constituency.type}</Badge>
            <span className="flex items-center gap-1 text-muted-foreground"><MapPin className="h-4 w-4"/>{constituency.district}, {constituency.province}</span>
          </div>
        }
        actions={(
           <Button variant="outline" onClick={handleSuggestEdit}>
            <Edit className="mr-2 h-4 w-4" /> Suggest Edit
          </Button>
        )}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {constituency.dataAiHint && (
             <Card className="overflow-hidden">
                <Image 
                    src={`https://placehold.co/800x300.png`} 
                    alt={`Map of ${constituency.name}`} 
                    width={800} height={300} 
                    className="w-full object-cover"
                    data-ai-hint={constituency.dataAiHint || "map area"}
                />
                <CardContent className="p-4 bg-muted/30">
                    <p className="text-sm text-muted-foreground">Note: This is a placeholder for an interactive map.</p>
                </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2"><Info className="text-primary"/> Constituency Overview</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div><strong>Type:</strong> {constituency.type}</div>
              {constituency.code && <div><strong>Code:</strong> {constituency.code}</div>}
              <div><strong>District:</strong> {constituency.district}</div>
              <div><strong>Province:</strong> {constituency.province}</div>
              {constituency.population && <div><strong>Population:</strong> {constituency.population.toLocaleString()}</div>}
              {constituency.registeredVoters && <div><strong>Registered Voters:</strong> {constituency.registeredVoters.toLocaleString()}</div>}
              {constituency.areaSqKm && <div><strong>Area:</strong> {constituency.areaSqKm.toLocaleString()} sq. km</div>}
            </CardContent>
          </Card>
          
          {constituency.currentRepresentativeIds && constituency.currentRepresentativeIds.length > 0 && (
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-xl flex items-center gap-2"><Users className="text-primary"/> Current Representative(s)</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {(constituency.currentRepresentativeNames || constituency.currentRepresentativeIds).map((nameOrId, index) => {
                            const repId = constituency.currentRepresentativeIds![index];
                            const repName = constituency.currentRepresentativeNames?.[index] || nameOrId;
                            const politician = getPoliticianById(repId);
                            return (
                                <li key={repId} className="text-sm flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground"/>
                                    {politician ? (
                                        <Link href={`/politicians/${politician.id}`} className="text-primary hover:underline font-semibold">
                                            {repName}
                                        </Link>
                                    ) : (
                                        <span className="font-semibold">{repName}</span>
                                    )}
                                    {politician?.partyName && <Badge variant="outline" className="text-xs">{politician.partyName}</Badge>}
                                </li>
                            );
                        })}
                    </ul>
                </CardContent>
            </Card>
          )}

          {constituency.keyDemographics && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2"><Landmark className="text-primary"/> Key Demographics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {constituency.keyDemographics.literacyRate && <p><strong>Literacy Rate:</strong> {constituency.keyDemographics.literacyRate}%</p>}
                {constituency.keyDemographics.ethnicGroups && constituency.keyDemographics.ethnicGroups.length > 0 && (
                  <div>
                    <strong>Major Ethnic Groups:</strong>
                    <ul className="list-disc list-inside ml-4">
                      {constituency.keyDemographics.ethnicGroups.map(group => (
                        <li key={group.name}>{group.name}: {group.percentage}%</li>
                      ))}
                    </ul>
                  </div>
                )}
                 <p className="text-xs text-muted-foreground pt-2 border-t mt-2">Note: More detailed demographic data will be available in future updates.</p>
              </CardContent>
            </Card>
          )}
          
          {constituency.historicalElectionResults && constituency.historicalElectionResults.length > 0 && (
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-xl flex items-center gap-2"><History className="text-primary"/>Historical Election Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {constituency.historicalElectionResults.map((result, idx) => (
                        <div key={idx} className="text-sm p-3 border rounded-md bg-muted/30">
                            <h4 className="font-semibold">{result.electionName}</h4>
                            {result.winnerPoliticianName && <p>Winner: {result.winnerPoliticianId ? <Link href={`/politicians/${result.winnerPoliticianId}`} className="text-primary hover:underline">{result.winnerPoliticianName}</Link> : result.winnerPoliticianName} ({result.winningPartyName || 'N/A'})</p>}
                            {result.detailsUrl && <Link href={result.detailsUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">View Full Results</Link>}
                        </div>
                    ))}
                     <p className="text-xs text-muted-foreground pt-2 border-t mt-2">Note: Full election result breakdowns will be available in future updates.</p>
                </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" /> Rate this Constituency
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

          {/* Revision History Card - Assuming constituency.revisionHistory is available */}
          {constituency.revisionHistory && constituency.revisionHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                  <History className="h-5 w-5 text-primary"/> Revision History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {constituency.revisionHistory.map((event) => (
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
           {constituency.developmentProjects && constituency.developmentProjects.length > 0 && (
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-xl flex items-center gap-2"><Package className="text-primary"/>Key Development Projects</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {constituency.developmentProjects.map((project: DevelopmentProject) => (
                        <div key={project.id} className="text-sm pb-2 border-b last:border-b-0">
                            <div className="font-semibold flex items-center gap-2">
                              <span>{project.name}</span>
                              <Badge variant={project.status === 'Completed' ? 'default' : project.status === 'Ongoing' ? 'secondary' : 'outline'} className={`text-xs ${project.status === 'Completed' ? 'bg-green-500 text-white' : ''}`}>{project.status}</Badge>
                            </div>
                            {project.description && <p className="text-xs text-muted-foreground mt-0.5">{project.description}</p>}
                            {project.budget && <p className="text-xs">Budget: {project.budget}</p>}
                            {project.expectedCompletion && <p className="text-xs">Expected Completion: {project.expectedCompletion}</p>}
                             {project.implementingAgency && <p className="text-xs">Agency: {project.implementingAgency}</p>}
                        </div>
                    ))}
                </CardContent>
            </Card>
           )}

            {constituency.localIssues && constituency.localIssues.length > 0 && (
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-xl flex items-center gap-2"><AlertTriangle className="text-primary"/>Major Local Issues</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {constituency.localIssues.map((issue: LocalIssue) => (
                        <div key={issue.id} className="text-sm pb-2 border-b last:border-b-0">
                           <div className="font-semibold flex items-center gap-2">
                            <span>{issue.title}</span>
                             <Badge variant={issue.status === 'Addressed' ? 'default' : issue.severity === 'High' ? 'destructive' : 'secondary'} 
                                    className={`text-xs ${issue.status === 'Addressed' ? 'bg-green-500 text-white' : ''}`}>
                                {issue.status} {issue.severity && `(${issue.severity})`}
                             </Badge>
                           </div>
                           {issue.description && <p className="text-xs text-muted-foreground mt-0.5">{issue.description}</p>}
                           {issue.reportedBy && <p className="text-xs text-muted-foreground">Reported by: {issue.reportedBy} {issue.dateReported && `on ${format(new Date(issue.dateReported), 'MM/dd/yyyy')}`}</p>}
                           {issue.resolutionDetails && <p className="text-xs text-green-700 mt-0.5">Resolution: {issue.resolutionDetails}</p>}
                        </div>
                    ))}
                </CardContent>
            </Card>
           )}

           {relatedNews.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2"><Newspaper className="text-primary"/>Related News</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {relatedNews.slice(0,5).map((news: NewsArticleLink) => (
                    <li key={news.id} className="text-sm border-b pb-2 last:border-b-0">
                      <a href={news.url || `/news/${news.slug || news.id}`} target={news.url && news.isAggregated ? "_blank" : "_self"} rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
                        {news.title}
                      </a>
                      <p className="text-xs text-muted-foreground">{news.sourceName} - {format(new Date(news.publicationDate), 'MM/dd/yyyy')}</p>
                      {news.summary && <p className="text-xs text-foreground/80 mt-1 line-clamp-2">{news.summary}</p>}
                    </li>
                  ))}
                  {relatedNews.length > 5 && <Link href={`/news?constituencyId=${constituency.id}`} className="text-xs text-primary hover:underline mt-2 block">View all related news...</Link>}
                </ul>
              </CardContent>
            </Card>
          )}

           {constituency.tags && constituency.tags.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-lg flex items-center gap-2">
                           <Layers className="h-5 w-5 text-primary"/> Tags 
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        {constituency.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                    </CardContent>
                </Card>
            )}
            <Button
              onClick={handleFollowToggle}
              className="w-full"
              variant={isFollowingConstituency ? "outline" : "default"}
            >
              {isFollowingConstituency ? <CheckCircle className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
              {isFollowingConstituency ? `Following Constituency` : `Follow Constituency`}
            </Button>
        </div>
      </div>
    </div>
  );
}
