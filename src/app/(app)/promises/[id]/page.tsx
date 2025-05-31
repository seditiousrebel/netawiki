
"use client";

import { getPromiseById, getPoliticianById, getPartyById } from '@/lib/mock-data';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TimelineDisplay, formatPromiseStatusUpdatesForTimeline } from '@/components/common/timeline-display';
import { Edit, Users2, User, ClipboardList, AlertTriangle, Info, FileText, CalendarClock, CalendarCheck2, Percent, Landmark, Link2, ExternalLink, History, CheckCircle, RefreshCw, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import type { PromiseItem, PromiseStatus, PromiseEvidenceLink, PromiseStatusUpdate } from '@/types/gov';
import React from 'react';

function getStatusVisuals(status: PromiseStatus): { icon: React.ReactNode; badgeClass: string; } {
  switch (status) {
    case 'Fulfilled':
      return { icon: <CheckCircle className="h-5 w-5 text-green-700" />, badgeClass: 'border-green-500 text-green-700 bg-green-50' };
    case 'In Progress':
      return { icon: <RefreshCw className="h-5 w-5 text-blue-700 animate-spin-slow" />, badgeClass: 'border-blue-500 text-blue-700 bg-blue-50' };
    case 'Pending':
      return { icon: <CalendarClock className="h-5 w-5 text-yellow-700" />, badgeClass: 'border-yellow-500 text-yellow-700 bg-yellow-50' };
    case 'Broken':
      return { icon: <XCircle className="h-5 w-5 text-red-700" />, badgeClass: 'border-red-500 text-red-700 bg-red-50' };
    case 'Stalled':
      return { icon: <AlertTriangle className="h-5 w-5 text-orange-600" />, badgeClass: 'border-orange-500 text-orange-600 bg-orange-50' };
    case 'Modified':
      return { icon: <Info className="h-5 w-5 text-purple-600" />, badgeClass: 'border-purple-500 text-purple-600 bg-purple-50' };
    case 'Cancelled':
      return { icon: <XCircle className="h-5 w-5 text-slate-600" />, badgeClass: 'border-slate-500 text-slate-600 bg-slate-50' };
    case 'Partially Fulfilled':
      return { icon: <CheckCircle className="h-5 w-5 text-teal-600" />, badgeClass: 'border-teal-500 text-teal-600 bg-teal-50' };
    default:
      return { icon: <AlertTriangle className="h-5 w-5 text-gray-700" />, badgeClass: 'border-gray-500 text-gray-700 bg-gray-50' };
  }
}

export default function PromiseDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = React.use(paramsPromise);
  const promise = getPromiseById(params.id);
  const { toast } = useToast();

  if (!promise) {
    return (
      <div className="text-center py-10">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
        <p className="mt-4 text-xl font-semibold">Promise Not Found</p>
        <p className="text-muted-foreground">The promise you are looking for does not exist or may have been removed.</p>
        <Link href="/promises" className="mt-6 inline-block">
          <Button variant="outline">Back to Promises List</Button>
        </Link>
      </div>
    );
  }

  const handleSuggestEdit = () => {
    toast({
      title: "Suggest Edit Feature",
      description: "This functionality is under development. Approved suggestions will update the content.",
      duration: 6000,
    });
  };

  const promiser = promise.politicianId 
    ? getPoliticianById(promise.politicianId) 
    : promise.partyId 
    ? getPartyById(promise.partyId) 
    : null;

  const promiserLink = promiser ? (
    promise.politicianId ? (
      <Link href={`/politicians/${promiser.id}`} className="text-primary hover:underline flex items-center gap-1">
        <User className="h-4 w-4"/> {promiser.name}
      </Link>
    ) : (
      <Link href={`/parties/${promiser.id}`} className="text-primary hover:underline flex items-center gap-1">
        <Users2 className="h-4 w-4"/> {promiser.name}
      </Link>
    )
  ) : <span className="flex items-center gap-1"><ClipboardList className="h-4 w-4"/> Unknown Promiser</span>;

  const { icon: statusIcon, badgeClass } = getStatusVisuals(promise.status);
  const timelineItems = promise.statusUpdateHistory ? formatPromiseStatusUpdatesForTimeline(promise.statusUpdateHistory) : [];


  return (
    <div>
      <PageHeader
        title={promise.title}
        description={<div className="text-sm text-muted-foreground">Promised by: {promiserLink}</div>}
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
              <CardTitle className="font-headline text-xl flex items-center gap-2"><Info className="text-primary"/>Promise Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground/80 whitespace-pre-line">{promise.description}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                {promise.category && (
                  <div><strong>Category:</strong> <Badge variant="secondary">{promise.category}{promise.subCategory && ` > ${promise.subCategory}`}</Badge></div>
                )}
                {promise.geographicScope && (
                  <div><strong>Scope:</strong> <Badge variant="outline">{promise.geographicScope}</Badge></div>
                )}
                {promise.sourceType && (
                  <div><strong>Source:</strong> {promise.sourceType}
                    {promise.sourceDetails && <span className="text-muted-foreground text-xs italic ml-1">({promise.sourceDetails})</span>}
                  </div>
                )}
                {promise.responsibleAgency && (
                  <div className="flex items-center gap-1"><strong>Responsible:</strong> <Landmark className="h-4 w-4 text-muted-foreground inline-block mr-1"/>{promise.responsibleAgency}</div>
                )}
                 {promise.datePromised && (
                    <div className="flex items-center gap-1"><strong>Promised on:</strong> <CalendarClock className="h-4 w-4 text-muted-foreground inline-block mr-1"/>{new Date(promise.datePromised).toLocaleDateString()}</div>
                 )}
                 {promise.expectedFulfillmentDate && (
                    <div className="flex items-center gap-1"><strong>Expected by:</strong> <CalendarClock className="h-4 w-4 text-muted-foreground inline-block mr-1"/>{new Date(promise.expectedFulfillmentDate).toLocaleDateString()}</div>
                 )}
                 {promise.actualFulfillmentDate && promise.status === 'Fulfilled' && (
                    <div className="flex items-center gap-1 text-green-600"><strong>Fulfilled on:</strong> <CalendarCheck2 className="h-4 w-4 inline-block mr-1"/>{new Date(promise.actualFulfillmentDate).toLocaleDateString()}</div>
                 )}
              </div>
            </CardContent>
          </Card>

          {timelineItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2"><History className="text-primary"/>Status Update History</CardTitle>
              </CardHeader>
              <CardContent>
                <TimelineDisplay items={timelineItems} />
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2">
                {statusIcon} Current Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Badge variant="outline" className={`text-base py-1 px-3 w-full justify-center ${badgeClass}`}>
                {promise.status}
              </Badge>

              {promise.fulfillmentPercentage !== undefined && ['In Progress', 'Partially Fulfilled', 'Fulfilled'].includes(promise.status) && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                      <Percent className="h-4 w-4 text-primary/70"/> Progress:
                    </span>
                    <span className="text-lg font-semibold text-primary">{promise.fulfillmentPercentage}%</span>
                  </div>
                  <Progress value={promise.fulfillmentPercentage} className="h-3" />
                </div>
              )}

              {promise.reasonForStatus && ['Broken', 'Stalled', 'Modified', 'Cancelled'].includes(promise.status) && (
                <div className="mt-2 p-3 bg-muted/50 rounded-md">
                  <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5 mb-1"><Info className="h-4 w-4 text-primary/70"/>Reason for Status:</h4>
                  <p className="text-sm text-foreground/70">{promise.reasonForStatus}</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {promise.evidenceLinks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2"><Link2 className="text-primary"/>Evidence</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {promise.evidenceLinks.map((link: PromiseEvidenceLink, idx: number) => (
                    <li key={idx} className="text-sm">
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1.5">
                        <ExternalLink className="h-4 w-4 shrink-0" />
                        <span className="truncate">{link.description || link.url}</span>
                      </a>
                      {link.type && <Badge variant="outline" className="ml-2 text-xs px-1.5 py-0">{link.type}</Badge>}
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
