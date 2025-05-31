import { getBillById } from '@/lib/mock-data';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Users, CalendarDays, CheckSquare, XSquare, ExternalLink, Landmark, FileText, ListCollapse } from 'lucide-react';
import Link from 'next/link';
import { TimelineDisplay, formatAmendmentsForTimeline } from '@/components/common/timeline-display';
import type { VoteRecord } from '@/types/gov';

export default function BillDetailsPage({ params }: { params: { id: string } }) {
  const bill = getBillById(params.id);

  if (!bill) {
    return <p>Bill not found.</p>;
  }

  return (
    <div>
      <PageHeader
        title={`${bill.title} (${bill.billNumber})`}
        description={`Introduced on ${new Date(bill.introducedDate).toLocaleDateString()}`}
        actions={
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" /> Suggest Edit
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2"><FileText className="text-primary"/> Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 whitespace-pre-line">{bill.summary}</p>
              {bill.fullTextUrl && (
                 <a href={bill.fullTextUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block">
                  <Button variant="link" className="p-0 h-auto text-primary items-center">
                    Read Full Text <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
               </a>
              )}
            </CardContent>
          </Card>

          {bill.amendmentHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2"><ListCollapse className="text-primary"/> Amendment History</CardTitle>
              </CardHeader>
              <CardContent>
                <TimelineDisplay items={formatAmendmentsForTimeline(bill.amendmentHistory)} />
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
              <CardTitle className="font-headline text-xl">Bill Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="flex items-center gap-2">
                <Badge variant={bill.status === 'Became Law' ? 'default' : 'secondary'} className={bill.status === 'Became Law' ? 'bg-green-500 text-white' : ''}>
                    {bill.status}
                </Badge>
              </p>
              <p className="text-sm text-muted-foreground">Introduced: {new Date(bill.introducedDate).toLocaleDateString()}</p>
              {bill.lastActionDate && <p className="text-sm text-muted-foreground">Last Action: {new Date(bill.lastActionDate).toLocaleDateString()}</p>}
              {bill.lastActionDescription && <p className="text-sm text-muted-foreground">{bill.lastActionDescription}</p>}
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
        </div>
      </div>
    </div>
  );
}
