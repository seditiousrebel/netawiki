import React, { memo } from 'react'; // Import memo
import Link from 'next/link';
import { FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SponsoredBill {
  id: string;
  title: string;
  billNumber: string;
  status: string;
  sponsorshipType?: string; // e.g., 'Primary Sponsor', 'Co-Sponsor'
}

interface SponsoredBillsDisplayProps {
  sponsoredBills?: SponsoredBill[];
}

const SponsoredBillsDisplay: React.FC<SponsoredBillsDisplayProps> = ({ sponsoredBills }) => {
  if (!sponsoredBills || sponsoredBills.length === 0) {
    return null; // Render nothing if there are no sponsored bills
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" /> Sponsored Bills
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {sponsoredBills.map((bill) => (
            <li 
              key={bill.id} 
              className="p-3 border rounded-md bg-card-foreground/5 hover:bg-card-foreground/10 transition-colors"
            >
              <Link href={`/bills/${bill.id}`} className="font-semibold text-primary hover:underline">
                {bill.title} ({bill.billNumber})
              </Link>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-1 space-y-1 sm:space-y-0">
                <p className="text-xs text-muted-foreground">
                  Status: {bill.status}
                </p>
                {bill.sponsorshipType && (
                  <Badge variant="outline" className="text-xs whitespace-nowrap">
                    {bill.sponsorshipType}
                  </Badge>
                )}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default memo(SponsoredBillsDisplay);
