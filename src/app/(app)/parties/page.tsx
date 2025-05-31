
"use client";

import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/common/page-header';
import { EntityCard } from '@/components/common/entity-card';
import { mockParties } from '@/lib/mock-data';
import type { Party } from '@/types/gov';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';


export default function PartiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIdeology, setSelectedIdeology] = useState('');
  const [foundedYearStart, setFoundedYearStart] = useState('');
  const [foundedYearEnd, setFoundedYearEnd] = useState('');
  const [selectedNationalStatus, setSelectedNationalStatus] = useState('all');
  const [selectedActiveStatus, setSelectedActiveStatus] = useState('all');
  const [filteredParties, setFilteredParties] = useState<Party[]>(mockParties);

  const allIdeologies = useMemo(() => {
    const ideologies = new Set<string>();
    mockParties.forEach(party => {
      party.ideology?.forEach(ideo => ideologies.add(ideo));
    });
    return Array.from(ideologies).sort();
  }, []);

  useEffect(() => {
    let updatedParties = [...mockParties];

    // Search term filter
    if (searchTerm) {
      updatedParties = updatedParties.filter(party =>
        party.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (party.abbreviation && party.abbreviation.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (party.nepaliName && party.nepaliName.includes(searchTerm)) // Direct include for Nepali name
      );
    }

    // Ideology filter
    if (selectedIdeology) {
      updatedParties = updatedParties.filter(party => party.ideology?.includes(selectedIdeology));
    }

    // Founded year range filter
    const startYear = parseInt(foundedYearStart, 10);
    const endYear = parseInt(foundedYearEnd, 10);

    if (!isNaN(startYear)) {
      updatedParties = updatedParties.filter(party => {
        if (!party.foundedDate) return false;
        const founded = new Date(party.foundedDate).getFullYear();
        return founded >= startYear;
      });
    }
    if (!isNaN(endYear)) {
      updatedParties = updatedParties.filter(party => {
        if (!party.foundedDate) return false;
        const founded = new Date(party.foundedDate).getFullYear();
        return founded <= endYear;
      });
    }
    
    // National status filter
    if (selectedNationalStatus !== 'all') {
      const isNational = selectedNationalStatus === 'national';
      updatedParties = updatedParties.filter(party => party.isNationalParty === isNational);
    }

    // Active status filter
    if (selectedActiveStatus !== 'all') {
      const isActive = selectedActiveStatus === 'active';
      updatedParties = updatedParties.filter(party => party.isActive === isActive);
    }

    setFilteredParties(updatedParties);
  }, [searchTerm, selectedIdeology, foundedYearStart, foundedYearEnd, selectedNationalStatus, selectedActiveStatus]);


  return (
    <div>
      <PageHeader
        title="Political Parties"
        description="Learn about different political parties, their history, and leadership."
      />

      <div className="mb-8 p-6 bg-card rounded-lg shadow">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 items-end">
          <div className="sm:col-span-2 md:col-span-1">
            <Label htmlFor="search-party">Search Party</Label>
            <Input
              id="search-party"
              placeholder="Name or abbreviation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="filter-ideology">Ideology</Label>
            <Select value={selectedIdeology} onValueChange={(value) => setSelectedIdeology(value === 'all' ? '' : value)}>
              <SelectTrigger id="filter-ideology">
                <SelectValue placeholder="Filter by ideology" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ideologies</SelectItem>
                {allIdeologies.map(ideo => (
                  <SelectItem key={ideo} value={ideo}>{ideo}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="filter-year-start">Founded From</Label>
              <Input
                id="filter-year-start"
                type="number"
                placeholder="Year"
                value={foundedYearStart}
                onChange={(e) => setFoundedYearStart(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="filter-year-end">Founded Until</Label>
              <Input
                id="filter-year-end"
                type="number"
                placeholder="Year"
                value={foundedYearEnd}
                onChange={(e) => setFoundedYearEnd(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="filter-national-status">Party Status</Label>
            <Select value={selectedNationalStatus} onValueChange={setSelectedNationalStatus}>
              <SelectTrigger id="filter-national-status">
                <SelectValue placeholder="National/Regional" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="national">National</SelectItem>
                <SelectItem value="regional">Regional</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="filter-active-status">Activity</Label>
            <Select value={selectedActiveStatus} onValueChange={setSelectedActiveStatus}>
              <SelectTrigger id="filter-active-status">
                <SelectValue placeholder="Active/Inactive" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filteredParties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredParties.map((party) => (
            <EntityCard
              key={party.id}
              id={party.id}
              name={party.name + (party.abbreviation ? ` (${party.abbreviation})` : '')}
              imageUrl={party.logoUrl}
              imageAiHint={party.dataAiHint as string}
              description={party.ideology?.slice(0,2).join(', ') || party.history.substring(0, 70) + (party.history.length > 70 ? '...' : '')}
              viewLink={`/parties/${party.id}`}
              category={`Founded: ${party.foundedDate ? new Date(party.foundedDate).getFullYear() : 'N/A'}`}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-8">No political parties found matching your criteria.</p>
      )}
    </div>
  );
}
