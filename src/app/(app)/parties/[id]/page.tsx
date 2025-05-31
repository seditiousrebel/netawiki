
"use client";

import Image from 'next/image';
import { getPartyById, mockPoliticians, getPartyNameById, getPromisesByPartyId, getControversiesByPartyId } from '@/lib/mock-data';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge }
from '@/components/ui/badge';
import { Mail, Phone, Globe, Edit, Users, CalendarDays, Landmark, Info, Tag, Building, CheckCircle, XCircle, Scale, Link as LinkIcon, FlagIcon, Palette, Group, Milestone, ExternalLink, Briefcase, UserCheck, ListChecks, ClipboardList, History, Award, UserPlus, Handshake, GitMerge, GitPullRequest, ShieldAlert, ClipboardCheck, Megaphone } from 'lucide-react';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect } from 'react';
import type { PromiseItem, LeadershipEvent, Party, PartyAlliance, Controversy, PartySplitMergerEvent, PartyStance } from '@/types/gov';
import { TimelineDisplay } from '@/components/common/timeline-display';

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
       description += ' - Present'; // Assume present if endDate is missing
    }
    if (event.politicianId) {
      // Link to politician if ID exists, not implemented here for brevity but would be in a real app
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

  const [formattedFoundedDate, setFormattedFoundedDate] = useState<string | null>(null);
  const [formattedDissolvedDate, setFormattedDissolvedDate] = useState<string | null>(null);
  const [leadershipTimelineItems, setLeadershipTimelineItems] = useState<TimelineItem[]>([]);
  const [splitMergerTimelineItems, setSplitMergerTimelineItems] = useState<TimelineItem[]>([]);
  const [isFollowingParty, setIsFollowingParty] = useState(false);


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


  const handleSuggestEdit = () => {
    toast({
      title: "Suggest Edit Feature",
      description: "This functionality is under development. Approved suggestions will update the content. You can see mock suggestions being managed on the /admin/suggestions page.",
      duration: 6000,
    });
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
                            width={60} 
                            height={40}
                            className="object-cover border rounded-md"
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
              <CardTitle className="font-headline text-xl flex items-center gap-2"><Users className="text-primary"/> Current Leadership</CardTitle>
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
                <CardTitle className="font-headline text-xl flex items-center gap-2"><Milestone className="text-primary"/> Ideology &amp; Platform</CardTitle>
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
                    <CardTitle className="font-headline text-xl flex items-center gap-2"><LinkIcon className="text-primary"/> Affiliations &amp; Structure</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    {party.parentPartyName && (
                        <p className="flex items-center gap-1"><GitMerge className="h-4 w-4 text-muted-foreground" /> <span className="font-semibold">Parent Party:</span> {party.parentPartyName}
                        </p>
                    )}
                    {party.splinterPartyNames && party.splinterPartyNames.length > 0 && (
                         <p className="flex items-center gap-1"><GitPullRequest className="h-4 w-4 text-muted-foreground" /> <span className="font-semibold">Splinter Parties:</span> {party.splinterPartyNames.join(', ')}
                         </p>
                    )}
                    {party.internationalAffiliations && party.internationalAffiliations.length > 0 && (
                        <p className="flex items-center gap-1"><Globe className="h-4 w-4 text-muted-foreground" /> <span className="font-semibold">International Affiliations:</span> {party.internationalAffiliations.join(', ')}</p>
                    )}
                </CardContent>
            </Card>
          )}
          
          {party.leadershipHistory && party.leadershipHistory.length > 0 && (
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-xl flex items-center gap-2"><History className="text-primary"/> Leadership History</CardTitle>
                </CardHeader>
                <CardContent>
                    <TimelineDisplay items={leadershipTimelineItems} />
                </CardContent>
            </Card>
          )}

          {party.splitMergerHistory && party.splitMergerHistory.length > 0 && (
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-xl flex items-center gap-2"><GitMerge className="text-primary"/> Party Evolution</CardTitle>
                </CardHeader>
                <CardContent>
                    <TimelineDisplay items={splitMergerTimelineItems} />
                </CardContent>
            </Card>
          )}

          {party.alliances && party.alliances.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2"><Handshake className="text-primary"/> Political Alliances</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {party.alliances.map((alliance, idx) => (
                    <li key={idx} className="text-sm border-b pb-3 last:border-b-0">
                      <h4 className="font-semibold text-md">{alliance.name} 
                        {alliance.status && (
                          <Badge variant={alliance.status === 'Active' ? 'default' : 'secondary'} className={`ml-2 text-xs ${alliance.status === 'Active' ? 'bg-green-500 text-white' : ''}`}>
                            {alliance.status}
                          </Badge>
                        )}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {new Date(alliance.startDate).toLocaleDateString()} - {alliance.endDate && alliance.endDate !== 'Ongoing' ? new Date(alliance.endDate).toLocaleDateString() : 'Ongoing'}
                      </p>
                      {alliance.purpose && <p className="text-foreground/80 mt-1">{alliance.purpose}</p>}
                      {alliance.partnerPartyNames && alliance.partnerPartyNames.length > 0 && (
                        <p className="text-xs mt-1">
                          <span className="font-medium">Partners:</span> {alliance.partnerPartyNames.join(', ')}
                           {/* In a real app, you might try to link these names if IDs are available */}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          
          {party.stancesOnIssues && party.stancesOnIssues.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2"><Megaphone className="text-primary"/> Stances on Key Issues</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {party.stancesOnIssues.map((stance, idx) => (
                  <div key={idx} className="text-sm border-b pb-3 last:border-b-0">
                    <h4 className="font-semibold">
                      {stance.isBill ? (
                        <Link href={`/bills/${stance.issueId}`} className="text-primary hover:underline">
                          {stance.issueTitle}
                        </Link>
                      ) : (
                        stance.issueTitle
                      )}
                    </h4>
                    <p>
                      Stance: <Badge variant={stance.stance === 'Supports' ? 'default' : stance.stance === 'Opposes' ? 'destructive' : 'secondary'}
                                   className={stance.stance === 'Supports' ? 'bg-green-500 text-white' : stance.stance === 'Opposes' ? 'bg-red-500 text-white' : ''}>
                                   {stance.stance}
                               </Badge>
                      {stance.dateOfStance && <span className="text-xs text-muted-foreground ml-2">({new Date(stance.dateOfStance).toLocaleDateString()})</span>}
                    </p>
                    {stance.statement && <p className="text-foreground/80 mt-1 italic">"{stance.statement}"</p>}
                    {stance.statementUrl && (
                      <a href={stance.statementUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs flex items-center gap-1 mt-1">
                        View Official Statement <ExternalLink className="h-3 w-3"/>
                      </a>
                    )}
                  </div>
                ))}
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


          <Button 
            onClick={handleFollowPartyToggle} 
            className="w-full mt-4"
            variant={isFollowingParty ? "outline" : "default"}
          >
            {isFollowingParty ? <CheckCircle className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
            {isFollowingParty ? `Following ${party.name}` : `Follow ${party.name}`}
          </Button>
        </div>
      </div>
    </div>
  );
}


    