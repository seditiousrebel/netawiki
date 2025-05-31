
"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/page-header';
import { getAllCommittees, getCommitteeByName } from '@/lib/mock-data'; // Ensure getCommitteeByName is available if needed
import type { Committee } from '@/types/gov';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, Landmark, Building, Search, ArrowRight, PlusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SuggestNewEntryForm } from '@/components/common/suggest-new-entry-form';
import { entitySchemas } from '@/lib/schemas'; // Added
import type { EntityType } from '@/lib/data/suggestions'; // Added
import { getCurrentUser, isUserLoggedIn } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast"; // Added for toast notifications
import { Label } from '@/components/ui/label';

export default function CommitteesPage() {
  const { toast } = useToast(); // Initialize useToast
  const currentUser = getCurrentUser();
  const router = useRouter();
  const [isSuggestNewCommitteeModalOpen, setIsSuggestNewCommitteeModalOpen] = useState(false);
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [filteredCommittees, setFilteredCommittees] = useState<Committee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedHouse, setSelectedHouse] = useState('');
  const [sortOption, setSortOption] = useState('name_asc');

  useEffect(() => {
    setCommittees(getAllCommittees());
  }, []);

  const committeeTypes = Array.from(new Set(committees.map(c => c.committeeType))).sort();
  const committeeHouses = Array.from(new Set(committees.map(c => c.house).filter(Boolean) as string[])).sort();

  useEffect(() => {
    let tempCommittees = [...committees];

    if (searchTerm) {
      tempCommittees = tempCommittees.filter(committee =>
        committee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (committee.nepaliName && committee.nepaliName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        committee.mandate?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType) {
      tempCommittees = tempCommittees.filter(committee => committee.committeeType === selectedType);
    }

    if (selectedHouse) {
      tempCommittees = tempCommittees.filter(committee => committee.house === selectedHouse);
    }
    
    switch (sortOption) {
      case 'name_asc':
        tempCommittees.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        tempCommittees.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'establishment_newest':
        tempCommittees.sort((a, b) => {
          const dateA = a.establishmentDate ? new Date(a.establishmentDate).getTime() : 0;
          const dateB = b.establishmentDate ? new Date(b.establishmentDate).getTime() : 0;
          return dateB - dateA;
        });
        break;
      case 'establishment_oldest':
        tempCommittees.sort((a, b) => {
          const dateA = a.establishmentDate ? new Date(a.establishmentDate).getTime() : Number.MAX_SAFE_INTEGER;
          const dateB = b.establishmentDate ? new Date(b.establishmentDate).getTime() : Number.MAX_SAFE_INTEGER;
          return dateA - dateB;
        });
        break;
      default:
        break;
    }

    setFilteredCommittees(tempCommittees);
  }, [committees, searchTerm, selectedType, selectedHouse, sortOption]);

  const getChairpersonName = (committee: Committee): string | null => {
    const chairperson = committee.members?.find(member => member.role === 'Chairperson');
    return chairperson ? chairperson.politicianName : null;
  };

  const handleOpenSuggestNewCommitteeModal = () => {
    if (isUserLoggedIn()) {
      setIsSuggestNewCommitteeModalOpen(true);
    } else {
      router.push('/auth/login');
    }
  };

  const handleSuggestNewCommitteeSubmit = (newEntryData: any) => {
    console.log("New Committee Suggestion:", newEntryData);
    toast({
      title: "Suggestion Submitted",
      description: `Suggestion for new committee '${newEntryData.name || 'N/A'}' submitted for review.`,
      duration: 5000,
    });
    setIsSuggestNewCommitteeModalOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="Parliamentary Committees"
        description="Explore committees, their mandates, members, and activities."
        actions={
          <Button variant="default" onClick={handleOpenSuggestNewCommitteeModal}>
            <PlusCircle className="mr-2 h-4 w-4" /> Suggest New Committee
          </Button>
        }
      />

      <SuggestNewEntryForm
        isOpen={isSuggestNewCommitteeModalOpen}
        onOpenChange={setIsSuggestNewCommitteeModalOpen}
        entityType={'Committee' as EntityType} // Used EntityType
        entitySchema={entitySchemas.Committee} // Passed the schema
        onSubmit={handleSuggestNewCommitteeSubmit}
      />

      <Card className="mb-8 p-6 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
          <div className="col-span-full md:col-span-1">
            <Label htmlFor="search-committee">Search Committees</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search-committee"
                placeholder="Name, mandate..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <div className="col-span-full md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <Label htmlFor="filter-type">Type</Label>
              <Select value={selectedType} onValueChange={(value) => setSelectedType(value === 'all' ? '' : value)}>
                <SelectTrigger id="filter-type"><SelectValue placeholder="All Types" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {committeeTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="filter-house">House</Label>
              <Select value={selectedHouse} onValueChange={(value) => setSelectedHouse(value === 'all' ? '' : value)}>
                <SelectTrigger id="filter-house"><SelectValue placeholder="All Houses" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Houses</SelectItem>
                  {committeeHouses.map(house => <SelectItem key={house} value={house}>{house}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sort-committees">Sort By</Label>
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger id="sort-committees"><SelectValue placeholder="Sort by..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name_desc">Name (Z-A)</SelectItem>
                  <SelectItem value="establishment_newest">Established (Newest)</SelectItem>
                  <SelectItem value="establishment_oldest">Established (Oldest)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {filteredCommittees.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommittees.map((committee) => {
            const chairpersonName = getChairpersonName(committee);
            return (
              <Card key={committee.id} className="shadow-md hover:shadow-lg transition-shadow flex flex-col">
                <CardHeader>
                  <CardTitle className="font-headline text-xl text-primary">
                    <Link href={`/committees/${committee.slug || committee.id}`}>
                      {committee.name}
                    </Link>
                  </CardTitle>
                  {committee.nepaliName && <CardDescription className="text-sm -mt-1">{committee.nepaliName}</CardDescription>}
                </CardHeader>
                <CardContent className="space-y-2 text-sm flex-grow">
                  <div className="flex items-center gap-2">
                    <Landmark className="h-4 w-4 text-muted-foreground" />
                    <span>{committee.committeeType}</span>
                  </div>
                  {committee.house && (
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>{committee.house}</span>
                    </div>
                  )}
                  {chairpersonName && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>Chair: {chairpersonName}</span>
                    </div>
                  )}
                  {committee.tags && committee.tags.length > 0 && (
                    <div className="pt-2">
                      {committee.tags.slice(0, 3).map(tag => <Badge key={tag} variant="secondary" className="mr-1 mb-1 text-xs">{tag}</Badge>)}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Link href={`/committees/${committee.slug || committee.id}`} className="w-full">
                    <Button variant="outline" className="w-full">
                      View Details <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10">
          <Users className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-lg font-medium">No committees found.</p>
          <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
}
