
"use client";

import Image from 'next/image';
import { getPartyById, mockPoliticians, getPartyNameById } from '@/lib/mock-data';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, Globe, Edit, Users, CalendarDays, Landmark, Info, Tag, Building, CheckCircle, XCircle, Scale, Link as LinkIcon, FlagIcon, Palette, Group, Milestone, ExternalLink, Briefcase, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect } from 'react';

export default function PartyProfilePage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = React.use(paramsPromise);
  const party = getPartyById(params.id);
  const { toast } = useToast();

  const [formattedFoundedDate, setFormattedFoundedDate] = useState<string | null>(null);
  const [formattedDissolvedDate, setFormattedDissolvedDate] = useState<string | null>(null);

  useEffect(() => {
    if (party?.foundedDate) {
      setFormattedFoundedDate(new Date(party.foundedDate).toLocaleDateString());
    }
    if (party?.dissolvedDate) {
      setFormattedDissolvedDate(new Date(party.dissolvedDate).toLocaleDateString());
    }
  }, [party?.foundedDate, party?.dissolvedDate]);

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
        title={party.name + (party.abbreviation ? ` (${party.abbreviation})` : '')}
        description={
           <div className="flex flex-wrap gap-2 mt-1 items-center">
            {party.isActive !== undefined && (
              <Badge variant={party.isActive ? 'default' : 'secondary'} className={party.isActive ? 'bg-green-500 text-white' : ''}>
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
              <div className="bg-muted p-4 flex justify-center items-center rounded-t-lg min-h-[180px]">
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
                <h2 className="text-2xl font-headline font-semibold mb-1">{party.name}</h2>
                {party.nepaliName && <p className="text-lg text-muted-foreground -mt-1 mb-1">{party.nepaliName}</p>}
                
                <div className="flex flex-wrap gap-2 items-center">
                    {party.electionSymbolUrl && (
                        <div className="text-center">
                        <h3 className="text-xs font-medium text-muted-foreground mb-0.5">Symbol</h3>
                        <Image
                            src={party.electionSymbolUrl}
                            alt={`${party.name} Election Symbol`}
                            width={40}
                            height={40}
                            className="object-contain border rounded-md p-0.5"
                            data-ai-hint={party.dataAiHint || "election symbol"}
                        />
                        </div>
                    )}
                    {party.flagUrl && (
                        <div className="text-center">
                        <h3 className="text-xs font-medium text-muted-foreground mb-0.5">Flag</h3>
                        <Image
                            src={party.flagUrl}
                            alt={`${party.name} Flag`}
                            width={60} // Flags are often wider
                            height={40}
                            className="object-cover border rounded-md" // Use object-cover for flags
                             data-ai-hint={party.dataAiHint || "party flag"}
                        />
                        </div>
                    )}
                    {party.partyColorHex && (
                        <div className="text-center">
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
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2"><Users className="text-primary"/> Leadership</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {party.leadership.map((leader, idx) => (
                  <li key={idx} className="text-sm">
                    {leader.politicianId ? (
                       <Link href={`/politicians/${leader.politicianId}`} className="text-primary hover:underline font-semibold">
                         {leader.name}
                       </Link>
                    ) : (
                       <span className="font-semibold">{leader.name}</span>
                    )}
                     - <span className="text-muted-foreground">{leader.role}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          {party.ideology && party.ideology.length > 0 && (
            <Card>
                <CardHeader>
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
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2"><Building className="text-primary"/> Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {party.headquartersAddress && (
                <p className="flex items-start gap-2 text-sm">
                  <Landmark className="h-4 w-4 text-primary mt-0.5 shrink-0" /> {party.headquartersAddress}
                </p>
              )}
              {party.contactInfo.email && (
                <p className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-primary" />
                  <a href={`mailto:${party.contactInfo.email}`} className="hover:underline truncate">{party.contactInfo.email}</a>
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
                  <a href={party.contactInfo.website} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                    Official Website
                  </a>
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
          {party.aboutParty && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2"><Info className="text-primary"/> About the Party</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 whitespace-pre-line">{party.aboutParty}</p>
              </CardContent>
            </Card>
          )}
           {(party.detailedIdeologyDescription || party.partyManifestoUrl) && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2"><Milestone className="text-primary"/> Ideology & Platform</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {party.detailedIdeologyDescription && <p className="text-foreground/80 whitespace-pre-line">{party.detailedIdeologyDescription}</p>}
                {party.partyManifestoUrl && (
                  <a href={party.partyManifestoUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="link" className="p-0 h-auto text-primary items-center">
                      Read Full Manifesto <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                  </a>
                )}
              </CardContent>
            </Card>
           )}

          {(party.parentPartyName || (party.splinterPartyNames && party.splinterPartyNames.length > 0) || (party.internationalAffiliations && party.internationalAffiliations.length > 0)) && (
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-xl flex items-center gap-2"><LinkIcon className="text-primary"/> Affiliations & Structure</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    {party.parentPartyName && (
                        <p><span className="font-semibold">Parent Party:</span> {party.parentPartyName}
                        {/* Future: Could link to parentPartyId if that page exists */}
                        </p>
                    )}
                    {party.splinterPartyNames && party.splinterPartyNames.length > 0 && (
                         <p><span className="font-semibold">Splinter Parties:</span> {party.splinterPartyNames.join(', ')}
                         {/* Future: Could link to splinterPartyIds if those pages exist */}
                         </p>
                    )}
                    {party.internationalAffiliations && party.internationalAffiliations.length > 0 && (
                        <p><span className="font-semibold">International Affiliations:</span> {party.internationalAffiliations.join(', ')}</p>
                    )}
                </CardContent>
            </Card>
          )}

          {party.wings && party.wings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2"><Group className="text-primary"/> Party Wings</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {party.wings.map((wing, idx) => (
                    <li key={idx} className="text-sm border-b pb-2 last:border-b-0">
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
                    // TODO: Link to a filtered politician list or a dedicated party members page
                    <Button variant="link" className="p-0 h-auto text-primary mt-2">View all members</Button>
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
