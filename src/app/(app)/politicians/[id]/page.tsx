
"use client";

import Image from 'next/image';
import { getPoliticianById, getPromisesByPolitician, mockParties, getBillsBySponsor, mockBills } from '@/lib/mock-data';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, Globe, Edit, Users, Tag, CalendarDays, Briefcase, Landmark, MapPin, GraduationCap, Twitter, Facebook, Linkedin, Instagram, ScrollText, ExternalLink, Gavel, Star, BarChart3, ListChecks, FileText, ClipboardList, UserPlus, UserCheck, ShieldAlert, Building, Languages, CheckCircle, XCircle, AlertCircle, MessageSquare, Map, CircleHelp, Quote } from 'lucide-react';
import { TimelineDisplay, formatPoliticalJourneyForTimeline } from '@/components/common/timeline-display';
import Link from 'next/link';
import type { PromiseItem, AssetDeclaration, CriminalRecord, CommitteeMembership, Bill, VoteRecord, Politician, StatementQuote } from '@/types/gov';
import { useToast } from "@/hooks/use-toast";
import { useState } from 'react';

interface PoliticianVote extends VoteRecord {
  billId: string;
  billTitle: string;
  billNumber: string;
  chamber: 'House' | 'Senate';
  voteDate: string;
}

export default function PoliticianProfilePage({ params }: { params: { id: string } }) {
  const politician = getPoliticianById(params.id);
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(false);
  
  if (!politician) {
    return <p>Politician not found.</p>;
  }

  const promises = getPromisesByPolitician(params.id);
  const party = politician.partyId ? mockParties.find(p => p.id === politician.partyId) : null;
  const sponsoredBills = getBillsBySponsor(politician.id);

  const politicianVotes: PoliticianVote[] = [];
  mockBills.forEach(bill => {
    if (bill.votingResults?.house?.records) {
      const houseVote = bill.votingResults.house.records.find(record => record.politicianId === politician.id);
      if (houseVote) {
        politicianVotes.push({
          ...houseVote,
          billId: bill.id,
          billTitle: bill.title,
          billNumber: bill.billNumber,
          chamber: 'House',
          voteDate: bill.votingResults.house.date,
        });
      }
    }
    if (bill.votingResults?.senate?.records) {
      const senateVote = bill.votingResults.senate.records.find(record => record.politicianId === politician.id);
      if (senateVote) {
        politicianVotes.push({
          ...senateVote,
          billId: bill.id,
          billTitle: bill.title,
          billNumber: bill.billNumber,
          chamber: 'Senate',
          voteDate: bill.votingResults.senate.date,
        });
      }
    }
  });


  const getCriminalStatusBadgeVariant = (status: CriminalRecord['status']) => {
    switch (status) {
      case 'Convicted':
      case 'Charges Filed':
        return 'destructive';
      case 'Alleged':
      case 'Under Investigation':
        return 'secondary'; 
      case 'Acquitted':
      case 'Dismissed':
        return 'default'; 
      default:
        return 'outline';
    }
  };
  

  const handleSuggestEdit = () => {
    toast({
      title: "Suggest Edit Feature",
      description: "This functionality is under development. Approved suggestions will update the content. You can see mock suggestions being managed on the /admin/suggestions page.",
      duration: 6000,
    });
  };

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    toast({
      title: !isFollowing ? `Following ${politician.name}` : `Unfollowed ${politician.name}`,
      description: !isFollowing ? "You'll now receive updates in your feed." : "You will no longer receive updates.",
      duration: 3000,
    });
  };

  const handleViewControversies = () => {
    toast({
      title: "Controversy Tracking",
      description: "This feature is under development. It will show controversies associated with this politician.",
      duration: 5000,
    });
  };


  return (
    <div>
      <PageHeader
        title={politician.name}
        description={
          <div className="space-y-1">
            <p>{politician.positions[0]?.title || 'Public Figure'}</p>
            {/* Verification status removed from here */}
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
              <Image
                src={politician.photoUrl}
                alt={politician.name}
                width={400}
                height={400}
                className="w-full h-auto object-cover rounded-t-lg"
                data-ai-hint={politician.dataAiHint || "politician portrait"}
              />
              <div className="p-6 space-y-1.5">
                <h2 className="text-2xl font-headline font-semibold mb-1">{politician.name}</h2>
                {politician.nepaliName && <p className="text-lg text-muted-foreground -mt-1 mb-1">{politician.nepaliName}</p>}
                {politician.aliases && politician.aliases.length > 0 && <p className="text-sm text-muted-foreground">Also known as: {politician.aliases.join(', ')}</p>}
                
                {party && (
                  <Link href={`/parties/${party.id}`} className="text-primary hover:underline flex items-center gap-1 text-sm">
                    <Landmark className="h-4 w-4" /> {party.name}
                  </Link>
                )}
                 {politician.constituency && <p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="h-4 w-4" /> {politician.constituency}</p>}
                {politician.dateOfBirth && <p className="text-sm text-muted-foreground flex items-center gap-1"><CalendarDays className="h-4 w-4" /> Born: {new Date(politician.dateOfBirth).toLocaleDateString()}{politician.placeOfBirth?.district && `, ${politician.placeOfBirth.district}`}{politician.placeOfBirth?.address && `, ${politician.placeOfBirth.address}`}</p>}
                {politician.dateOfDeath && <p className="text-sm text-muted-foreground flex items-center gap-1"><CalendarDays className="h-4 w-4" /> Deceased: {new Date(politician.dateOfDeath).toLocaleDateString()}</p>}
                {politician.gender && <p className="text-sm text-muted-foreground">Gender: {politician.gender}</p>}
                {politician.isActiveInPolitics !== undefined && (
                  <p className={`text-sm font-medium ${politician.isActiveInPolitics ? 'text-green-600' : 'text-red-600'}`}>
                    Status: {politician.isActiveInPolitics ? 'Active in Politics' : 'Inactive in Politics'}
                  </p>
                )}
              </div>
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
                  <a href={`mailto:${politician.contactInfo.email}`} className="hover:underline truncate">{politician.contactInfo.email}</a>
                </p>
              )}
              {politician.contactInfo.phone && (
                <p className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-primary" /> {politician.contactInfo.phone} (Personal)
                </p>
              )}
              {politician.contactInfo.officePhone && (
                <p className="flex items-center gap-2 text-sm">
                  <Building className="h-4 w-4 text-primary" /> {politician.contactInfo.officePhone} (Office)
                </p>
              )}
              {politician.contactInfo.permanentAddress && (
                <p className="flex items-start gap-2 text-sm">
                  <Map className="h-4 w-4 text-primary mt-0.5 shrink-0" /> Permanent Address: {politician.contactInfo.permanentAddress}
                </p>
              )}
              {politician.contactInfo.temporaryAddress && (
                <p className="flex items-start gap-2 text-sm">
                  <Map className="h-4 w-4 text-primary mt-0.5 shrink-0" /> Temporary Address: {politician.contactInfo.temporaryAddress}
                </p>
              )}
              {politician.contactInfo.website && (
                <p className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-primary" />
                  <a href={politician.contactInfo.website} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                    Official Website
                  </a>
                </p>
              )}
              {politician.contactInfo.twitter && (
                <p className="flex items-center gap-2 text-sm">
                  <Twitter className="h-4 w-4 text-primary" />
                  <a href={politician.contactInfo.twitter} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                    @{politician.contactInfo.twitter.split('/').pop()}
                  </a>
                </p>
              )}
              {politician.contactInfo.facebook && (
                <p className="flex items-center gap-2 text-sm">
                  <Facebook className="h-4 w-4 text-primary" />
                  <a href={politician.contactInfo.facebook} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                    Facebook Profile
                  </a>
                </p>
              )}
              {politician.contactInfo.linkedin && (
                <p className="flex items-center gap-2 text-sm">
                  <Linkedin className="h-4 w-4 text-primary" />
                  <a href={politician.contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                    LinkedIn Profile
                  </a>
                </p>
              )}
              {politician.contactInfo.instagram && (
                <p className="flex items-center gap-2 text-sm">
                  <Instagram className="h-4 w-4 text-primary" />
                  <a href={politician.contactInfo.instagram} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                    @{politician.contactInfo.instagram.split('/').pop()?.replace(/[/]/g,'')}
                  </a>
                </p>
              )}
            </CardContent>
          </Card>

          {politician.education && politician.education.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary"/> Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {politician.education.map((edu, idx) => (
                    <li key={idx} className="text-sm">
                      <p className="font-semibold">{edu.degree}{edu.field && ` in ${edu.field}`}</p>
                      <p className="text-muted-foreground">{edu.institution}</p>
                      {edu.graduationYear && <p className="text-xs text-muted-foreground">Graduated: {edu.graduationYear}</p>}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

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

          {politician.committeeMemberships && politician.committeeMemberships.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                  <Landmark className="h-5 w-5 text-primary"/> Committee Memberships
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {politician.committeeMemberships.map((mem, idx) => (
                    <li key={idx} className="text-sm">
                      <p className="font-semibold">{mem.committeeName}</p>
                      {mem.role && <p className="text-muted-foreground">{mem.role}</p>}
                      {mem.startDate && (
                        <p className="text-xs text-muted-foreground">
                          {new Date(mem.startDate).toLocaleDateString()} - {mem.endDate && mem.endDate !== 'Present' ? new Date(mem.endDate).toLocaleDateString() : 'Present'}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2 space-y-8">
         {(politician.politicalIdeology && politician.politicalIdeology.length > 0) || (politician.languagesSpoken && politician.languagesSpoken.length > 0) ? (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary"/> Profile Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {politician.politicalIdeology && politician.politicalIdeology.length > 0 && (
                  <div>
                    <h3 className="text-md font-semibold mb-1 flex items-center gap-1"><Tag className="h-4 w-4 text-muted-foreground"/> Political Ideology</h3>
                    <div className="flex flex-wrap gap-2">
                      {politician.politicalIdeology.map(ideo => (
                        <Badge key={ideo} variant="secondary">{ideo}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {politician.languagesSpoken && politician.languagesSpoken.length > 0 && (
                   <div>
                    <h3 className="text-md font-semibold mb-1 flex items-center gap-1"><Languages className="h-4 w-4 text-muted-foreground"/> Languages Spoken</h3>
                    <p className="text-sm text-foreground/80">{politician.languagesSpoken.join(', ')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : null}


          {(politician.overallRating !== undefined || politician.voteScore !== undefined || politician.promiseFulfillmentRate !== undefined || politician.popularityScore !== undefined) && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary"/> Analytics Snapshot
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {politician.overallRating !== undefined && (
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-400" />
                    <span className="font-semibold text-lg">{politician.overallRating.toFixed(1)} / 5.0</span>
                    {politician.userRatingCount !== undefined && (
                      <span className="text-sm text-muted-foreground">(from {politician.userRatingCount} ratings)</span>
                    )}
                  </div>
                )}
                {politician.voteScore !== undefined && (
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" /> 
                    <span className="font-semibold text-lg">{politician.voteScore}%</span>
                    <span className="text-sm text-muted-foreground">Vote Score (Hypothetical)</span>
                  </div>
                )}
                {politician.promiseFulfillmentRate !== undefined && (
                  <div className="flex items-center gap-2">
                    <ListChecks className="h-5 w-5 text-green-500" />
                    <span className="font-semibold text-lg">{politician.promiseFulfillmentRate}%</span>
                    <span className="text-sm text-muted-foreground">Promise Fulfillment</span>
                  </div>
                )}
                {politician.popularityScore !== undefined && (
                  <div className="flex items-center gap-2">
                     <CircleHelp className="h-5 w-5 text-purple-500" /> 
                    <span className="font-semibold text-lg">{politician.popularityScore}</span>
                    <span className="text-sm text-muted-foreground">Popularity Score</span>
                  </div>
                )}
                 <div className="mt-3 pt-3 border-t">
                    <Button variant="link" onClick={handleViewControversies} className="p-0 h-auto text-sm text-muted-foreground hover:text-primary flex items-center gap-1">
                        <ShieldAlert className="h-4 w-4"/> View Associated Controversies
                    </Button>
                 </div>
                 <p className="text-xs text-muted-foreground pt-2 border-t mt-2">
                    Note: Analytics data is for demonstration purposes.
                </p>
              </CardContent>
            </Card>
          )}

          {politician.statementsAndQuotes && politician.statementsAndQuotes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                  <Quote className="h-5 w-5 text-primary"/> Notable Statements & Quotes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {politician.statementsAndQuotes.map((sq: StatementQuote) => (
                  <div key={sq.id} className="border-l-4 border-primary pl-4 py-2 bg-secondary/30 rounded-r-md">
                    <blockquote className="italic text-foreground/90">
                      "{sq.quoteText}"
                    </blockquote>
                    <footer className="mt-2 text-xs text-muted-foreground">
                      &mdash; {politician.name}, {sq.sourceName} ({new Date(sq.dateOfStatement).toLocaleDateString()})
                      {sq.sourceUrl && (
                        <a href={sq.sourceUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-primary hover:underline inline-flex items-center gap-1">
                          Source <ExternalLink className="h-3 w-3"/>
                        </a>
                      )}
                    </footer>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

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
              <CardTitle className="font-headline text-xl">Career Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <TimelineDisplay items={formatPoliticalJourneyForTimeline(politician.politicalJourney)} />
            </CardContent>
          </Card>

          {sponsoredBills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary"/> Sponsored Bills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {sponsoredBills.map((bill: Bill) => (
                    <li key={bill.id} className="p-3 border rounded-md bg-secondary/50 hover:bg-secondary/70 transition-colors">
                      <Link href={`/bills/${bill.id}`} className="font-semibold text-primary hover:underline">
                        {bill.title} ({bill.billNumber})
                      </Link>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-muted-foreground">
                          Status: {bill.status}
                        </p>
                        {bill.sponsors.find(s => s.id === politician.id)?.type === 'Primary' && (
                            <Badge variant="outline" className="text-xs">Primary Sponsor</Badge>
                        )}
                        {bill.sponsors.find(s => s.id === politician.id)?.type === 'Co-Sponsor' && (
                             <Badge variant="secondary" className="text-xs">Co-Sponsor</Badge>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {politicianVotes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-primary"/> Voting Record
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {politicianVotes.map((vote, idx) => (
                    <li key={`vote-${idx}-${vote.billId}`} className="text-sm border-b pb-3 last:border-b-0 last:pb-0">
                       <Link href={`/bills/${vote.billId}`} className="font-semibold text-primary hover:underline">
                        {vote.billTitle} ({vote.billNumber})
                      </Link>
                      <p className="text-muted-foreground">
                        Vote: <span className={`font-medium ${vote.vote === 'Yea' ? 'text-green-600' : vote.vote === 'Nay' ? 'text-red-600' : ''}`}>{vote.vote}</span> in {vote.chamber}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Date: {new Date(vote.voteDate).toLocaleDateString()}
                      </p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          
          {politician.assetDeclarations && politician.assetDeclarations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                  <ScrollText className="h-5 w-5 text-primary"/> Asset Declarations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {politician.assetDeclarations.map((asset: AssetDeclaration, idx: number) => (
                    <li key={idx} className="text-sm border-b pb-3 last:border-b-0 last:pb-0">
                      <p className="font-semibold">{asset.description} ({asset.year})</p>
                      {asset.value && <p className="text-muted-foreground">Value: {asset.value}</p>}
                      {asset.sourceUrl && (
                        <a href={asset.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs flex items-center gap-1">
                          View Source <ExternalLink className="h-3 w-3"/>
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {politician.criminalRecords && politician.criminalRecords.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                  <Gavel className="h-5 w-5 text-primary"/> Criminal Records
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {politician.criminalRecords.map((record: CriminalRecord, idx: number) => (
                    <li key={idx} className="text-sm border-b pb-3 last:border-b-0 last:pb-0">
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-semibold">{record.offense}</p>
                        <Badge variant={getCriminalStatusBadgeVariant(record.status)}>{record.status}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Date: {new Date(record.date).toLocaleDateString()}</p>
                      {record.caseNumber && <p className="text-xs text-muted-foreground">Case: {record.caseNumber}</p>}
                      {record.court && <p className="text-xs text-muted-foreground">Court: {record.court}</p>}
                      {record.summary && <p className="mt-1 text-foreground/80">{record.summary}</p>}
                      {record.sourceUrl && (
                        <a href={record.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs flex items-center gap-1 mt-1">
                          View Source <ExternalLink className="h-3 w-3"/>
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

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

          <Button 
            onClick={handleFollowToggle} 
            className="w-full mt-4 bg-accent hover:bg-accent/90 text-accent-foreground"
            variant={isFollowing ? "outline" : "default"}
          >
            {isFollowing ? <UserCheck className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
            {isFollowing ? `Following ${politician.name}` : `Follow ${politician.name}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
