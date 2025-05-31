import { PageHeader } from '@/components/common/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { EditSuggestion } from '@/types/gov';

// --- Edit Suggestion Types and Data ---
// (Assuming EditSuggestion is already well-defined in @/types/gov)

const mockEditSuggestions: EditSuggestion[] = [
  {
    id: 's1',
    contentType: 'politician',
    contentId: 'p1',
    fieldName: 'bio',
    oldValue: 'Alice Democratia is a dedicated public servant...',
    suggestedValue: 'Alice Democratia is a highly experienced public servant with over 15 years in governance...',
    reason: 'Updated bio with more current information about her experience.',
    evidenceUrl: 'https://example.com/news/alice-democratia-experience',
    status: 'Pending',
    submittedBy: 'user456',
    submittedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
  {
    id: 's2',
    contentType: 'party',
    contentId: 'party2',
    fieldName: 'history',
    oldValue: 'Established in 1985, advocating for free markets...',
    suggestedValue: 'Established in 1985, the Red Alliance Group has consistently advocated for robust free markets and individual liberties, adapting its platform over decades.',
    reason: 'More detailed and accurate historical summary.',
    evidenceUrl: 'https://example.com/party/red-alliance/history-update',
    status: 'Approved',
    submittedBy: 'user789',
    submittedAt: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
    reviewedBy: 'admin01',
    reviewedAt: new Date(Date.now() - 86400000).toISOString(),
  },
   {
    id: 's3',
    contentType: 'promise',
    contentId: 'pr3',
    fieldName: 'status',
    oldValue: 'Broken',
    suggestedValue: 'Pending',
    reason: 'This promise was re-evaluated and is now considered pending further review.',
    evidenceUrl: '', // No evidence provided for this one
    status: 'Rejected',
    submittedBy: 'user101',
    submittedAt: new Date(Date.now() - 3 * 86400000).toISOString(), // 3 days ago
    reviewedBy: 'admin02',
    reviewedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

// --- New Entry Suggestion Types and Data ---
interface NewEntrySuggestionData {
  name: string;
  partyName?: string;
  positions?: string; // Simplified for this example
  bio?: string;
  contactInfo?: { email?: string };
  photoUrl?: string;
  // ensure all fields from the form are here if they should be displayed
}

interface NewEntrySuggestion {
  id: string;
  entityType: string; // e.g., "Politician", "Party"
  data: NewEntrySuggestionData;
  reason: string;
  evidenceUrl: string;
  status: 'PendingNewEntry' | 'ApprovedNewEntry' | 'RejectedNewEntry'; // Distinct statuses
  submittedBy: string;
  submittedAt: string; // ISO Date string
  reviewedBy?: string; // Admin User ID
  reviewedAt?: string; // ISO Date string
}

const mockNewEntrySuggestions: NewEntrySuggestion[] = [
  {
    id: 'new-s1',
    entityType: 'Politician',
    data: {
      name: 'John Q. Public',
      partyName: 'People\'s Voice Party',
      positions: 'Community Organizer, Activist',
      bio: 'John Q. Public has been a vocal advocate for community rights and transparency for over a decade. He believes in grassroots movements to effect change.',
      contactInfo: { email: 'john.public@example.com' },
      photoUrl: 'https://example.com/photos/john_q_public.jpg',
    },
    reason: 'This individual is a prominent new figure in local politics and should be listed.',
    evidenceUrl: 'https://example.com/news/jqp_profile',
    status: 'PendingNewEntry',
    submittedBy: 'citizenX',
    submittedAt: new Date(Date.now() - 86400000 * 0.5).toISOString(), // 0.5 days ago
  },
  {
    id: 'new-s2',
    entityType: 'Party', // Example for another entity type
    data: {
      name: 'Future Forward Alliance',
      // other party specific fields...
    },
    reason: 'Newly formed political party gaining traction.',
    evidenceUrl: 'https://example.com/ffa_announcement',
    status: 'ApprovedNewEntry',
    submittedBy: 'analystY',
    submittedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    reviewedBy: 'admin01',
    reviewedAt: new Date(Date.now() - 86400000).toISOString(),
  }
];


export default function AdminSuggestionsPage() {
  const editSuggestions = mockEditSuggestions;
  const newEntrySuggestions = mockNewEntrySuggestions;

  const handleApprove = (id: string, type: 'edit' | 'new') => {
    console.log(`Approved ${type} suggestion: ${id}`);
    // Here you would typically update the status in your backend/state
    alert(`Approved ${type} suggestion: ${id} (mock)`);
  };

  const handleReject = (id: string, type: 'edit' | 'new') => {
    console.log(`Rejected ${type} suggestion: ${id}`);
    // Here you would typically update the status in your backend/state
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
                {suggestion.status === 'Pending' && (
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
                {suggestion.status === 'PendingNewEntry' && (
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
