
import type { PoliticalJourneyEvent, BillTimelineEvent, PromiseStatusUpdate, ControversyUpdate } from '@/types/gov';

interface TimelineItem {
  date: string;
  title: string;
  description?: string;
  actor?: string; // New field for BillTimelineEvent
  relatedDocumentUrl?: string; // New field for BillTimelineEvent
}

interface TimelineDisplayProps {
  items: TimelineItem[];
  title?: string;
}

export function TimelineDisplay({ items, title }: TimelineDisplayProps) {
  if (!items || items.length === 0) {
    return <p className="text-muted-foreground">No timeline information available.</p>;
  }

  const sortedItems = [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div>
      {title && <h3 className="text-xl font-headline font-semibold mb-4 text-primary">{title}</h3>}
      <div className="relative pl-6 after:absolute after:inset-y-0 after:w-0.5 after:bg-border after:left-0">
        {sortedItems.map((item, index) => (
          <div key={index} className="relative mb-6 pl-4 group">
            <div className="absolute -left-[calc(1.5rem+2px)] top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-background group-hover:scale-125 transition-transform"></div>
            <p className="font-semibold text-foreground">{item.title}</p>
            <p className="text-sm text-muted-foreground mb-1">{new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            {item.description && <p className="text-sm text-foreground/80 whitespace-pre-line">{item.description}</p>}
            {item.actor && <p className="text-xs text-muted-foreground mt-0.5">Actor: {item.actor}</p>}
            {item.relatedDocumentUrl && (
              <a href={item.relatedDocumentUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-0.5 inline-block">
                View Related Document
              </a>
            )}
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
  }));
}

export function formatBillTimelineEventsForTimeline(events: BillTimelineEvent[]): TimelineItem[] {
  return events.map(event => ({
    date: event.date,
    title: event.event,
    description: event.description,
    actor: event.actor,
    relatedDocumentUrl: event.relatedDocumentUrl,
  }));
}

export function formatPromiseStatusUpdatesForTimeline(statusUpdates: PromiseStatusUpdate[]): TimelineItem[] {
  return statusUpdates.map(update => {
    let title = `Status changed to: ${update.status}`;
    if (update.fulfillmentPercentage !== undefined) {
      title += ` (${update.fulfillmentPercentage}%)`;
    }
    let desc = update.description || '';
    if (update.updatedBy) {
      desc += `\n(Updated by: ${update.updatedBy})`;
    }
    return {
      date: update.date,
      title: title,
      description: desc.trim() || undefined,
    };
  });
}

export function formatControversyUpdatesForTimeline(updates: ControversyUpdate[]): TimelineItem[] {
  return updates.map(update => ({
    date: update.date,
    title: update.description,
    relatedDocumentUrl: update.sourceUrl,
  }));
}
