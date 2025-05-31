
"use client";

import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/common/page-header';
import { mockBills } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import BillStatusChart from '@/components/charts/BillStatusChart'; // Import BillStatusChart
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, FileText, Edit, SearchIcon, PlusCircle } from 'lucide-react';
import type { Bill, BillStatus } from '@/types/gov';
import { useToast } from "@/hooks/use-toast";
import { Input } from '@/components/ui/input';
import { SuggestNewEntryForm } from '@/components/common/suggest-new-entry-form';
import { getCurrentUser, isUserLoggedIn } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function BillsPage() {
  const { toast } = useToast();
  const currentUser = getCurrentUser();
  const router = useRouter();
  const [isSuggestNewBillModalOpen, setIsSuggestNewBillModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<BillStatus | ''>('');
  const [sortOption, setSortOption] = useState('introduced_desc'); // Default sort
  const [filteredBills, setFilteredBills] = useState<Bill[]>(mockBills);

  const allStatuses = useMemo(() => {
    const statuses = new Set<BillStatus>();
    mockBills.forEach(bill => statuses.add(bill.status));
    return Array.from(statuses).sort();
  }, []);

  useEffect(() => {
    let updatedBills = [...mockBills];

    // Search term filter
    if (searchTerm) {
      updatedBills = updatedBills.filter(bill =>
        bill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (selectedStatus) {
      updatedBills = updatedBills.filter(bill => bill.status === selectedStatus);
    }

    // Apply sorting
    const getDateVal = (dateStr: string | undefined, ascending: boolean = true): number => {
        if (!dateStr) return ascending ? Number.MAX_SAFE_INTEGER : Number.MIN_SAFE_INTEGER;
        return new Date(dateStr).getTime();
    };

    switch (sortOption) {
      case 'introduced_desc':
        updatedBills.sort((a, b) => getDateVal(b.introducedDate, false) - getDateVal(a.introducedDate, false));
        break;
      case 'introduced_asc':
        updatedBills.sort((a, b) => getDateVal(a.introducedDate) - getDateVal(b.introducedDate));
        break;
      case 'last_action_desc':
        updatedBills.sort((a, b) => getDateVal(b.lastActionDate, false) - getDateVal(a.lastActionDate, false));
        break;
      case 'last_action_asc':
        updatedBills.sort((a, b) => getDateVal(a.lastActionDate) - getDateVal(b.lastActionDate));
        break;
      default:
        updatedBills.sort((a, b) => getDateVal(b.introducedDate, false) - getDateVal(a.introducedDate, false)); // Default to newest introduced
        break;
    }

    setFilteredBills(updatedBills);
  }, [searchTerm, selectedStatus, sortOption]);

  const handleOpenSuggestNewBillModal = () => {
    if (isUserLoggedIn()) {
      setIsSuggestNewBillModalOpen(true);
    } else {
      router.push('/auth/login');
    }
  };

  const handleSuggestNewBillSubmit = (newEntryData: any) => {
    console.log("New Bill Suggestion:", newEntryData);
    toast({
      title: "Suggestion Submitted",
      description: `Suggestion for new bill '${newEntryData.title || 'N/A'}' submitted for review.`,
      duration: 5000,
    });
    setIsSuggestNewBillModalOpen(false);
  };

  const handleSuggestEdit = () => {
    if (!isUserLoggedIn()) {
      router.push('/auth/login');
      return;
    }
    toast({
      title: "Suggest Edit Feature",
      description: "This functionality is under development. Approved suggestions will update the content. You can see mock suggestions being managed on the /admin/suggestions page.",
      duration: 6000,
    });
  };

  return (
    <div>
      <PageHeader
        title="Bill Tracking"
        description="Follow legislative bills, their summaries, sponsorship, and status."
        actions={
          <Button variant="default" onClick={handleOpenSuggestNewBillModal}>
            <PlusCircle className="mr-2 h-4 w-4" /> Suggest New Bill
          </Button>
        }
      />

      <SuggestNewEntryForm
        isOpen={isSuggestNewBillModalOpen}
        onOpenChange={setIsSuggestNewBillModalOpen}
        entityType="Bill"
        onSubmit={handleSuggestNewBillSubmit}
      />

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Bill Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <BillStatusChart billData={mockBills} />
        </CardContent>
      </Card>

      <Card className="mb-8 p-6 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
          <div>
            <Label htmlFor="search-bills">Search Bills</Label>
             <div className="relative">
                <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                id="search-bills"
                placeholder="Title or bill number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
                />
            </div>
          </div>
          <div>
            <Label htmlFor="filter-status">Status</Label>
            <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value === 'all' ? '' : value as BillStatus)}>
              <SelectTrigger id="filter-status"><SelectValue placeholder="Filter by status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {allStatuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="sort-bills">Sort By</Label>
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger id="sort-bills"><SelectValue placeholder="Sort by..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="introduced_desc">Introduced Date (Newest)</SelectItem>
                <SelectItem value="introduced_asc">Introduced Date (Oldest)</SelectItem>
                <SelectItem value="last_action_desc">Last Action (Newest)</SelectItem>
                <SelectItem value="last_action_asc">Last Action (Oldest)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {filteredBills.length > 0 ? (
        <div className="space-y-6">
          {filteredBills.map((bill: Bill) => (
            <Card key={bill.id} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="font-headline text-xl mb-1">
                      <Link href={`/bills/${bill.slug || bill.id}`} className="text-primary hover:underline">
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
                <Button variant="ghost" size="sm" onClick={handleSuggestEdit}>
                  <Edit className="mr-2 h-3 w-3" /> Suggest Edit
                </Button>
                <Link href={`/bills/${bill.slug || bill.id}`}>
                  <Button variant="outline" size="sm">
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium">No bills found.</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
}

    