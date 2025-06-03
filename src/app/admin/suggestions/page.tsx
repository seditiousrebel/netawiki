
"use client";

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, Eye, Loader2 } from 'lucide-react'; // Added Loader2
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { PendingEdit } from '@/types/gov';
import { getCurrentUser, canAccess, EDITOR_ROLES } from '@/lib/auth';
import {
  mockPendingEdits,
  approvePendingEdit,
  rejectPendingEdit,
} from '@/lib/data/suggestions';
import Link from 'next/link';

// Helper component to display JSON data in a more readable format
const JsonDisplay = ({ data, level = 0 }: { data: any; level?: number }) => {
  if (data === null || data === undefined) {
    return <span className="text-muted-foreground italic">N/A</span>;
  }

  // Handle arrays
  if (Array.isArray(data)) {
    if (data.length === 0) {
      return <span className="text-muted-foreground italic">[Empty Array]</span>;
    }
    return (
      <ul style={{ paddingLeft: `${level > 0 ? 20 : 0}px` }} className="list-none space-y-1 mt-1">
        {data.map((item, index) => (
          <li key={index} className="p-1 rounded-md bg-muted/30">
            <JsonDisplay data={item} level={level + 1} />
          </li>
        ))}
      </ul>
    );
  }

  // Handle simple types (strings, numbers, booleans)
  if (typeof data !== 'object') {
    return <span className="break-all">{String(data)}</span>;
  }

  // Handle empty objects
  if (Object.keys(data).length === 0) {
    return <span className="text-muted-foreground italic">{'{ Empty Object }'}</span>;
  }

  // Handle objects
  return (
    <div style={{ marginLeft: `${level > 0 ? 20 : 0}px` }} className="space-y-2 pt-1">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="flex flex-col">
          <strong className="mr-2 shrink-0 text-sm text-foreground/90">{key}:</strong>
          <div className="break-all text-sm text-foreground/80 pl-2 border-l-2 border-muted">
            <JsonDisplay data={value} level={level + 1} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default function AdminSuggestionsPage() {
  const [isClient, setIsClient] = useState(false);
  const [currentUserState, setCurrentUserState] = useState(getCurrentUser()); // Get user once on client
  const [pendingEdits, setPendingEdits] = useState<PendingEdit[]>([]);
  const [adminFeedback, setAdminFeedback] = useState<Record<string, string>>({});

  useEffect(() => {
    setIsClient(true);
    setCurrentUserState(getCurrentUser()); // Ensure currentUser is updated on client
    setPendingEdits(mockPendingEdits); // Load mock suggestions on client
  }, []);


  const handleFeedbackChange = (suggestionId: string, feedback: string) => {
    setAdminFeedback(prev => ({ ...prev, [suggestionId]: feedback }));
  };

  const handleApprove = (id: string) => {
    const feedback = adminFeedback[id] || '';
    if (approvePendingEdit(id, currentUserState.id, feedback)) {
      setPendingEdits(prev =>
        prev.map(s =>
          s.id === id
            ? { ...s, status: 'APPROVED', approvedByUserId: currentUserState.id, reviewedAt: new Date().toISOString(), adminFeedback: feedback }
            : s
        )
      );
      setAdminFeedback(prev => ({ ...prev, [id]: '' })); 
      alert(`Approved suggestion: ${id}`);
    } else {
      alert(`Failed to approve suggestion: ${id}`);
    }
  };

  const handleReject = (id: string) => {
    const feedback = adminFeedback[id] || '';
    if (!feedback && window.confirm("Are you sure you want to reject without feedback?")) {
        // Proceed without feedback
    } else if (!feedback) {
        alert("Please provide feedback for rejection.");
        return;
    }

    if (rejectPendingEdit(id, currentUserState.id, feedback)) {
      setPendingEdits(prev =>
        prev.map(s =>
          s.id === id
            ? { ...s, status: 'DENIED', deniedByUserId: currentUserState.id, reviewedAt: new Date().toISOString(), adminFeedback: feedback }
            : s
        )
      );
      setAdminFeedback(prev => ({ ...prev, [id]: '' })); 
      alert(`Rejected suggestion: ${id}`);
    } else {
      alert(`Failed to reject suggestion: ${id}`);
    }
  };

  const getEntityLink = (suggestion: PendingEdit): string | null => {
    if (!suggestion.entityId) return null; 
    
    switch (suggestion.entityType) {
      case 'Politician':
        return `/politicians/${suggestion.entityId}`;
      case 'Party':
        return `/parties/${suggestion.entityId}`;
      case 'Bill':
        return `/bills/${suggestion.entityId}`;
      default:
        return null;
    }
  };

  if (!isClient) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!canAccess(currentUserState.role, EDITOR_ROLES)) {
    return <div className="container mx-auto py-8 text-center">Access Denied. You do not have permission to view this page.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="Admin: Content Suggestions"
        description="Review and manage user-submitted content edits and new entry proposals."
      />

      <section className="mb-12">
        <h2 className="text-2xl font-headline mb-4">Pending Suggestions</h2>
        {pendingEdits.length > 0 ? (
          <div className="space-y-6">
            {pendingEdits.map((suggestion) => (
              <Card key={suggestion.id} className="shadow-md">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="font-headline text-lg">
                        {suggestion.entityId
                          ? `Edit for ${suggestion.entityType}: `
                          : `New ${suggestion.entityType}: `}
                        <span className="text-primary">
                          {suggestion.entityId || (suggestion.proposedData as any)?.name || (suggestion.proposedData as any)?.title || 'N/A'}
                        </span>
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        ID: {suggestion.id} <br />
                        Submitted by: {suggestion.submittedByUserId} on {new Date(suggestion.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={
                        suggestion.status === 'PENDING' ? 'secondary' :
                        suggestion.status === 'APPROVED' ? 'default' : 'destructive'
                    }
                    className={suggestion.status === 'APPROVED' ? 'bg-green-500 text-white' : ''}
                    >
                      {suggestion.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    <div>
                      <h4 className="font-semibold mb-1">Proposed Data:</h4>
                      <div className="p-2 bg-muted rounded-md text-xs">
                        <JsonDisplay data={suggestion.proposedData} />
                      </div>
                    </div>

                    {suggestion.reasonForChange && (
                      <div>
                        <h4 className="font-semibold mb-1">Reason for Change:</h4>
                        <p className="text-sm text-foreground/80 p-2 bg-muted/50 rounded-md">{suggestion.reasonForChange}</p>
                      </div>
                    )}

                    {suggestion.evidenceUrl && (
                      <div>
                        <h4 className="font-semibold mb-1">Evidence URL:</h4>
                        <a
                          href={suggestion.evidenceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline p-2 bg-muted/50 rounded-md block truncate"
                        >
                          {suggestion.evidenceUrl}
                        </a>
                      </div>
                    )}

                    {suggestion.status !== 'PENDING' && (
                      <div className="mt-4 pt-2 border-t">
                        {suggestion.adminFeedback && (
                             <div>
                                <h4 className="font-semibold mb-1">Admin Feedback:</h4>
                                <p className="text-sm text-foreground/80 p-2 bg-accent/20 rounded-md">{suggestion.adminFeedback}</p>
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          Reviewed by {suggestion.approvedByUserId || suggestion.deniedByUserId} on {suggestion.reviewedAt ? new Date(suggestion.reviewedAt).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    )}
                  </div>
                 
                  {suggestion.status === 'PENDING' && canAccess(currentUserState.role, EDITOR_ROLES) && (
                     <div className="mt-4 pt-4 border-t">
                        <Label htmlFor={`admin-feedback-${suggestion.id}`} className="font-semibold mb-1 block">Admin Feedback (Optional for Approve, Required for Reject):</Label>
                        <Textarea
                            id={`admin-feedback-${suggestion.id}`}
                            value={adminFeedback[suggestion.id] || ''}
                            onChange={(e) => handleFeedbackChange(suggestion.id, e.target.value)}
                            placeholder="Provide feedback for the user..."
                            className="mb-2"
                            rows={3}
                        />
                    </div>
                  )}
                </CardContent>
                {suggestion.status === 'PENDING' && canAccess(currentUserState.role, EDITOR_ROLES) && (
                  <CardFooter className="flex justify-end gap-2">
                    {suggestion.entityId && getEntityLink(suggestion) ? (
                       <Link href={getEntityLink(suggestion)!} passHref legacyBehavior>
                         <Button asChild variant="outline" size="sm"><a target="_blank" rel="noopener noreferrer"><Eye className="mr-1 h-4 w-4" /> View Item</a></Button>
                       </Link>
                    ) : (
                       <Button variant="outline" size="sm" disabled><Eye className="mr-1 h-4 w-4" /> View (New)</Button>
                    )}
                    <Button variant="destructive" size="sm" onClick={() => handleReject(suggestion.id)}><X className="mr-1 h-4 w-4" /> Reject</Button>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleApprove(suggestion.id)}><Check className="mr-1 h-4 w-4" /> Approve</Button>
                  </CardFooter>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No pending suggestions.</p>
        )}
      </section>
    </div>
  );
}

