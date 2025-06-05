
import type { PoliticalJourneyEvent, BillTimelineEvent, PromiseStatusUpdate, ControversyUpdate, ElectionTimelineEvent, CommitteeActivityEvent } from '@/types/gov';
import { Briefcase, FileText, ListChecks, ShieldAlert, Vote, Landmark, CalendarDays, LucideIcon, ListFilter, X, Pencil, Trash2 } from 'lucide-react';
import React, { useState, useMemo, memo } from 'react'; // Import memo
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TimelineItem {
  id: string; // Added id for editing/deleting
  date: string;
  title: string;
  description?: string;
  actor?: string;
  relatedDocumentUrl?: string;
  iconType?: string; // Added for icon differentiation
}

interface TimelineDisplayProps {
  items: TimelineItem[];
  title?: string;
  onEditItem?: (id: string) => void; // Optional handler for editing
  onDeleteItem?: (id: string) => void; // Optional handler for deleting
}

const iconMap: { [key: string]: LucideIcon } = {
  politicalJourney: Briefcase, // Briefcase for career/political journey
  billEvent: FileText, // FileText for bill events
  promiseUpdate: ListChecks, // ListChecks for promise updates
  controversyUpdate: ShieldAlert, // ShieldAlert for controversies
  electionEvent: Vote, // Vote for election events
  committeeActivity: Landmark, // Landmark for committee activities
  default: CalendarDays, // CalendarDays as a default icon
};

// Helper to capitalize and add spaces to camelCase or snake_case icon types for display
const formatIconTypeName = (iconType: string) => {
  return iconType
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/_/g, ' ') // Replace underscores with spaces
    .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize first letter of each word
};

// Renamed original component
const TimelineDisplayComponent: React.FC<TimelineDisplayProps> = ({ items, title }) => {
  const [selectedIconTypes, setSelectedIconTypes] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const availableIconTypes = useMemo(() => {
    const types = new Set(items.map(item => item.iconType).filter(Boolean) as string[]);
    return Array.from(types);
  }, [items]);

  const handleIconTypeToggle = (iconType: string) => {
    setSelectedIconTypes(prev =>
      prev.includes(iconType) ? prev.filter(it => it !== iconType) : [...prev, iconType]
    );
  };

  const clearFilters = () => {
    setSelectedIconTypes([]);
    setSearchTerm("");
  };

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [items]);

  const filteredItems = useMemo(() => {
    return sortedItems.filter(item => {
      const typeMatch = selectedIconTypes.length === 0 || (item.iconType && selectedIconTypes.includes(item.iconType));
      const termMatch = searchTerm === "" ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
      return typeMatch && termMatch;
    });
  }, [sortedItems, selectedIconTypes, searchTerm]);

  if (!items || items.length === 0) {
    return <p className="text-muted-foreground">No timeline information available.</p>;
  }

  return (
    <div>
      {title && <h3 className="text-xl font-headline font-semibold mb-4 text-primary">{title}</h3>}

      <div className="flex flex-wrap gap-4 mb-6 p-4 border bg-card rounded-lg shadow-sm">
        <Input
          placeholder="Search timeline..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs flex-grow"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex-grow sm:flex-grow-0">
              <ListFilter className="mr-2 h-4 w-4" />
              Filter by Type ({selectedIconTypes.length > 0 ? selectedIconTypes.length : 'All'})
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Event Types</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {availableIconTypes.map(iconType => (
              <DropdownMenuCheckboxItem
                key={iconType}
                checked={selectedIconTypes.includes(iconType)}
                onCheckedChange={() => handleIconTypeToggle(iconType)}
              >
                {formatIconTypeName(iconType)}
              </DropdownMenuCheckboxItem>
            ))}
            {availableIconTypes.length === 0 && <DropdownMenuLabel className="text-xs text-muted-foreground p-2">No specific event types found</DropdownMenuLabel>}
          </DropdownMenuContent>
        </DropdownMenu>
        {(selectedIconTypes.length > 0 || searchTerm) && (
          <Button variant="ghost" onClick={clearFilters} className="flex-grow sm:flex-grow-0">
            <X className="mr-2 h-4 w-4" /> Clear Filters
          </Button>
        )}
      </div>

      {filteredItems.length === 0 && (
         <p className="text-muted-foreground text-center py-4">No items match your filters.</p>
      )}

      <div className="relative pl-6 after:absolute after:inset-y-0 after:w-0.5 after:bg-border after:left-0">
        {filteredItems.map((item, index) => {
          const IconComponent = iconMap[item.iconType || 'default'] || iconMap.default;
          return (
            <div key={item.date + '-' + item.title + '-' + index} className="relative mb-6 pl-4 group"> {/* Improved key */}
              <div className="absolute -left-[calc(1.5rem+2px)] top-1 flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground border-2 border-background group-hover:scale-110 transition-transform">
                <IconComponent className="w-4 h-4" />
              </div>
              <p className="font-semibold text-foreground">{item.title}</p>
              <p className="text-sm text-muted-foreground mb-1">{new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              {item.description && <p className="text-sm text-foreground/80 whitespace-pre-line">{item.description}</p>}
              {item.actor && <p className="text-xs text-muted-foreground mt-0.5">Actor: {item.actor}</p>}
              {item.relatedDocumentUrl && (
                <a href={item.relatedDocumentUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-0.5 inline-block">
                  View Related Document
                </a>
              )}
              {(onEditItem || onDeleteItem) && (
                <div className="mt-2 space-x-2">
                  {onEditItem && (
                    <Button variant="outline" size="xs" onClick={() => onEditItem(item.id)}>
                      <Pencil className="h-3 w-3 mr-1" /> Edit
                    </Button>
                  )}
                  {onDeleteItem && (
                    <Button variant="destructive" size="xs" onClick={() => onDeleteItem(item.id)}>
                      <Trash2 className="h-3 w-3 mr-1" /> Delete
                    </Button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Helper functions to adapt specific types to TimelineItem
export function formatPoliticalJourneyForTimeline(journeyEvents: PoliticalJourneyEvent[]): Omit<TimelineItem, 'id'>[] { // ID is not present in PoliticalJourneyEvent
  return journeyEvents.map(event => ({
    date: event.date,
    title: event.event,
    description: event.description,
    iconType: 'politicalJourney',
  }));
}

// Export the memoized version as the primary TimelineDisplay
export const TimelineDisplay = memo(TimelineDisplayComponent);
export function formatBillTimelineEventsForTimeline(events: BillTimelineEvent[]): Omit<TimelineItem, 'id'>[] { // ID is not present in BillTimelineEvent
  return events.map(event => ({
    date: event.date,
    title: event.event,
    description: event.description,
    actor: event.actor,
    relatedDocumentUrl: event.relatedDocumentUrl,
    iconType: 'billEvent',
  }));
}

export function formatPromiseStatusUpdatesForTimeline(statusUpdates: PromiseStatusUpdate[]): Omit<TimelineItem, 'id'>[] { // ID is not present in PromiseStatusUpdate
  return statusUpdates.map(update => {
    let title = `Status changed to: ${update.status}`;
    if (update.fulfillmentPercentage !== undefined) {
      title += ` (${update.fulfillmentPercentage}%)`;
    }
    let desc = update.description || '';
    if (update.updatedBy) {
      desc += `\\n(Updated by: ${update.updatedBy})`;
    }
    return {
      date: update.date,
      title: title,
      description: desc.trim() || undefined,
      iconType: 'promiseUpdate',
    };
  });
}

export function formatControversyUpdatesForTimeline(updates: ControversyUpdate[]): Omit<TimelineItem, 'id'>[] { // ID is not present in ControversyUpdate
  return updates.map(update => ({
    date: update.date,
    title: update.description, // Using description as the main title for controversy updates
    relatedDocumentUrl: update.sourceUrl,
    iconType: 'controversyUpdate',
  }));
}

export function formatElectionTimelineEventsForTimeline(events: ElectionTimelineEvent[]): TimelineItem[] { // ElectionTimelineEvent now has ID
  return events.map(event => ({
    id: event.id, // Ensure id is passed through
    date: event.date,
    title: event.event,
    description: event.description,
    relatedDocumentUrl: event.relatedDocumentUrl,
    iconType: 'electionEvent',
  }));
}

export function formatCommitteeActivityForTimeline(events: CommitteeActivityEvent[]): Omit<TimelineItem, 'id'>[] { // ID is not present in CommitteeActivityEvent
  return events.map(event => ({
    date: event.date,
    title: event.event,
    description: event.description,
    relatedDocumentUrl: event.relatedDocumentUrl,
    iconType: 'committeeActivity',
  }));
}

