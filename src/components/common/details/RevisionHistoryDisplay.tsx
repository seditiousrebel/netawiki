import { History } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface RevisionHistoryItem {
  id: string;
  date: string; // Date-parsable string, should also include time
  author: string;
  event: string;
  details?: string;
  suggestionId?: string;
}

interface RevisionHistoryDisplayProps {
  historyItems?: RevisionHistoryItem[];
}

const formatDateTime = (dateString: string | undefined): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      // second: '2-digit', // Optional: uncomment if seconds are needed
      hour12: true,
    });
  } catch (error) {
    console.error("Error formatting date-time:", dateString, error);
    return dateString;
  }
};

const RevisionHistoryDisplay: React.FC<RevisionHistoryDisplayProps> = ({ historyItems }) => {
  if (!historyItems || historyItems.length === 0) {
    return null; // Render nothing if there is no history
    // Or: return <p className="text-muted-foreground">No revision history available.</p>; if a message is preferred
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center gap-2">
          <History className="h-5 w-5 text-primary" /> Revision History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {historyItems.map((item) => (
            <li 
              key={item.id} 
              className="text-sm border-b border-border/80 pb-3 last:border-b-0 last:pb-0"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-1">
                <span className="font-semibold text-foreground/90 text-base">{item.event}</span>
                <span className="text-xs text-muted-foreground mt-0.5 sm:mt-0">
                  {formatDateTime(item.date)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Author: <span className="font-medium text-foreground/80">{item.author}</span></p>
              {item.details && (
                <p className="mt-1.5 text-xs text-foreground/80 bg-muted/50 p-2 rounded-md whitespace-pre-wrap">
                  {item.details}
                </p>
              )}
              {item.suggestionId && (
                <p className="text-xs text-muted-foreground mt-1">
                  Suggestion ID: <span className="font-medium text-foreground/80">{item.suggestionId}</span>
                </p>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default RevisionHistoryDisplay;
