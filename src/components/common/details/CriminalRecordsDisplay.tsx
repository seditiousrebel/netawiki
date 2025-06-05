import React, { memo } from 'react'; // Import memo
import { Gavel, ExternalLink, Pencil, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'; // Import Button

interface CriminalRecordItem {
  id: string; // ID is now mandatory for edit/delete
  offense: string;
  date: string; // Date-parsable string
  status: 'Convicted' | 'Charges Filed' | 'Alleged' | 'Under Investigation' | 'Acquitted' | 'Dismissed' | 'Appealed' | string; // Match type more closely
  caseNumber?: string;
  court?: string;
  summary?: string;
  sourceUrl?: string;
}

interface CriminalRecordsDisplayProps {
  criminalRecords?: CriminalRecordItem[];
  onEditItem?: (id: string) => void;
  onDeleteItem?: (id: string) => void;
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

type BadgeVariant = BadgeProps['variant'];

const getCriminalStatusBadgeVariant = (status: CriminalRecordItem['status']): BadgeVariant => {
  const lowerStatus = status.toLowerCase();
  if (lowerStatus.includes('convicted')) {
    return 'destructive';
  }
  if (lowerStatus.includes('acquitted') || lowerStatus.includes('dismissed')) {
    return 'default'; // Or 'success' if you have a success variant
  }
  if (lowerStatus.includes('alleged') || lowerStatus.includes('under investigation') || lowerStatus.includes('charges filed')) {
    return 'secondary'; // Or 'warning' if you have one
  }
  return 'outline'; // Default for other statuses
};

const CriminalRecordsDisplay: React.FC<CriminalRecordsDisplayProps> = ({ criminalRecords, onEditItem, onDeleteItem }) => {
  if (!criminalRecords || criminalRecords.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center gap-2">
            <Gavel className="h-5 w-5 text-primary" /> Criminal Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No criminal records available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline text-xl flex items-center gap-2">
          <Gavel className="h-5 w-5 text-primary" /> Criminal Records
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {criminalRecords.map((record, idx) => (
            <li
              key={record.id} // Use mandatory ID for key
              className="text-sm border-b border-border pb-3 last:border-b-0 last:pb-0"
            >
              <div className="flex justify-between items-start">
                <div className="flex-grow">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-1">
                    <p className="font-semibold text-base">{record.offense}</p>
                    <Badge
                      variant={getCriminalStatusBadgeVariant(record.status)}
                      className="mt-1 sm:mt-0 whitespace-nowrap"
                    >
                      {record.status}
                    </Badge>
                  </div>
                  <div className="space-y-0.5 text-xs text-muted-foreground">
                    <p>Date: {formatDate(record.date)}</p>
                    {record.caseNumber && <p>Case Number: {record.caseNumber}</p>}
                    {record.court && <p>Court: {record.court}</p>}
                  </div>
                  {record.summary && (
                    <p className="mt-2 text-sm text-foreground/90">{record.summary}</p>
                  )}
                  {record.sourceUrl && (
                    <a
                      href={record.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-xs flex items-center gap-1 mt-2"
                    >
                      View Source <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
                {(onEditItem || onDeleteItem) && (
                  <div className="ml-4 flex-shrink-0 space-x-2 self-center">
                    {onEditItem && (
                      <Button variant="outline" size="iconXs" onClick={() => onEditItem(record.id)}>
                        <Pencil className="h-3.5 w-3.5" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    )}
                    {onDeleteItem && (
                      <Button variant="destructive" size="iconXs" onClick={() => onDeleteItem(record.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default memo(CriminalRecordsDisplay);
