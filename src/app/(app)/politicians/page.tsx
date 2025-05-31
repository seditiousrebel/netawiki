
"use client";

import { useState, useEffect } from 'react';
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
  const [filteredPoliticians, setFilteredPoliticians] = useState<Politician[]>(mockPoliticians);

  const parties: Party[] = mockParties;

  useEffect(() => {
    let updatedPoliticians = mockPoliticians;

    if (searchTerm) {
      updatedPoliticians = updatedPoliticians.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedParty) {
      updatedPoliticians = updatedPoliticians.filter(p => p.partyId === selectedParty);
    }

    setFilteredPoliticians(updatedPoliticians);
  }, [searchTerm, selectedParty]);

  return (
    <div>
      <PageHeader
        title="Politicians"
        description="Explore profiles of political figures."
        // actions={<Button variant="default"><PlusCircle className="mr-2 h-4 w-4" />Add Politician</Button>}
      />

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        <Select value={selectedParty} onValueChange={(value) => setSelectedParty(value === 'all' ? '' : value)}>
          <SelectTrigger className="w-full sm:w-[220px]">
            <SelectValue placeholder="Filter by party" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Parties</SelectItem>
            {parties.map(party => (
              <SelectItem key={party.id} value={party.id}>{party.name}</SelectItem>
            ))}
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
