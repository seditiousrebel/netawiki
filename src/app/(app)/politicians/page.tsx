import { PageHeader } from '@/components/common/page-header';
import { EntityCard } from '@/components/common/entity-card';
import { mockPoliticians } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react'; // Assuming an Add Politician feature later

export default function PoliticiansPage() {
  const politicians = mockPoliticians;

  return (
    <div>
      <PageHeader
        title="Politicians"
        description="Explore profiles of political figures."
        // actions={<Button variant="default"><PlusCircle className="mr-2 h-4 w-4" />Add Politician</Button>}
      />
      {politicians.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {politicians.map((politician) => (
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
        <p>No politicians found.</p>
      )}
    </div>
  );
}
