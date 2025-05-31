import { PageHeader } from '@/components/common/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { EditSuggestion } from '@/types/gov';

// Mock data for suggestions
const mockSuggestions: EditSuggestion[] = [
  {
    id: 's1',
    contentType: 'politician',
    contentId: 'p1',
    fieldName: 'bio',
    oldValue: 'Alice Democratia is a dedicated public servant...',
    suggestedValue: 'Alice Democratia is a highly experienced public servant with over 15 years in governance...',
    reason: 'Updated bio with more current information about her experience.',
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
    status: 'Rejected',
    submittedBy: 'user101',
    submittedAt: new Date(Date.now() - 3 * 86400000).toISOString(), // 3 days ago
    reviewedBy: 'admin02',
    reviewedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];


export default function AdminSuggestionsPage() {
  const suggestions = mockSuggestions;

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="Admin: Edit Suggestions"
        description="Review and manage user-submitted content edits."
      />
      {suggestions.length > 0 ? (
        <div className="space-y-6">
          {suggestions.map((suggestion) => (
            <Card key={suggestion.id} className="shadow-md">
              <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="font-headline text-lg">
                            Edit for {suggestion.contentType.charAt(0).toUpperCase() + suggestion.contentType.slice(1)}: <span className="text-primary">{suggestion.contentId}</span> (Field: {suggestion.fieldName})
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
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
                        <h4 className="font-semibold mb-1 text-sm">Reason:</h4>
                        <p className="text-sm text-foreground/80 p-2 bg-muted/50 rounded-md">{suggestion.reason}</p>
                    </div>
                )}
                {suggestion.status !== 'Pending' && suggestion.reviewedBy && (
                    <p className="text-xs text-muted-foreground mt-2">
                        Reviewed by {suggestion.reviewedBy} on {new Date(suggestion.reviewedAt!).toLocaleDateString()}
                    </p>
                )}
              </CardContent>
              {suggestion.status === 'Pending' && (
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline" size="sm"><Eye className="mr-1 h-4 w-4" /> View Item</Button>
                  <Button variant="destructive" size="sm"><X className="mr-1 h-4 w-4" /> Reject</Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white"><Check className="mr-1 h-4 w-4" /> Approve</Button>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <p>No edit suggestions pending.</p>
      )}
    </div>
  );
}
