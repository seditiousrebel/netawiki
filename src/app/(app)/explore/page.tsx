
import Link from 'next/link';
import { PageHeader } from '@/components/common/page-header';
import { EntityCard } from '@/components/common/entity-card';
import {
  Users,
  FileText,
  Landmark,
  MapPin,
  ShieldAlert,
  Vote,
  Newspaper,
  Shield,
  ClipboardList,
  Compass // Generic explore icon
} from 'lucide-react';

const entities = [
  { name: 'Politicians', path: '/politicians', description: 'Profiles, history, and activities of political figures.', icon: Users, dataAiHint: 'diverse group politicians' },
  { name: 'Parties', path: '/parties', description: 'Information on political parties, their ideology, and leadership.', icon: Shield, dataAiHint: 'political party symbols' },
  { name: 'Bills', path: '/bills', description: 'Track legislation from introduction to law.', icon: FileText, dataAiHint: 'stack legislative documents' },
  { name: 'Promises', path: '/promises', description: 'Monitor promises made by politicians and parties.', icon: ClipboardList, dataAiHint: 'checklist promise fulfilled' },
  { name: 'Committees', path: '/committees', description: 'Details on parliamentary committees and their work.', icon: Landmark, dataAiHint: 'committee meeting room' },
  { name: 'Constituencies', path: '/constituencies', description: 'Explore electoral districts and representatives.', icon: MapPin, dataAiHint: 'map constituency boundaries' },
  { name: 'Controversies', path: '/controversies', description: 'Follow major political controversies and their impact.', icon: ShieldAlert, dataAiHint: 'news headlines controversy' },
  { name: 'Elections', path: '/elections', description: 'Information on past, ongoing, and upcoming elections.', icon: Vote, dataAiHint: 'ballot box election day' },
  { name: 'News', path: '/news', description: 'Latest news articles, analyses, and fact-checks.', icon: Newspaper, dataAiHint: 'newspaper headlines articles' },
];

export default function ExplorePage() {
  return (
    <div>
      <PageHeader
        title="Explore GovTrackr"
        description="Discover detailed information across various political entities and activities."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {entities.map((entity) => (
          <EntityCard
            key={entity.name}
            id={entity.path.split('/').pop() || entity.name.toLowerCase()} // Simple ID generation
            name={entity.name}
            description={entity.description}
            viewLink={entity.path}
            // Using a generic placeholder if no specific image is defined,
            // relying on dataAiHint for potential future image generation.
            imageUrl={`https://placehold.co/400x250.png?text=${entity.name.replace(' ', '+')}`}
            imageAiHint={entity.dataAiHint}
            // Category could be the entity type itself or something more specific if needed
            category={entity.name}
          />
        ))}
      </div>
    </div>
  );
}
