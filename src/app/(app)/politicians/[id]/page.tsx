
"use client";

import Image from 'next/image';
import { getPoliticianById, getPromisesByPolitician, mockParties, getBillsBySponsor, mockBills, getControversiesByPoliticianId, getNewsByPoliticianId } from '@/lib/mock-data';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, Globe, Edit, Users, Tag, CalendarDays, Briefcase, Landmark, MapPin, GraduationCap, Twitter, Facebook, Linkedin, Instagram, ScrollText, ExternalLink, Gavel, Star, BarChart3, ListChecks, FileText, ClipboardList, UserPlus, UserCheck, ShieldAlert, Building, Languages, CheckCircle, XCircle, AlertCircle, MessageSquare, Map, CircleHelp, Quote, AlertOctagon, Newspaper, History, Download, Trash2 } from 'lucide-react';
import { TimelineDisplay } from '@/components/common/timeline-display'; // Removed formatCombinedCareerTimeline from here
import Link from 'next/link';
import type { PromiseItem, AssetDeclaration, CriminalRecord, CommitteeMembership, Bill, VoteRecord, Politician, StatementQuote, Controversy, PartyAffiliation, PoliticalJourneyEvent, NewsArticleLink } from '@/types/gov';
import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { SuggestEditForm } from '@/components/common/suggest-edit-form';
import { SuggestEntityEditForm } from '@/components/common/SuggestEntityEditForm';
import { entitySchemas } from '@/lib/schemas'; // Added
import { useNotificationStore } from "@/lib/notifications";
import ScoreBarChart from '@/components/charts/ScoreBarChart';
import { getCurrentUser, canAccess, ADMIN_ROLES, isUserLoggedIn } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { exportElementAsPDF } from '@/lib/utils';

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

const LOCAL_STORAGE_FOLLOWED_POLITICIANS_KEY = 'govtrackr_followed_politicians';

// Helper component for edit buttons
const EditFieldButton: React.FC<{ fieldPath: string; onClick: (fieldPath: string) => void; className?: string; tooltip?: string }> = ({ fieldPath, onClick, className, tooltip }) => (
  <Button
    variant="ghost"
    size="icon"
    className={`ml-2 h-5 w-5 ${className}`}
    onClick={(e) => { e.stopPropagation(); onClick(fieldPath); }}
    title={tooltip || `Suggest edit for ${fieldPath.split('.').pop()?.replace(/\[\d+\]/, '')}`}
  >
    <Edit className="h-3 w-3 text-muted-foreground group-hover:text-primary" />
  </Button>
);

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


export default function PoliticianProfilePage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = React.use(paramsPromise);
  const currentUser = getCurrentUser();
  const router = useRouter();
  const politician = getPoliticianById(params.id);
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [commentText, setCommentText] = useState("");

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isSuggestEditModalOpen, setIsSuggestEditModalOpen] = useState(false);
  const [isSuggestEntityEditModalOpen, setIsSuggestEntityEditModalOpen] = useState(false);
  // Updated state for the edit form
  const [editingFieldPath, setEditingFieldPath] = useState('');
  // No need for suggestionOldValue in state, it's derived in the form
  // const [suggestionOldValue, setSuggestionOldValue] = useState<string | any>('');


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

  useEffect(() => {
    if (politician) {
      try {
        const followedPoliticiansStr = localStorage.getItem(LOCAL_STORAGE_FOLLOWED_POLITICIANS_KEY);
        if (followedPoliticiansStr) {
          const followedIds: string[] = JSON.parse(followedPoliticiansStr);
          if (followedIds.includes(politician.id)) {
            setIsFollowing(true);
          }
        }
      } catch (error) {
        console.error("Error reading followed politicians from localStorage:", error);
      }
    }
  }, [politician]);

  const openSuggestEditModal = (fieldPath: string) => {
    if (!isUserLoggedIn()) {
      router.push('/auth/login');
      return;
    }
    if (!politician) return;
    setEditingFieldPath(fieldPath);
    setIsSuggestEditModalOpen(true);
  };

  const handleSuggestionSubmit = (suggestion: {
    fieldPath: string;
    suggestedValue: any;
    oldValue: any;
    reason: string;
    evidenceUrl: string;
  }) => {
    console.log("Suggestion submitted:", {
      entityType: "Politician", // This could be passed to SuggestEditForm or derived if needed
      entityId: politician?.id,
      ...suggestion,
    });
    toast({
      title: "Suggestion Submitted",
      description: `Suggestion for '${suggestion.fieldPath}' on ${politician?.name} has been submitted. Thank you!`,
      duration: 5000,
    });
    setIsSuggestEditModalOpen(false);
  };

  const handleEntityEditSuggestionSubmit = (submission: {
    formData: Record<string, any>;
    reason: string;
    evidenceUrl: string;
  }) => {
    if (!politician) return; // Should not happen if modal is open, but good practice

    console.log("Full entity edit suggestion submitted:", {
      entityType: "Politician", // Hardcoded for now, or could be passed if form is more generic
      entityId: politician.id,
      suggestedData: submission.formData,
      reason: submission.reason,
      evidenceUrl: submission.evidenceUrl,
      submittedAt: new Date().toISOString(),
      status: "PendingEntityUpdate" // A more specific status
    });

    toast({
      title: "Changes Suggested",
      description: `Your proposed changes for ${politician.name} have been submitted for review. Thank you!`,
      duration: 5000,
    });
    setIsSuggestEntityEditModalOpen(false);
  };

  const handleFollowToggle = () => {
    if (!politician) return;
    const newFollowingState = !isFollowing;
    setIsFollowing(newFollowingState);

    try {
      const followedPoliticiansStr = localStorage.getItem(LOCAL_STORAGE_FOLLOWED_POLITICIANS_KEY);
      let followedIds: string[] = followedPoliticiansStr ? JSON.parse(followedPoliticiansStr) : [];

      if (newFollowingState) {
        if (!followedIds.includes(politician.id)) {
          followedIds.push(politician.id);
        }
      } else {
        followedIds = followedIds.filter(id => id !== politician.id);
      }
      localStorage.setItem(LOCAL_STORAGE_FOLLOWED_POLITICIANS_KEY, JSON.stringify(followedIds));
    } catch (error) {
      console.error("Error updating followed politicians in localStorage:", error);
       toast({
        title: "Could not update follow status",
        description: "There was an issue saving your follow preference. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
      setIsFollowing(!newFollowingState);
      return;
    }

    toast({
      title: newFollowingState ? `Following ${politician.name}` : `Unfollowed ${politician.name}`,
      description: newFollowingState ? "You'll now receive updates in your feed (demo)." : "You will no longer receive updates (demo).",
      duration: 3000,
    });
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
    console.log("Rating Submitted:", { rating: currentRating, comment: commentText });
    toast({
      title: "Review Submitted (Demo)",
      description: `You rated ${politician.name} ${currentRating} star(s). Comment: ${commentText || 'No comment provided.'}`,
      duration: 5000,
    });
  };

  async function handleExportPdfWrapper() {
    if (!politician) return;
    const fileName = `politician-${politician.name.toLowerCase().replace(/\s+/g, '-')}-profile.pdf`;
    await exportElementAsPDF('politician-profile-export-area', fileName, setIsGeneratingPdf);
  }

  const handleDelete = () => {
    if (!politician) return;
    alert(`Mock delete action for politician: ${politician.name}`);
  };

  if (!politician) {
    return <p>Politician not found.</p>;
  }

  const promises = getPromisesByPolitician(params.id);
  const party = politician.partyId ? mockParties.find(p => p.id === politician.partyId) : null;
  const sponsoredBills = getBillsBySponsor(politician.id);
  const relatedControversies = getControversiesByPoliticianId(politician.id);
  const careerTimelineItems = formatCombinedCareerTimeline(politician.politicalJourney, politician.partyAffiliations);
  const relatedNews = getNewsByPoliticianId(politician.id);


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


  const getCriminalStatusBadgeVariant = (status: CriminalRecord['status']) => {
    switch (status) {
      case 'Convicted':
      case 'Charges Filed':
        return 'destructive';
      case 'Alleged':
      case 'Under Investigation':
        return 'secondary';
      case 'Acquitted':
      case 'Dismissed':
        return 'default';
      default:
        return 'outline';
    }
  };

  return (
    <div>
      <PageHeader
        title={
          <span className="group flex items-center">
            {politician.name}
            <EditFieldButton fieldPath="name" onClick={openSuggestEditModal} tooltip="Edit name"/>
          </span>
        }
        description={
          <div className="space-y-1">
            <p className="group flex items-center">
              {politician.positions[0]?.title || 'Public Figure'}
              {politician.positions[0] && <EditFieldButton fieldPath="positions[0].title" onClick={openSuggestEditModal} tooltip="Edit primary position title"/>}
            </p>
            {politician.isActiveInPolitics !== undefined && (
                <Badge variant={politician.isActiveInPolitics ? 'default' : 'secondary'} className={`group ${politician.isActiveInPolitics ? 'bg-green-500 text-white' : ''}`}>
                  {politician.isActiveInPolitics ? <CheckCircle className="mr-1 h-3 w-3"/> : <XCircle className="mr-1 h-3 w-3"/>}
                  {politician.isActiveInPolitics ? 'Active' : 'Inactive'}
                  <EditFieldButton fieldPath="isActiveInPolitics" onClick={openSuggestEditModal} tooltip="Edit activity status" className="text-white group-hover:text-primary-foreground"/>
                </Badge>
            )}
          </div>
        }
        actions={(
          <div className="flex gap-2">
            {/* General "Suggest Edit" buttons can be removed if all fields get inline edit icons or specific section edit buttons */}
            {/* Keeping a few general ones for now or replacing with more specific section edits if appropriate */}
            {/* <Button variant="outline" onClick={() => openSuggestEditModal('bio')}>
              <Edit className="mr-2 h-4 w-4" /> Suggest Edit for Bio
            </Button>
            <Button variant="outline" onClick={() => openSuggestEditModal('contactInfo.email')}>
              <Edit className="mr-2 h-4 w-4" /> Suggest Edit for Email
            </Button> */}
            <Button variant="outline" onClick={() => openSuggestEditModal('aliases')}>
              <Edit className="mr-2 h-4 w-4" /> Edit Aliases (JSON)
            </Button>
            {/* <Button variant="outline" onClick={() => openSuggestEditModal('partyAffiliations[0].role')}>
              <Edit className="mr-2 h-4 w-4" /> Edit First Party Role
            </Button> */}
            <Button variant="outline" onClick={() => openSuggestEditModal('contactInfo')}>
              <Edit className="mr-2 h-4 w-4" /> Edit Contact Info Block (Field)
            </Button>
            <Button variant="outline" onClick={openSuggestEntityEditModal}>
              <Edit className="mr-2 h-4 w-4" /> Propose Changes to Profile
            </Button>
            <Button variant="outline" onClick={handleExportPdfWrapper} disabled={isGeneratingPdf}>
              <Download className="mr-2 h-4 w-4" /> {isGeneratingPdf ? 'Generating PDF...' : 'Export to PDF'}
            </Button>
            {canAccess(currentUser.role, ADMIN_ROLES) && (
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete Politician
              </Button>
            )}
          </div>
        )}
      />

      {politician && isSuggestEditModalOpen && entitySchemas.Politician && (
        <SuggestEditForm
          isOpen={isSuggestEditModalOpen}
          onOpenChange={setIsSuggestEditModalOpen}
          entitySchema={entitySchemas.Politician}
          fieldPath={editingFieldPath}
          currentEntityData={politician}
          entityDisplayName={politician.name}
          onSubmit={handleSuggestionSubmit}
        />
      )}

      {politician && isSuggestEntityEditModalOpen && entitySchemas.Politician && (
        <SuggestEntityEditForm
          isOpen={isSuggestEntityEditModalOpen}
          onOpenChange={setIsSuggestEntityEditModalOpen}
          entityType="Politician"
          entitySchema={entitySchemas.Politician} // Make sure entitySchemas.Politician is available
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
                <EditFieldButton fieldPath="photoUrl" onClick={openSuggestEditModal} className="absolute top-2 right-2 bg-background/50 hover:bg-background/80" tooltip="Edit photo URL"/>
              </div>
              <div className="p-6 space-y-1.5">
                <h2 className="text-2xl font-headline font-semibold mb-1 group flex items-center">{politician.name} <EditFieldButton fieldPath="name" onClick={openSuggestEditModal}/></h2>
                {politician.nepaliName && <p className="text-lg text-muted-foreground -mt-1 mb-1 group flex items-center">{politician.nepaliName} <EditFieldButton fieldPath="nepaliName" onClick={openSuggestEditModal}/></p>}

                <div className="group flex items-center">
                  <span className="text-sm text-muted-foreground">Also known as: {politician.aliases?.join(', ') || 'N/A'}</span>
                  <EditFieldButton fieldPath="aliases" onClick={openSuggestEditModal} tooltip="Edit aliases (JSON)"/>
                </div>

                {party && (
                  <Link href={`/parties/${party.id}`} className="text-primary hover:underline flex items-center gap-1 text-sm group">
                    <Landmark className="h-4 w-4" /> {party.name}
                    <EditFieldButton fieldPath="partyName" onClick={openSuggestEditModal} tooltip="Edit party name"/>
                    <EditFieldButton fieldPath="partyId" onClick={openSuggestEditModal} tooltip="Edit party ID"/>
                  </Link>
                )}
                 {politician.constituency && <p className="text-sm text-muted-foreground flex items-center gap-1 group"><MapPin className="h-4 w-4" /> {politician.constituency} <EditFieldButton fieldPath="constituency" onClick={openSuggestEditModal}/> <EditFieldButton fieldPath="constituencyId" onClick={openSuggestEditModal} tooltip="Edit constituency ID"/></p>}
                {politician.dateOfBirth && <p className="text-sm text-muted-foreground flex items-center gap-1 group"><CalendarDays className="h-4 w-4" /> Born: {formattedDateOfBirth || '...'} <EditFieldButton fieldPath="dateOfBirth" onClick={openSuggestEditModal} tooltip="Edit date of birth"/>{politician.placeOfBirth?.district && <span className="group flex items-center">, {politician.placeOfBirth.district} <EditFieldButton fieldPath="placeOfBirth.district" onClick={openSuggestEditModal} tooltip="Edit birth district"/></span>}{politician.placeOfBirth?.address && <span className="group flex items-center">, {politician.placeOfBirth.address} <EditFieldButton fieldPath="placeOfBirth.address" onClick={openSuggestEditModal} tooltip="Edit birth address"/></span>}</p>}
                {politician.dateOfDeath && <p className="text-sm text-muted-foreground flex items-center gap-1 group"><CalendarDays className="h-4 w-4" /> Deceased: {formattedDateOfDeath || '...'} <EditFieldButton fieldPath="dateOfDeath" onClick={openSuggestEditModal}/></p>}
                {politician.gender && <p className="text-sm text-muted-foreground group flex items-center">Gender: {politician.gender} <EditFieldButton fieldPath="gender" onClick={openSuggestEditModal}/></p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-headline text-xl">Contact Information</CardTitle>
              <EditFieldButton fieldPath="contactInfo" onClick={openSuggestEditModal} tooltip="Edit entire contact block (JSON)"/>
            </CardHeader>
            <CardContent className="space-y-2">
              {politician.contactInfo.email && (
                <p className="flex items-center justify-between gap-2 text-sm group">
                  <span className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" />
                  <a href={`mailto:${politician.contactInfo.email}`} className="hover:underline truncate">{politician.contactInfo.email}</a></span>
                  <EditFieldButton fieldPath="contactInfo.email" onClick={openSuggestEditModal}/>
                </p>
              )}
              {politician.contactInfo.phone && (
                <p className="flex items-center justify-between gap-2 text-sm group">
                  <span className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> {politician.contactInfo.phone} (Personal)</span>
                  <EditFieldButton fieldPath="contactInfo.phone" onClick={openSuggestEditModal}/>
                </p>
              )}
              {politician.contactInfo.officePhone && (
                <p className="flex items-center justify-between gap-2 text-sm group">
                  <span className="flex items-center gap-2"><Building className="h-4 w-4 text-primary" /> {politician.contactInfo.officePhone} (Office)</span>
                  <EditFieldButton fieldPath="contactInfo.officePhone" onClick={openSuggestEditModal}/>
                </p>
              )}
              {politician.contactInfo.permanentAddress && (
                <p className="flex items-start justify-between gap-2 text-sm group">
                  <span className="flex items-start gap-2"><Map className="h-4 w-4 text-primary mt-0.5 shrink-0" /> Permanent Address: {politician.contactInfo.permanentAddress}</span>
                  <EditFieldButton fieldPath="contactInfo.permanentAddress" onClick={openSuggestEditModal}/>
                </p>
              )}
              {politician.contactInfo.temporaryAddress && (
                <p className="flex items-start justify-between gap-2 text-sm group">
                  <span className="flex items-start gap-2"><Map className="h-4 w-4 text-primary mt-0.5 shrink-0" /> Temporary Address: {politician.contactInfo.temporaryAddress}</span>
                  <EditFieldButton fieldPath="contactInfo.temporaryAddress" onClick={openSuggestEditModal}/>
                </p>
              )}
              {politician.contactInfo.website && (
                <p className="flex items-center justify-between gap-2 text-sm group">
                  <span className="flex items-center gap-2"><Globe className="h-4 w-4 text-primary" />
                  <a href={politician.contactInfo.website} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                    Official Website
                  </a></span>
                  <EditFieldButton fieldPath="contactInfo.website" onClick={openSuggestEditModal}/>
                </p>
              )}
              {politician.contactInfo.twitter && (
                <p className="flex items-center justify-between gap-2 text-sm group">
                  <span className="flex items-center gap-2"><Twitter className="h-4 w-4 text-primary" />
                  <a href={politician.contactInfo.twitter} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                    @{politician.contactInfo.twitter.split('/').pop()}
                  </a></span>
                  <EditFieldButton fieldPath="contactInfo.twitter" onClick={openSuggestEditModal}/>
                </p>
              )}
              {politician.contactInfo.facebook && (
                <p className="flex items-center justify-between gap-2 text-sm group">
                  <span className="flex items-center gap-2"><Facebook className="h-4 w-4 text-primary" />
                  <a href={politician.contactInfo.facebook} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                    Facebook Profile
                  </a></span>
                  <EditFieldButton fieldPath="contactInfo.facebook" onClick={openSuggestEditModal}/>
                </p>
              )}
              {politician.contactInfo.linkedin && (
                <p className="flex items-center justify-between gap-2 text-sm group">
                  <span className="flex items-center gap-2"><Linkedin className="h-4 w-4 text-primary" />
                  <a href={politician.contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                    LinkedIn Profile
                  </a></span>
                  <EditFieldButton fieldPath="contactInfo.linkedin" onClick={openSuggestEditModal}/>
                </p>
              )}
              {politician.contactInfo.instagram && (
                <p className="flex items-center justify-between gap-2 text-sm group">
                  <span className="flex items-center gap-2"><Instagram className="h-4 w-4 text-primary" />
                  <a href={politician.contactInfo.instagram} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                    @{politician.contactInfo.instagram.split('/').pop()?.replace(/[/]/g,'')}
                  </a></span>
                  <EditFieldButton fieldPath="contactInfo.instagram" onClick={openSuggestEditModal}/>
                </p>
              )}
            </CardContent>
          </Card>

          {politician.tags && politician.tags.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                  <Tag className="h-5 w-5 text-primary"/> Tags
                </CardTitle>
                <EditFieldButton fieldPath="tags" onClick={openSuggestEditModal} tooltip="Edit tags (JSON)"/>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {politician.tags.map((tag) => (
                  <Link key={tag} href={`/search?tag=${encodeURIComponent(tag)}`} passHref>
                    <Badge variant="secondary" className="hover:bg-primary/20 transition-colors cursor-pointer">{tag}</Badge>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}

          {politician.education && politician.education.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary"/> Education
                </CardTitle>
                 <EditFieldButton fieldPath="education" onClick={openSuggestEditModal} tooltip="Edit all education entries (JSON)"/>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {politician.education.map((edu, idx) => (
                    <li key={idx} className="text-sm group flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{edu.degree}{edu.field && ` in ${edu.field}`}</p>
                        <p className="text-muted-foreground">{edu.institution}</p>
                        {edu.graduationYear && <p className="text-xs text-muted-foreground">Graduated: {edu.graduationYear}</p>}
                      </div>
                      <EditFieldButton fieldPath={`education[${idx}]`} onClick={openSuggestEditModal} tooltip={`Edit this education entry`}/>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <Card>
             <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-headline text-xl flex items-center gap-2"><Briefcase className="text-primary"/> Positions Held</CardTitle>
               <EditFieldButton fieldPath="positions" onClick={openSuggestEditModal} tooltip="Edit all positions (JSON)"/>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {politician.positions.map((pos, idx) => (
                  <li key={idx} className="text-sm group flex justify-between items-start">
                    <div>
                      <span className="font-semibold">{pos.title}</span>
                      <br />
                      <span className="text-muted-foreground">
                        {new Date(pos.startDate).toLocaleDateString()} - {pos.endDate ? new Date(pos.endDate).toLocaleDateString() : 'Present'}
                      </span>
                    </div>
                    <EditFieldButton fieldPath={`positions[${idx}]`} onClick={openSuggestEditModal} tooltip="Edit this position"/>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {politician.committeeMemberships && politician.committeeMemberships.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                  <Landmark className="h-5 w-5 text-primary"/> Committee Memberships
                </CardTitle>
                <EditFieldButton fieldPath="committeeMemberships" onClick={openSuggestEditModal} tooltip="Edit all committee memberships (JSON)"/>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {politician.committeeMemberships.map((mem, idx) => (
                    <li key={idx} className="text-sm group flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{mem.committeeName}</p>
                        {mem.role && <p className="text-muted-foreground">{mem.role}</p>}
                        {mem.startDate && (
                          <p className="text-xs text-muted-foreground">
                            {new Date(mem.startDate).toLocaleDateString()} - {mem.endDate && mem.endDate !== 'Present' ? new Date(mem.endDate).toLocaleDateString() : 'Present'}
                          </p>
                        )}
                      </div>
                      <EditFieldButton fieldPath={`committeeMemberships[${idx}]`} onClick={openSuggestEditModal} tooltip="Edit this membership"/>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
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
                  <div className="group">
                    <div className="flex justify-between items-center">
                      <h3 className="text-md font-semibold mb-1 flex items-center gap-1"><Tag className="h-4 w-4 text-muted-foreground"/> Political Ideology</h3>
                      <EditFieldButton fieldPath="politicalIdeology" onClick={openSuggestEditModal} tooltip="Edit political ideologies (JSON)"/>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {politician.politicalIdeology.map(ideo => (
                        <Badge key={ideo} variant="secondary">{ideo}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {politician.languagesSpoken && politician.languagesSpoken.length > 0 && (
                   <div className="group">
                    <div className="flex justify-between items-center">
                      <h3 className="text-md font-semibold mb-1 flex items-center gap-1"><Languages className="h-4 w-4 text-muted-foreground"/> Languages Spoken</h3>
                      <EditFieldButton fieldPath="languagesSpoken" onClick={openSuggestEditModal} tooltip="Edit languages spoken (JSON)"/>
                    </div>
                    <p className="text-sm text-foreground/80">{politician.languagesSpoken.join(', ')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : null}


          {/* Analytics and Rating cards are less likely to have direct field edits, so skipping them for now */}
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
                {/* Display individual scores if needed, or rely on chart */}
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
                <EditFieldButton fieldPath="bio" onClick={openSuggestEditModal} tooltip="Edit biography"/>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 whitespace-pre-line">{politician.bio}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-headline text-xl">Career Timeline</CardTitle>
              <div>
                 <EditFieldButton fieldPath="politicalJourney" onClick={openSuggestEditModal} tooltip="Edit political journey (JSON)"/>
                 <EditFieldButton fieldPath="partyAffiliations" onClick={openSuggestEditModal} tooltip="Edit party affiliations (JSON)"/>
              </div>
            </CardHeader>
            <CardContent>
              {/* TODO: Add edit buttons for individual timeline items if possible, or edit whole array as JSON */}
              <TimelineDisplay items={careerTimelineItems} />
            </CardContent>
          </Card>

          {/* Revision History is likely system-managed, so no edit button here */}
          {politician.revisionHistory && politician.revisionHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                  <History className="h-5 w-5 text-primary"/> Revision History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {politician.revisionHistory.map((item) => (
                    <li key={item.id} className="text-sm border-b border-border/50 pb-3 last:border-b-0 last:pb-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-foreground/90">{item.event}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Author: {item.author}</p>
                      {item.details && <p className="mt-1 text-xs text-foreground/70 bg-muted/30 p-1.5 rounded-sm">{item.details}</p>}
                      {item.suggestionId && <p className="text-xs text-muted-foreground mt-1">Suggestion ID: {item.suggestionId}</p>}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {sponsoredBills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary"/> Sponsored Bills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {sponsoredBills.map((bill: Bill) => (
                    <li key={bill.id} className="p-3 border rounded-md bg-secondary/50 hover:bg-secondary/70 transition-colors">
                      <Link href={`/bills/${bill.id}`} className="font-semibold text-primary hover:underline">
                        {bill.title} ({bill.billNumber})
                      </Link>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-muted-foreground">
                          Status: {bill.status}
                        </p>
                        {bill.sponsors.find(s => s.id === politician.id)?.type === 'Primary' && (
                            <Badge variant="outline" className="text-xs">Primary Sponsor</Badge>
                        )}
                        {bill.sponsors.find(s => s.id === politician.id)?.type === 'Co-Sponsor' && (
                             <Badge variant="secondary" className="text-xs">Co-Sponsor</Badge>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {politicianVotes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-primary"/> Voting Record
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {politicianVotes.map((vote, idx) => (
                    <li key={`vote-${idx}-${vote.billId}`} className="text-sm border-b pb-3 last:border-b-0 last:pb-0">
                       <Link href={`/bills/${vote.billId}`} className="font-semibold text-primary hover:underline">
                        {vote.billTitle} ({vote.billNumber})
                      </Link>
                      <p className="text-muted-foreground">
                        Vote: <span className={`font-medium ${vote.vote === 'Yea' ? 'text-green-600' : vote.vote === 'Nay' ? 'text-red-600' : ''}`}>{vote.vote}</span> in {vote.chamber}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Date: {new Date(vote.voteDate).toLocaleDateString()}
                      </p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {politician.assetDeclarations && politician.assetDeclarations.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                  <ScrollText className="h-5 w-5 text-primary"/> Asset Declarations
                </CardTitle>
                <EditFieldButton fieldPath="assetDeclarations" onClick={openSuggestEditModal} tooltip="Edit all asset declarations (JSON)"/>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {politician.assetDeclarations.map((asset: AssetDeclaration, idx: number) => (
                    <li key={idx} className="text-sm border-b pb-3 last:border-b-0 last:pb-0 group flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{asset.description} ({asset.year})</p>
                        {asset.value && <p className="text-muted-foreground">Value: {asset.value}</p>}
                        {asset.sourceUrl && (
                          <a href={asset.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs flex items-center gap-1">
                            View Source <ExternalLink className="h-3 w-3"/>
                          </a>
                        )}
                      </div>
                      <EditFieldButton fieldPath={`assetDeclarations[${idx}]`} onClick={openSuggestEditModal} tooltip="Edit this asset declaration"/>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {politician.criminalRecords && politician.criminalRecords.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                  <Gavel className="h-5 w-5 text-primary"/> Criminal Records
                </CardTitle>
                <EditFieldButton fieldPath="criminalRecords" onClick={openSuggestEditModal} tooltip="Edit all criminal records (JSON)"/>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {politician.criminalRecords.map((record: CriminalRecord, idx: number) => (
                    <li key={idx} className="text-sm border-b pb-3 last:border-b-0 last:pb-0 group">
                       <div className="flex justify-between items-start mb-1">
                          <div>
                            <p className="font-semibold">{record.offense}</p>
                          </div>
                          <div className="flex items-center">
                            <Badge variant={getCriminalStatusBadgeVariant(record.status)}>{record.status}</Badge>
                            <EditFieldButton fieldPath={`criminalRecords[${idx}]`} onClick={openSuggestEditModal} tooltip="Edit this criminal record"/>
                          </div>
                       </div>
                      <p className="text-xs text-muted-foreground">Date: {new Date(record.date).toLocaleDateString()}</p>
                      {record.caseNumber && <p className="text-xs text-muted-foreground">Case: {record.caseNumber}</p>}
                      {record.court && <p className="text-xs text-muted-foreground">Court: {record.court}</p>}
                      {record.summary && <p className="mt-1 text-foreground/80">{record.summary}</p>}
                      {record.sourceUrl && (
                        <a href={record.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs flex items-center gap-1 mt-1">
                          View Source <ExternalLink className="h-3 w-3"/>
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Related News and Controversies are typically links to other entities, edit buttons would be on those entity pages or managed via a different system. */}
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
                      <p className="text-xs text-muted-foreground">{news.sourceName} - {new Date(news.publicationDate).toLocaleDateString()}</p>
                      {news.summary && <p className="text-xs text-foreground/80 mt-1">{news.summary}</p>}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {relatedControversies.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-primary"/> Associated Controversies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {relatedControversies.map((controversy: Controversy) => (
                    <li key={controversy.id} className="p-3 border rounded-md bg-secondary/50 hover:bg-secondary/70 transition-colors">
                      <Link href={`/controversies/${controversy.id}`} className="font-semibold text-primary hover:underline">
                        {controversy.title}
                      </Link>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-muted-foreground">
                          Status: {controversy.status}
                        </p>
                        <Badge variant={
                            controversy.severityIndicator === 'Critical' || controversy.severityIndicator === 'High' ? 'destructive' :
                            controversy.severityIndicator === 'Medium' ? 'secondary' : 'outline'
                        } className="text-xs">
                           Severity: {controversy.severityIndicator}
                        </Badge>
                      </div>
                    </li>
                  ))}
                </ul>
                <Link href="/controversies" className="mt-4 inline-block">
                   <Button variant="link" className="p-0 h-auto text-primary text-sm">View all controversies</Button>
                </Link>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">Promises</CardTitle>
            </CardHeader>
            <CardContent>
              {promises.length > 0 ? (
                <ul className="space-y-3">
                  {promises.map((promise: PromiseItem) => (
                    <li key={promise.id} className="p-3 border rounded-md bg-secondary/50">
                      <Link href={`/promises#${promise.id}`} className="font-semibold text-primary hover:underline">{promise.title}</Link>
                      <p className="text-xs text-muted-foreground mt-1">Status: {promise.status} {promise.dueDate && `(Due: ${new Date(promise.dueDate).toLocaleDateString()})`}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No promises listed for this politician yet.</p>
              )}
               <Link href="/promises" className="mt-4 inline-block">
                  <Button variant="link" className="p-0 h-auto text-primary">View all promises</Button>
               </Link>
            </CardContent>
          </Card>

          <Button
            onClick={handleFollowToggle}
            className="w-full mt-4 bg-accent hover:bg-accent/90 text-accent-foreground"
            variant={isFollowing ? "outline" : "default"}
          >
            {isFollowing ? <UserCheck className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
            {isFollowing ? `Following ${politician.name}` : `Follow ${politician.name}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
