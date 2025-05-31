"use client"; // Add this line

import React, { useState, useEffect } from 'react'; // Add useState and useEffect
import { PageHeader } from '@/components/common/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { EditSuggestion } from '@/types/gov';
import { getCurrentUser, canAccess, EDITOR_ROLES } from '@/lib/auth'; // ADMIN_ROLES no longer needed for button logic here
import {
  mockEditSuggestions as initialEditSuggestions,
  mockNewEntrySuggestions as initialNewEntrySuggestions,
  approveEditSuggestion,
  rejectEditSuggestion,
  approveNewEntrySuggestion,
  rejectNewEntrySuggestion,
  NewEntrySuggestion
} from '@/lib/data/suggestions';


export default function AdminSuggestionsPage() {
  const currentUser = getCurrentUser();

  if (!canAccess(currentUser.role, EDITOR_ROLES)) {
    return <div className="container mx-auto py-8 text-center">Access Denied. You do not have permission to view this page.</div>;
  }

  const [editSuggestions, setEditSuggestions] = useState<EditSuggestion[]>(initialEditSuggestions);
  const [newEntrySuggestions, setNewEntrySuggestions] = useState<NewEntrySuggestion[]>(initialNewEntrySuggestions);

  // Simulate fetching data on mount
  useEffect(() => {
    // In a real app, you might fetch fresh data here.
    // For this mock, we're just ensuring the state is set from the initial import.
    setEditSuggestions(initialEditSuggestions);
    setNewEntrySuggestions(initialNewEntrySuggestions);
  }, []);

  const handleApprove = (id: string, type: 'edit' | 'new') => {
    if (type === 'edit') {
      approveEditSuggestion(id, currentUser.id);
      setEditSuggestions(prev => prev.map(s => s.id === id ? { ...s, status: 'Approved', reviewedBy: currentUser.id, reviewedAt: new Date().toISOString() } : s));
    } else {
      approveNewEntrySuggestion(id, currentUser.id);
      setNewEntrySuggestions(prev => prev.map(s => s.id === id ? { ...s, status: 'ApprovedNewEntry', reviewedBy: currentUser.id, reviewedAt: new Date().toISOString() } : s));
    }
    alert(`Approved ${type} suggestion: ${id} (mock)`);
  };

  const handleReject = (id: string, type: 'edit' | 'new') => {
    if (type === 'edit') {
      rejectEditSuggestion(id, currentUser.id);
      setEditSuggestions(prev => prev.map(s => s.id === id ? { ...s, status: 'Rejected', reviewedBy: currentUser.id, reviewedAt: new Date().toISOString() } : s));
    } else {
      rejectNewEntrySuggestion(id, currentUser.id);
      setNewEntrySuggestions(prev => prev.map(s => s.id === id ? { ...s, status: 'RejectedNewEntry', reviewedBy: currentUser.id, reviewedAt: new Date().toISOString() } : s));
    }
    alert(`Rejected ${type} suggestion: ${id} (mock)`);
  };


  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="Admin: Content Suggestions"
        description="Review and manage user-submitted content edits and new entry proposals."
      />

      {/* Section for Edit Suggestions */}
      <section className="mb-12">
        <h2 className="text-2xl font-headline mb-4">Edit Suggestions</h2>
        {editSuggestions.length > 0 ? (
          <div className="space-y-6">
            {editSuggestions.map((suggestion) => (
              <Card key={suggestion.id} className="shadow-md">
                <CardHeader>
                  <div className="flex justify-between items-start">
                      <div>
                          <CardTitle className="font-headline text-lg">
                              Edit for {suggestion.contentType.charAt(0).toUpperCase() + suggestion.contentType.slice(1)}: <span className="text-primary">{suggestion.contentId}</span>
                          </CardTitle>
                          <p className="text-xs text-muted-foreground">
                              Submitted by: {suggestion.submittedBy} on {new Date(suggestion.submittedAt).toLocaleDateString()}
                          </p>
                      </div>
                      <Badge variant={
                          suggestion.status === 'Pending' ? 'secondary' :
                          suggestion.status === 'Approved' ? 'default' : 'destructive'
                      }
                      className={suggestion.status === 'Approved' ? 'bg-green-500 text-white' : ''}
                      >
                          {suggestion.status}
                      </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    <div>
                      <h4 className="font-semibold mb-1">Field Name:</h4>
                      <p className="text-sm text-foreground/80 p-2 bg-muted/50 rounded-md">{suggestion.fieldName}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-1">Old Value:</h4>
                        <pre className="p-2 bg-muted rounded-md text-xs whitespace-pre-wrap break-all">{String(suggestion.oldValue)}</pre>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Suggested Value:</h4>
                        <pre className="p-2 bg-accent/20 rounded-md text-xs whitespace-pre-wrap break-all">{String(suggestion.suggestedValue)}</pre>
                      </div>
                    </div>

                    {suggestion.reason && (
                      <div>
                        <h4 className="font-semibold mb-1">Reason for Change:</h4>
                        <p className="text-sm text-foreground/80 p-2 bg-muted/50 rounded-md">{suggestion.reason}</p>
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
                  </div>

                  {suggestion.status !== 'Pending' && suggestion.reviewedBy && (
                      <p className="text-xs text-muted-foreground mt-4 pt-2 border-t">
                          Reviewed by {suggestion.reviewedBy} on {new Date(suggestion.reviewedAt!).toLocaleDateString()}
                      </p>
                  )}
                </CardContent>
                {suggestion.status === 'Pending' && canAccess(currentUser.role, EDITOR_ROLES) && (
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => alert(`Viewing item related to ${suggestion.contentId} (mock)`)}><Eye className="mr-1 h-4 w-4" /> View Item</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleReject(suggestion.id, 'edit')}><X className="mr-1 h-4 w-4" /> Reject</Button>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleApprove(suggestion.id, 'edit')}><Check className="mr-1 h-4 w-4" /> Approve</Button>
                  </CardFooter>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No edit suggestions pending.</p>
        )}
      </section>

      {/* Section for New Entry Suggestions */}
      <section>
        <h2 className="text-2xl font-headline mb-4">New Entry Suggestions</h2>
        {newEntrySuggestions.length > 0 ? (
          <div className="space-y-6">
            {newEntrySuggestions.map((suggestion) => (
              <Card key={suggestion.id} className="shadow-md">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="font-headline text-lg">
                        New {suggestion.entityType} Suggestion: <span className="text-primary">{suggestion.data.name}</span>
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        Submitted by: {suggestion.submittedBy} on {new Date(suggestion.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                     <Badge variant={
                        suggestion.status === 'PendingNewEntry' ? 'secondary' :
                        suggestion.status === 'ApprovedNewEntry' ? 'default' : 'destructive'
                    }
                    className={suggestion.status === 'ApprovedNewEntry' ? 'bg-blue-500 text-white' :
                                suggestion.status === 'PendingNewEntry' ? 'bg-orange-400 text-white' : ''}
                    >
                        {suggestion.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    {Object.entries(suggestion.data).map(([key, value]) => {
                      if (typeof value === 'object' && value !== null) {
                        return (
                          <div key={key}>
                            <h4 className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}:</h4>
                            <pre className="p-2 bg-muted rounded-md text-xs whitespace-pre-wrap break-all">
                              {JSON.stringify(value, null, 2)}
                            </pre>
                          </div>
                        );
                      }
                      if (value) { // Only display if value exists
                        return (
                          <div key={key}>
                            <h4 className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}:</h4>
                            <p className="text-sm text-foreground/80 p-2 bg-muted/50 rounded-md">{String(value)}</p>
                          </div>
                        );
                      }
                      return null;
                    })}
                     <div>
                        <h4 className="font-semibold">Reason for Suggestion:</h4>
                        <p className="text-sm text-foreground/80 p-2 bg-muted/50 rounded-md">{suggestion.reason}</p>
                    </div>
                    {suggestion.evidenceUrl && (
                       <div>
                        <h4 className="font-semibold">Evidence URL:</h4>
                        <a href={suggestion.evidenceUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline p-2 bg-muted/50 rounded-md block truncate">
                            {suggestion.evidenceUrl}
                        </a>
                        </div>
                    )}
                  </div>
                   {suggestion.status !== 'PendingNewEntry' && suggestion.reviewedBy && (
                      <p className="text-xs text-muted-foreground mt-4 pt-2 border-t">
                          Reviewed by {suggestion.reviewedBy} on {new Date(suggestion.reviewedAt!).toLocaleDateString()}
                      </p>
                  )}
                </CardContent>
                {suggestion.status === 'PendingNewEntry' && canAccess(currentUser.role, EDITOR_ROLES) && (
                  <CardFooter className="flex justify-end gap-2">
                    {/* <Button variant="outline" size="sm"><Eye className="mr-1 h-4 w-4" /> View (N/A)</Button> */}
                    <Button variant="destructive" size="sm" onClick={() => handleReject(suggestion.id, 'new')}><X className="mr-1 h-4 w-4" /> Reject</Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handleApprove(suggestion.id, 'new')}><Check className="mr-1 h-4 w-4" /> Approve</Button>
                  </CardFooter>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No new entry suggestions pending.</p>
        )}
      </section>
    </div>
  );
}
