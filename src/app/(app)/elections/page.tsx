
"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/common/page-header';
import { mockElections } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ArrowRight, CalendarDays, VoteIcon, CheckCircle, Clock, SearchIcon, FileText, PlusCircle } from 'lucide-react';
import type { Election, ElectionStatus, ElectionType } from '@/types/gov';
import { format } from 'date-fns';
import { SuggestNewEntryForm } from '@/components/common/suggest-new-entry-form';
import { entitySchemas } from '@/lib/schemas'; // Added
import type { EntityType } from '@/lib/data/suggestions'; // Added
import { getCurrentUser, isUserLoggedIn } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

function getElectionStatusBadgeVariant(status: ElectionStatus) {
  switch (status) {
    case 'Concluded':
      return 'bg-green-500 text-white';
    case 'Ongoing':
    case 'Counting':
      return 'bg-blue-500 text-white';
    case 'Scheduled':
    case 'Upcoming':
      return 'bg-yellow-500 text-black';
    case 'Postponed':
    case 'Cancelled':
      return 'bg-red-500 text-white';
    default:
      return 'bg-secondary text-secondary-foreground';
  }
}

function getElectionStatusIcon(status: ElectionStatus) {
  switch (status) {
    case 'Concluded':
      return <CheckCircle className="mr-1.5 h-4 w-4" />;
    case 'Ongoing':
    case 'Counting':
    case 'Scheduled':
    case 'Upcoming':
      return <Clock className="mr-1.5 h-4 w-4" />;
    default:
      return <VoteIcon className="mr-1.5 h-4 w-4" />;
  }
}


export default function ElectionsPage() {
  const currentUser = getCurrentUser();
  const router = useRouter();
  const { toast } = useToast();
  const [isSuggestNewElectionModalOpen, setIsSuggestNewElectionModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<ElectionType | ''>('');
  const [selectedStatus, setSelectedStatus] = useState<ElectionStatus | ''>('');
  const [sortOption, setSortOption] = useState('date_desc'); // Default sort
  const [filteredElections, setFilteredElections] = useState<Election[]>(mockElections);

  const allElectionTypes = useMemo(() => {
    const types = new Set<ElectionType>();
    mockElections.forEach(election => types.add(election.electionType));
    return Array.from(types).sort();
  }, []);

  const allElectionStatuses = useMemo(() => {
    const statuses = new Set<ElectionStatus>();
    mockElections.forEach(election => statuses.add(election.status));
    return Array.from(statuses).sort();
  }, []);

  useEffect(() => {
    let updatedElections = [...mockElections];

    // Search term filter
    if (searchTerm) {
      updatedElections = updatedElections.filter(election =>
        election.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (election.description && election.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Type filter
    if (selectedType) {
      updatedElections = updatedElections.filter(election => election.electionType === selectedType);
    }
    
    // Status filter
    if (selectedStatus) {
      updatedElections = updatedElections.filter(election => election.status === selectedStatus);
    }

    // Apply sorting
    const getDateVal = (dateStr: string): number => new Date(dateStr).getTime();

    switch (sortOption) {
      case 'date_asc':
        updatedElections.sort((a, b) => getDateVal(a.date) - getDateVal(b.date));
        break;
      case 'name_asc':
        updatedElections.sort((a,b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        updatedElections.sort((a,b) => b.name.localeCompare(a.name));
        break;
      case 'date_desc':
      default:
        updatedElections.sort((a, b) => getDateVal(b.date) - getDateVal(a.date));
        break;
    }

    setFilteredElections(updatedElections);
  }, [searchTerm, selectedType, selectedStatus, sortOption]);

  const handleOpenSuggestNewElectionModal = () => {
    if (isUserLoggedIn()) {
      setIsSuggestNewElectionModalOpen(true);
    } else {
      router.push('/auth/login');
    }
  };

  const handleSuggestNewElectionSubmit = (newEntryData: any) => {
    console.log("New Election Suggestion:", newEntryData);
    toast({
      title: "Suggestion Submitted",
      description: `Suggestion for new election '${newEntryData.name || 'N/A'}' submitted for review.`,
      duration: 5000,
    });
    setIsSuggestNewElectionModalOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="Elections Hub"
        description="Track upcoming, ongoing, and past elections, results, and candidate information."
        actions={
          <Button variant="default" onClick={handleOpenSuggestNewElectionModal}>
            <PlusCircle className="mr-2 h-4 w-4" /> Suggest New Election
          </Button>
        }
      />

      <SuggestNewEntryForm
        isOpen={isSuggestNewElectionModalOpen}
        onOpenChange={setIsSuggestNewElectionModalOpen}
        entityType={'Election' as EntityType} // Used EntityType
        entitySchema={entitySchemas.Election} // Passed the schema
        onSubmit={handleSuggestNewElectionSubmit}
      />

      <Card className="mb-8 p-6 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
          <div className="sm:col-span-2 md:col-span-4">
            <Label htmlFor="search-elections">Search Elections</Label>
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search-elections"
                placeholder="Name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="filter-type">Type</Label>
            <Select value={selectedType} onValueChange={(value) => setSelectedType(value === 'all' ? '' : value as ElectionType)}>
              <SelectTrigger id="filter-type"><SelectValue placeholder="Filter by type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {allElectionTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="filter-status">Status</Label>
            <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value === 'all' ? '' : value as ElectionStatus)}>
              <SelectTrigger id="filter-status"><SelectValue placeholder="Filter by status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {allElectionStatuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-full sm:col-span-1 md:col-span-2">
            <Label htmlFor="sort-elections">Sort By</Label>
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger id="sort-elections"><SelectValue placeholder="Sort by..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="date_desc">Date (Newest First)</SelectItem>
                <SelectItem value="date_asc">Date (Oldest First)</SelectItem>
                <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                <SelectItem value="name_desc">Name (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {filteredElections.length > 0 ? (
        <div className="space-y-6">
          {filteredElections.map((election: Election) => (
            <Card key={election.id} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <CardTitle className="font-headline text-xl mb-1">
                      <Link href={`/elections/${election.slug || election.id}`} className="text-primary hover:underline">
                        {election.name}
                      </Link>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1.5 text-sm">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      {format(new Date(election.date), 'MMMM dd, yyyy')}
                      <span className="mx-1 text-muted-foreground">|</span>
                      <Badge variant="outline">{election.electionType}</Badge>
                    </CardDescription>
                  </div>
                  <Badge className={cn("text-xs px-2.5 py-1", getElectionStatusBadgeVariant(election.status))}>
                     {getElectionStatusIcon(election.status)}
                    {election.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 mb-3 line-clamp-2">{election.description}</p>
                <div className="text-xs text-muted-foreground space-x-3">
                    {election.country && <span>Country: {election.country}</span>}
                    {election.province && <span>Province: {election.province}</span>}
                    {election.districts && election.districts.length > 0 && <span>District(s): {election.districts.join(', ')}</span>}
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Link href={`/elections/${election.slug || election.id}`} className="ml-auto">
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
            <p className="mt-4 text-lg font-medium">No elections found.</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
}

