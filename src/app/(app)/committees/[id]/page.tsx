
"use client";

import React from 'react';
import Link from 'next/link';
import { getCommitteeById, getPoliticianById, getBillById, getNewsByCommitteeId } from '@/lib/mock-data';
import { PageHeader } from '@/components/common/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Landmark, Building, CalendarDays, FileText, ExternalLink, Mail, Phone, Globe, ListChecks, Newspaper, MessageSquare, Activity } from 'lucide-react';
import { format } from 'date-fns';
import type { Committee, CommitteeMemberLink, CommitteeMeeting, CommitteeReport, BillReferredToCommittee, NewsArticleLink, CommitteeActivityEvent } from '@/types/gov';
import { TimelineDisplay, formatCommitteeActivityForTimeline } from '@/components/common/timeline-display';

function CommitteeDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = React.use(paramsPromise);
  const committee = getCommitteeById(params.id);
  const relatedNews = committee ? getNewsByCommitteeId(committee.id) : [];
  const activityTimelineItems = committee?.activityTimeline ? formatCommitteeActivityForTimeline(committee.activityTimeline) : [];


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

  const chairperson = committee.members?.find(m => m.role === 'Chairperson');

  return (
    <div>
      <PageHeader
        title={committee.name}
        description={
          <div className="flex flex-wrap gap-2 items-center mt-1 text-sm">
            <Badge variant="secondary">{committee.committeeType}</Badge>
            {committee.house && <Badge variant="outline">{committee.house}</Badge>}
            {committee.isActive !== undefined && (
                <Badge variant={committee.isActive ? 'default' : 'destructive'} className={committee.isActive ? 'bg-green-500 text-white': ''}>
                    {committee.isActive ? 'Active' : 'Inactive'}
                </Badge>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {committee.mandate && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2"><FileText className="text-primary"/> Mandate & Terms of Reference</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 whitespace-pre-line">{committee.mandate}</p>
              </CardContent>
            </Card>
          )}

          {committee.billsReferred && committee.billsReferred.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2"><ListChecks className="text-primary"/> Bills Referred / Under Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {committee.billsReferred.map((billRef, idx) => {
                  const bill = getBillById(billRef.billId);
                  return (
                    <div key={idx} className="p-3 border rounded-md bg-muted/30">
                      <Link href={`/bills/${bill?.slug || billRef.billId}`} className="font-semibold text-primary hover:underline">
                        {billRef.billName} {billRef.billNumber && `(${billRef.billNumber})`}
                      </Link>
                      <p className="text-xs text-muted-foreground">Referred: {format(new Date(billRef.referralDate), 'MMMM dd, yyyy')}</p>
                      {billRef.status && <p className="text-xs">Committee Status: <Badge variant="outline" className="text-xs">{billRef.status}</Badge></p>}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
          
          {committee.reports && committee.reports.length > 0 && (
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-xl flex items-center gap-2"><FileText className="text-primary"/> Published Reports</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {committee.reports.map((report, idx) => (
                        <div key={report.id || idx} className="text-sm border-b pb-2 last:border-b-0">
                            <a href={report.reportUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline flex items-center gap-1">
                                {report.title} <ExternalLink className="h-3 w-3 shrink-0"/>
                            </a>
                            <p className="text-xs text-muted-foreground">Published: {format(new Date(report.publicationDate), 'MMMM dd, yyyy')}{report.reportType && ` (${report.reportType})`}</p>
                            {report.summary && <p className="text-xs text-foreground/80 mt-1 line-clamp-2">{report.summary}</p>}
                        </div>
                    ))}
                </CardContent>
            </Card>
          )}

          {committee.meetings && committee.meetings.length > 0 && (
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-xl flex items-center gap-2"><CalendarDays className="text-primary"/> Recent Meetings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {committee.meetings.slice(0,5).map((meeting, idx) => ( // Show latest 5
                        <div key={meeting.id || idx} className="text-sm border-b pb-2 last:border-b-0">
                            <p className="font-semibold">{meeting.title || `Meeting on ${format(new Date(meeting.date), 'MMMM dd, yyyy')}`}</p>
                            <p className="text-xs text-muted-foreground">Date: {format(new Date(meeting.date), 'MMMM dd, yyyy')}</p>
                            {meeting.summary && <p className="text-xs text-foreground/80 mt-1 line-clamp-2">{meeting.summary}</p>}
                            <div className="flex gap-2 mt-1.5">
                                {meeting.agendaUrl && <Button variant="link" size="sm" asChild className="p-0 h-auto text-xs"><a href={meeting.agendaUrl} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-3 w-3 mr-1"/>View Agenda</a></Button>}
                                {meeting.minutesUrl && <Button variant="link" size="sm" asChild className="p-0 h-auto text-xs"><a href={meeting.minutesUrl} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-3 w-3 mr-1"/>View Minutes</a></Button>}
                            </div>
                        </div>
                    ))}
                    {committee.meetings.length > 5 && <p className="text-xs text-muted-foreground mt-2">... and more meetings.</p>}
                </CardContent>
            </Card>
          )}

          {activityTimelineItems.length > 0 && (
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-xl flex items-center gap-2"><Activity className="text-primary"/>Activity Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                   <TimelineDisplay items={activityTimelineItems} />
                </CardContent>
            </Card>
           )}
        </div>

        <div className="lg:col-span-1 space-y-6">
           {committee.members && committee.members.length > 0 && (
            <Card>
                <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2"><Users className="text-primary"/> Members</CardTitle>
                {chairperson && <CardDescription>Chairperson: <Link href={`/politicians/${chairperson.politicianId}`} className="text-primary hover:underline">{chairperson.politicianName}</Link></CardDescription>}
                </CardHeader>
                <CardContent>
                <ul className="space-y-2">
                    {committee.members.map((member, idx) => (
                    <li key={idx} className="text-sm">
                        <Link href={`/politicians/${member.politicianId}`} className="text-primary hover:underline font-semibold">
                        {member.politicianName}
                        </Link>
                        <span className="text-xs text-muted-foreground"> ({member.role})</span>
                    </li>
                    ))}
                </ul>
                </CardContent>
            </Card>
           )}

           {committee.contactInfo && (
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-xl flex items-center gap-2"><MessageSquare className="text-primary"/>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1.5 text-sm">
                    {committee.contactInfo.officeAddress && <p className="flex items-start gap-1.5"><Landmark className="h-4 w-4 text-primary/70 mt-0.5 shrink-0"/> {committee.contactInfo.officeAddress}</p>}
                    {committee.contactInfo.email && <p className="flex items-center gap-1.5"><Mail className="h-4 w-4 text-primary/70"/><a href={`mailto:${committee.contactInfo.email}`} className="hover:underline">{committee.contactInfo.email}</a></p>}
                    {committee.contactInfo.phone && <p className="flex items-center gap-1.5"><Phone className="h-4 w-4 text-primary/70"/>{committee.contactInfo.phone}</p>}
                    {committee.contactInfo.website && <p className="flex items-center gap-1.5"><Globe className="h-4 w-4 text-primary/70"/><a href={committee.contactInfo.website} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">Official Website</a></p>}
                </CardContent>
            </Card>
           )}

            {committee.tags && committee.tags.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-lg flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary"/> Tags
                        </CardTitle>
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
            
           {!activityTimelineItems.length && ( // Only show placeholder if no timeline data
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-xl flex items-center gap-2"><Activity className="text-primary"/>Activity Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                   <p className="text-muted-foreground text-sm">(Detailed committee activity timeline will be available in future updates.)</p>
                </CardContent>
            </Card>
           )}

        </div>
      </div>
    </div>
  );
}

export default CommitteeDetailPage;
