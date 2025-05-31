import { PageHeader } from '@/components/common/page-header';
import { EntityCard } from '@/components/common/entity-card';
import { mockParties } from '@/lib/mock-data';
// import { Button } from '@/components/ui/button';
// import { PlusCircle } from 'lucide-react';

export default function PartiesPage() {
  const parties = mockParties;

  return (
    <div>
      <PageHeader
        title="Political Parties"
        description="Learn about different political parties, their history, and leadership."
        // actions={<Button variant="default"><PlusCircle className="mr-2 h-4 w-4" />Add Party</Button>}
      />
      {parties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {parties.map((party) => (
            <EntityCard
              key={party.id}
              id={party.id}
              name={party.name}
              imageUrl={party.logoUrl}
              imageAiHint={party.dataAiHint as string}
              description={party.history.substring(0, 100) + (party.history.length > 100 ? '...' : '')}
              viewLink={`/parties/${party.id}`}
              category="Political Party"
            />
          ))}
        </div>
      ) : (
        <p>No political parties found.</p>
      )}
    </div>
  );
}
