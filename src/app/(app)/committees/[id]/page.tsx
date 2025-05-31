
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getCommitteeById, getPoliticianById, getBillById, getNewsByCommitteeId } from '@/lib/mock-data';
import { PageHeader } from '@/components/common/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Landmark, Building, CalendarDays, FileText, ExternalLink, Mail, Phone, Globe, ListChecks, Newspaper, MessageSquare, Activity, Star, UserPlus, CheckCircle, History, Download, Trash2, Edit, Tag } from 'lucide-react';
import { format } from 'date-fns';
import type { Committee, CommitteeMemberLink, CommitteeMeeting, CommitteeReport, BillReferredToCommittee, NewsArticleLink, CommitteeActivityEvent } from '@/types/gov';
import { TimelineDisplay, formatCommitteeActivityForTimeline } from '@/components/common/timeline-display';
import { useToast } from "@/hooks/use-toast";
import { exportElementAsPDF } from '@/lib/utils';
import { getCurrentUser, canAccess, ADMIN_ROLES, isUserLoggedIn } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { SuggestEditForm } from '@/components/common/suggest-edit-form';
import { entitySchemas } from '@/lib/schemas';
import type { EntityType } from '@/lib/data/suggestions';

const LOCAL_STORAGE_FOLLOWED_COMMITTEES_KEY = 'govtrackr_followed_committees';

// Helper component for edit buttons
const EditFieldButton: React.FC<{ fieldPath: string; onClick: (fieldPath: string) => void; className?: string; tooltip?: string }> = ({ fieldPath, onClick, className, tooltip }) => (
  <Button
    variant="ghost"
    size="icon"
    className={`ml-2 h-5 w-5 ${className ?? ''} opacity-50 group-hover:opacity-100 transition-opacity`}
    onClick={(e) => { e.stopPropagation(); onClick(fieldPath); }}
    title={tooltip || `Suggest edit for ${fieldPath.split('.').pop()?.replace(/\[\d+\]/, '')}`}
  >
    <Edit className="h-3 w-3 text-muted-foreground" />
  </Button>
);

function CommitteeDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = React.use(paramsPromise);
  const committee = getCommitteeById(params.id);
  const relatedNews = committee ? getNewsByCommitteeId(committee.id) : [];
  const activityTimelineItems = committee?.activityTimeline ? formatCommitteeActivityForTimeline(committee.activityTimeline) : [];
  const { toast } = useToast();
  const currentUser = getCurrentUser();
  const router = useRouter();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const [isFollowingCommittee, setIsFollowingCommittee] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const [isSuggestEditModalOpen, setIsSuggestEditModalOpen] = useState(false);
  const [editingFieldPath, setEditingFieldPath] = useState('');

  useEffect(() => {
    if (committee) {
      try {
        const followedItemsStr = localStorage.getItem(LOCAL_STORAGE_FOLLOWED_COMMITTEES_KEY);
        if (followedItemsStr) {
          const followedIds: string[] = JSON.parse(followedItemsStr);
          setIsFollowingCommittee(followedIds.includes(committee.id));
        }
      } catch (error) {
        console.error("Error reading followed committees from localStorage:", error);
      }
    }
  }, [committee]);


  if (!committee) {
    return (
      <div className="text-center py-10">
        <Users className="mx-auto h-12 w-12 text-destructive" />
        <p className="mt-4 text-xl font-semibold">Committee Not Found</p>
        <p className="text-muted-foreground">The committee you are looking for does not exist.</p>
        <Link href="/committees" className="mt-6 inline-block">
          <Button variant="outline">Back to Committees List</Button>
        </Link>
      </div>
    );
  }

  const openSuggestEditModal = (fieldPath: string) => {
    if (!isUserLoggedIn()) {
      router.push('/auth/login');
      return;
    }
    if (!committee) return;
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
    console.log("Committee Edit Suggestion:", {
      entityType: "Committee",
      entityId: committee?.id,
      ...suggestion,
    });
    toast({
      title: "Suggestion Submitted",
      description: `Edit suggestion for ${suggestion.fieldPath} on committee '${committee?.name}' submitted for review.`,
      duration: 5000,
    });
    setIsSuggestEditModalOpen(false);
  };


  const handleFollowToggle = () => {
    if (!committee) return;
    const newFollowingState = !isFollowingCommittee;
    setIsFollowingCommittee(newFollowingState);

    try {
      const followedItemsStr = localStorage.getItem(LOCAL_STORAGE_FOLLOWED_COMMITTEES_KEY);
      let followedIds: string[] = followedItemsStr ? JSON.parse(followedItemsStr) : [];

      if (newFollowingState) {
        if (!followedIds.includes(committee.id)) {
          followedIds.push(committee.id);
        }
      } else {
        followedIds = followedIds.filter(id => id !== committee.id);
      }
      localStorage.setItem(LOCAL_STORAGE_FOLLOWED_COMMITTEES_KEY, JSON.stringify(followedIds));
       toast({
        title: newFollowingState ? `Following "${committee.name.substring(0,30)}..."` : `Unfollowed "${committee.name.substring(0,30)}..."`,
        description: newFollowingState ? "You'll receive updates for this committee (demo)." : "You will no longer receive updates (demo).",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error updating followed committees in localStorage:", error);
      toast({
        title: "Could not update follow status",
        description: "There was an issue saving your follow preference. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
      setIsFollowingCommittee(!newFollowingState); // Revert state
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
    console.log("Committee Rating Submitted:", { committeeId: committee.id, rating: currentRating });
    toast({
      title: "Review Submitted (Demo)",
      description: `You rated this committee ${currentRating} star(s).`,
      duration: 5000,
    });
  };

  const chairperson = committee.members?.find(m => m.role === 'Chairperson');

  async function handleExportPdf() {
    if (!committee) return;
    const fileName = `committee-${committee.name.toLowerCase().replace(/\s+/g, '-')}-details.pdf`;
    await exportElementAsPDF('committee-details-export-area', fileName, setIsGeneratingPdf);
  }

  const handleDeleteCommittee = () => {
    if (!committee) return;
    alert(`Mock delete action for committee: ${committee.name}`);
  };

  return (
    <div>
      <PageHeader
        title={
          <span className="group flex items-center">
            {committee.name} <EditFieldButton fieldPath="name" onClick={openSuggestEditModal} />
            {committee.nepaliName && <span className="text-lg text-muted-foreground ml-2 group flex items-center">({committee.nepaliName} <EditFieldButton fieldPath="nepaliName" onClick={openSuggestEditModal}/>)</span>}
          </span>
        }
        description={
          <div className="flex flex-wrap gap-2 items-center mt-1 text-sm">
            <Badge variant="secondary" className="group">{committee.committeeType} <EditFieldButton fieldPath="committeeType" onClick={openSuggestEditModal}/></Badge>
            {committee.house && <Badge variant="outline" className="group">{committee.house} <EditFieldButton fieldPath="house" onClick={openSuggestEditModal}/></Badge>}
            {committee.isActive !== undefined && (
                <Badge variant={committee.isActive ? 'default' : 'destructive'} className={`group ${committee.isActive ? 'bg-green-500 text-white': ''}`}>
                    {committee.isActive ? 'Active' : 'Inactive'}
                    <EditFieldButton fieldPath="isActive" onClick={openSuggestEditModal} className="text-white group-hover:text-primary-foreground"/>
                </Badge>
            )}
          </div>
        }
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportPdf} disabled={isGeneratingPdf}>
              <Download className="mr-2 h-4 w-4" /> {isGeneratingPdf ? 'Generating PDF...' : 'Export Details'}
            </Button>
            {canAccess(currentUser.role, ADMIN_ROLES) && (
              <Button variant="destructive" onClick={handleDeleteCommittee}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete Committee
              </Button>
            )}
          </div>
        }
      />

      {committee && isSuggestEditModalOpen && entitySchemas.Committee && (
        <SuggestEditForm
          isOpen={isSuggestEditModalOpen}
          onOpenChange={setIsSuggestEditModalOpen}
          entitySchema={entitySchemas.Committee}
          fieldPath={editingFieldPath}
          currentEntityData={committee}
          entityDisplayName={committee.name}
          onSubmit={handleSuggestionSubmit}
        />
      )}

      <div id="committee-details-export-area" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {committee.mandate && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline text-xl flex items-center gap-2"><FileText className="text-primary"/> Mandate & Terms of Reference</CardTitle>
                <EditFieldButton fieldPath="mandate" onClick={openSuggestEditModal}/>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 whitespace-pre-line">{committee.mandate}</p>
              </CardContent>
            </Card>
          )}

          {committee.members && committee.members.length > 0 && (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="font-headline text-xl flex items-center gap-2"><Users className="text-primary"/> Members</CardTitle>
                    {chairperson && <CardDescription>Chairperson: <Link href={`/politicians/${chairperson.politicianId}`} className="text-primary hover:underline">{chairperson.politicianName}</Link></CardDescription>}
                  </div>
                  <EditFieldButton fieldPath="members" onClick={openSuggestEditModal} tooltip="Edit members (JSON)"/>
                </CardHeader>
                <CardContent>
                <ul className="space-y-2">
                    {committee.members.map((member, idx) => (
                    <li key={idx} className="text-sm group flex justify-between items-start">
                        <div>
                          <Link href={`/politicians/${member.politicianId}`} className="text-primary hover:underline font-semibold">
                            {member.politicianName}
                          </Link>
                          <span className="text-xs text-muted-foreground"> ({member.role})</span>
                        </div>
                        <EditFieldButton fieldPath={`members[${idx}]`} onClick={openSuggestEditModal} tooltip="Edit this member"/>
                    </li>
                    ))}
                </ul>
                </CardContent>
            </Card>
           )}

          {committee.billsReferred && committee.billsReferred.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline text-xl flex items-center gap-2"><ListChecks className="text-primary"/> Bills Referred / Under Review</CardTitle>
                <EditFieldButton fieldPath="billsReferred" onClick={openSuggestEditModal} tooltip="Edit bills referred (JSON)"/>
              </CardHeader>
              <CardContent className="space-y-4">
                {committee.billsReferred.map((billRef, idx) => {
                  const bill = getBillById(billRef.billId); // Assuming this function exists
                  return (
                    <div key={idx} className="p-3 border rounded-md bg-muted/30 group flex justify-between items-start">
                      <div>
                        <Link href={`/bills/${bill?.slug || billRef.billId}`} className="font-semibold text-primary hover:underline">
                          {billRef.billName} {billRef.billNumber && `(${billRef.billNumber})`}
                        </Link>
                        <p className="text-xs text-muted-foreground">Referred: {format(new Date(billRef.referralDate), 'MMMM dd, yyyy')}</p>
                        {billRef.status && <div className="text-xs">Committee Status: <Badge variant="outline" className="text-xs">{billRef.status}</Badge></div>}
                      </div>
                      <EditFieldButton fieldPath={`billsReferred[${idx}]`} onClick={openSuggestEditModal} tooltip="Edit this referred bill entry"/>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
          
          {committee.reports && committee.reports.length > 0 && (
             <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="font-headline text-xl flex items-center gap-2"><FileText className="text-primary"/> Published Reports</CardTitle>
                    <EditFieldButton fieldPath="reports" onClick={openSuggestEditModal} tooltip="Edit reports (JSON)"/>
                </CardHeader>
                <CardContent className="space-y-3">
                    {committee.reports.map((report, idx) => (
                        <div key={report.id || idx} className="text-sm border-b pb-2 last:border-b-0 group flex justify-between items-start">
                            <div>
                              <a href={report.reportUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline flex items-center gap-1">
                                  {report.title} <ExternalLink className="h-3 w-3 shrink-0"/>
                              </a>
                              <p className="text-xs text-muted-foreground">Published: {format(new Date(report.publicationDate), 'MMMM dd, yyyy')}{report.reportType && ` (${report.reportType})`}</p>
                              {report.summary && <p className="text-xs text-foreground/80 mt-1 line-clamp-2">{report.summary}</p>}
                            </div>
                            <EditFieldButton fieldPath={`reports[${idx}]`} onClick={openSuggestEditModal} tooltip="Edit this report"/>
                        </div>
                    ))}
                </CardContent>
            </Card>
          )}

          {committee.meetings && committee.meetings.length > 0 && (
             <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="font-headline text-xl flex items-center gap-2"><CalendarDays className="text-primary"/> Recent Meetings</CardTitle>
                    <EditFieldButton fieldPath="meetings" onClick={openSuggestEditModal} tooltip="Edit meetings (JSON)"/>
                </CardHeader>
                <CardContent className="space-y-3">
                    {committee.meetings.slice(0,5).map((meeting, idx) => (
                        <div key={meeting.id || idx} className="text-sm border-b pb-2 last:border-b-0 group flex justify-between items-start">
                            <div>
                              <p className="font-semibold">{meeting.title || `Meeting on ${format(new Date(meeting.date), 'MMMM dd, yyyy')}`}</p>
                              <p className="text-xs text-muted-foreground">Date: {format(new Date(meeting.date), 'MMMM dd, yyyy')}</p>
                              {meeting.summary && <p className="text-xs text-foreground/80 mt-1 line-clamp-2">{meeting.summary}</p>}
                              <div className="flex gap-2 mt-1.5">
                                  {meeting.agendaUrl && <Button variant="link" size="sm" asChild className="p-0 h-auto text-xs"><a href={meeting.agendaUrl} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-3 w-3 mr-1"/>View Agenda</a></Button>}
                                  {meeting.minutesUrl && <Button variant="link" size="sm" asChild className="p-0 h-auto text-xs"><a href={meeting.minutesUrl} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-3 w-3 mr-1"/>View Minutes</a></Button>}
                              </div>
                            </div>
                             <EditFieldButton fieldPath={`meetings[${idx}]`} onClick={openSuggestEditModal} tooltip="Edit this meeting"/>
                        </div>
                    ))}
                    {committee.meetings.length > 5 && <p className="text-xs text-muted-foreground mt-2">... and more meetings.</p>}
                </CardContent>
            </Card>
          )}

          {activityTimelineItems.length > 0 && (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="font-headline text-xl flex items-center gap-2"><Activity className="text-primary"/>Activity Timeline</CardTitle>
                    <EditFieldButton fieldPath="activityTimeline" onClick={openSuggestEditModal} tooltip="Edit activity timeline (JSON)"/>
                </CardHeader>
                <CardContent>
                   <TimelineDisplay items={activityTimelineItems} />
                </CardContent>
            </Card>
           )}

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" /> Rate this Committee
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

          {committee.revisionHistory && committee.revisionHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                  <History className="h-5 w-5 text-primary"/> Revision History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {committee.revisionHistory.map((event) => (
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
           {committee.contactInfo && (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="font-headline text-xl flex items-center gap-2"><MessageSquare className="text-primary"/>Contact Information</CardTitle>
                    <EditFieldButton fieldPath="contactInfo" onClick={openSuggestEditModal} tooltip="Edit contact info (JSON)"/>
                </CardHeader>
                <CardContent className="space-y-1.5 text-sm">
                    {committee.contactInfo.officeAddress && <p className="flex items-start justify-between gap-1.5 group"><span className="flex items-start gap-1.5"><Landmark className="h-4 w-4 text-primary/70 mt-0.5 shrink-0"/> {committee.contactInfo.officeAddress}</span> <EditFieldButton fieldPath="contactInfo.officeAddress" onClick={openSuggestEditModal}/></p>}
                    {committee.contactInfo.email && <p className="flex items-center justify-between gap-1.5 group"><span className="flex items-center gap-1.5"><Mail className="h-4 w-4 text-primary/70"/><a href={`mailto:${committee.contactInfo.email}`} className="hover:underline">{committee.contactInfo.email}</a></span> <EditFieldButton fieldPath="contactInfo.email" onClick={openSuggestEditModal}/></p>}
                    {committee.contactInfo.phone && <p className="flex items-center justify-between gap-1.5 group"><span className="flex items-center gap-1.5"><Phone className="h-4 w-4 text-primary/70"/>{committee.contactInfo.phone}</span> <EditFieldButton fieldPath="contactInfo.phone" onClick={openSuggestEditModal}/></p>}
                    {committee.contactInfo.website && <p className="flex items-center justify-between gap-1.5 group"><span className="flex items-center gap-1.5"><Globe className="h-4 w-4 text-primary/70"/><a href={committee.contactInfo.website} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">Official Website</a></span> <EditFieldButton fieldPath="contactInfo.website" onClick={openSuggestEditModal}/></p>}
                </CardContent>
            </Card>
           )}

            {committee.tags && committee.tags.length > 0 && (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="font-headline text-lg flex items-center gap-2">
                            <Tag className="h-5 w-5 text-primary"/> Tags
                        </CardTitle>
                        <EditFieldButton fieldPath="tags" onClick={openSuggestEditModal} tooltip="Edit tags (JSON)"/>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        {committee.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
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
                        {relatedNews.slice(0, 5).map((news: NewsArticleLink) => (
                            <li key={news.id} className="text-sm border-b pb-2 last:border-b-0">
                            <a href={news.url || `/news/${news.slug || news.id}`} target={news.url && news.isAggregated ? "_blank" : "_self"} rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
                                {news.title}
                            </a>
                            <p className="text-xs text-muted-foreground">{news.sourceName} - {format(new Date(news.publicationDate), 'MM/dd/yyyy')}</p>
                            {news.summary && <p className="text-xs text-foreground/80 mt-1 line-clamp-2">{news.summary}</p>}
                            </li>
                        ))}
                        {relatedNews.length > 5 && <Link href={`/news?committeeId=${committee.id}`} className="text-xs text-primary hover:underline mt-2 block">View all related news...</Link>}
                        </ul>
                    </CardContent>
                </Card>
            )}
            
           {!activityTimelineItems.length && !committee.activityTimeline && (
             <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="font-headline text-xl flex items-center gap-2"><Activity className="text-primary"/>Activity Timeline</CardTitle>
                    <EditFieldButton fieldPath="activityTimeline" onClick={openSuggestEditModal} tooltip="Edit activity timeline (JSON)"/>
                </CardHeader>
                <CardContent>
                   <p className="text-muted-foreground text-sm">(Detailed committee activity timeline will be available in future updates.)</p>
                </CardContent>
            </Card>
           )}

          <Button
            onClick={handleFollowToggle}
            className="w-full"
            variant={isFollowingCommittee ? "outline" : "default"}
          >
            {isFollowingCommittee ? <CheckCircle className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
            {isFollowingCommittee ? `Following Committee` : `Follow Committee`}
          </Button>

        </div>
      </div>
    </div>
  );
}

export default CommitteeDetailPage;
