
"use client";

import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/common/page-header';
import { EntityCard } from '@/components/common/entity-card';
import { mockPoliticians, mockParties } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Politician, Party } from '@/types/gov';
// import { Button } from '@/components/ui/button';
// import { PlusCircle } from 'lucide-react';

export default function PoliticiansPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParty, setSelectedParty] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedConstituency, setSelectedConstituency] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [filteredPoliticians, setFilteredPoliticians] = useState<Politician[]>(mockPoliticians);

  const parties: Party[] = mockParties;
  
  const provinces = useMemo(() => 
    Array.from(new Set(mockPoliticians.map(p => p.province).filter(Boolean))) as string[]
  , []);

  const constituencies = useMemo(() =>
    Array.from(new Set(mockPoliticians.map(p => p.constituency).filter(Boolean))) as string[]
  , []);

  const positions = useMemo(() =>
    Array.from(new Set(mockPoliticians.map(p => p.positions[0]?.title).filter(Boolean))) as string[]
  , []);

  useEffect(() => {
    let updatedPoliticians = [...mockPoliticians]; // Create a mutable copy

    // Apply filters
    if (searchTerm) {
      updatedPoliticians = updatedPoliticians.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
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

    // Apply sorting
    switch (sortOption) {
      case 'name_asc':
        updatedPoliticians.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        updatedPoliticians.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'rating_desc':
        updatedPoliticians.sort((a, b) => (b.overallRating ?? 0) - (a.overallRating ?? 0));
        break;
      case 'rating_asc':
        updatedPoliticians.sort((a, b) => (a.overallRating ?? 0) - (b.overallRating ?? 0));
        break;
      case 'popularity_desc':
        updatedPoliticians.sort((a, b) => (b.popularityScore ?? 0) - (a.popularityScore ?? 0));
        break;
      case 'popularity_asc':
        updatedPoliticians.sort((a, b) => (a.popularityScore ?? 0) - (b.popularityScore ?? 0));
        break;
      default:
        // No sorting or default sort
        break;
    }

    setFilteredPoliticians(updatedPoliticians);
  }, [searchTerm, selectedParty, selectedProvince, selectedConstituency, selectedPosition, sortOption]);

  return (
    <div>
      <PageHeader
        title="Politicians"
        description="Explore profiles of political figures."
        // actions={<Button variant="default"><PlusCircle className="mr-2 h-4 w-4" />Add Politician</Button>}
      />

      <div className="mb-6 flex flex-col sm:flex-row flex-wrap gap-4">
        <Input
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs flex-grow sm:flex-grow-0"
        />
        <Select value={selectedParty} onValueChange={(value) => setSelectedParty(value === 'all' ? '' : value)}>
          <SelectTrigger className="w-full sm:w-[180px]">
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
          <SelectTrigger className="w-full sm:w-[180px]">
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
          <SelectTrigger className="w-full sm:w-[200px]">
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
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by position" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Positions</SelectItem>
            {positions.map(position => (
              <SelectItem key={position} value={position}>{position}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortOption} onValueChange={setSortOption}>
          <SelectTrigger className="w-full sm:w-[220px]">
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
