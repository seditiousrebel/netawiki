"use client";

import Image from 'next/image';
import { getPartyById, mockPoliticians, getPromisesByPartyId, getControversiesByPartyId, getNewsByPartyId } from '@/lib/mock-data';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, Globe, Edit, Users, CalendarDays, Landmark, Info, Tag, Building, CheckCircle, XCircle, Scale, Link as LinkIcon, FlagIcon, Palette, Group, Milestone, ExternalLink, Briefcase, UserCheck, ListChecks, ClipboardList, History, Award, UserPlus, Handshake, GitMerge, GitPullRequest, ShieldAlert, ClipboardCheck, Megaphone, DollarSign, VoteIcon, BookOpen, BarChart3, Newspaper, TrendingUp, Star, Download, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect } from 'react';
import type { PromiseItem, LeadershipEvent, Party, PartyAlliance, PartySplitMergerEvent, PartyStance, FundingSource, IntraPartyElection, HistoricalManifesto, ElectionPerformanceRecord, NewsArticleLink, Controversy } from '@/types/gov';
import { TimelineDisplay } from '@/components/common/timeline-display';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { exportElementAsPDF } from '@/lib/utils';
import { getCurrentUser, canAccess, ADMIN_ROLES, isUserLoggedIn } from '@/lib/auth';
import { useRouter } from 'next/navigation';
// import { SuggestEditForm } from '@/components/common/suggest-edit-form'; // Removed
import { SuggestEntityEditForm } from '@/components/common/SuggestEntityEditForm'; // Added
import { entitySchemas } from '@/lib/schemas';
import type { EntityType } from '@/lib/data/suggestions';
import { format } from 'date-fns';

interface TimelineItem {
  date: string;
  title: string;
  description?: string;
}

const LOCAL_STORAGE_FOLLOWED_PARTIES_KEY = 'govtrackr_followed_parties';

function formatLeadershipHistoryForTimeline(events: LeadershipEvent[] = []): TimelineItem[] {
  return events.map(event => {
    let description = `Term: ${new Date(event.startDate).toLocaleDateString()}`;
    if (event.endDate && event.endDate !== 'Present') {
      description += ` - ${new Date(event.endDate).toLocaleDateString()}`;
    } else if (event.endDate === 'Present') {
      description += ' - Present';
    } else {
       description += ' - Present';
    }
    return {
      date: event.startDate,
      title: `${event.role}: ${event.name}`,
      description: description,
    };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function formatSplitMergerHistoryForTimeline(events: PartySplitMergerEvent[] = []): TimelineItem[] {
  return events.map(event => {
    let title = `${event.type}: ${event.description.substring(0, 50)}${event.description.length > 50 ? '...' : ''}`;
    let description = event.description;
    if (event.involvedParties && event.involvedParties.length > 0) {
      description += ` (Involved: ${event.involvedParties.map(p => p.name).join(', ')})`;
    }
    return {
      date: event.date,
      title: title,
      description: description,
    };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export default function PartyProfilePage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = React.use(paramsPromise);
  const party = getPartyById(params.id);
  const { toast } = useToast();
  const currentUser = getCurrentUser();
  const router = useRouter();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const [isPartySuggestEntityEditModalOpen, setIsPartySuggestEntityEditModalOpen] = useState(false); // New form state

  const [formattedFoundedDate, setFormattedFoundedDate] = useState<string | null>(null);
  const [formattedDissolvedDate, setFormattedDissolvedDate] = useState<string | null>(null);
  const [leadershipTimelineItems, setLeadershipTimelineItems] = useState<TimelineItem[]>([]);
  const [splitMergerTimelineItems, setSplitMergerTimelineItems] = useState<TimelineItem[]>([]);
  const [isFollowingParty, setIsFollowingParty] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    if (party?.foundedDate) {
      setFormattedFoundedDate(new Date(party.foundedDate).toLocaleDateString());
    } else {
      setFormattedFoundedDate(null);
    }
    if (party?.dissolvedDate) {
      setFormattedDissolvedDate(new Date(party.dissolvedDate).toLocaleDateString());
    } else {
      setFormattedDissolvedDate(null);
    }
    if (party?.leadershipHistory) {
      setLeadershipTimelineItems(formatLeadershipHistoryForTimeline(party.leadershipHistory));
    }
     if (party?.splitMergerHistory) {
      setSplitMergerTimelineItems(formatSplitMergerHistoryForTimeline(party.splitMergerHistory));
    }
    if (party) {
      try {
        const followedPartiesStr = localStorage.getItem(LOCAL_STORAGE_FOLLOWED_PARTIES_KEY);
        if (followedPartiesStr) {
          const followedPartyIds: string[] = JSON.parse(followedPartiesStr);
          if (followedPartyIds.includes(party.id)) {
            setIsFollowingParty(true);
          }
        }
      } catch (error) {
        console.error("Error reading followed parties from localStorage:", error);
      }
    }
  }, [party]);

  if (!party) {
    return <p>Party not found.</p>;
  }

  const partyMembers = mockPoliticians.filter(p => p.partyId === party.id);
  const partyPromises = getPromisesByPartyId(party.id);
  const relatedControversies = getControversiesByPartyId(party.id);
  const relatedNews = getNewsByPartyId(party.id);

  const openSuggestPartyEditModal = () => { // New form handler
    if (!isUserLoggedIn()) {
      router.push('/auth/login');
      return;
    }
    if (!party) return;
    setIsPartySuggestEntityEditModalOpen(true);
  };

  const handlePartyEntityEditSuggestionSubmit = (submission: { // New form handler
    formData: Record<string, any>;
    reason: string;
    evidenceUrl: string;
  }) => {
    if (!party) return;

    console.log("Full Party edit suggestion submitted:", {
      entityType: "Party" as EntityType,
      entityId: party.id,
      suggestedData: submission.formData,
      reason: submission.reason,
      evidenceUrl: submission.evidenceUrl,
      submittedAt: new Date().toISOString(),
      status: "PendingEntityUpdate"
    });

    toast({
      title: "Changes Suggested",
      description: `Your proposed changes for party "${party.name}" have been submitted for review. Thank you!`,
      duration: 5000,
    });
    setIsPartySuggestEntityEditModalOpen(false);
  };

  const handleFollowPartyToggle = () => {
    if (!party) return;
    const newFollowingState = !isFollowingParty;
    setIsFollowingParty(newFollowingState);

    try {
      const followedPartiesStr = localStorage.getItem(LOCAL_STORAGE_FOLLOWED_PARTIES_KEY);
      let followedPartyIds: string[] = followedPartiesStr ? JSON.parse(followedPartiesStr) : [];

      if (newFollowingState) {
        if (!followedPartyIds.includes(party.id)) {
          followedPartyIds.push(party.id);
        }
      } else {
        followedPartyIds = followedPartyIds.filter(id => id !== party.id);
      }
      localStorage.setItem(LOCAL_STORAGE_FOLLOWED_PARTIES_KEY, JSON.stringify(followedPartyIds));
    } catch (error) {
      console.error("Error updating followed parties in localStorage:", error);
      toast({
        title: "Could not update follow status",
        description: "There was an issue saving your follow preference. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
      setIsFollowingParty(!newFollowingState); // Revert state
      return;
    }

    toast({
      title: newFollowingState ? `Following ${party.name}` : `Unfollowed ${party.name}`,
      description: newFollowingState ? "You'll receive updates for this party (demo)." : "You will no longer receive updates (demo).",
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
    console.log("Party Rating Submitted:", { partyId: party.id, rating: currentRating });
    toast({
      title: "Review Submitted (Demo)",
      description: `You rated ${party.name} ${currentRating} star(s).`,
      duration: 5000,
    });
  };

  async function handleExportPdf() {
    if (!party) return;
    const fileName = `party-${party.name.toLowerCase().replace(/\s+/g, '-')}-details.pdf`;
    await exportElementAsPDF('party-details-export-area', fileName, setIsGeneratingPdf);
  }

  const handleDeleteParty = () => {
    if (!party) return;
    alert(`Mock delete action for party: ${party.name}`);
  };

  return (
    <div>
      <PageHeader
        title={
          <span className="flex items-center">
            {party.name}
            {party.abbreviation && <span className="ml-2 flex items-center">({party.abbreviation})</span>}
          </span>
        }
        description={
           <div className="flex flex-wrap gap-2 mt-1 items-center">
            {party.isActive !== undefined && (
              <Badge variant={party.isActive ? 'default' : 'secondary'} className={`${party.isActive ? 'bg-green-500 text-white' : ''}`}>
                {party.isActive ? <CheckCircle className="mr-1 h-3 w-3"/> : <XCircle className="mr-1 h-3 w-3"/>}
                {party.isActive ? 'Active' : 'Inactive'}
              </Badge>
            )}
            {party.isNationalParty !== undefined && (
              <Badge variant={party.isNationalParty ? 'default' : 'outline'}>
                {party.isNationalParty ? 'National Party' : 'Regional Party'}
              </Badge>
            )}
          </div>
        }
        actions={(
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleFollowPartyToggle}
            >
              {isFollowingParty ? <CheckCircle className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
              {isFollowingParty ? 'Following' : 'Follow'}
            </Button>
            <Button variant="outline" onClick={openSuggestPartyEditModal}>
              <Edit className="mr-2 h-4 w-4" /> Propose Changes to Party
            </Button>
            <Button variant="outline" onClick={handleExportPdf} disabled={isGeneratingPdf}>
              <Download className="mr-2 h-4 w-4" /> {isGeneratingPdf ? 'Generating PDF...' : 'Export Party Details'}
            </Button>
            {canAccess(currentUser.role, ADMIN_ROLES) && (
              <Button variant="destructive" onClick={handleDeleteParty}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete Party
              </Button>
            )}
          </div>
        )}
      />

      {party && isPartySuggestEntityEditModalOpen && entitySchemas.Party && ( 
        <SuggestEntityEditForm
          isOpen={isPartySuggestEntityEditModalOpen}
          onOpenChange={setIsPartySuggestEntityEditModalOpen}
          entityType="Party"
          entitySchema={entitySchemas.Party}
          currentEntityData={party}
          onSubmit={handlePartyEntityEditSuggestionSubmit}
        />
      )}

      <div id="party-details-export-area" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-0">
              <div className="bg-muted p-4 flex justify-center items-center rounded-t-lg min-h-[180px] relative">
                {party.logoUrl && (
                  <Image
                    src={party.logoUrl}
                    alt={`${party.name} Logo`}
                    width={150}
                    height={150}
                    className="object-contain max-h-[150px]"
                    data-ai-hint={party.dataAiHint as string || "party logo"}
                  />
                )}
              </div>
              <div className="p-6 space-y-2">
                <h2 className="text-2xl font-headline font-semibold mb-1 flex items-center">{party.name} </h2>
                {party.nepaliName && <p className="text-lg text-muted-foreground -mt-1 mb-1 flex items-center">{party.nepaliName}  </p>}

                <div className="flex flex-wrap gap-2 items-center">
                    {party.electionSymbolUrl && (
                        <div className="text-center relative">
                          <h3 className="text-xs font-medium text-muted-foreground mb-0.5">Symbol</h3>
                          <Image src={party.electionSymbolUrl} alt={`${party.name} Election Symbol`} width={40} height={40} className="object-contain border rounded-md p-0.5"/>
                        </div>
                    )}
                    {party.flagUrl && (
                        <div className="text-center relative">
                          <h3 className="text-xs font-medium text-muted-foreground mb-0.5">Flag</h3>
                          <Image src={party.flagUrl} alt={`${party.name} Flag`} width={60} height={40} className="object-cover border rounded-md"/>
                        </div>
                    )}
                    {party.partyColorHex && (
                        <div className="text-center relative">
                            <h3 className="text-xs font-medium text-muted-foreground mb-0.5">Color</h3>
                            <div style={{ backgroundColor: party.partyColorHex }} className="w-10 h-10 rounded-md border" title={`Party Color: ${party.partyColorHex}`}></div>
                        </div>
                    )}
                </div>

                {party.foundedDate && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1 pt-2">
                        <CalendarDays className="h-4 w-4" /> Founded: {formattedFoundedDate || '...'}
                    </p>
                )}
                 {party.dissolvedDate && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <CalendarDays className="h-4 w-4" /> Dissolved: {formattedDissolvedDate || '...'}
                    </p>
                )}
                {party.registrationNumber && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Briefcase className="h-4 w-4" /> Reg. No: {party.registrationNumber}
                    </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-headline text-xl flex items-center gap-2"><Users className="text-primary"/> Current Leadership</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {party.leadership.map((leader, idx) => (
                  <li key={idx} className="text-sm flex justify-between items-start">
                    <div>
                      {leader.politicianId ? (
                        <Link href={`/politicians/${leader.politicianId}`} className="text-primary hover:underline font-semibold">
                          {leader.name}
                        </Link>
                      ) : (
                        <span className="font-semibold">{leader.name}</span>
                      )}
                      - <span className="text-muted-foreground">{leader.role}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {party.tags && party.tags.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                  <Tag className="h-5 w-5 text-primary"/> Tags
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {party.tags.map((tag) => (
                  <Link key={tag} href={`/search?tag=${encodeURIComponent(tag)}`} passHref>
                    <Badge variant="secondary" className="hover:bg-primary/20 transition-colors cursor-pointer">{tag}</Badge>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}

          {party.ideology && party.ideology.length > 0 && (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="font-headline text-xl flex items-center gap-2"><Tag className="text-primary"/> Stated Ideology</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {party.ideology.map(ideo => (
                            <Badge key={ideo} variant="secondary">{ideo}</Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-headline text-xl flex items-center gap-2"><Building className="text-primary"/> Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {party.headquartersAddress && (
                <p className="flex items-start justify-between gap-2 text-sm">
                  <span className="flex items-start gap-2"><Landmark className="h-4 w-4 text-primary mt-0.5 shrink-0" /> {party.headquartersAddress}</span>
                </p>
              )}
              {party.contactInfo.email && (
                <p className="flex items-center justify-between gap-2 text-sm">
                  <span className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /><a href={`mailto:${party.contactInfo.email}`} className="hover:underline truncate">{party.contactInfo.email}</a></span>
                </p>
              )}
              {party.contactInfo.phone && (
                <p className="flex items-center justify-between gap-2 text-sm">
                  <span className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> {party.contactInfo.phone}</span>
                </p>
              )}
              {party.contactInfo.website && (
                <p className="flex items-center justify-between gap-2 text-sm">
                  <span className="flex items-center gap-2"><Globe className="h-4 w-4 text-primary" /><a href={party.contactInfo.website} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">Official Website</a></span>
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
          {party.aboutParty && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline text-xl flex items-center gap-2"><Info className="text-primary"/> About the Party</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 whitespace-pre-line">{party.aboutParty}</p>
              </CardContent>
            </Card>
          )}
           {(party.detailedIdeologyDescription || party.partyManifestoUrl || (party.historicalManifestos && party.historicalManifestos.length > 0)) && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline text-xl flex items-center gap-2"><Milestone className="text-primary"/> Ideology &amp; Platform</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {party.detailedIdeologyDescription && <p className="text-foreground/80 whitespace-pre-line flex justify-between items-start"><span>{party.detailedIdeologyDescription}</span>  </p>}
                {party.partyManifestoUrl && (
                  <div className='mb-2 flex justify-between items-center'>
                    <Button variant="link" asChild className="p-0 h-auto text-primary items-center font-semibold">
                      <a href={party.partyManifestoUrl} target="_blank" rel="noopener noreferrer">
                        Read Current Manifesto <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                )}
                {party.historicalManifestos && party.historicalManifestos.length > 0 && (
                  <div className="pt-3 border-t">
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-1"><BookOpen className="h-4 w-4 text-muted-foreground"/> Historical Manifestos</h4>
                    <ul className="space-y-1">
                      {party.historicalManifestos.map((manifesto, idx) => (
                        <li key={idx} className="text-sm flex justify-between items-center">
                           <a href={manifesto.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                            {manifesto.year} {manifesto.description ? `- ${manifesto.description}` : 'Manifesto'} <ExternalLink className="h-3 w-3"/>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
           )}

          {(party.parentPartyName || (party.splinterPartyNames && party.splinterPartyNames.length > 0) || (party.internationalAffiliations && party.internationalAffiliations.length > 0)) && (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="font-headline text-xl flex items-center gap-2"><LinkIcon className="text-primary"/> Affiliations &amp; Structure</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    {party.parentPartyName && (
                        <p className="flex items-center justify-between gap-1"><span className="flex items-center gap-1"><GitMerge className="h-4 w-4 text-muted-foreground" /> <span className="font-semibold">Parent Party:</span> {party.parentPartyName}</span> <span> </span></p>
                    )}
                    {party.splinterPartyNames && party.splinterPartyNames.length > 0 && (
                         <p className="flex items-center justify-between gap-1"><span className="flex items-center gap-1"><GitPullRequest className="h-4 w-4 text-muted-foreground" /> <span className="font-semibold">Splinter Parties:</span> {party.splinterPartyNames.join(', ')}</span> <span> </span></p>
                    )}
                    {party.internationalAffiliations && party.internationalAffiliations.length > 0 && (
                        <p className="flex items-center justify-between gap-1"><span className="flex items-center gap-1"><Globe className="h-4 w-4 text-muted-foreground" /> <span className="font-semibold">International Affiliations:</span> {party.internationalAffiliations.join(', ')}</span></p>
                    )}
                </CardContent>
            </Card>
          )}

          {party.leadershipHistory && party.leadershipHistory.length > 0 && (
             <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="font-headline text-xl flex items-center gap-2"><History className="text-primary"/> Leadership History</CardTitle>
                </CardHeader>
                <CardContent>
                    <TimelineDisplay items={leadershipTimelineItems} />
                </CardContent>
            </Card>
          )}

          {party.splitMergerHistory && party.splitMergerHistory.length > 0 && (
             <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="font-headline text-xl flex items-center gap-2"><GitMerge className="text-primary"/> Party Evolution</CardTitle>
                </CardHeader>
                <CardContent>
                    <TimelineDisplay items={splitMergerTimelineItems} />
                </CardContent>
            </Card>
          )}

          {party.alliances && party.alliances.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline text-xl flex items-center gap-2"><Handshake className="text-primary"/> Political Alliances</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {party.alliances.map((alliance, idx) => (
                    <li key={idx} className="text-sm border-b pb-3 last:border-b-0 flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-md">{alliance.name}
                          {alliance.status && (
                            <Badge variant={alliance.status === 'Active' ? 'default' : 'secondary'} className={`ml-2 text-xs ${alliance.status === 'Active' ? 'bg-green-500 text-white' : ''}`}>
                              {alliance.status}
                            </Badge>
                          )}
                        </h4>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(alliance.startDate), 'MM/dd/yyyy')} - {alliance.endDate && alliance.endDate !== 'Ongoing' ? format(new Date(alliance.endDate), 'MM/dd/yyyy') : 'Ongoing'}
                      </p>
                      {alliance.purpose && <p className="text-foreground/80 mt-1">{alliance.purpose}</p>}
                      {alliance.partnerPartyNames && alliance.partnerPartyNames.length > 0 && (
                        <p className="text-xs mt-1">
                          <span className="font-medium">Partners:</span> {alliance.partnerPartyNames.join(', ')}
                        </p>
                      )}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {party.stancesOnIssues && party.stancesOnIssues.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline text-xl flex items-center gap-2"><Megaphone className="text-primary"/> Stances on Key Issues</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {party.stancesOnIssues.map((stance, idx) => (
                  <div key={idx} className="text-sm border-b pb-3 last:border-b-0 flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">
                        {stance.isBill ? (
                          <Link href={`/bills/${stance.issueId}`} className="text-primary hover:underline">
                            {stance.issueTitle}
                          </Link>
                        ) : (
                          stance.issueTitle
                        )}
                      </h4>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="font-medium">Stance:</span>
                        <Badge variant={stance.stance === 'Supports' ? 'default' : stance.stance === 'Opposes' ? 'destructive' : 'secondary'}
                                     className={stance.stance === 'Supports' ? 'bg-green-500 text-white' : stance.stance === 'Opposes' ? 'bg-red-500 text-white' : ''}>
                                     {stance.stance}
                        </Badge>
                        {stance.dateOfStance && <span className="text-xs text-muted-foreground ml-2">({format(new Date(stance.dateOfStance), 'MM/dd/yyyy')})</span>}
                      </div>
                      {stance.statement && <p className="text-foreground/80 mt-1 italic">"{stance.statement}"</p>}
                      {stance.statementUrl && (
                        <a href={stance.statementUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs flex items-center gap-1 mt-1">
                          View Official Statement <ExternalLink className="h-3 w-3"/>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

           {party.fundingSources && party.fundingSources.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline text-xl flex items-center gap-2"><DollarSign className="text-primary"/> Funding &amp; Transparency</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {party.fundingSources.map((source: FundingSource, idx: number) => (
                  <div key={idx} className="text-sm border-b pb-3 last:border-b-0 flex justify-between items-start">
                    <div>
                      <div className="flex justify-between items-start">
                          <h4 className="font-semibold">{source.sourceName} ({source.year})</h4>
                          <Badge variant="outline">{source.type}</Badge>
                      </div>
                      {source.amount && <p className="text-muted-foreground">Amount: {source.amount}</p>}
                      {source.description && <p className="text-foreground/80 mt-1">{source.description}</p>}
                      {source.sourceUrl && (
                        <a href={source.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs flex items-center gap-1 mt-1">
                          View Source/Report <ExternalLink className="h-3 w-3"/>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {party.intraPartyElections && party.intraPartyElections.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline text-xl flex items-center gap-2"><VoteIcon className="text-primary"/> Internal Party Elections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {party.intraPartyElections.map((election: IntraPartyElection, idx: number) => (
                  <div key={idx} className="text-sm border-b pb-3 last:border-b-0 flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{election.electionTitle} ({format(new Date(election.date), 'MM/dd/yyyy')})</h4>
                      {election.description && <p className="text-foreground/80 mt-1">{election.description}</p>}
                      {election.resultsSummary && <p className="text-muted-foreground mt-1 italic">Results: {election.resultsSummary}</p>}
                      {election.documentUrl && (
                        <a href={election.documentUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs flex items-center gap-1 mt-1">
                          View Details/Announcement <ExternalLink className="h-3 w-3"/>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {party.electionHistory && party.electionHistory.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline text-xl flex items-center gap-2"><BarChart3 className="text-primary"/> Election Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Year</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Seats Won</TableHead>
                      <TableHead className="text-right">Vote %</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {party.electionHistory.map((record: ElectionPerformanceRecord, idx: number) => (
                      <TableRow key={idx}>
                        <TableCell>{record.electionYear}</TableCell>
                        <TableCell>{record.electionType}</TableCell>
                        <TableCell className="text-right">{record.seatsWon}</TableCell>
                        <TableCell className="text-right">{record.votePercentage ? `${record.votePercentage.toFixed(1)}%` : 'N/A'}</TableCell>
                        <TableCell className="text-right"></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <p className="text-xs text-muted-foreground mt-3">Note: Graphs and more detailed election analysis can be added in future updates.</p>
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

          <Card>
            <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2"><TrendingUp className="text-primary"/> Analytics Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>Current Seat Distribution (Federal): [Data Unavailable - Graph Placeholder]</p>
                <p>Current Seat Distribution (Provincial): [Data Unavailable - Graph Placeholder]</p>
                <p>Estimated Member Count: [Data Unavailable]</p>
                <p>Party Promise Fulfillment Rate (Overall): [Data Unavailable]</p>
                <p className="text-xs pt-2 border-t">Note: Detailed analytics and visualizations will be implemented in future updates.</p>
            </CardContent>
          </Card>

          {party.wings && party.wings.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline text-xl flex items-center gap-2"><Group className="text-primary"/> Party Wings</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {party.wings.map((wing, idx) => (
                    <li key={idx} className="text-sm border-b pb-2 last:border-b-0 flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{wing.name}</p>
                        {wing.description && <p className="text-muted-foreground text-xs mt-0.5">{wing.description}</p>}
                        {wing.keyLeaders && wing.keyLeaders.length > 0 && (
                          <div className="mt-1">
                            <span className="text-xs font-medium">Key Leaders: </span>
                            {wing.keyLeaders.map((leader, lIdx) => (
                              <React.Fragment key={lIdx}>
                                {leader.politicianId ? (
                                  <Link href={`/politicians/${leader.politicianId}`} className="text-primary hover:underline text-xs">
                                    {leader.name}
                                  </Link>
                                ) : (
                                  <span className="text-xs">{leader.name}</span>
                                )}
                                {lIdx < wing.keyLeaders!.length - 1 && ', '}
                              </React.Fragment>
                            ))}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {partyMembers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2"><UserCheck className="text-primary"/> Notable Members</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {partyMembers.slice(0, 5).map(member => {
                    const partyRoleEntry = party.leadership.find(leader => leader.politicianId === member.id);
                    const displayRole = partyRoleEntry ? partyRoleEntry.role : (member.positions[0] ? member.positions[0].title : 'Member');
                    return (
                      <li key={member.id}>
                        <Link href={`/politicians/${member.id}`} className="text-primary hover:underline">
                          {member.name}
                        </Link>
                        {displayRole && <span className="text-muted-foreground text-xs"> - {displayRole}</span>}
                      </li>
                    );
                  })}
                </ul>
                {partyMembers.length > 5 && (
                    <Link href={`/politicians?partyId=${party.id}`} className="mt-2 inline-block">
                        <Button variant="link" className="p-0 h-auto text-primary text-sm">View all members...</Button>
                    </Link>
                )}
              </CardContent>
            </Card>
          )}

          {partyPromises.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2"><ClipboardList className="text-primary"/> Party Promises</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {partyPromises.map((promise: PromiseItem) => (
                    <li key={promise.id} className="p-3 border rounded-md bg-secondary/50">
                      <Link href={`/promises#${promise.id}`} className="font-semibold text-primary hover:underline">
                        {promise.title}
                      </Link>
                      <p className="text-xs text-muted-foreground mt-1">
                        Status: {promise.status} {promise.dueDate && `(Due: ${new Date(promise.dueDate).toLocaleDateString()})`}
                      </p>
                       {promise.politicianId && mockPoliticians.find(p=>p.id === promise.politicianId) && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Promised by: <Link href={`/politicians/${promise.politicianId}`} className="text-primary/80 hover:underline"> {mockPoliticians.find(p=>p.id === promise.politicianId)?.name}</Link>
                        </p>
                       )}
                    </li>
                  ))}
                </ul>
                 <Link href="/promises" className="mt-4 inline-block">
                  <Button variant="link" className="p-0 h-auto text-primary text-sm">View all promises</Button>
               </Link>
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
              <CardTitle className="font-headline text-xl flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" /> Rate this Party
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

          {party.revisionHistory && party.revisionHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                  <History className="h-5 w-5 text-primary"/> Revision History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {party.revisionHistory.map((event) => (
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
      </div>
    </div>
  );
}

[end of src/app/(app)/parties/[id]/page.tsx]
