
"use client";

import { getControversyById } from '@/lib/mock-data';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Users, CalendarDays, FileText, ExternalLink, ShieldAlert, AlertTriangle, MessageSquare, Building, Tag, ListChecks, Scale, Briefcase } from 'lucide-react';
import Link from 'next/link';
import type { Controversy, InvolvedEntity, ControversyUpdate, ControversyEvidenceLink, ControversyOfficialResponse, ControversyMediaCoverage, ControversyLegalProceeding } from '@/types/gov';
import { useToast } from "@/hooks/use-toast";
import { TimelineDisplay } from '@/components/common/timeline-display'; // Assuming you might use this for updates

function formatControversyUpdatesForTimeline(updates: ControversyUpdate[] = []): { date: string; title: string; description?: string; }[] {
  return updates.map(update => ({
    date: update.date,
    title: update.description.substring(0, 100) + (update.description.length > 100 ? '...' : ''), // Use part of desc as title
    description: update.sourceUrl ? `Source: ${update.sourceUrl}` : undefined,
  })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}


export default function ControversyDetailPage({ params }: { params: { id: string } }) {
  const controversy = getControversyById(params.id);
  const { toast } = useToast();

  if (!controversy) {
    return (
      <div className="text-center py-10">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
        <p className="mt-4 text-xl font-semibold">Controversy Not Found</p>
        <p className="text-muted-foreground">The controversy you are looking for does not exist or may have been removed.</p>
        <Link href="/controversies" className="mt-6 inline-block">
          <Button variant="outline">Back to Controversies List</Button>
        </Link>
      </div>
    );
  }

  const handleSuggestEdit = () => {
    toast({
      title: "Suggest Edit Feature",
      description: "This functionality is under development. Approved suggestions will update the content. You can see mock suggestions being managed on the /admin/suggestions page.",
      duration: 6000,
    });
  };
  
  const getEntityIcon = (type: InvolvedEntity['type']) => {
    switch(type) {
      case 'politician': return <Users className="h-4 w-4 text-primary" />;
      case 'party': return <Briefcase className="h-4 w-4 text-primary" />; // Using Briefcase for party as Flag might be used for nation
      case 'organization': return <Building className="h-4 w-4 text-primary" />;
      default: return <Users className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <div>
      <PageHeader
        title={controversy.title}
        description={
          <div className="flex flex-wrap gap-2 items-center mt-1">
            <Badge variant={controversy.status === 'Proven' || controversy.status === 'Legal Action Initiated' ? 'destructive' : 'secondary'}>{controversy.status}</Badge>
            <Badge variant={
                controversy.severityIndicator === 'Critical' || controversy.severityIndicator === 'High' ? 'destructive' :
                controversy.severityIndicator === 'Medium' ? 'secondary' : 'outline'
            }>
                Severity: {controversy.severityIndicator}
            </Badge>
            {controversy.dates?.started && <span className="text-sm text-muted-foreground">Started: {new Date(controversy.dates.started).toLocaleDateString()}</span>}
            {controversy.dates?.ended && <span className="text-sm text-muted-foreground">Ended: {new Date(controversy.dates.ended).toLocaleDateString()}</span>}
            {controversy.period && !controversy.dates?.started && <span className="text-sm text-muted-foreground">Period: {controversy.period}</span>}
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
              <CardTitle className="font-headline text-xl flex items-center gap-2"><FileText className="text-primary"/> Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 whitespace-pre-line">{controversy.description}</p>
              {controversy.summaryOutcome && (
                <div className="mt-4 pt-4 border-t">
                  <h3 className="font-semibold text-md mb-1">Outcome Summary:</h3>
                  <p className="text-sm text-muted-foreground italic">{controversy.summaryOutcome}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {controversy.updates && controversy.updates.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2"><CalendarDays className="text-primary"/> Chronological Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <TimelineDisplay items={formatControversyUpdatesForTimeline(controversy.updates)} />
              </CardContent>
            </Card>
          )}

          {controversy.legalProceedings && controversy.legalProceedings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2"><Scale className="text-primary"/> Legal Proceedings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {controversy.legalProceedings.map((lp, idx) => (
                  <div key={idx} className="text-sm border-b pb-2 last:border-b-0">
                    {lp.court && <p className="font-semibold">{lp.court}{lp.caseNumber && ` (${lp.caseNumber})`}</p>}
                    {lp.status && <p>Status: <Badge variant="outline">{lp.status}</Badge></p>}
                    {lp.outcome && <p>Outcome: {lp.outcome}</p>}
                    {lp.summary && <p className="text-muted-foreground text-xs mt-1">{lp.summary}</p>}
                    {lp.date && <p className="text-xs text-muted-foreground">Last Update: {new Date(lp.date).toLocaleDateString()}</p>}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2"><Users className="text-primary"/> Involved Entities</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {controversy.involvedEntities.map((entity, idx) => (
                  <li key={idx} className="text-sm flex items-start gap-2">
                    {getEntityIcon(entity.type)}
                    <div>
                      <Link 
                        href={entity.type === 'politician' ? `/politicians/${entity.id}` : entity.type === 'party' ? `/parties/${entity.id}` : '#'} 
                        className={entity.type === 'politician' || entity.type === 'party' ? "text-primary hover:underline font-semibold" : "font-semibold"}
                      >
                        {entity.name}
                      </Link>
                      <span className="text-xs text-muted-foreground block"> ({entity.type.charAt(0).toUpperCase() + entity.type.slice(1)})</span>
                      {entity.role && <p className="text-xs text-muted-foreground italic mt-0.5">{entity.role}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          {controversy.tags && controversy.tags.length > 0 && (
             <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-xl flex items-center gap-2"><Tag className="text-primary"/> Tags</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                    {controversy.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                </CardContent>
            </Card>
          )}

          {controversy.evidenceLinks && controversy.evidenceLinks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2"><ListChecks className="text-primary"/> Evidence</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm">
                  {controversy.evidenceLinks.map((link, idx) => (
                    <li key={idx}>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                        {link.description || link.url} <ExternalLink className="h-3 w-3"/>
                      </a>
                      {link.dateAdded && <span className="text-xs text-muted-foreground"> (Added: {new Date(link.dateAdded).toLocaleDateString()})</span>}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {controversy.officialResponses && controversy.officialResponses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2"><MessageSquare className="text-primary"/> Official Responses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {controversy.officialResponses.map((response, idx) => (
                  <div key={idx} className="text-sm border-l-4 border-primary/50 pl-3 py-1">
                    <p className="font-semibold">{response.entityName} ({new Date(response.date).toLocaleDateString()})</p>
                    <blockquote className="italic text-foreground/80 mt-1">"{response.responseText}"</blockquote>
                    {response.sourceUrl && <a href={response.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs flex items-center gap-1 mt-1">View Source <ExternalLink className="h-3 w-3"/></a>}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
           {controversy.mediaCoverageLinks && controversy.mediaCoverageLinks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2"><ShieldAlert className="text-primary"/> Media Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm">
                  {controversy.mediaCoverageLinks.map((link, idx) => (
                    <li key={idx}>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {link.title}
                      </a>
                      <span className="text-xs text-muted-foreground"> - {link.sourceName} {link.date && `(${new Date(link.date).toLocaleDateString()})`}</span>
                    </li>
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
