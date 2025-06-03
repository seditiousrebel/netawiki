import React, { memo } from 'react'; // Import memo
import Link from 'next/link';
import { ListChecks } from 'lucide-react';
import { Badge, type BadgeProps } from '@/components/ui/badge';

interface PromiseItemDisplay {
  id: string;
  title: string;
  status: string;
  dueDate?: string; // Date-parsable string
}

interface PromisesDisplayProps {
  promises?: PromiseItemDisplay[];
}

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString; // Return original string if it's not a valid date
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return dateString; // Return original string on error
  }
};

type PromiseStatusBadgeVariant = BadgeProps['variant'];

const getPromiseStatusVariant = (status: string): PromiseStatusBadgeVariant => {
  if (!status) return 'outline';
  const lowerStatus = status.toLowerCase();
  if (lowerStatus.includes('fulfilled')) return 'default'; // Consider this 'success' if you have a green badge
  if (lowerStatus.includes('progress')) return 'secondary'; // Consider 'info' or 'warning'
  if (lowerStatus.includes('broken') || lowerStatus.includes('failed')) return 'destructive';
  if (lowerStatus.includes('pending') || lowerStatus.includes('stalled')) return 'outline';
  return 'outline';
};

const PromisesDisplay: React.FC<PromisesDisplayProps> = ({ promises }) => {
  if (!promises || promises.length === 0) {
    return <p className="text-muted-foreground">No promises listed yet.</p>;
  }

  return (
    <ul className="space-y-3">
      {promises.map((promise) => (
        <li
          key={promise.id}
          className="p-3 border rounded-md bg-card-foreground/5 hover:bg-card-foreground/10 transition-colors"
        >
          <Link href={`/promises#${promise.id}`} className="font-semibold text-primary hover:underline text-base block">
            {promise.title}
          </Link>
          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
            <span>Status:</span>
            <Badge variant={getPromiseStatusVariant(promise.status)} className="text-xs">
              {promise.status}
            </Badge>
            {promise.dueDate && (
              <span>(Due: {formatDate(promise.dueDate)})</span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default memo(PromisesDisplay);
