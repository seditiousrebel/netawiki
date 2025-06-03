import React, { memo } from 'react'; // Import memo
import { Landmark } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Link from 'next/link';

interface CommitteeMembershipRecord {
  committeeId?: string;
  committeeSlug?: string;
  committeeName: string;
  role?: string;
  startDate: string;
  endDate?: string;
}

interface CommitteeMembershipsDisplayProps {
  committeeMemberships?: CommitteeMembershipRecord[];
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
    });
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return dateString;
  }
};

const CommitteeMembershipsDisplay: React.FC<CommitteeMembershipsDisplayProps> = ({ committeeMemberships }) => {
  if (!committeeMemberships || committeeMemberships.length === 0) {
    // If it's intended to be a card even when empty, return the card with a message.
    // For now, returning null as per previous logic if not wrapped by parent card.
    // However, if it's a standalone card, it should show "No memberships".
    // Let's assume it should be a card, so we provide the structure.
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-headline text-xl flex items-center gap-2">
            <Landmark className="h-5 w-5 text-primary" /> Committee Memberships
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No committee memberships listed yet.</p>
        </CardContent>
      </Card>
    );
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
            <li key={mem.committeeId || mem.committeeName || idx} className="text-sm border-b border-border pb-3 last:border-b-0 last:pb-0">
              <div>
                {mem.committeeId || mem.committeeSlug ? (
                  <Link href={`/committees/${mem.committeeSlug || mem.committeeId}`} className="text-primary hover:underline">
                    <p className="font-semibold text-base">{mem.committeeName}</p>
                  </Link>
                ) : (
                  <p className="font-semibold text-base">{mem.committeeName}</p>
                )}
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

export default memo(CommitteeMembershipsDisplay);
