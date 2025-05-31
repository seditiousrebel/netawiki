
"use client";

import { PageHeader } from '@/components/common/page-header';
import { mockPromises, mockPoliticians, mockParties } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Edit, User, CalendarClock, CheckCircle, XCircle, RefreshCw, AlertTriangle, Building, Users2, Percent, Landmark, CalendarCheck2, Info, Link2, FileText, ArrowRight, History, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import type { PromiseStatus, PromiseItem, PromiseEvidenceLink } from '@/types/gov';
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";


function getStatusVisuals(status: PromiseStatus): { icon: React.ReactNode; badgeClass: string; } {
  switch (status) {
    case 'Fulfilled':
      return { icon: <CheckCircle className="h-4 w-4 text-green-700" />, badgeClass: 'border-green-500 text-green-700 bg-green-50' };
    case 'In Progress':
      return { icon: <RefreshCw className="h-4 w-4 text-blue-700 animate-spin-slow" />, badgeClass: 'border-blue-500 text-blue-700 bg-blue-50' };
    case 'Pending':
      return { icon: <CalendarClock className="h-4 w-4 text-yellow-700" />, badgeClass: 'border-yellow-500 text-yellow-700 bg-yellow-50' };
    case 'Broken':
      return { icon: <XCircle className="h-4 w-4 text-red-700" />, badgeClass: 'border-red-500 text-red-700 bg-red-50' };
    case 'Stalled':
      return { icon: <AlertTriangle className="h-4 w-4 text-orange-600" />, badgeClass: 'border-orange-500 text-orange-600 bg-orange-50' };
    case 'Modified':
      return { icon: <Info className="h-4 w-4 text-purple-600" />, badgeClass: 'border-purple-500 text-purple-600 bg-purple-50' };
    case 'Cancelled':
      return { icon: <XCircle className="h-4 w-4 text-slate-600" />, badgeClass: 'border-slate-500 text-slate-600 bg-slate-50' };
    case 'Partially Fulfilled':
      return { icon: <CheckCircle className="h-4 w-4 text-teal-600" />, badgeClass: 'border-teal-500 text-teal-600 bg-teal-50' };
    default:
      return { icon: <AlertTriangle className="h-4 w-4 text-gray-700" />, badgeClass: 'border-gray-500 text-gray-700 bg-gray-50' };
  }
}


export default function PromisesPage() {
  const promises = mockPromises;
  const { toast } = useToast();

  const handleSuggestEdit = (promiseId: string) => {
    toast({
      title: `Suggest Edit for Promise: ${promiseId}`,
      description: "This functionality is under development. Approved suggestions will update the content. You can see mock suggestions being managed on the /admin/suggestions page.",
      duration: 6000,
    });
  };

  const getPromiserLink = (promise: PromiseItem) => {
    if (promise.politicianId) {
      const politician = mockPoliticians.find(p => p.id === promise.politicianId);
      if (politician) {
        return (
          <Link href={`/politicians/${politician.id}`} className="text-primary hover:underline flex items-center gap-1">
            <User className="h-3.5 w-3.5"/> {politician.name}
          </Link>
        );
      }
    }
    if (promise.partyId) {
      const party = mockParties.find(p => p.id === promise.partyId);
      if (party) {
        return (
          <Link href={`/parties/${party.id}`} className="text-primary hover:underline flex items-center gap-1">
            <Users2 className="h-3.5 w-3.5"/> {party.name}
          </Link>
        );
      }
    }
    return <span className="flex items-center gap-1"><ClipboardList className="h-3.5 w-3.5"/> Unknown Promiser</span>;
  };

  return (
    <div>
      <PageHeader
        title="Promise Tracker"
        description="Monitor promises made by politicians and parties, and their current status."
      />
      {promises.length > 0 ? (
        <div className="space-y-6">
          {promises.map((promise: PromiseItem) => {
            const { icon: statusIcon, badgeClass } = getStatusVisuals(promise.status);
            const detailPageUrl = `/promises/${promise.slug || promise.id}`;
            return (
              <Card key={promise.id} id={promise.id} className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-grow">
                      <CardTitle className="font-headline text-xl mb-1">
                        <Link href={detailPageUrl} className="text-primary hover:underline">
                          {promise.title}
                        </Link>
                      </CardTitle>
                      <div className="text-sm text-muted-foreground space-y-0.5">
                        <p className="flex items-center gap-1.5">
                           Promised by: {getPromiserLink(promise)}
                        </p>
                        {promise.category && (
                           <div className="flex items-center gap-1">Category: <Badge variant="secondary" className="text-xs">{promise.category}{promise.subCategory && ` > ${promise.subCategory}`}</Badge></div>
                        )}
                         {promise.geographicScope && (
                           <div className="flex items-center gap-1">Scope: <Badge variant="outline" className="text-xs">{promise.geographicScope}</Badge></div>
                        )}
                      </div>
                    </div>
                    <Badge variant="outline" className={`flex items-center gap-1.5 text-sm shrink-0 ${badgeClass}`}>
                      {statusIcon}
                      {promise.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80 mb-4 line-clamp-3 whitespace-pre-line">{promise.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-xs text-muted-foreground mb-4">
                    {promise.datePromised && <p className="flex items-center gap-1.5"><CalendarClock className="h-3.5 w-3.5 text-primary/70"/>Promised: {new Date(promise.datePromised).toLocaleDateString()}</p>}
                    {promise.expectedFulfillmentDate && <p className="flex items-center gap-1.5"><CalendarClock className="h-3.5 w-3.5 text-primary/70"/>Due by: {new Date(promise.expectedFulfillmentDate).toLocaleDateString()}</p>}
                    {promise.actualFulfillmentDate && promise.status === 'Fulfilled' && <p className="flex items-center gap-1.5"><CalendarCheck2 className="h-3.5 w-3.5 text-green-600"/>Fulfilled on: {new Date(promise.actualFulfillmentDate).toLocaleDateString()}</p>}
                    {promise.sourceType && <p className="flex items-center gap-1.5"><FileText className="h-3.5 w-3.5 text-primary/70"/>Source: {promise.sourceType}{promise.sourceDetails && <span className="text-foreground/60 italic text-[0.7rem]"> ({promise.sourceDetails.substring(0,50)}{promise.sourceDetails.length > 50 ? '...' : ''})</span>}</p>}
                    {promise.responsibleAgency && <p className="flex items-center gap-1.5"><Landmark className="h-3.5 w-3.5 text-primary/70"/>Responsible: {promise.responsibleAgency}</p>}
                  </div>

                  {promise.fulfillmentPercentage !== undefined && ['In Progress', 'Partially Fulfilled'].includes(promise.status) && (
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                         <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                           <Percent className="h-3.5 w-3.5 text-primary/70"/> Progress:
                         </p>
                         <span className="text-sm font-semibold text-primary">{promise.fulfillmentPercentage}%</span>
                      </div>
                      <Progress value={promise.fulfillmentPercentage} className="h-2" />
                    </div>
                  )}

                  {promise.reasonForStatus && ['Broken', 'Stalled', 'Modified', 'Cancelled'].includes(promise.status) && (
                    <div className="mb-3 p-2 bg-muted/50 rounded-md">
                      <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5"><Info className="h-3.5 w-3.5 text-primary/70"/>Reason for Status:</p>
                      <p className="text-xs text-foreground/70 mt-0.5">{promise.reasonForStatus}</p>
                    </div>
                  )}
                  
                  {promise.evidenceLinks.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold mb-1.5 flex items-center gap-1.5"><Link2 className="h-4 w-4 text-primary/80"/>Evidence:</h4>
                      <ul className="space-y-1.5">
                        {promise.evidenceLinks.map((link: PromiseEvidenceLink, idx: number) => (
                          <li key={idx} className="text-xs">
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1.5">
                              <ExternalLink className="h-3.5 w-3.5" />
                              {link.description || link.url}
                              {link.type && <Badge variant="outline" className="ml-2 text-[0.65rem] px-1.5 py-0">{link.type}</Badge>}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between items-center pt-2">
                  <Button variant="ghost" size="sm" onClick={() => handleSuggestEdit(promise.id)}>
                    <Edit className="mr-2 h-3 w-3" /> Suggest Edit
                  </Button>
                  <Link href={detailPageUrl}>
                    <Button variant="outline" size="sm">View Details <ArrowRight className="ml-2 h-4 w-4" /></Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <p>No promises found.</p>
      )}
    </div>
  );
}
