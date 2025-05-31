
"use client";

import React from 'react';
import { getBillById } from '@/lib/mock-data';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Users, CalendarDays, CheckSquare, XSquare, ExternalLink, Landmark, FileText, ListCollapse, BookOpen, Info, Tag, Layers, Building, Clock, GitBranch, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { TimelineDisplay, formatBillTimelineEventsForTimeline } from '@/components/common/timeline-display';
import type { VoteRecord, BillTimelineEvent } from '@/types/gov';
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';

export default function BillDetailsPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = React.use(paramsPromise);
  const bill = getBillById(params.id);
  const { toast } = useToast();

  if (!bill) {
    return <p>Bill not found.</p>;
  }

  const handleSuggestEdit = () => {
    toast({
      title: "Suggest Edit Feature",
      description: "This functionality is under development. Approved suggestions will update the content. You can see mock suggestions being managed on the /admin/suggestions page.",
      duration: 6000,
    });
  };

  const timelineItems = bill.timelineEvents ? formatBillTimelineEventsForTimeline(bill.timelineEvents) : [];

  return (
    <div>
      <PageHeader
        title={`${bill.title} (${bill.billNumber})`}
        description={
            <div className="flex flex-wrap gap-2 items-center mt-1">
                <Badge variant={bill.status === 'Became Law' ? 'default' : 'secondary'} className={bill.status === 'Became Law' ? 'bg-green-500 text-white' : ''}>
                    {bill.status}
                </Badge>
                {bill.billType && <Badge variant="outline">{bill.billType}</Badge>}
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
              <CardTitle className="font-headline text-xl flex items-center gap-2"><FileText className="text-primary"/> Summary & Purpose</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 whitespace-pre-line">{bill.summary}</p>
              {bill.purpose && (
                <div className="mt-4 pt-4 border-t">
                  <h3 className="font-semibold text-md mb-1">Purpose:</h3>
                  <p className="text-sm text-muted-foreground italic">{bill.purpose}</p>
                </div>
              )}
              {bill.fullTextUrl && (
                 <a href={bill.fullTextUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block">
                  <Button variant="link" className="p-0 h-auto text-primary items-center">
                    Read Full Text <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
               </a>
              )}
            </CardContent>
          </Card>

          {timelineItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2"><ListCollapse className="text-primary"/> Bill Journey</CardTitle>
              </CardHeader>
              <CardContent>
                <TimelineDisplay items={timelineItems} />
              </CardContent>
            </Card>
          )}

          {bill.votingResults && (bill.votingResults.house || bill.votingResults.senate) && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl">Voting Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {bill.votingResults.house && (
                  <div>
                    <h3 className="font-semibold text-md mb-1">House Vote ({new Date(bill.votingResults.house.date).toLocaleDateString()}): 
                      <Badge variant={bill.votingResults.house.passed ? "default" : "destructive"} className="ml-2">
                        {bill.votingResults.house.passed ? 'Passed' : 'Failed'}
                      </Badge>
                    </h3>
                    <ul className="text-sm list-disc list-inside pl-2">
                      {bill.votingResults.house.records.slice(0,3).map((vote: VoteRecord, idx: number) => (
                        <li key={`house-vote-${idx}`}>
                           <Link href={`/politicians/${vote.politicianId}`} className="text-primary hover:underline">{vote.politicianName}</Link>: {vote.vote}
                        </li>
                      ))}
                      {bill.votingResults.house.records.length > 3 && <li className="text-muted-foreground">...and more</li>}
                    </ul>
                  </div>
                )}
                 {bill.votingResults.senate && (
                  <div>
                    <h3 className="font-semibold text-md mb-1">Senate Vote ({new Date(bill.votingResults.senate.date).toLocaleDateString()}):
                      <Badge variant={bill.votingResults.senate.passed ? "default" : "destructive"} className="ml-2">
                        {bill.votingResults.senate.passed ? 'Passed' : 'Failed'}
                      </Badge>
                    </h3>
                     <ul className="text-sm list-disc list-inside pl-2">
                      {bill.votingResults.senate.records.slice(0,3).map((vote: VoteRecord, idx: number) => (
                        <li key={`senate-vote-${idx}`}>
                           <Link href={`/politicians/${vote.politicianId}`} className="text-primary hover:underline">{vote.politicianName}</Link>: {vote.vote}
                        </li>
                      ))}
                      {bill.votingResults.senate.records.length > 3 && <li className="text-muted-foreground">...and more</li>}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-1 space-y-6">
           <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2"><Info className="text-primary"/> Legislative Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {bill.billType && <p><span className="font-semibold">Type:</span> {bill.billType}</p>}
              {bill.responsibleMinistry && <p><span className="font-semibold">Responsible Ministry:</span> {bill.responsibleMinistry}</p>}
              {bill.houseOfIntroduction && <p><span className="font-semibold">Introduced In:</span> {bill.houseOfIntroduction}</p>}
              {bill.parliamentarySession && <p><span className="font-semibold">Session:</span> {bill.parliamentarySession}</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2"><Clock className="text-primary"/> Key Dates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5 text-sm text-muted-foreground">
              <p><ShieldCheck className="inline-block h-4 w-4 mr-1 text-primary/70" /> Status: 
                 <Badge variant={bill.status === 'Became Law' ? 'default' : 'secondary'} 
                        className={`ml-1 ${bill.status === 'Became Law' ? 'bg-green-500 text-white' : ''}`}>
                    {bill.status}
                </Badge>
              </p>
              <p><CalendarDays className="inline-block h-4 w-4 mr-1 text-primary/70" /> Introduced: {format(new Date(bill.introducedDate), 'MMMM dd, yyyy')}</p>
              {bill.keyDates?.committeeReferral && <p><GitBranch className="inline-block h-4 w-4 mr-1 text-primary/70" /> Committee Referral: {format(new Date(bill.keyDates.committeeReferral), 'MMMM dd, yyyy')}</p>}
              {bill.keyDates?.passedLowerHouse && <p><CheckSquare className="inline-block h-4 w-4 mr-1 text-green-600" /> Passed Lower House: {format(new Date(bill.keyDates.passedLowerHouse), 'MMMM dd, yyyy')}</p>}
              {bill.keyDates?.passedUpperHouse && <p><CheckSquare className="inline-block h-4 w-4 mr-1 text-green-600" /> Passed Upper House: {format(new Date(bill.keyDates.passedUpperHouse), 'MMMM dd, yyyy')}</p>}
              {bill.keyDates?.assent && <p><CheckSquare className="inline-block h-4 w-4 mr-1 text-green-600" /> Assented: {format(new Date(bill.keyDates.assent), 'MMMM dd, yyyy')}</p>}
              {bill.keyDates?.effectiveDate && <p><CheckSquare className="inline-block h-4 w-4 mr-1 text-green-600" /> Effective: {format(new Date(bill.keyDates.effectiveDate), 'MMMM dd, yyyy')}</p>}
              {bill.lastActionDate && <p><CalendarDays className="inline-block h-4 w-4 mr-1 text-primary/70" /> Last Action: {format(new Date(bill.lastActionDate), 'MMMM dd, yyyy')}</p>}
              {bill.lastActionDescription && <p className="text-xs mt-1">{bill.lastActionDescription}</p>}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2"><Users className="text-primary"/> Sponsors</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {bill.sponsors.map(sponsor => (
                  <li key={sponsor.id} className="text-sm">
                    <Link href={`/politicians/${sponsor.id}`} className="text-primary hover:underline">
                      {sponsor.name}
                    </Link>
                    <span className="text-muted-foreground text-xs"> ({sponsor.type})</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          {bill.committees && bill.committees.length > 0 && (
             <Card>
                <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2"><Landmark className="text-primary"/> Committees</CardTitle>
                </CardHeader>
                <CardContent>
                <ul className="space-y-1">
                    {bill.committees.map((committee, idx) => (
                    <li key={idx} className="text-sm text-foreground/80">{committee}</li>
                    ))}
                </ul>
                </CardContent>
            </Card>
          )}

          {bill.impact && (
             <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-xl flex items-center gap-2"><Layers className="text-primary"/> Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/80">{bill.impact}</p>
                </CardContent>
            </Card>
          )}
          
          {bill.tags && bill.tags.length > 0 && (
             <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-xl flex items-center gap-2"><Tag className="text-primary"/> Tags</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                    {bill.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

    