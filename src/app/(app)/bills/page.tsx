import { PageHeader } from '@/components/common/page-header';
import { mockBills } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, FileText, Edit } from 'lucide-react';
import type { Bill } from '@/types/gov';


export default function BillsPage() {
  const bills = mockBills;

  return (
    <div>
      <PageHeader
        title="Bill Tracking"
        description="Follow legislative bills, their summaries, sponsorship, and status."
      />
      {bills.length > 0 ? (
        <div className="space-y-6">
          {bills.map((bill: Bill) => (
            <Card key={bill.id} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="font-headline text-xl mb-1">
                      <Link href={`/bills/${bill.id}`} className="text-primary hover:underline">
                        {bill.title} ({bill.billNumber})
                      </Link>
                    </CardTitle>
                    <CardDescription>Introduced: {new Date(bill.introducedDate).toLocaleDateString()}</CardDescription>
                  </div>
                  <Badge variant={bill.status === 'Became Law' ? 'default' : 'secondary'} 
                         className={bill.status === 'Became Law' ? 'bg-green-500 text-white' : 
                                    bill.status.startsWith('Passed') ? 'bg-blue-500 text-white' : ''}>
                    {bill.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 mb-3 line-clamp-3">{bill.summary}</p>
                {bill.sponsors.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Primary Sponsor: {' '}
                    <Link href={`/politicians/${bill.sponsors.find(s => s.type === 'Primary')?.id}`} className="text-primary hover:underline">
                         {bill.sponsors.find(s => s.type === 'Primary')?.name}
                    </Link>
                  </p>
                )}
                 {bill.lastActionDescription && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Last Action ({bill.lastActionDate ? new Date(bill.lastActionDate).toLocaleDateString() : 'N/A'}): {bill.lastActionDescription}
                  </p>
                )}
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <Button variant="ghost" size="sm">
                  <Edit className="mr-2 h-3 w-3" /> Suggest Edit
                </Button>
                <Link href={`/bills/${bill.id}`}>
                  <Button variant="outline" size="sm">
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <p>No bills found.</p>
      )}
    </div>
  );
}
