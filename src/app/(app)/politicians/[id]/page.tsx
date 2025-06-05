
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
// SuggestNewEntryForm is not used in this file anymore after previous refactors
// import { SuggestNewEntryForm } from '@/components/common/suggest-new-entry-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'; // Keep for other modals if any, or remove if not used
import type { PromiseItem, AssetDeclaration, CriminalRecord, CommitteeMembership, Bill, VoteRecord, Politician, StatementQuote, Controversy, PartyAffiliation, PoliticalJourneyEvent, NewsArticleLink, PendingEdit } from '@/types/gov';
import { format } from 'date-fns'; // Added import
import { AssetDeclarationForm } from '@/components/common/forms/AssetDeclarationForm';
import { assetDeclarationSchema } from '@/lib/schemas';
import { CriminalRecordForm } from '@/components/common/forms/CriminalRecordForm'; // Import the new form
import { criminalRecordSchema } from '@/lib/schemas'; // Import the schema

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
  const initialPoliticianData = getPoliticianById(params.id); // Renamed to initialPoliticianData
  const { toast } = useToast();

  const [currentPoliticianData, setCurrentPoliticianData] = useState<Politician | null>(null);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<AssetDeclaration | null>(null);
  const [isCriminalRecordModalOpen, setIsCriminalRecordModalOpen] = useState(false);
  const [editingCriminalRecord, setEditingCriminalRecord] = useState<CriminalRecord | null>(null);

  const [currentRating, setCurrentRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [isSuggestEntityEditModalOpen, setIsSuggestEntityEditModalOpen] = useState(false);
  const [formattedDateOfBirth, setFormattedDateOfBirth] = useState<string | null>(null);
  const [formattedDateOfDeath, setFormattedDateOfDeath] = useState<string | null>(null);
  const { addNotification } = useNotificationStore();
  const notificationTriggered = useRef(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (initialPoliticianData) {
      setCurrentPoliticianData(JSON.parse(JSON.stringify(initialPoliticianData))); // Deep copy
    }
  }, [initialPoliticianData]);


  const openSuggestEntityEditModal = useCallback(() => {
    if (!isUserLoggedIn()) {
      router.push('/auth/login');
      return;
    }
    if (!currentPoliticianData) return;
    setIsSuggestEntityEditModalOpen(true);
  }, [router, currentPoliticianData]);

  useEffect(() => {
    if (currentPoliticianData && !notificationTriggered.current) {
      const timeoutId = setTimeout(() => {
        addNotification(
          `New bill 'Infrastructure Improvement Act' sponsored by ${currentPoliticianData.name} has been introduced.`,
          'info',
          '/bills/mock-bill-123'
        );
      }, 3000);
      notificationTriggered.current = true;
      return () => clearTimeout(timeoutId);
    }
  }, [currentPoliticianData, addNotification]);

  const formattedDateOfBirthMemo = useMemo(() => {
    if (currentPoliticianData?.dateOfBirth) {
      return format(new Date(currentPoliticianData.dateOfBirth), 'MM/dd/yyyy');
    }
    return null;
  }, [currentPoliticianData?.dateOfBirth]);

  const formattedDateOfDeathMemo = useMemo(() => {
    if (currentPoliticianData?.dateOfDeath) {
      return format(new Date(currentPoliticianData.dateOfDeath), 'MM/dd/yyyy');
    }
    return null;
  }, [currentPoliticianData?.dateOfDeath]);

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
    if (!currentPoliticianData || !currentUser) return;

    const proposedData = {
      ...JSON.parse(JSON.stringify(currentPoliticianData)),
      ...submission.formData,
    };

    const pendingEdit: PendingEdit = {
      entityType: "Politician",
      entityId: currentPoliticianData.id,
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
          description: `Your proposed changes for ${currentPoliticianData.name} have been submitted for review. Thank you! (ID: ${savedEdit.id})`,
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
  }, [currentPoliticianData, currentUser, toast]);

  const handleOpenAddAssetModal = () => {
    setEditingAsset(null);
    setIsAssetModalOpen(true);
  };

  const handleOpenEditAssetModal = (assetId: string) => {
    const assetToEdit = currentPoliticianData?.assetDeclarations?.find(a => a.id === assetId);
    if (assetToEdit) {
      setEditingAsset(assetToEdit);
      setIsAssetModalOpen(true);
    }
  };

  const handleAssetFormSubmit = (values: any) => {
    if (!currentPoliticianData) return;
    let updatedAssets = [...(currentPoliticianData.assetDeclarations || [])];
    if (editingAsset) { // Editing existing
      updatedAssets = updatedAssets.map(a => a.id === editingAsset.id ? { ...a, ...values } : a);
    } else { // Adding new
      updatedAssets.push({ ...values, id: `asset-${Date.now().toString()}` }); // Simple ID
    }
    const updatedPolitician = { ...currentPoliticianData, assetDeclarations: updatedAssets };
    setCurrentPoliticianData(updatedPolitician);
    // TODO: Mock persistence for 'updatedPolitician'
    console.log('Updated Politician Data with Asset Changes:', updatedPolitician);
    toast({ title: 'Asset Declaration Saved (Mock)', description: 'Changes are reflected locally.' });
    setIsAssetModalOpen(false);
    setEditingAsset(null);
  };

  const handleDeleteAsset = (assetId: string) => {
    if (!currentPoliticianData) return;
    const updatedAssets = (currentPoliticianData.assetDeclarations || []).filter(a => a.id !== assetId);
    const updatedPolitician = { ...currentPoliticianData, assetDeclarations: updatedAssets };
    setCurrentPoliticianData(updatedPolitician);
    // TODO: Mock persistence for 'updatedPolitician'
    console.log('Updated Politician Data after Deleting Asset:', updatedPolitician);
    toast({ title: 'Asset Declaration Deleted (Mock)', description: 'Changes are reflected locally.' });
  };

  const handleOpenAddCriminalRecordModal = () => {
    setEditingCriminalRecord(null);
    setIsCriminalRecordModalOpen(true);
  };

  const handleOpenEditCriminalRecordModal = (recordId: string) => {
    const recordToEdit = currentPoliticianData?.criminalRecords?.find(r => r.id === recordId);
    if (recordToEdit) {
      setEditingCriminalRecord(recordToEdit);
      setIsCriminalRecordModalOpen(true);
    }
  };

  const handleCriminalRecordFormSubmit = (values: any) => {
    if (!currentPoliticianData) return;
    let updatedRecords = [...(currentPoliticianData.criminalRecords || [])];
    if (editingCriminalRecord) { // Editing existing
      updatedRecords = updatedRecords.map(r => r.id === editingCriminalRecord.id ? { ...r, ...values } : r);
    } else { // Adding new
      updatedRecords.push({ ...values, id: `crimrec-${Date.now().toString()}` }); // Simple ID
    }
    const updatedPolitician = { ...currentPoliticianData, criminalRecords: updatedRecords };
    setCurrentPoliticianData(updatedPolitician);
    // TODO: Mock persistence for 'updatedPolitician'
    console.log('Updated Politician Data with Criminal Record Changes:', updatedPolitician);
    toast({ title: 'Criminal Record Saved (Mock)', description: 'Changes are reflected locally.' });
    setIsCriminalRecordModalOpen(false);
    setEditingCriminalRecord(null);
  };

  const handleDeleteCriminalRecord = (recordId: string) => {
    if (!currentPoliticianData) return;
    const updatedRecords = (currentPoliticianData.criminalRecords || []).filter(r => r.id !== recordId);
    const updatedPolitician = { ...currentPoliticianData, criminalRecords: updatedRecords };
    setCurrentPoliticianData(updatedPolitician);
    // TODO: Mock persistence for 'updatedPolitician'
    console.log('Updated Politician Data after Deleting Criminal Record:', updatedPolitician);
    toast({ title: 'Criminal Record Deleted (Mock)', description: 'Changes are reflected locally.' });
  };

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
      description: `You rated ${currentPoliticianData?.name} ${currentRating} star(s). Comment: ${commentText || 'No comment provided.'}`,
      duration: 5000,
    });
  }, [currentRating, commentText, currentPoliticianData?.name, toast]);

  const handleDelete = useCallback(() => {
    if (!currentPoliticianData) return;
    alert(`Mock delete action for politician: ${currentPoliticianData.name}`);
  }, [currentPoliticianData]);

  if (!currentPoliticianData) {
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

  const promises = getPromisesByPolitician(params.id); // This might need to use currentPoliticianData.id if promises are dynamic
  const party = currentPoliticianData.partyId ? mockParties.find(p => p.id === currentPoliticianData.partyId) : null;
  const sponsoredBillsData = getBillsBySponsor(currentPoliticianData.id);
  const relatedControversies = getControversiesByPoliticianId(currentPoliticianData.id);
  const relatedNews = getNewsByPoliticianId(currentPoliticianData.id);

  const careerTimelineItems = useMemo(() =>
    currentPoliticianData ? formatCombinedCareerTimeline(currentPoliticianData.politicalJourney, currentPoliticianData.partyAffiliations) : [],
    [currentPoliticianData?.politicalJourney, currentPoliticianData?.partyAffiliations]
  );

  const sponsoredBillsForDisplay = useMemo(() => {
    if (!currentPoliticianData) return [];
    return sponsoredBillsData.map(bill => ({
      ...bill,
      sponsorshipType: bill.sponsors?.find(s => s.id === currentPoliticianData.id)?.type
        ? `${bill.sponsors.find(s => s.id === currentPoliticianData.id)?.type} Sponsor`
        : undefined
    }));
  }, [sponsoredBillsData, currentPoliticianData?.id]);

  const politicianVotes = useMemo(() => {
    if (!currentPoliticianData) return [];
    const votes: PoliticianVote[] = [];
    mockBills.forEach(bill => {
      if (bill.votingResults?.house?.records) {
        const houseVote = bill.votingResults.house.records.find(record => record.politicianId === currentPoliticianData.id);
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
        const senateVote = bill.votingResults.senate.records.find(record => record.politicianId === currentPoliticianData.id);
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
  }, [currentPoliticianData?.id]);

  return (
    <div>
      <PageHeader
        title={
          <span className="flex items-center">
            {currentPoliticianData.name}
          </span>
        }
        description={
          <div className="space-y-1">
            <p className="flex items-center">
              {currentPoliticianData.positions[0]?.title || 'Public Figure'}
            </p>
            {currentPoliticianData.isActiveInPolitics !== undefined && (
                <Badge variant={currentPoliticianData.isActiveInPolitics ? 'default' : 'secondary'} className={`${currentPoliticianData.isActiveInPolitics ? 'bg-green-500 text-white' : ''}`}>
                  {currentPoliticianData.isActiveInPolitics ? <CheckCircle className="mr-1 h-3 w-3"/> : <XCircle className="mr-1 h-3 w-3"/>}
                  {currentPoliticianData.isActiveInPolitics ? 'Active' : 'Inactive'}
                </Badge>
            )}
          </div>
        }
        actions={(
          <div className="flex gap-2">
            {currentPoliticianData && (
              <FollowButton
                entityId={currentPoliticianData.id}
                entityType="politician"
                entityName={currentPoliticianData.name}
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

      {currentPoliticianData && isSuggestEntityEditModalOpen && entitySchemas.Politician && (
        <SuggestEntityEditForm
          isOpen={isSuggestEntityEditModalOpen}
          onOpenChange={setIsSuggestEntityEditModalOpen}
          entityType="Politician"
          entitySchema={entitySchemas.Politician}
          currentEntityData={currentPoliticianData}
          onSubmit={handleEntityEditSuggestionSubmit}
        />
      )}

      {isAssetModalOpen && currentPoliticianData && (
        <AssetDeclarationForm
          isOpen={isAssetModalOpen}
          onOpenChange={setIsAssetModalOpen}
          assetData={editingAsset}
          onSubmit={handleAssetFormSubmit}
          entitySchema={assetDeclarationSchema}
          dialogTitle={editingAsset ? 'Edit Asset Declaration' : 'Add Asset Declaration'}
        />
      )}

      {isCriminalRecordModalOpen && currentPoliticianData && (
        <CriminalRecordForm
          isOpen={isCriminalRecordModalOpen}
          onOpenChange={setIsCriminalRecordModalOpen}
          recordData={editingCriminalRecord}
          onSubmit={handleCriminalRecordFormSubmit}
          entitySchema={criminalRecordSchema}
          dialogTitle={editingCriminalRecord ? 'Edit Criminal Record' : 'Add Criminal Record'}
        />
      )}

      <div id="politician-profile-export-area" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-0">
              <div className="relative group">
                <Image
                    src={currentPoliticianData.photoUrl}
                    alt={currentPoliticianData.name}
                    width={400}
                    height={400}
                    className="w-full h-auto object-cover rounded-t-lg"
                    data-ai-hint={currentPoliticianData.dataAiHint || "politician portrait"}
                />
              </div>
              <div className="p-6 space-y-1.5">
                <h2 className="text-2xl font-headline font-semibold mb-1 flex items-center">{currentPoliticianData.name} </h2>
                {currentPoliticianData.nepaliName && <p className="text-lg text-muted-foreground -mt-1 mb-1 flex items-center">{currentPoliticianData.nepaliName} </p>}
                <div className="flex items-center">
                  <span className="text-sm text-muted-foreground">Also known as: {currentPoliticianData.aliases?.join(', ') || 'N/A'}</span>
                </div>
                {party && (
                  <Link href={`/parties/${party.id}`} className="text-primary hover:underline flex items-center gap-1 text-sm">
                    <Landmark className="h-4 w-4" /> {party.name}
                  </Link>
                )}
                 {currentPoliticianData.constituency && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-4 w-4" />{' '}
                    {currentPoliticianData.constituencyId ? (
                      <Link href={`/constituencies/${currentPoliticianData.constituencyId}`} className="text-primary hover:underline">
                        {currentPoliticianData.constituency}
                      </Link>
                    ) : (
                      currentPoliticianData.constituency
                    )}
                  </p>
                )}
                {currentPoliticianData.dateOfBirth && <p className="text-sm text-muted-foreground flex items-center gap-1"><CalendarDays className="h-4 w-4" /> Born: {formattedDateOfBirth || '...'} {currentPoliticianData.placeOfBirth?.district && <span className="flex items-center">, {currentPoliticianData.placeOfBirth.district} </span>}{currentPoliticianData.placeOfBirth?.address && <span className="flex items-center">, {currentPoliticianData.placeOfBirth.address} </span>}</p>}
                {currentPoliticianData.dateOfDeath && <p className="text-sm text-muted-foreground flex items-center gap-1"><CalendarDays className="h-4 w-4" /> Deceased: {formattedDateOfDeath || '...'} </p>}
                {currentPoliticianData.gender && <p className="text-sm text-muted-foreground flex items-center">Gender: {currentPoliticianData.gender} </p>}
              </div>
            </CardContent>
          </Card>

          <ContactInfoDisplay contactInfo={currentPoliticianData.contactInfo} />
          {currentPoliticianData.tags && currentPoliticianData.tags.length > 0 && (
            <TagsDisplay tags={currentPoliticianData.tags} />
          )}
          {currentPoliticianData.education && currentPoliticianData.education.length > 0 && (
            <EducationHistoryDisplay educationHistory={currentPoliticianData.education} />
          )}
          <CareerHistoryDisplay careerHistory={currentPoliticianData.positions} />
          {currentPoliticianData.committeeMemberships && currentPoliticianData.committeeMemberships.length > 0 && (
            <CommitteeMembershipsDisplay committeeMemberships={currentPoliticianData.committeeMemberships} />
          )}
        </div>

        <div className="lg:col-span-2 space-y-8">
         {(currentPoliticianData.politicalIdeology && currentPoliticianData.politicalIdeology.length > 0) || (currentPoliticianData.languagesSpoken && currentPoliticianData.languagesSpoken.length > 0) ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary"/> Profile Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentPoliticianData.politicalIdeology && currentPoliticianData.politicalIdeology.length > 0 && (
                  <div>
                    <div className="flex justify-between items-center">
                      <h3 className="text-md font-semibold mb-1 flex items-center gap-1"><Tag className="h-4 w-4 text-muted-foreground"/> Political Ideology</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {currentPoliticianData.politicalIdeology.map(ideo => (
                        <Badge key={ideo} variant="secondary">{ideo}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {currentPoliticianData.languagesSpoken && currentPoliticianData.languagesSpoken.length > 0 && (
                   <div>
                    <div className="flex justify-between items-center">
                      <h3 className="text-md font-semibold mb-1 flex items-center gap-1"><Languages className="h-4 w-4 text-muted-foreground"/> Languages Spoken</h3>
                    </div>
                    <p className="text-sm text-foreground/80">{currentPoliticianData.languagesSpoken.join(', ')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : null}

          {(currentPoliticianData.overallRating !== undefined || currentPoliticianData.voteScore !== undefined || currentPoliticianData.promiseFulfillmentRate !== undefined || currentPoliticianData.popularityScore !== undefined) && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary"/> Analytics Snapshot
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(currentPoliticianData.voteScore !== undefined || currentPoliticianData.promiseFulfillmentRate !== undefined) && (
                  <div className="mb-6">
                    <ScoreBarChart data={[
                      ...(currentPoliticianData.voteScore !== undefined ? [{ name: 'Vote Score', value: currentPoliticianData.voteScore }] : []),
                      ...(currentPoliticianData.promiseFulfillmentRate !== undefined ? [{ name: 'Promise Fulfillment', value: currentPoliticianData.promiseFulfillmentRate }] : []),
                    ]} />
                  </div>
                )}
                {currentPoliticianData.overallRating !== undefined && (
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-400" />
                    <span className="font-semibold text-lg">{currentPoliticianData.overallRating.toFixed(1)} / 5.0</span>
                    {currentPoliticianData.userRatingCount !== undefined && (
                      <span className="text-sm text-muted-foreground">(from {currentPoliticianData.userRatingCount} ratings)</span>
                    )}
                  </div>
                )}
                {currentPoliticianData.voteScore !== undefined && currentPoliticianData.promiseFulfillmentRate === undefined && (
                   <div className="flex items-center gap-2">
                     <Users className="h-5 w-5 text-primary" />
                     <span className="font-semibold text-lg">{currentPoliticianData.voteScore}%</span>
                     <span className="text-sm text-muted-foreground">Vote Score (Hypothetical)</span>
                   </div>
                )}
                 {currentPoliticianData.promiseFulfillmentRate !== undefined && currentPoliticianData.voteScore === undefined && (
                   <div className="flex items-center gap-2">
                     <ListChecks className="h-5 w-5 text-green-500" />
                     <span className="font-semibold text-lg">{currentPoliticianData.promiseFulfillmentRate}%</span>
                     <span className="text-sm text-muted-foreground">Promise Fulfillment</span>
                   </div>
                 )}
                {currentPoliticianData.popularityScore !== undefined && (
                  <div className="flex items-center gap-2">
                     <CircleHelp className="h-5 w-5 text-purple-500" />
                    <span className="font-semibold text-lg">{currentPoliticianData.popularityScore}</span>
                    <span className="text-sm text-muted-foreground">Popularity Score</span>
                  </div>
                )}
                 <p className="text-xs text-muted-foreground pt-2 border-t mt-2">
                    Note: Analytics data is for demonstration purposes.
                </p>
              </CardContent>
            </Card>
          )}

          {currentPoliticianData.statementsAndQuotes && currentPoliticianData.statementsAndQuotes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                  <Quote className="h-5 w-5 text-primary"/> Notable Statements & Quotes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {currentPoliticianData.statementsAndQuotes.map((sq: StatementQuote) => (
                  <div key={sq.id} className="border-l-4 border-primary pl-4 py-2 bg-secondary/30 rounded-r-md">
                    <blockquote className="italic text-foreground/90">
                      "{sq.quoteText}"
                    </blockquote>
                    <footer className="mt-2 text-xs text-muted-foreground">
                      &mdash; {currentPoliticianData.name}, {sq.sourceName} ({format(new Date(sq.dateOfStatement), 'MM/dd/yyyy')})
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

           {currentPoliticianData.bio && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline text-xl">Biography</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 whitespace-pre-line">{currentPoliticianData.bio}</p>
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
          {/* Asset Declarations Section */}
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center justify-between">
                Asset Declarations
                <Button onClick={handleOpenAddAssetModal} variant="outline" size="sm">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Asset Declaration
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AssetDeclarationsDisplay
                assetDeclarations={currentPoliticianData.assetDeclarations || []}
                onEditItem={handleOpenEditAssetModal}
                onDeleteItem={handleDeleteAsset}
              />
            </CardContent>
          </Card>

          {/* Criminal Records Section */}
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center justify-between">
                Criminal Records
                <Button onClick={handleOpenAddCriminalRecordModal} variant="outline" size="sm">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Criminal Record
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CriminalRecordsDisplay
                criminalRecords={currentPoliticianData.criminalRecords || []}
                onEditItem={handleOpenEditCriminalRecordModal}
                onDeleteItem={handleDeleteCriminalRecord}
              />
            </CardContent>
          )}
          <RelatedNewsDisplay newsItems={relatedNews} />

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center justify-between">
                Associated Controversies
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

