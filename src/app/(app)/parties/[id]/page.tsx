
"use client";

import Image from 'next/image';
import { getPartyById, mockPoliticians } from '@/lib/mock-data';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, Globe, Edit, Users, CalendarDays, Landmark, Info, Tag } from 'lucide-react';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import React from 'react'; // Import React for React.use

export default function PartyProfilePage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = React.use(paramsPromise); // Unwrap the params promise
  const party = getPartyById(params.id);
  const { toast } = useToast();

  if (!party) {
    return <p>Party not found.</p>;
  }
  
  const partyMembers = mockPoliticians.filter(p => p.partyId === party.id);

  const handleSuggestEdit = () => {
    toast({
      title: "Suggest Edit Feature",
      description: "This functionality is under development. Approved suggestions will update the content. You can see mock suggestions being managed on the /admin/suggestions page.",
      duration: 6000,
    });
  };

  return (
    <div>
      <PageHeader
        title={party.name}
        description="Detailed information about the political party."
        actions={
          <Button variant="outline" onClick={handleSuggestEdit}>
            <Edit className="mr-2 h-4 w-4" /> Suggest Edit
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-0">
              <div className="bg-muted p-4 flex justify-center items-center rounded-t-lg">
                <Image
                  src={party.logoUrl}
                  alt={`${party.name} Logo`}
                  width={150}
                  height={150}
                  className="object-contain"
                  data-ai-hint={party.dataAiHint as string || "party logo"}
                />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-headline font-semibold mb-2">{party.name}</h2>
                {party.foundedDate && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                        <CalendarDays className="h-4 w-4" /> Founded: {new Date(party.foundedDate).toLocaleDateString()}
                    </p>
                )}
                {party.electionSymbolUrl && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Election Symbol</h3>
                    <Image
                      src={party.electionSymbolUrl}
                      alt={`${party.name} Election Symbol`}
                      width={60}
                      height={60}
                      className="object-contain border rounded-md p-1"
                       data-ai-hint={party.dataAiHint as string || "election symbol"}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2"><Users className="text-primary"/> Leadership</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {party.leadership.map((leader, idx) => (
                  <li key={idx} className="text-sm">
                    <span className="font-semibold">{leader.name}</span> - <span className="text-muted-foreground">{leader.role}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          {party.ideology && party.ideology.length > 0 && (
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-xl flex items-center gap-2"><Tag className="text-primary"/> Ideology</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {party.ideology.map(ideo => (
                            <span key={ideo} className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-full">{ideo}</span>
                        ))}
                    </div>
                </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {party.contactInfo.email && (
                <p className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-primary" />
                  <a href={`mailto:${party.contactInfo.email}`} className="hover:underline">{party.contactInfo.email}</a>
                </p>
              )}
              {party.contactInfo.phone && (
                <p className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-primary" /> {party.contactInfo.phone}
                </p>
              )}
              {party.contactInfo.website && (
                <p className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-primary" />
                  <a href={party.contactInfo.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    Official Website
                  </a>
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2"><Info className="text-primary"/> Party History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 whitespace-pre-line">{party.history}</p>
            </CardContent>
          </Card>
          
          {partyMembers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl">Notable Members</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {partyMembers.slice(0, 5).map(member => ( // Display first 5 members
                    <li key={member.id}>
                      <Link href={`/politicians/${member.id}`} className="text-primary hover:underline">
                        {member.name}
                      </Link>
                       {member.positions[0] && <span className="text-sm text-muted-foreground"> - {member.positions[0].title}</span>}
                    </li>
                  ))}
                </ul>
                {partyMembers.length > 5 && (
                    <Link href={`/politicians?party=${party.id}`} className="mt-2 inline-block">
                        <Button variant="link" className="p-0 h-auto text-primary">View all members</Button>
                    </Link>
                )}
              </CardContent>
            </Card>
          )}

          <Button className="w-full mt-4 bg-accent hover:bg-accent/90 text-accent-foreground">
            <Landmark className="mr-2 h-4 w-4" /> Follow {party.name}
          </Button>
        </div>
      </div>
    </div>
  );
}
