"use client";

import Image from 'next/image';
import { getPoliticianById, getPromisesByPolitician, mockParties, getBillsBySponsor, mockBills, getControversiesByPoliticianId, getNewsByPoliticianId } from '@/lib/mock-data';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// Lucide imports selectively kept based on direct usage on this page
import { Edit, Users, Tag, CalendarDays, Landmark, MapPin, Star, BarChart3, ListChecks, Languages, CheckCircle, XCircle, MessageSquare, CircleHelp, Quote, Trash2, UserCircle, ExternalLink } from 'lucide-react';
import { TimelineDisplay } from '@/components/common/timeline-display';
import Link from 'next/link';
import type { PromiseItem, AssetDeclaration, CriminalRecord, CommitteeMembership, Bill, VoteRecord, Politician, StatementQuote, Controversy, PartyAffiliation, PoliticalJourneyEvent, NewsArticleLink, PendingEdit } from '@/types/gov';

// Import new reusable components
import ContactInfoDisplay from '@/components/common/details/ContactInfoDisplay';
import TagsDisplay from '@/components/common/details/TagsDisplay';
import EducationHistoryDisplay from '@/components/common/details/EducationHistoryDisplay';
import CareerHistoryDisplay from '@/components/common/details/CareerHistoryDisplay';
import CommitteeMembershipsDisplay from '@/components/common/details/CommitteeMembershipsDisplay';
import SponsoredBillsDisplay from '@/components/common/details/SponsoredBillsDisplay';
import VotingRecordDisplay from '@/components/common/details/VotingRecordDisplay';
import AssetDeclarationsDisplay from '@/components/common/details/AssetDeclarationsDisplay';
import CriminalRecordsDisplay from '@/components/common/details/CriminalRecordsDisplay';
import RelatedNewsDisplay from '@/components/common/details/RelatedNewsDisplay';
import AssociatedControversiesDisplay from '@/components/common/details/AssociatedControversiesDisplay';
import PromisesDisplay from '@/components/common/details/PromisesDisplay';
import RevisionHistoryDisplay from '@/components/common/details/RevisionHistoryDisplay';
import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect, useRef } from 'react'; // Keep useEffect if other effects use it
import { Textarea } from '@/components/ui/textarea';
// import { SuggestEditForm } from '@/components/common/suggest-edit-form'; // Removed
import { SuggestEntityEditForm } from '@/components/common/SuggestEntityEditForm';
import FollowButton from '@/components/common/FollowButton'; // Added FollowButton import
import { entitySchemas } from '@/lib/schemas'; // Added
import { useNotificationStore } from "@/lib/notifications";
import ScoreBarChart from '@/components/charts/ScoreBarChart';
import { getCurrentUser, canAccess, ADMIN_ROLES, isUserLoggedIn } from '@/lib/auth';
import { useRouter } from 'next/navigation';
// import { exportElementAsPDF } from '@/lib/utils'; // Removed export
import VotingRecordChart from '@/components/charts/VotingRecordChart'; // Import the new chart

interface PoliticianVote extends VoteRecord {
  billId: string;
  billTitle: string;
  billNumber: string;
  chamber: 'House' | 'Senate';
  voteDate: string;
}

interface TimelineItem {
  date: string;
  title: string;
  description?: string;
}

// Helper function to combine and sort career events - This local definition is correct
function formatCombinedCareerTimeline(
  journeyEvents: PoliticalJourneyEvent[] = [],
  partyAffiliations: PartyAffiliation[] = []
): TimelineItem[] {
  const combinedEvents: TimelineItem[] = [];

  journeyEvents.forEach(event => {
    combinedEvents.push({
      date: event.date,
      title: event.event,
      description: event.description,
    });
  });

  partyAffiliations.forEach(aff => {
    combinedEvents.push({
      date: aff.startDate,
      title: `Joined ${aff.partyName}`,
      description: aff.role ? `Role: ${aff.role}` : undefined,
    });
    if (aff.endDate && aff.endDate !== 'Present') {
      combinedEvents.push({
        date: aff.endDate,
        title: `Left ${aff.partyName}`,
        description: aff.role ? `Previous Role: ${aff.role}` : undefined,
      });
    }
  });

  return combinedEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Mock function to simulate saving a pending edit
const mockSavePendingEdit = async (pendingEditData: PendingEdit) => {
  console.log("Mock saving PendingEdit:", JSON.stringify(pendingEditData, null, 2));
  // In a real scenario, this would be an API call:
  // const response = await fetch('/api/pending-edits', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(pendingEditData),
  // });
  // if (!response.ok) {
  //   throw new Error('Failed to save pending edit');
  // }
  // return await response.json();
  return { ...pendingEditData, id: `mock-${Date.now()}` }; // Simulate ID generation
};

export default function PoliticianProfilePage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = React.use(paramsPromise);
  const currentUser = getCurrentUser();
  const router = useRouter();
  const politician = getPoliticianById(params.id);
  const { toast } = useToast();
  // const [isFollowing, setIsFollowing] = useState(false); // Removed isFollowing state
  const [currentRating, setCurrentRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [commentText, setCommentText] = useState("");

  // const [isGeneratingPdf, setIsGeneratingPdf] = useState(false); // Removed for PDF export
  const [isSuggestEntityEditModalOpen, setIsSuggestEntityEditModalOpen] = useState(false); 


  const [formattedDateOfBirth, setFormattedDateOfBirth] = useState<string | null>(null);
  const [formattedDateOfDeath, setFormattedDateOfDeath] = useState<string | null>(null);
  const { addNotification } = useNotificationStore();
  const notificationTriggered = useRef(false);

  const openSuggestEntityEditModal = () => {
    if (!isUserLoggedIn()) {
      router.push('/auth/login');
      return;
    }
    if (!politician) return;
    setIsSuggestEntityEditModalOpen(true);
  };

  useEffect(() => {
    if (politician && !notificationTriggered.current) {
      const timeoutId = setTimeout(() => {
        addNotification(
          `New bill 'Infrastructure Improvement Act' sponsored by ${politician.name} has been introduced.`,
          'info',
          '/bills/mock-bill-123'
        );
      }, 3000);
      notificationTriggered.current = true;
      return () => clearTimeout(timeoutId);
    }
  }, [politician, addNotification]);

  useEffect(() => {
    if (politician?.dateOfBirth) {
      setFormattedDateOfBirth(new Date(politician.dateOfBirth).toLocaleDateString());
    } else {
      setFormattedDateOfBirth(null);
    }
    if (politician?.dateOfDeath) {
      setFormattedDateOfDeath(new Date(politician.dateOfDeath).toLocaleDateString());
    } else {
      setFormattedDateOfDeath(null);
    }
  }, [politician?.dateOfBirth, politician?.dateOfDeath]);

  // Removed useEffect for isFollowing

  const handleEntityEditSuggestionSubmit = (submission: {
    formData: Record<string, any>;
    reason: string;
    evidenceUrl: string;
  }) => {
    if (!politician || !currentUser) return;

    // Construct proposedData
    const proposedData = {
      ...JSON.parse(JSON.stringify(politician)), // Deep clone of the current politician object
      ...submission.formData, // Merge the changes from the form
    };

    const pendingEdit: PendingEdit = {
      // id will be generated by the backend, mockSavePendingEdit simulates this
      entityType: "Politician",
      entityId: politician.id,
      proposedData: proposedData,
      reasonForChange: submission.reason,
      evidenceUrl: submission.evidenceUrl,
      submittedByUserId: currentUser.id,
      submittedAt: new Date().toISOString(),
      status: 'PENDING',
      // adminFeedback, approvedByUserId, deniedByUserId, reviewedAt will be undefined initially
    };

    mockSavePendingEdit(pendingEdit)
      .then(savedEdit => {
        console.log("Pending edit saved (mock):", savedEdit);
        toast({
          title: "Changes Suggested",
          description: `Your proposed changes for ${politician.name} have been submitted for review. Thank you! (ID: ${savedEdit.id})`,
          duration: 5000,
        });
      })
      .catch(error => {
        console.error("Failed to save pending edit (mock):", error);
        toast({
          title: "Error Suggesting Changes",
          description: "There was an error submitting your changes. Please try again.",
          variant: "destructive",
          duration: 5000,
        });
      });
    
    // Original console log kept for comparison during development if needed, can be removed.
    // console.log("Original Full entity edit suggestion submitted:", {
    //   entityType: "Politician",
    //   entityId: politician.id,
    //   suggestedData: submission.formData,
    //   reason: submission.reason,
    //   evidenceUrl: submission.evidenceUrl,
    //   submittedAt: new Date().toISOString(),
    //   status: "PendingEntityUpdate"
    // });

    // The toast call below was part of the original code before PendingEdit integration.
    // It's now handled within the .then() of mockSavePendingEdit.
    // toast({
    //   title: "Changes Suggested",
    //   description: `Your proposed changes for ${politician.name} have been submitted for review. Thank you!`,
    //   duration: 5000,
    // });
    setIsSuggestEntityEditModalOpen(false);
  };

  // Removed handleFollowToggle function

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
    console.log("Rating Submitted:", { rating: currentRating, comment: commentText });
    toast({
      title: "Review Submitted (Demo)",
      description: `You rated ${politician.name} ${currentRating} star(s). Comment: ${commentText || 'No comment provided.'}`,
      duration: 5000,
    });
  };

  // Removed handleExportPdfWrapper function

  const handleDelete = () => {
    if (!politician) return;
    alert(`Mock delete action for politician: ${politician.name}`);
  };

  if (!politician) {
    return (
      <div className="container mx-auto py-10 text-center">
        <UserCircle className="mx-auto h-16 w-16 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold text-foreground">Politician Not Found</h1>
        <p className="mt-2 text-muted-foreground">
          The politician profile you are looking for does not exist or may have been removed.
        </p>
        <Button asChild className="mt-6">
          <Link href="/politicians">Back to Politicians List</Link>
        </Button>
      </div>
    );
  }

  const promises = getPromisesByPolitician(params.id);
  const party = politician.partyId ? mockParties.find(p => p.id === politician.partyId) : null;
  const sponsoredBillsData = getBillsBySponsor(politician.id); // Renamed to avoid conflict
  const relatedControversies = getControversiesByPoliticianId(politician.id);
  const careerTimelineItems = formatCombinedCareerTimeline(politician.politicalJourney, politician.partyAffiliations);
  const relatedNews = getNewsByPoliticianId(politician.id);

  // Prepare data for SponsoredBillsDisplay
  const sponsoredBillsForDisplay = sponsoredBillsData.map(bill => ({
    ...bill,
    // Ensure type safety if bill.sponsors is undefined or if find returns undefined
    sponsorshipType: bill.sponsors?.find(s => s.id === politician.id)?.type
      ? `${bill.sponsors.find(s => s.id === politician.id)?.type} Sponsor`
      : undefined
  }));

  const politicianVotes: PoliticianVote[] = [];
  mockBills.forEach(bill => {
    if (bill.votingResults?.house?.records) {
      const houseVote = bill.votingResults.house.records.find(record => record.politicianId === politician.id);
      if (houseVote) {
        politicianVotes.push({
          ...houseVote,
          billId: bill.id,
          billTitle: bill.title,
          billNumber: bill.billNumber,
          chamber: 'House',
          voteDate: bill.votingResults.house.date,
        });
      }
    }
    if (bill.votingResults?.senate?.records) {
      const senateVote = bill.votingResults.senate.records.find(record => record.politicianId === politician.id);
      if (senateVote) {
        politicianVotes.push({
          ...senateVote,
          billId: bill.id,
          billTitle: bill.title,
          billNumber: bill.billNumber,
          chamber: 'Senate',
          voteDate: bill.votingResults.senate.date,
        });
      }
    }
  });

  // Removed getCriminalStatusBadgeVariant as it's now in CriminalRecordsDisplay.tsx

  return (
    <div>
      <PageHeader
        title={
          <span className="flex items-center">
            {politician.name}
          </span>
        }
        description={
          <div className="space-y-1">
            <p className="flex items-center">
              {politician.positions[0]?.title || 'Public Figure'}
            </p>
            {politician.isActiveInPolitics !== undefined && (
                <Badge variant={politician.isActiveInPolitics ? 'default' : 'secondary'} className={`${politician.isActiveInPolitics ? 'bg-green-500 text-white' : ''}`}>
                  {politician.isActiveInPolitics ? <CheckCircle className="mr-1 h-3 w-3"/> : <XCircle className="mr-1 h-3 w-3"/>}
                  {politician.isActiveInPolitics ? 'Active' : 'Inactive'}
                </Badge>
            )}
          </div>
        }
        actions={(
          <div className="flex gap-2">
            {politician && ( // Ensure politician data is loaded
              <FollowButton
                entityId={politician.id}
                entityType="politician"
                entityName={politician.name}
                className="whitespace-nowrap" // Added for consistent styling with other buttons if needed
              />
            )}
            <Button variant="outline" onClick={openSuggestEntityEditModal}>
              <Edit className="mr-2 h-4 w-4" /> Propose Changes to Profile
            </Button>
            {/* Export to PDF button removed */}
            {canAccess(currentUser.role, ADMIN_ROLES) && (
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete Politician
              </Button>
            )}
          </div>
        )}
      />

      {politician && isSuggestEntityEditModalOpen && entitySchemas.Politician && (
        <SuggestEntityEditForm
          isOpen={isSuggestEntityEditModalOpen}
          onOpenChange={setIsSuggestEntityEditModalOpen}
          entityType="Politician"
          entitySchema={entitySchemas.Politician} 
          currentEntityData={politician}
          onSubmit={handleEntityEditSuggestionSubmit}
        />
      )}

      <div id="politician-profile-export-area" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-0">
              <div className="relative group">
                <Image
                    src={politician.photoUrl}
                    alt={politician.name}
                    width={400}
                    height={400}
                    className="w-full h-auto object-cover rounded-t-lg"
                    data-ai-hint={politician.dataAiHint || "politician portrait"}
                />
              </div>
              <div className="p-6 space-y-1.5">
                <h2 className="text-2xl font-headline font-semibold mb-1 flex items-center">{politician.name} </h2>
                {politician.nepaliName && <p className="text-lg text-muted-foreground -mt-1 mb-1 flex items-center">{politician.nepaliName} </p>}

                <div className="flex items-center">
                  <span className="text-sm text-muted-foreground">Also known as: {politician.aliases?.join(', ') || 'N/A'}</span>
                </div>

                {party && (
                  <Link href={`/parties/${party.id}`} className="text-primary hover:underline flex items-center gap-1 text-sm">
                    <Landmark className="h-4 w-4" /> {party.name}
                  </Link>
                )}
                 {politician.constituency && <p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="h-4 w-4" /> {politician.constituency} </p>}
                {politician.dateOfBirth && <p className="text-sm text-muted-foreground flex items-center gap-1"><CalendarDays className="h-4 w-4" /> Born: {formattedDateOfBirth || '...'} {politician.placeOfBirth?.district && <span className="flex items-center">, {politician.placeOfBirth.district} </span>}{politician.placeOfBirth?.address && <span className="flex items-center">, {politician.placeOfBirth.address} </span>}</p>}
                {politician.dateOfDeath && <p className="text-sm text-muted-foreground flex items-center gap-1"><CalendarDays className="h-4 w-4" /> Deceased: {formattedDateOfDeath || '...'} </p>}
                {politician.gender && <p className="text-sm text-muted-foreground flex items-center">Gender: {politician.gender} </p>}
              </div>
            </CardContent>
          </Card>

          <ContactInfoDisplay contactInfo={politician.contactInfo} />

          {politician.tags && politician.tags.length > 0 && (
            <TagsDisplay tags={politician.tags} />
          )}

          {politician.education && politician.education.length > 0 && (
            <EducationHistoryDisplay educationHistory={politician.education} />
          )}
          
          {/* CareerHistoryDisplay renders its own Card if careerHistory is not empty */}
          <CareerHistoryDisplay careerHistory={politician.positions} />

          {politician.committeeMemberships && politician.committeeMemberships.length > 0 && (
            <CommitteeMembershipsDisplay committeeMemberships={politician.committeeMemberships} />
          )}
        </div>

        <div className="lg:col-span-2 space-y-8">
         {(politician.politicalIdeology && politician.politicalIdeology.length > 0) || (politician.languagesSpoken && politician.languagesSpoken.length > 0) ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary"/> Profile Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {politician.politicalIdeology && politician.politicalIdeology.length > 0 && (
                  <div>
                    <div className="flex justify-between items-center">
                      <h3 className="text-md font-semibold mb-1 flex items-center gap-1"><Tag className="h-4 w-4 text-muted-foreground"/> Political Ideology</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {politician.politicalIdeology.map(ideo => (
                        <Badge key={ideo} variant="secondary">{ideo}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {politician.languagesSpoken && politician.languagesSpoken.length > 0 && (
                   <div>
                    <div className="flex justify-between items-center">
                      <h3 className="text-md font-semibold mb-1 flex items-center gap-1"><Languages className="h-4 w-4 text-muted-foreground"/> Languages Spoken</h3>
                    </div>
                    <p className="text-sm text-foreground/80">{politician.languagesSpoken.join(', ')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : null}


          {(politician.overallRating !== undefined || politician.voteScore !== undefined || politician.promiseFulfillmentRate !== undefined || politician.popularityScore !== undefined) && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary"/> Analytics Snapshot
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(politician.voteScore !== undefined || politician.promiseFulfillmentRate !== undefined) && (
                  <div className="mb-6">
                    <ScoreBarChart data={[
                      ...(politician.voteScore !== undefined ? [{ name: 'Vote Score', value: politician.voteScore }] : []),
                      ...(politician.promiseFulfillmentRate !== undefined ? [{ name: 'Promise Fulfillment', value: politician.promiseFulfillmentRate }] : []),
                    ]} />
                  </div>
                )}
                {politician.overallRating !== undefined && (
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-400" />
                    <span className="font-semibold text-lg">{politician.overallRating.toFixed(1)} / 5.0</span>
                    {politician.userRatingCount !== undefined && (
                      <span className="text-sm text-muted-foreground">(from {politician.userRatingCount} ratings)</span>
                    )}
                  </div>
                )}
                {politician.voteScore !== undefined && politician.promiseFulfillmentRate === undefined && (
                   <div className="flex items-center gap-2">
                     <Users className="h-5 w-5 text-primary" />
                     <span className="font-semibold text-lg">{politician.voteScore}%</span>
                     <span className="text-sm text-muted-foreground">Vote Score (Hypothetical)</span>
                   </div>
                )}
                 {politician.promiseFulfillmentRate !== undefined && politician.voteScore === undefined && (
                   <div className="flex items-center gap-2">
                     <ListChecks className="h-5 w-5 text-green-500" />
                     <span className="font-semibold text-lg">{politician.promiseFulfillmentRate}%</span>
                     <span className="text-sm text-muted-foreground">Promise Fulfillment</span>
                   </div>
                 )}
                {politician.popularityScore !== undefined && (
                  <div className="flex items-center gap-2">
                     <CircleHelp className="h-5 w-5 text-purple-500" />
                    <span className="font-semibold text-lg">{politician.popularityScore}</span>
                    <span className="text-sm text-muted-foreground">Popularity Score</span>
                  </div>
                )}
                 <p className="text-xs text-muted-foreground pt-2 border-t mt-2">
                    Note: Analytics data is for demonstration purposes.
                </p>
              </CardContent>
            </Card>
          )}

          {politician.statementsAndQuotes && politician.statementsAndQuotes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                  <Quote className="h-5 w-5 text-primary"/> Notable Statements & Quotes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {politician.statementsAndQuotes.map((sq: StatementQuote) => (
                  <div key={sq.id} className="border-l-4 border-primary pl-4 py-2 bg-secondary/30 rounded-r-md">
                    <blockquote className="italic text-foreground/90">
                      "{sq.quoteText}"
                    </blockquote>
                    <footer className="mt-2 text-xs text-muted-foreground">
                      &mdash; {politician.name}, {sq.sourceName} ({new Date(sq.dateOfStatement).toLocaleDateString()})
                      {sq.sourceUrl && (
                        <a href={sq.sourceUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-primary hover:underline inline-flex items-center gap-1">
                          Source <ExternalLink className="h-3 w-3"/>
                        </a>
                      )}
                    </footer>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

           {politician.bio && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline text-xl">Biography</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 whitespace-pre-line">{politician.bio}</p>
              </CardContent>
            </Card>
          )}

            <CardContent>
              <TimelineDisplay items={careerTimelineItems} />
            </CardContent>
          </Card>

          {/* SponsoredBillsDisplay renders its own Card if data exists */}
          <SponsoredBillsDisplay sponsoredBills={sponsoredBillsForDisplay} />

          {/* VotingRecordDisplay renders its own Card if data exists */}
          <VotingRecordDisplay votingRecords={politicianVotes} />

          {/* AssetDeclarationsDisplay renders its own Card if data exists */}
          {politician.assetDeclarations && politician.assetDeclarations.length > 0 && (
             <AssetDeclarationsDisplay assetDeclarations={politician.assetDeclarations} />
          )}
         
          {/* CriminalRecordsDisplay renders its own Card if data exists */}
          {politician.criminalRecords && politician.criminalRecords.length > 0 && (
            <CriminalRecordsDisplay criminalRecords={politician.criminalRecords} />
          )}

          {/* RelatedNewsDisplay renders its own Card if data exists */}
          <RelatedNewsDisplay newsItems={relatedNews} />
          
          {/* AssociatedControversiesDisplay renders its own Card if data exists */}
          <AssociatedControversiesDisplay controversies={relatedControversies} />
          {/* Note: The "View all controversies" link from the original page can be added here by the page author if desired. */}
          
          {/* PromisesDisplay handles its own empty message and Card structure */}
          <PromisesDisplay promises={promises} />
          {/* Optional: Link to view all promises - can be added by the page author if desired. */}
          
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" /> Rate or Endorse {politician.name}
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
              <div>
                <label htmlFor="comment" className="mb-2 text-sm font-medium block">Your Comment (Optional):</label>
                <Textarea
                  id="comment"
                  placeholder={`Share your thoughts on ${politician.name}...`}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={4}
                />
              </div>
              <Button onClick={handleRatingSubmit} className="w-full sm:w-auto" disabled={currentRating === 0}>
                Submit Review
              </Button>
            </CardContent>
          </Card>

          {/* Voting Record Chart */}
          {politician.votingRecords && politician.votingRecords.length > 0 && (
            <Card>
              <VotingRecordChart votingData={politician.votingRecords} />
            </Card>
          )}

          {/* RevisionHistoryDisplay renders its own Card if data exists */}
          <RevisionHistoryDisplay historyItems={politician.revisionHistory} />
        </div>
      </div>
    </div>
  );
}
