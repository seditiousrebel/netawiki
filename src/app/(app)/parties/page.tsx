
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
  const [selectedNationalStatus, setSelectedNationalStatus] = useState('all');
  const [selectedActiveStatus, setSelectedActiveStatus] = useState('all');
  const [sortOption, setSortOption] = useState('default');
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
        (party.nepaliName && party.nepaliName.includes(searchTerm)) 
      );
    }

    // Ideology filter
    if (selectedIdeology) {
      updatedParties = updatedParties.filter(party => party.ideology?.includes(selectedIdeology));
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

    // Apply sorting
    switch (sortOption) {
      case 'name_asc':
        updatedParties.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        updatedParties.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'founded_newest':
        updatedParties.sort((a, b) => {
          const dateA = a.foundedDate ? new Date(a.foundedDate).getTime() : 0;
          const dateB = b.foundedDate ? new Date(b.foundedDate).getTime() : 0;
          return dateB - dateA; // Sort descending for newest first
        });
        break;
      case 'founded_oldest':
         updatedParties.sort((a, b) => {
          const dateA = a.foundedDate ? new Date(a.foundedDate).getTime() : Number.MAX_SAFE_INTEGER;
          const dateB = b.foundedDate ? new Date(b.foundedDate).getTime() : Number.MAX_SAFE_INTEGER;
          return dateA - dateB; // Sort ascending for oldest first
        });
        break;
      default:
        // No explicit sorting, or maintain original order if 'default'
        break;
    }

    setFilteredParties(updatedParties);
  }, [searchTerm, selectedIdeology, selectedNationalStatus, selectedActiveStatus, sortOption]);


  return (
    <div>
      <PageHeader
        title="Political Parties"
        description="Learn about different political parties, their history, and leadership."
      />

      <div className="mb-8 p-6 bg-card rounded-lg shadow">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 gap-4 items-end">
          <div className="col-span-full xl:col-span-1">
            <Label htmlFor="search-party">Search Party</Label>
            <Input
              id="search-party"
              placeholder="Name or abbreviation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="xl:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
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
            <div>
                <Label htmlFor="sort-parties">Sort By</Label>
                <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger id="sort-parties">
                    <SelectValue placeholder="Sort order" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name_desc">Name (Z-A)</SelectItem>
                    <SelectItem value="founded_newest">Founded (Newest First)</SelectItem>
                    <SelectItem value="founded_oldest">Founded (Oldest First)</SelectItem>
                </SelectContent>
                </Select>
            </div>
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
