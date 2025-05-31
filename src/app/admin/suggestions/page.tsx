import { PageHeader } from '@/components/common/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { EditSuggestion, NewEntrySuggestion } from '@/types/gov';

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
    evidence: 'https://example.com/news/alice-democratia-new-role',
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
    evidence: 'Party internal records, meeting minutes dated 2023-05-10',
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
    evidence: 'https://example.com/promises/pr3/reassessment-report.pdf',
  },
];

const mockNewEntrySuggestions: NewEntrySuggestion[] = [
  {
    id: 'nes1',
    contentType: 'politician',
    suggestedData: {
      name: 'John Publico',
      nepaliName: 'जोन पब्लिको',
      bio: 'A new candidate focusing on grassroots movements and community development. Background in environmental science.',
      partyName: 'Independent',
      positions: [{ title: 'Community Organizer', startDate: '2020-01-01' }],
      contactInfo: { email: 'john.publico@email.com' },
      photoUrl: 'https://example.com/images/john-publico.jpg',
    },
    reason: 'New politician profile submission for upcoming local elections.',
    evidence: 'https://example.com/news/new-politician-john-publico',
    status: 'Pending',
    submittedBy: 'userCitizenX',
    submittedAt: new Date(Date.now() - 4 * 86400000).toISOString(), // 4 days ago
  },
  {
    id: 'nes2',
    contentType: 'party',
    suggestedData: {
      name: 'Green Future Alliance',
      abbreviation: 'GFA',
      ideology: ['Environmentalism', 'Social Justice'],
      foundedDate: '2024-01-15',
      logoUrl: 'https://example.com/logos/gfa.png',
      electionSymbolUrl: 'https://example.com/symbols/gfa-tree.png',
      history: 'Formed by a coalition of environmental activists and social reformers, the GFA aims to bring sustainable development to the forefront of national policy.',
    },
    reason: 'Submission for a newly registered political party.',
    evidence: 'Official party registration document: reg_doc_gfa_2024.pdf',
    status: 'Pending',
    submittedBy: 'userActivistY',
    submittedAt: new Date(Date.now() - 5 * 86400000).toISOString(), // 5 days ago
  },
];

// Helper type for combined suggestions
type CombinedSuggestion = (EditSuggestion & { suggestionType: 'edit' }) | (NewEntrySuggestion & { suggestionType: 'new' });

export default function AdminSuggestionsPage() {
  const allSuggestions: CombinedSuggestion[] = [
    ...mockSuggestions.map(s => ({ ...s, suggestionType: 'edit' as const })),
    ...mockNewEntrySuggestions.map(s => ({ ...s, suggestionType: 'new' as const })),
  ].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="Admin: Content Suggestions"
        description="Review and manage user-submitted content edits and new entries."
      />
      {allSuggestions.length > 0 ? (
        <div className="space-y-6">
          {allSuggestions.map((suggestion) => {
            const contentTypeDisplay = suggestion.contentType.charAt(0).toUpperCase() + suggestion.contentType.slice(1);
            let cardTitle = '';
            if (suggestion.suggestionType === 'edit') {
              cardTitle = `Edit for ${contentTypeDisplay}: ${suggestion.contentId} (Field: ${suggestion.fieldName})`;
            } else {
              const proposedName = suggestion.suggestedData?.name || suggestion.suggestedData?.title || 'N/A';
              cardTitle = `New ${contentTypeDisplay} Suggestion: ${proposedName}`;
            }

            return (
              <Card key={suggestion.id} className="shadow-md">
                <CardHeader>
                  <div className="flex justify-between items-start">
                      <div>
                          <CardTitle className="font-headline text-lg">
                              {cardTitle}
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
                  {suggestion.suggestionType === 'edit' && (
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
                  )}
                  {suggestion.suggestionType === 'new' && suggestion.suggestedData && (
                    <div className="mb-4 text-sm">
                        <h4 className="font-semibold mb-1">Suggested Data:</h4>
                        <div className="p-2 bg-accent/20 rounded-md">
                            {Object.entries(suggestion.suggestedData).map(([key, value]) => (
                                <div key={key} className="grid grid-cols-[max-content_1fr] gap-x-2 text-xs mb-1">
                                    <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                                    <pre className="whitespace-pre-wrap break-all">{typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}</pre>
                                </div>
                            ))}
                        </div>
                    </div>
                  )}
                  {suggestion.reason && (
                      <div className="mb-4">
                          <h4 className="font-semibold mb-1 text-sm">Reason:</h4>
                          <p className="text-sm text-foreground/80 p-2 bg-muted/50 rounded-md">{suggestion.reason}</p>
                      </div>
                  )}
                  {suggestion.evidence && (
                    <div>
                      <h4 className="font-semibold mb-1 text-sm">Evidence:</h4>
                      <p className="text-sm text-foreground/80 p-2 bg-muted/50 rounded-md break-all">
                        {suggestion.evidence.startsWith('http') ? (
                          <a href={suggestion.evidence} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {suggestion.evidence}
                          </a>
                        ) : (
                          suggestion.evidence
                        )}
                      </p>
                    </div>
                  )}
                  {suggestion.status !== 'Pending' && suggestion.reviewedBy && (
                      <p className="text-xs text-muted-foreground mt-4">
                          Reviewed by {suggestion.reviewedBy} on {new Date(suggestion.reviewedAt!).toLocaleDateString()}
                      </p>
                  )}
                </CardContent>
                {suggestion.status === 'Pending' && (
                  <CardFooter className="flex justify-end gap-2">
                    {suggestion.suggestionType === 'edit' && (
                        <Button variant="outline" size="sm"><Eye className="mr-1 h-4 w-4" /> View Item</Button>
                    )}
                    {suggestion.suggestionType === 'new' && (
                         <Button variant="outline" size="sm" disabled><Eye className="mr-1 h-4 w-4" /> View Item</Button>
                    )}
                    <Button variant="destructive" size="sm"><X className="mr-1 h-4 w-4" /> Reject</Button>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white"><Check className="mr-1 h-4 w-4" /> Approve</Button>
                  </CardFooter>
                )}
              </Card>
            )
          })}
        </div>
      ) : (
        <p>No content suggestions available.</p>
      )}
    </div>
  );
}
