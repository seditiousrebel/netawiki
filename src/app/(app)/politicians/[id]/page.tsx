
"use client";

import Image from 'next/image';
import { getPoliticianById, getPromisesByPolitician, mockParties, getBillsBySponsor } from '@/lib/mock-data';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, Globe, Edit, Users, Tag, CalendarDays, Briefcase, Landmark, MapPin, GraduationCap, Twitter, Facebook, Linkedin, Instagram, ScrollText, ExternalLink, Gavel, Star, BarChart3, ListChecks, FileText } from 'lucide-react';
import { TimelineDisplay, formatPoliticalJourneyForTimeline } from '@/components/common/timeline-display';
import Link from 'next/link';
import type { PromiseItem, AssetDeclaration, CriminalRecord, CommitteeMembership, Bill } from '@/types/gov';
import { useToast } from "@/hooks/use-toast";

export default function PoliticianProfilePage({ params }: { params: { id: string } }) {
  const politician = getPoliticianById(params.id);
  const { toast } = useToast();
  
  if (!politician) {
    return <p>Politician not found.</p>;
  }

  const promises = getPromisesByPolitician(params.id);
  const party = politician.partyId ? mockParties.find(p => p.id === politician.partyId) : null;
  const sponsoredBills = getBillsBySponsor(politician.id);

  const getStatusBadgeVariant = (status: CriminalRecord['status']) => {
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


  return (
    <div>
      <PageHeader
        title={politician.name}
        description={politician.positions[0]?.title || 'Public Figure'}
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
              <div className="p-6 space-y-1">
                <h2 className="text-2xl font-headline font-semibold mb-1">{politician.name}</h2>
                {party && (
                  <Link href={`/parties/${party.id}`} className="text-primary hover:underline flex items-center gap-1">
                    <Landmark className="h-4 w-4" /> {party.name}
                  </Link>
                )}
                 {politician.district && <p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="h-4 w-4" /> {politician.district}</p>}
                {politician.dateOfBirth && <p className="text-sm text-muted-foreground flex items-center gap-1"><CalendarDays className="h-4 w-4" /> Born: {new Date(politician.dateOfBirth).toLocaleDateString()}</p>}
                {politician.gender && <p className="text-sm text-muted-foreground">Gender: {politician.gender}</p>}
              </div>
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
                  <Phone className="h-4 w-4 text-primary" /> {politician.contactInfo.phone}
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
        </div>

        <div className="lg:col-span-2 space-y-8">
          {(politician.overallRating !== undefined || politician.voteScore !== undefined || politician.promiseFulfillmentRate !== undefined) && (
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
                    <span className="text-sm text-muted-foreground">Overall Rating</span>
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
                 <p className="text-xs text-muted-foreground pt-2 border-t mt-2">
                    Note: Analytics data is for demonstration purposes.
                </p>
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
                        <Badge variant={getStatusBadgeVariant(record.status)}>{record.status}</Badge>
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
           <Button className="w-full mt-4 bg-accent hover:bg-accent/90 text-accent-foreground">
            <Users className="mr-2 h-4 w-4" /> Follow {politician.name}
          </Button>
        </div>
      </div>
    </div>
  );
}
