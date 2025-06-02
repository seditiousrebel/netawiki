import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge, BadgeProps } from '@/components/ui/badge';

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
    case 'high':
      return 'destructive';
    case 'medium':
      return 'secondary'; // Or 'warning' if available and preferred
    case 'low':
      return 'outline'; // Or a less prominent variant like 'default' or 'info'
    default:
      return 'outline';
  }
};

const AssociatedControversiesDisplay: React.FC<AssociatedControversiesDisplayProps> = ({ controversies }) => {
  if (!controversies || controversies.length === 0) {
    return null; // Render nothing if there are no controversies
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-primary" /> Associated Controversies
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {controversies.map((item) => (
            <li 
              key={item.id} 
              className="p-3 border rounded-md bg-card-foreground/5 hover:bg-card-foreground/10 transition-colors"
            >
              <Link href={`/controversies/${item.id}`} className="font-semibold text-primary hover:underline text-base">
                {item.title}
              </Link>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mt-1 space-y-1 sm:space-y-0">
                <p className="text-xs text-muted-foreground">
                  Status: {item.status}
                </p>
                <Badge 
                  variant={getSeverityBadgeVariant(item.severityIndicator)} 
                  className="text-xs whitespace-nowrap mt-1 sm:mt-0"
                >
                  Severity: {item.severityIndicator}
                </Badge>
              </div>
            </li>
          ))}
        </ul>
        {/* Optional: Link to view all controversies - can be added by the consuming page if needed */}
        {/* Example:
        <Link href="/controversies" className="mt-4 inline-block">
           <Button variant="link" className="p-0 h-auto text-primary text-sm">View all controversies</Button>
        </Link>
        */}
      </CardContent>
    </Card>
  );
};

export default AssociatedControversiesDisplay;
