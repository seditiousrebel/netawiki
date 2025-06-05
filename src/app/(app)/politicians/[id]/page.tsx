
"use client";

import Image from 'next/image';
import { getPoliticianById, getPromisesByPolitician, mockParties, getBillsBySponsor, mockBills, getControversiesByPoliticianId, getNewsByPoliticianId } from '@/lib/mock-data';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Users, Tag, CalendarDays, Landmark, MapPin, Star, BarChart3, ListChecks, Languages, CheckCircle, XCircle, MessageSquare, CircleHelp, Quote, Trash2, UserCircle, ExternalLink, History, PlusCircle } from 'lucide-react';
import { TimelineDisplay } from '@/components/common/timeline-display';
import Link from 'next/link';
import { SuggestNewEntryForm } from '@/components/common/suggest-new-entry-form';
import type { PromiseItem, AssetDeclaration, CriminalRecord, CommitteeMembership, Bill, VoteRecord, Politician, StatementQuote, Controversy, PartyAffiliation, PoliticalJourneyEvent, NewsArticleLink, PendingEdit } from '@/types/gov';
import { format } from 'date-fns'; // Added import

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
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'; // Import useMemo, useCallback
import { Textarea } from '@/components/ui/textarea';
import { SuggestEntityEditForm } from '@/components/common/SuggestEntityEditForm';
import FollowButton from '@/components/common/FollowButton';
import { entitySchemas } from '@/lib/schemas';
import { useNotificationStore } from "@/lib/notifications";
import ScoreBarChart from '@/components/charts/ScoreBarChart';
import { getCurrentUser, canAccess, ADMIN_ROLES, isUserLoggedIn } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import VotingRecordChart from '@/components/charts/VotingRecordChart';

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
  iconType?: string;
}

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
      iconType: 'politicalCareerEvent',
    });
  });

  partyAffiliations.forEach(aff => {
    combinedEvents.push({
      date: aff.startDate,
      title: `Joined ${aff.partyName}`,
      description: aff.role ? `Role: ${aff.role}` : undefined,
      iconType: 'partyAffiliationEvent',
    });
    if (aff.endDate && aff.endDate !== 'Present') {
      combinedEvents.push({
        date: aff.endDate,
        title: `Left ${aff.partyName}`,
        description: aff.role ? `Previous Role: ${aff.role}` : undefined,
        iconType: 'partyAffiliationEvent',
      });
    }
  });

  return combinedEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

const mockSavePendingEdit = async (pendingEditData: PendingEdit) => {
  console.log("Mock saving PendingEdit:", JSON.stringify(pendingEditData, null, 2));
  return { ...pendingEditData, id: `mock-${Date.now()}` };
};

export default function PoliticianProfilePage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = React.use(paramsPromise);
  const currentUser = getCurrentUser();
  const router = useRouter();
  const politician = getPoliticianById(params.id);
  const { toast } = useToast();
  const [currentRating, setCurrentRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [isSuggestEntityEditModalOpen, setIsSuggestEntityEditModalOpen] = useState(false);
  const [isSuggestNewPromiseModalOpen, setIsSuggestNewPromiseModalOpen] = useState(false);
  const [isSuggestNewControversyModalOpen, setIsSuggestNewControversyModalOpen] = useState(false);
  const [formattedDateOfBirth, setFormattedDateOfBirth] = useState<string | null>(null);
  const [formattedDateOfDeath, setFormattedDateOfDeath] = useState<string | null>(null);
  const { addNotification } = useNotificationStore();
  const notificationTriggered = useRef(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  const openSuggestEntityEditModal = useCallback(() => {
    if (!isUserLoggedIn()) {
      router.push('/auth/login');
      return;
    }
    if (!politician) return;
    setIsSuggestEntityEditModalOpen(true);
  }, [router, politician]);

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

  const formattedDateOfBirthMemo = useMemo(() => {
    if (politician?.dateOfBirth) {
      return format(new Date(politician.dateOfBirth), 'MM/dd/yyyy');
    }
    return null;
  }, [politician?.dateOfBirth]);

  const formattedDateOfDeathMemo = useMemo(() => {
    if (politician?.dateOfDeath) {
      return format(new Date(politician.dateOfDeath), 'MM/dd/yyyy');
    }
    return null;
  }, [politician?.dateOfDeath]);

  useEffect(() => {
    setFormattedDateOfBirth(formattedDateOfBirthMemo);
  }, [formattedDateOfBirthMemo]);

  useEffect(() => {
    setFormattedDateOfDeath(formattedDateOfDeathMemo);
  }, [formattedDateOfDeathMemo]);


  const handleEntityEditSuggestionSubmit = useCallback((submission: {
    formData: Record<string, any>;
    reason: string;
    evidenceUrl: string;
  }) => {
    if (!politician || !currentUser) return;

    const proposedData = {
      ...JSON.parse(JSON.stringify(politician)), 
      ...submission.formData,
    };

    const pendingEdit: PendingEdit = {
      entityType: "Politician",
      entityId: politician.id,
      proposedData: proposedData,
      reasonForChange: submission.reason,
      evidenceUrl: submission.evidenceUrl,
      submittedByUserId: currentUser.id,
      submittedAt: new Date().toISOString(),
      status: 'PENDING',
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
    setIsSuggestEntityEditModalOpen(false);
  }, [politician, currentUser, toast]);

  const handleSuggestNewPromiseSubmit = useCallback((formData: Record<string, any>) => {
    if (!politician || !currentUser) return;
    const submissionData = {
      ...formData,
    };
    console.log("New Promise Suggestion for Politician:", politician.name, submissionData);
    toast({
      title: "Promise Suggestion Submitted",
      description: `Your new promise suggestion for ${politician.name} has been submitted.`,
    });
    setIsSuggestNewPromiseModalOpen(false);
  }, [politician, currentUser, toast]);

  const handleSuggestNewControversySubmit = useCallback((formData: Record<string, any>) => {
    if (!politician || !currentUser) return;
    const submissionData = {
      ...formData,
    };
    console.log("New Controversy Suggestion for Politician:", politician.name, submissionData);
    toast({
      title: "Controversy Suggestion Submitted",
      description: `Your new controversy suggestion regarding ${politician.name} has been submitted.`,
    });
    setIsSuggestNewControversyModalOpen(false);
  }, [politician, currentUser, toast]);

  const handleRatingSubmit = useCallback(() => {
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
      description: `You rated ${politician?.name} ${currentRating} star(s). Comment: ${commentText || 'No comment provided.'}`,
      duration: 5000,
    });
  }, [currentRating, commentText, politician?.name, toast]);

  const handleDelete = useCallback(() => {
    if (!politician) return;
    alert(`Mock delete action for politician: ${politician.name}`);
  }, [politician]);

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
  const sponsoredBillsData = getBillsBySponsor(politician.id);
  const relatedControversies = getControversiesByPoliticianId(politician.id);
  const relatedNews = getNewsByPoliticianId(politician.id);

  const careerTimelineItems = useMemo(() =>
    politician ? formatCombinedCareerTimeline(politician.politicalJourney, politician.partyAffiliations) : [],
    [politician?.politicalJourney, politician?.partyAffiliations]
  );

  const sponsoredBillsForDisplay = useMemo(() => {
    if (!politician) return [];
    return sponsoredBillsData.map(bill => ({
      ...bill,
      sponsorshipType: bill.sponsors?.find(s => s.id === politician.id)?.type
        ? `${bill.sponsors.find(s => s.id === politician.id)?.type} Sponsor`
        : undefined
    }));
  }, [sponsoredBillsData, politician?.id]);

  const politicianVotes = useMemo(() => {
    if (!politician) return [];
    const votes: PoliticianVote[] = [];
    mockBills.forEach(bill => {
      if (bill.votingResults?.house?.records) {
        const houseVote = bill.votingResults.house.records.find(record => record.politicianId === politician.id);
        if (houseVote) {
          votes.push({
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
          votes.push({
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
    return votes;
  }, [politician?.id]);

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
            {politician && (
              <FollowButton
                entityId={politician.id}
                entityType="politician"
                entityName={politician.name}
                className="whitespace-nowrap"
              />
            )}
            <Button variant="outline" onClick={openSuggestEntityEditModal}>
              <Edit className="mr-2 h-4 w-4" /> Propose Changes to Profile
            </Button>
            {isClient && canAccess(currentUser.role, ADMIN_ROLES) && (
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

      {politician && entitySchemas.Promise && (
        <SuggestNewEntryForm
          isOpen={isSuggestNewPromiseModalOpen}
          onOpenChange={setIsSuggestNewPromiseModalOpen}
          entityType="Promise"
          entitySchema={entitySchemas.Promise}
          onSubmit={handleSuggestNewPromiseSubmit}
          linkedEntityId={politician.id}
          linkedEntityField="politicianId" // Key name in Promise schema
        />
      )}

      {politician && entitySchemas.Controversy && (
        <SuggestNewEntryForm
          isOpen={isSuggestNewControversyModalOpen}
          onOpenChange={setIsSuggestNewControversyModalOpen}
          entityType="Controversy"
          entitySchema={entitySchemas.Controversy}
          onSubmit={handleSuggestNewControversySubmit}
          linkedEntityId={politician.id}
          linkedEntityField="primaryPoliticianId" // Key name in Controversy schema
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
                 {politician.constituency && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-4 w-4" />{' '}
                    {politician.constituencyId ? (
                      <Link href={`/constituencies/${politician.constituencyId}`} className="text-primary hover:underline">
                        {politician.constituency}
                      </Link>
                    ) : (
                      politician.constituency
                    )}
                  </p>
                )}
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
                      &mdash; {politician.name}, {sq.sourceName} ({format(new Date(sq.dateOfStatement), 'MM/dd/yyyy')})
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

          {careerTimelineItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                  <History className="h-5 w-5 text-primary"/> Political Journey
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TimelineDisplay items={careerTimelineItems} />
              </CardContent>
            </Card>
          )}

          <SponsoredBillsDisplay sponsoredBills={sponsoredBillsForDisplay} />
          <VotingRecordDisplay votingRecords={politicianVotes} />
          {politician.assetDeclarations && politician.assetDeclarations.length > 0 && (
             <AssetDeclarationsDisplay assetDeclarations={politician.assetDeclarations} />
          )}
          {politician.criminalRecords && politician.criminalRecords.length > 0 && (
            <CriminalRecordsDisplay criminalRecords={politician.criminalRecords} />
          )}
          <RelatedNewsDisplay newsItems={relatedNews} />

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center justify-between">
                Associated Controversies
                {politician && (
                  <Button variant="outline" size="sm" onClick={() => {
                    if (!isUserLoggedIn()) { router.push('/auth/login'); return; }
                    setIsSuggestNewControversyModalOpen(true);
                  }}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Suggest New Controversy
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AssociatedControversiesDisplay controversies={relatedControversies} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center justify-between">
                Promises
                {politician && (
                  <Button variant="outline" size="sm" onClick={() => {
                    if (!isUserLoggedIn()) { router.push('/auth/login'); return; }
                    setIsSuggestNewPromiseModalOpen(true);
                  }}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Suggest New Promise
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
               <PromisesDisplay promises={promises} />
            </CardContent>
          </Card>
          
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

          {politician.votingRecords && politician.votingRecords.length > 0 && (
            <Card>
              <VotingRecordChart votingData={politician.votingRecords} />
            </Card>
          )}
          <RevisionHistoryDisplay historyItems={politician.revisionHistory} />
        </div>
      </div>
    </div>
  );
}

