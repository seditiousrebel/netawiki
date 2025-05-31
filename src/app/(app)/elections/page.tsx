
"use client";

import Link from 'next/link';
import { PageHeader } from '@/components/common/page-header';
import { mockElections } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, CalendarDays, VoteIcon, CheckCircle, Clock } from 'lucide-react';
import type { Election, ElectionStatus } from '@/types/gov';
import { format } from 'date-fns';
import { cn } from '@/lib/utils'; // Added missing import

function getElectionStatusBadgeVariant(status: ElectionStatus) {
  switch (status) {
    case 'Concluded':
      return 'bg-green-500 text-white';
    case 'Ongoing':
    case 'Counting':
      return 'bg-blue-500 text-white';
    case 'Scheduled':
    case 'Upcoming':
      return 'bg-yellow-500 text-black';
    case 'Postponed':
    case 'Cancelled':
      return 'bg-red-500 text-white';
    default:
      return 'bg-secondary text-secondary-foreground';
  }
}

function getElectionStatusIcon(status: ElectionStatus) {
  switch (status) {
    case 'Concluded':
      return <CheckCircle className="mr-1.5 h-4 w-4" />;
    case 'Ongoing':
    case 'Counting':
    case 'Scheduled':
    case 'Upcoming':
      return <Clock className="mr-1.5 h-4 w-4" />;
    default:
      return <VoteIcon className="mr-1.5 h-4 w-4" />;
  }
}


export default function ElectionsPage() {
  const elections = mockElections;

  return (
    <div>
      <PageHeader
        title="Elections Hub"
        description="Track upcoming, ongoing, and past elections, results, and candidate information."
      />

      {elections.length > 0 ? (
        <div className="space-y-6">
          {elections.map((election: Election) => (
            <Card key={election.id} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <CardTitle className="font-headline text-xl mb-1">
                      <Link href={`/elections/${election.slug || election.id}`} className="text-primary hover:underline">
                        {election.name}
                      </Link>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1.5 text-sm">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      {format(new Date(election.date), 'MMMM dd, yyyy')}
                      <span className="mx-1 text-muted-foreground">|</span>
                      <Badge variant="outline">{election.electionType}</Badge>
                    </CardDescription>
                  </div>
                  <Badge className={cn("text-xs px-2.5 py-1", getElectionStatusBadgeVariant(election.status))}>
                     {getElectionStatusIcon(election.status)}
                    {election.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 mb-3 line-clamp-2">{election.description}</p>
                <div className="text-xs text-muted-foreground space-x-3">
                    {election.country && <span>Country: {election.country}</span>}
                    {election.province && <span>Province: {election.province}</span>}
                    {election.districts && election.districts.length > 0 && <span>District(s): {election.districts.join(', ')}</span>}
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/elections/${election.slug || election.id}`} className="ml-auto">
                  <Button variant="outline" size="sm">
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
            <VoteIcon className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium">No elections found.</p>
            <p className="text-sm text-muted-foreground">Check back later for updates on upcoming elections.</p>
        </div>
      )}
    </div>
  );
}
