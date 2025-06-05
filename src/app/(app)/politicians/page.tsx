
"use client";

import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/common/page-header';
import { EntityCard } from '@/components/common/entity-card';
import { mockPoliticians, mockParties, mockCommittees } from '@/lib/mock-data'; // Updated mock-data import
import { getAllCommittees } from '@/lib/data/committees'; // Import function to get committees
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from "@/components/ui/checkbox"; // For MultiSelect
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; // For MultiSelect
import type { Politician, Party, Committee } from '@/types/gov'; // Added Committee
import { Button } from '@/components/ui/button';
import { PlusCircle, UsersIcon } from 'lucide-react'; // Added UsersIcon
import { SuggestNewEntryForm } from '@/components/common/suggest-new-entry-form';
import { FilterBar } from '@/components/common/filter-bar';
import { EmptyState } from '@/components/common/empty-state';
import { entitySchemas } from '@/lib/schemas'; // Added
import type { EntityType } from '@/lib/data/suggestions'; // Added
import { getCurrentUser, isUserLoggedIn } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

export default function PoliticiansPage() {
  const currentUser = getCurrentUser();
  const router = useRouter();
  const { toast } = useToast();
  const [isSuggestNewPoliticianModalOpen, setIsSuggestNewPoliticianModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParty, setSelectedParty] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedConstituency, setSelectedConstituency] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedActivityStatus, setSelectedActivityStatus] = useState('');
  const [selectedCommitteeIds, setSelectedCommitteeIds] = useState<string[]>([]); // New state for selected committees
  const [sortOption, setSortOption] = useState('default');
  const [filteredPoliticians, setFilteredPoliticians] = useState<Politician[]>(mockPoliticians);

  const parties: Party[] = mockParties;
  const committees: Committee[] = useMemo(() => getAllCommittees(), []); // Fetch committees

  const handleSuggestNewPoliticianSubmit = (newEntryData: any) => {
    console.log("New Politician Suggestion:", newEntryData);
    toast({
      title: "Suggestion Submitted",
      description: `Suggestion for new politician '${newEntryData.name}' submitted for review.`,
      duration: 5000,
    });
    setIsSuggestNewPoliticianModalOpen(false);
  };
  
  const provinces = useMemo(() => 
    Array.from(new Set(mockPoliticians.map(p => p.province).filter(Boolean))) as string[]
  , []);

  const constituencies = useMemo(() =>
    Array.from(new Set(mockPoliticians.map(p => p.constituency).filter(Boolean))) as string[]
  , []);

  const positions = useMemo(() =>
    Array.from(new Set(mockPoliticians.map(p => p.positions[0]?.title).filter(Boolean))) as string[]
  , []);

  const genders = useMemo(() =>
    Array.from(new Set(mockPoliticians.map(p => p.gender).filter(Boolean))) as string[]
  , []);

  // Simple MultiSelect Component (can be moved to a separate file later)
  interface MultiSelectProps {
    options: { id: string; name: string }[];
    selectedValues: string[];
    onChange: (selected: string[]) => void;
    placeholder?: string;
  }

  const MultiSelect: React.FC<MultiSelectProps> = ({ options, selectedValues, onChange, placeholder = "Select options" }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (value: string) => {
      const newSelectedValues = selectedValues.includes(value)
        ? selectedValues.filter(v => v !== value)
        : [...selectedValues, value];
      onChange(newSelectedValues);
    };

    const selectedNames = options
      .filter(opt => selectedValues.includes(opt.id))
      .map(opt => opt.name)
      .join(', ');

    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={isOpen} className="w-full justify-between">
            {selectedValues.length > 0 ? (selectedNames.length > 30 ? `${selectedValues.length} selected` : selectedNames) : placeholder}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-4 w-4 shrink-0 opacity-50"><path d="m6 9 6 6 6-6"></path></svg>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <div className="p-2 max-h-60 overflow-y-auto">
            {options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md">
                <Checkbox
                  id={`multiselect-${option.id}`}
                  checked={selectedValues.includes(option.id)}
                  onCheckedChange={() => handleSelect(option.id)}
                />
                <label
                  htmlFor={`multiselect-${option.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1"
                  onClick={(e) => e.stopPropagation()} // Prevent popover from closing when clicking label
                >
                  {option.name}
                </label>
              </div>
            ))}
          </div>
          {options.length === 0 && <p className="p-2 text-sm text-muted-foreground">No options available.</p>}
        </PopoverContent>
      </Popover>
    );
  };

  useEffect(() => {
    let updatedPoliticians = [...mockPoliticians];

    // Apply filters
    if (searchTerm) {
      updatedPoliticians = updatedPoliticians.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.nepaliName && p.nepaliName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.aliases && p.aliases.some(alias => alias.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }
    if (selectedParty) {
      updatedPoliticians = updatedPoliticians.filter(p => p.partyId === selectedParty);
    }
    if (selectedProvince) {
      updatedPoliticians = updatedPoliticians.filter(p => p.province === selectedProvince);
    }
    if (selectedConstituency) {
      updatedPoliticians = updatedPoliticians.filter(p => p.constituency === selectedConstituency);
    }
    if (selectedPosition) {
      updatedPoliticians = updatedPoliticians.filter(p => p.positions[0]?.title === selectedPosition);
    }
    if (selectedGender) {
      updatedPoliticians = updatedPoliticians.filter(p => p.gender === selectedGender);
    }
    if (selectedActivityStatus) {
      const isActive = selectedActivityStatus === 'active';
      updatedPoliticians = updatedPoliticians.filter(p => p.isActiveInPolitics === isActive);
    }

    // Filter by selected committees
    if (selectedCommitteeIds.length > 0) {
      updatedPoliticians = updatedPoliticians.filter(p =>
        p.committeeIds && p.committeeIds.some(committeeId => selectedCommitteeIds.includes(committeeId))
      );
    }

    // Apply sorting
    switch (sortOption) {
      case 'name_asc':
        updatedPoliticians.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        updatedPoliticians.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'rating_desc':
        updatedPoliticians.sort((a, b) => (b.overallRating ?? -1) - (a.overallRating ?? -1));
        break;
      case 'rating_asc':
        updatedPoliticians.sort((a, b) => (a.overallRating ?? -1) - (b.overallRating ?? -1));
        break;
      case 'popularity_desc':
        updatedPoliticians.sort((a, b) => (b.popularityScore ?? -1) - (a.popularityScore ?? -1));
        break;
      case 'popularity_asc':
        updatedPoliticians.sort((a, b) => (a.popularityScore ?? -1) - (b.popularityScore ?? -1));
        break;
      case 'activity_desc': // Newest first
        updatedPoliticians.sort((a, b) => {
          const dateA = a.lastActivityDate ? new Date(a.lastActivityDate).getTime() : 0;
          const dateB = b.lastActivityDate ? new Date(b.lastActivityDate).getTime() : 0;
          return dateB - dateA; // Sort descending
        });
        break;
      case 'activity_asc': // Oldest first
        updatedPoliticians.sort((a, b) => {
          const dateA = a.lastActivityDate ? new Date(a.lastActivityDate).getTime() : Number.MAX_SAFE_INTEGER;
          const dateB = b.lastActivityDate ? new Date(b.lastActivityDate).getTime() : Number.MAX_SAFE_INTEGER;
          return dateA - dateB; // Sort ascending
        });
        break;
      default:
        // No sorting or default sort based on mock data order
        break;
    }

    setFilteredPoliticians(updatedPoliticians);
  }, [searchTerm, selectedParty, selectedProvince, selectedConstituency, selectedPosition, selectedGender, selectedActivityStatus, selectedCommitteeIds, sortOption, committees]); // Added selectedCommitteeIds and committees

  return (
    <div>
      <PageHeader
        title="Politicians"
        description="Explore profiles of political figures."
        actions={(
          <Button
            variant="default"
            onClick={() => {
              if (isUserLoggedIn()) {
                setIsSuggestNewPoliticianModalOpen(true);
              } else {
                router.push('/auth/login');
              }
            }}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Suggest New Politician
          </Button>
        )}
      />

      <SuggestNewEntryForm
        isOpen={isSuggestNewPoliticianModalOpen}
        onOpenChange={setIsSuggestNewPoliticianModalOpen}
        entityType={'Politician' as EntityType} // Used EntityType
        entitySchema={entitySchemas.Politician} // Passed the schema
        onSubmit={handleSuggestNewPoliticianSubmit}
      />

      <FilterBar title="Filters">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <Input
            placeholder="Search by name..."
            value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="sm:col-span-2 md:col-span-1"
        />
        <Select value={selectedParty} onValueChange={(value) => setSelectedParty(value === 'all' ? '' : value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by party" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Parties</SelectItem>
            {parties.map(party => (
              <SelectItem key={party.id} value={party.id}>{party.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedProvince} onValueChange={(value) => setSelectedProvince(value === 'all' ? '' : value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by province" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Provinces</SelectItem>
            {provinces.map(province => (
              <SelectItem key={province} value={province}>{province}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedConstituency} onValueChange={(value) => setSelectedConstituency(value === 'all' ? '' : value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by constituency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Constituencies</SelectItem>
            {constituencies.map(constituency => (
              <SelectItem key={constituency} value={constituency}>{constituency}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedPosition} onValueChange={(value) => setSelectedPosition(value === 'all' ? '' : value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by position" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Positions</SelectItem>
            {positions.map(position => (
              <SelectItem key={position} value={position}>{position}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedGender} onValueChange={(value) => setSelectedGender(value === 'all' ? '' : value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genders</SelectItem>
            {genders.map(gender => (
              <SelectItem key={gender} value={gender}>{gender}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedActivityStatus} onValueChange={(value) => setSelectedActivityStatus(value === 'all' ? '' : value)}>
          <SelectTrigger>
            <SelectValue placeholder="Activity Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        {/* Committee MultiSelect Filter */}
        <MultiSelect
          options={committees.map(c => ({ id: c.id, name: c.name }))}
          selectedValues={selectedCommitteeIds}
          onChange={setSelectedCommitteeIds}
          placeholder="Filter by committees"
        />
        <Select value={sortOption} onValueChange={setSortOption}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Sort by...</SelectItem>
            <SelectItem value="name_asc">Name (A-Z)</SelectItem>
            <SelectItem value="name_desc">Name (Z-A)</SelectItem>
            <SelectItem value="rating_desc">Rating (High to Low)</SelectItem>
            <SelectItem value="rating_asc">Rating (Low to High)</SelectItem>
            <SelectItem value="popularity_desc">Popularity (High to Low)</SelectItem>
            <SelectItem value="popularity_asc">Popularity (Low to High)</SelectItem>
            <SelectItem value="activity_desc">Recently Active (Newest)</SelectItem>
            <SelectItem value="activity_asc">Recently Active (Oldest)</SelectItem>
          </SelectContent>
        </Select>
        </div>
      </FilterBar>

      {filteredPoliticians.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPoliticians.map((politician) => (
            <EntityCard
              key={politician.id}
              id={politician.id}
              name={politician.name}
              imageUrl={politician.photoUrl}
              imageAiHint={politician.dataAiHint as string}
              description={politician.positions[0]?.title || 'Public Figure'}
              viewLink={`/politicians/${politician.id}`}
              category={politician.partyName || 'Independent'}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          IconComponent={UsersIcon}
          title="No Politicians Found"
          message="No politicians match your current search or filter criteria. Try adjusting your filters."
        />
      )}
    </div>
  );
}
