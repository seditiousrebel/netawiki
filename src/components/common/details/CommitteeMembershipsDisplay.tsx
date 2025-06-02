import { Landmark } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface CommitteeMembershipRecord {
  id?: string; // Optional ID for stable keys
  committeeName: string;
  role?: string;
  startDate: string; // Expecting ISO date string or a parsable date string
  endDate?: string; // Can be 'Present' or a date string
}

interface CommitteeMembershipsDisplayProps {
  committeeMemberships?: CommitteeMembershipRecord[];
}

// Replicated date formatting logic for consistency
// In a larger refactor, this could be moved to a shared utils file
const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString; // Return original if not a valid parsable date
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return dateString; // Fallback to original string
  }
};

const CommitteeMembershipsDisplay: React.FC<CommitteeMembershipsDisplayProps> = ({ committeeMemberships }) => {
  if (!committeeMemberships || committeeMemberships.length === 0) {
    return null; // Render nothing if there are no committee memberships
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline text-xl flex items-center gap-2">
          <Landmark className="h-5 w-5 text-primary" /> Committee Memberships
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {committeeMemberships.map((mem, idx) => (
            <li key={mem.id || idx} className="text-sm border-b border-border pb-3 last:border-b-0 last:pb-0">
              <div>
                <p className="font-semibold text-base">{mem.committeeName}</p>
                {mem.role && (
                  <p className="text-muted-foreground">{mem.role}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(mem.startDate)} – {mem.endDate === 'Present' ? 'Present' : formatDate(mem.endDate)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default CommitteeMembershipsDisplay;
