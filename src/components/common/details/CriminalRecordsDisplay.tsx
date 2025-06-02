import { Gavel, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge, BadgeProps } from '@/components/ui/badge'; // Assuming Badge and BadgeProps are available

interface CriminalRecordItem {
  id?: string; // Optional ID for stable keys
  offense: string;
  date: string; // Date-parsable string
  status: 'Convicted' | 'Charges Filed' | 'Alleged' | 'Under Investigation' | 'Acquitted' | 'Dismissed' | string;
  caseNumber?: string;
  court?: string;
  summary?: string;
  sourceUrl?: string;
}

interface CriminalRecordsDisplayProps {
  criminalRecords?: CriminalRecordItem[];
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

const CriminalRecordsDisplay: React.FC<CriminalRecordsDisplayProps> = ({ criminalRecords }) => {
  if (!criminalRecords || criminalRecords.length === 0) {
    return null; // Render nothing if there are no criminal records
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
              key={record.id || idx} 
              className="text-sm border-b border-border pb-3 last:border-b-0 last:pb-0"
            >
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
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default CriminalRecordsDisplay;
