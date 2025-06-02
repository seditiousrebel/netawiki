import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ListChecks } from 'lucide-react'; // Added a relevant icon

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

const PromisesDisplay: React.FC<PromisesDisplayProps> = ({ promises }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center gap-2">
          <ListChecks className="h-5 w-5 text-primary" /> Promises
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!promises || promises.length === 0 ? (
          <p className="text-muted-foreground">No promises listed yet.</p>
        ) : (
          <ul className="space-y-3">
            {promises.map((promise) => (
              <li 
                key={promise.id} 
                className="p-3 border rounded-md bg-card-foreground/5 hover:bg-card-foreground/10 transition-colors"
              >
                <Link href={`/promises#${promise.id}`} className="font-semibold text-primary hover:underline text-base">
                  {promise.title}
                </Link>
                <p className="text-xs text-muted-foreground mt-1">
                  Status: {promise.status}
                  {promise.dueDate && (
                    <span className="ml-2">(Due: {formatDate(promise.dueDate)})</span>
                  )}
                </p>
              </li>
            ))}
          </ul>
        )}
        {/* Optional: Link to view all promises can be added by the consuming page */}
      </CardContent>
    </Card>
  );
};

export default PromisesDisplay;
