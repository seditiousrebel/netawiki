import Image from 'next/image';
import { getPoliticianById, getPromisesByPolitician, mockParties } from '@/lib/mock-data';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, Globe, Edit, Users, Tag, CalendarDays, Briefcase, Landmark, MapPin } from 'lucide-react';
import { TimelineDisplay, formatPoliticalJourneyForTimeline } from '@/components/common/timeline-display';
import Link from 'next/link';
import type { PromiseItem } from '@/types/gov';

export default function PoliticianProfilePage({ params }: { params: { id: string } }) {
  const politician = getPoliticianById(params.id);
  
  if (!politician) {
    return <p>Politician not found.</p>;
  }

  const promises = getPromisesByPolitician(params.id);
  const party = politician.partyId ? mockParties.find(p => p.id === politician.partyId) : null;

  return (
    <div>
      <PageHeader
        title={politician.name}
        description={politician.positions[0]?.title || 'Public Figure'}
        actions={
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" /> Suggest Edit
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-0">
              <Image
                src={politician.photoUrl}
                alt={politician.name}
                width={400}
                height={400}
                className="w-full h-auto object-cover rounded-t-lg"
                data-ai-hint={politician.dataAiHint as string || "politician portrait"}
              />
              <div className="p-6">
                <h2 className="text-2xl font-headline font-semibold mb-1">{politician.name}</h2>
                {party && (
                  <Link href={`/parties/${party.id}`} className="text-primary hover:underline flex items-center gap-1 mb-2">
                    <Landmark className="h-4 w-4" /> {party.name}
                  </Link>
                )}
                 {politician.district && <p className="text-sm text-muted-foreground flex items-center gap-1 mb-1"><MapPin className="h-4 w-4" /> {politician.district}</p>}
                {politician.dateOfBirth && <p className="text-sm text-muted-foreground flex items-center gap-1"><CalendarDays className="h-4 w-4" /> Born: {new Date(politician.dateOfBirth).toLocaleDateString()}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2"><Briefcase className="text-primary"/> Positions Held</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {politician.positions.map((pos, idx) => (
                  <li key={idx} className="text-sm">
                    <span className="font-semibold">{pos.title}</span>
                    <br />
                    <span className="text-muted-foreground">
                      {new Date(pos.startDate).toLocaleDateString()} - {pos.endDate ? new Date(pos.endDate).toLocaleDateString() : 'Present'}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {politician.contactInfo.email && (
                <p className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-primary" />
                  <a href={`mailto:${politician.contactInfo.email}`} className="hover:underline">{politician.contactInfo.email}</a>
                </p>
              )}
              {politician.contactInfo.phone && (
                <p className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-primary" /> {politician.contactInfo.phone}
                </p>
              )}
              {politician.contactInfo.website && (
                <p className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-primary" />
                  <a href={politician.contactInfo.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    Official Website
                  </a>
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
           {politician.bio && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl">Biography</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 whitespace-pre-line">{politician.bio}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">Political Journey</CardTitle>
            </CardHeader>
            <CardContent>
              <TimelineDisplay items={formatPoliticalJourneyForTimeline(politician.politicalJourney)} />
            </CardContent>
          </Card>

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
           <Button className="w-full mt-4 bg-accent hover:bg-accent/90 text-accent-foreground">
            <Users className="mr-2 h-4 w-4" /> Follow {politician.name}
          </Button>
        </div>
      </div>
    </div>
  );
}
