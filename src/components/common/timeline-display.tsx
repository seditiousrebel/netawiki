import type { PoliticalJourneyEvent, Amendment } from '@/types/gov';

interface TimelineItem {
  date: string;
  title: string;
  description?: string;
}

interface TimelineDisplayProps {
  items: TimelineItem[];
  title?: string;
}

export function TimelineDisplay({ items, title }: TimelineDisplayProps) {
  if (!items || items.length === 0) {
    return <p className="text-muted-foreground">No timeline information available.</p>;
  }

  return (
    <div>
      {title && <h3 className="text-xl font-headline font-semibold mb-4 text-primary">{title}</h3>}
      <div className="relative pl-6 after:absolute after:inset-y-0 after:w-0.5 after:bg-border after:left-0">
        {items.map((item, index) => (
          <div key={index} className="relative mb-6 pl-4 group">
            <div className="absolute -left-[calc(1.5rem+2px)] top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-background group-hover:scale-125 transition-transform"></div>
            <p className="font-semibold text-foreground">{item.title}</p>
            <p className="text-sm text-muted-foreground mb-1">{new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            {item.description && <p className="text-sm text-foreground/80">{item.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper functions to adapt specific types to TimelineItem
export function formatPoliticalJourneyForTimeline(journeyEvents: PoliticalJourneyEvent[]): TimelineItem[] {
  return journeyEvents.map(event => ({
    date: event.date,
    title: event.event,
    description: event.description,
  })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function formatAmendmentsForTimeline(amendments: Amendment[]): TimelineItem[] {
  return amendments.map(amendment => ({
    date: amendment.date,
    title: `Amendment ${amendment.status || 'Proposed'}`,
    description: amendment.description,
  })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
