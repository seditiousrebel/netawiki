import React, { memo } from 'react'; // Import memo
import Link from 'next/link';
import { ClipboardList } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface VoteRecordItem {
  id?: string; // Optional ID for stable keys
  billId: string;
  billTitle: string;
  billNumber: string;
  chamber?: 'House' | 'Senate' | string;
  voteDate: string; // Date-parsable string
  vote: 'Yea' | 'Nay' | 'Abstain' | 'Not Voting' | string;
}

interface VotingRecordDisplayProps {
  votingRecords?: VoteRecordItem[];
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

const getVoteClass = (vote: VoteRecordItem['vote']): string => {
  switch (vote.toLowerCase()) {
    case 'yea':
      return 'text-green-600 dark:text-green-500';
    case 'nay':
      return 'text-red-600 dark:text-red-500';
    case 'abstain':
      return 'text-gray-600 dark:text-gray-400';
    case 'not voting':
      return 'text-yellow-600 dark:text-yellow-500';
    default:
      return 'text-muted-foreground';
  }
};

const VotingRecordDisplay: React.FC<VotingRecordDisplayProps> = ({ votingRecords }) => {
  if (!votingRecords || votingRecords.length === 0) {
    return null; // Render nothing if there are no voting records
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary" /> Voting Record
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {votingRecords.map((record, idx) => (
            <li 
              key={record.id || `vote-${record.billId}-${idx}`} 
              className="border-b border-border pb-3 last:border-b-0 last:pb-0"
            >
              <Link href={`/bills/${record.billId}`} className="font-semibold text-primary hover:underline text-base">
                {record.billTitle} ({record.billNumber})
              </Link>
              <div className="mt-1 space-y-0.5">
                <p className="text-sm text-muted-foreground">
                  Vote: <span className={`font-medium ${getVoteClass(record.vote)}`}>{record.vote}</span>
                  {record.chamber && <span className="ml-1">in {record.chamber}</span>}
                </p>
                <p className="text-xs text-muted-foreground">
                  Date: {formatDate(record.voteDate)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default memo(VotingRecordDisplay);
