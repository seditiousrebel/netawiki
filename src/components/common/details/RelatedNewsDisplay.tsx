import React, { memo } from 'react'; // Import memo
import { Newspaper, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface NewsItem {
  id?: string; // Optional ID for stable keys
  url: string;
  title: string;
  sourceName: string;
  publicationDate: string; // Date-parsable string
  summary?: string;
}

interface RelatedNewsDisplayProps {
  newsItems?: NewsItem[];
}

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return dateString;
  }
};

const RelatedNewsDisplay: React.FC<RelatedNewsDisplayProps> = ({ newsItems }) => {
  if (!newsItems || newsItems.length === 0) {
    return null; // Render nothing if there are no news items
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-primary" /> Related News
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {newsItems.map((item, idx) => (
            <li 
              key={item.id || idx} 
              className="text-sm border-b border-border pb-3 last:border-b-0 last:pb-0"
            >
              <a 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-semibold text-base text-primary hover:underline flex items-center gap-1"
              >
                {item.title}
                <ExternalLink className="h-4 w-4 flex-shrink-0" />
              </a>
              <p className="text-xs text-muted-foreground mt-0.5">
                {item.sourceName} - {formatDate(item.publicationDate)}
              </p>
              {item.summary && (
                <p className="text-sm text-foreground/90 mt-1">{item.summary}</p>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default memo(RelatedNewsDisplay);
