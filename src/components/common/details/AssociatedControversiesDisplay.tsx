import React, { memo } from 'react'; // Import memo
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { Badge, type BadgeProps } from '@/components/ui/badge';

interface ControversyItem {
  id: string;
  title: string;
  status: string;
  severityIndicator: 'Critical' | 'High' | 'Medium' | 'Low' | string;
}

interface AssociatedControversiesDisplayProps {
  controversies?: ControversyItem[];
}

type BadgeVariant = BadgeProps['variant'];

const getSeverityBadgeVariant = (severity: ControversyItem['severityIndicator']): BadgeVariant => {
  const lowerSeverity = typeof severity === 'string' ? severity.toLowerCase() : '';
  switch (lowerSeverity) {
    case 'critical':
      return 'destructive';
    case 'high':
      return 'destructive'; // Also destructive for high
    case 'medium':
      return 'secondary'; // Consider 'warning' if a yellow/orange variant exists
    case 'low':
      return 'outline';
    default:
      return 'outline';
  }
};

const getControversyStatusVariant = (status?: string): BadgeVariant => {
  if (!status) return 'outline';
  const lowerStatus = status.toLowerCase();
  if (lowerStatus.includes('resolved') || lowerStatus.includes('dismissed')) return 'default'; // Consider 'success'
  if (lowerStatus.includes('investigation') || lowerStatus.includes('finding')) return 'secondary'; // Consider 'info' or 'warning'
  if (lowerStatus.includes('alleged')) return 'outline';
  return 'outline';
};


const AssociatedControversiesDisplay: React.FC<AssociatedControversiesDisplayProps> = ({ controversies }) => {
  if (!controversies || controversies.length === 0) {
    return <p className="text-muted-foreground">No controversies listed yet.</p>;
  }

  return (
    <ul className="space-y-3">
      {controversies.map((item) => (
        <li
          key={item.id}
          className="p-3 border rounded-md bg-card-foreground/5 hover:bg-card-foreground/10 transition-colors"
        >
          <Link href={`/controversies/${item.id}`} className="font-semibold text-primary hover:underline text-base block">
            {item.title}
          </Link>
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 gap-y-1 mt-1">
            <Badge variant={getControversyStatusVariant(item.status)} className="text-xs whitespace-nowrap">
              Status: {item.status}
            </Badge>
            <Badge
              variant={getSeverityBadgeVariant(item.severityIndicator)}
              className="text-xs whitespace-nowrap"
            >
              Severity: {item.severityIndicator}
            </Badge>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default memo(AssociatedControversiesDisplay);
