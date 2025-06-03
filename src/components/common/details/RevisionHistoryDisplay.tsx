
import React, { memo, useState, useEffect } from 'react'; // Added useState, useEffect
import { History } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';

interface RevisionHistoryItem {
  id: string;
  date: string; // ISO Date string
  author: string;
  event: string;
  details?: string;
  suggestionId?: string;
}

interface RevisionHistoryDisplayProps {
  historyItems?: RevisionHistoryItem[];
}

// Helper component to render time on client-side only
const ClientRenderedTime: React.FC<{ isoDate: string }> = ({ isoDate }) => {
  const [timeString, setTimeString] = useState<string>('');

  useEffect(() => {
    if (isoDate) {
      try {
        const date = parseISO(isoDate);
        if (!isNaN(date.getTime())) {
          setTimeString(format(date, 'hh:mm a'));
        } else {
          console.warn("Invalid date string for time formatting:", isoDate);
          setTimeString(''); // Or some fallback
        }
      } catch (error) {
        console.error("Error formatting time:", error);
        setTimeString(''); // Or some fallback
      }
    }
  }, [isoDate]);

  // Render nothing on the server and during initial client render
  // The time will be filled in by useEffect on the client
  if (typeof window === 'undefined' || !timeString) {
    return null;
  }

  return <>{`, ${timeString}`}</>;
};

const formatDatePart = (dateString: string | undefined): string => {
  if (!dateString) return '';
  try {
    const date = parseISO(dateString);
    if (isNaN(date.getTime())) {
      console.warn("Invalid date string for parseISO in formatDatePart:", dateString);
      return dateString;
    }
    return format(date, 'MM/dd/yyyy');
  } catch (error) {
    console.error("Error formatting date part:", dateString, error);
    return dateString;
  }
};

const RevisionHistoryDisplay: React.FC<RevisionHistoryDisplayProps> = ({ historyItems }) => {
  if (!historyItems || historyItems.length === 0) {
    return null;
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
                  {formatDatePart(item.date)}
                  <ClientRenderedTime isoDate={item.date} />
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

export default memo(RevisionHistoryDisplay);
