
"use client";

import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/common/page-header';
import { EntityCard } from '@/components/common/entity-card';
import { mockPoliticians, mockParties } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Politician, Party } from '@/types/gov';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { SuggestNewEntryForm } from '@/components/common/suggest-new-entry-form';
import { useToast } from "@/hooks/use-toast";

export default function PoliticiansPage() {
  const { toast } = useToast();
  const [isSuggestNewPoliticianModalOpen, setIsSuggestNewPoliticianModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParty, setSelectedParty] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedConstituency, setSelectedConstituency] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedActivityStatus, setSelectedActivityStatus] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [filteredPoliticians, setFilteredPoliticians] = useState<Politician[]>(mockPoliticians);

  const parties: Party[] = mockParties;

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
  }, [searchTerm, selectedParty, selectedProvince, selectedConstituency, selectedPosition, selectedGender, selectedActivityStatus, sortOption]);

  return (
    <div>
      <PageHeader
        title="Politicians"
        description="Explore profiles of political figures."
        actions={
          <Button variant="default" onClick={() => setIsSuggestNewPoliticianModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Suggest New Politician
          </Button>
        }
      />

      <SuggestNewEntryForm
        isOpen={isSuggestNewPoliticianModalOpen}
        onOpenChange={setIsSuggestNewPoliticianModalOpen}
        entityType="Politician"
        onSubmit={handleSuggestNewPoliticianSubmit}
      />

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
        <p className="text-muted-foreground">No politicians found matching your criteria.</p>
      )}
    </div>
  );
}
