import { PageHeader } from '@/components/common/page-header';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { getCurrentUser, canAccess, EDITOR_ROLES } from '@/lib/auth';

const mockAuditLogEntries = [
  { id: 'al001', timestamp: new Date(Date.now() - 3600000).toISOString(), user: 'AdminUser', action: 'Politician Profile Update', details: 'Updated bio for Alice Democratia (p1) via suggestion sugg_bio_p1_abc.' },
  { id: 'al002', timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), user: 'EditorBob', action: 'Suggestion Approved', details: 'Approved suggestion s2 for Party Red Alliance Group.' },
  { id: 'al003', timestamp: new Date(Date.now() - 5 * 3600000).toISOString(), user: 'System', action: 'User Account Created', details: 'New user Member Alice (usr_003) registered.' },
  { id: 'al004', timestamp: new Date(Date.now() - 10 * 3600000).toISOString(), user: 'User:JaneD', action: 'Edit Suggestion Submitted', details: 'Submitted suggestion for contact email on Bob Republicanus (p2).' },
  { id: 'al005', timestamp: new Date(Date.now() - 24 * 3600000).toISOString(), user: 'AdminUser', action: 'New Entry Approved', details: 'Approved new party: Future Forward Alliance (new-s2).' },
  { id: 'al006', timestamp: new Date(Date.now() - 48 * 3600000).toISOString(), user: 'System', action: 'Security Alert', details: 'Unusual login attempt detected for user EditorBob.' },
  { id: 'al007', timestamp: new Date(Date.now() - 72 * 3600000).toISOString(), user: 'EditorAlice', action: 'Content Deletion', details: 'Deleted news article "Old News" (news_098).' },
];

export default function AuditLogPage() {
  const currentUser = getCurrentUser();

  if (!canAccess(currentUser.role, EDITOR_ROLES)) {
    return <div className="container mx-auto py-8 text-center">Access Denied. You do not have permission to view this page.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="Audit Log"
        description="Track important activities and changes across the platform."
      />

      {/* Mock Filter Controls */}
      <div className="my-6 p-4 border rounded-lg bg-card shadow">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label htmlFor="filter-user" className="block text-sm font-medium text-muted-foreground mb-1">Filter by User</label>
            <Input id="filter-user" placeholder="Enter username or ID..." disabled className="bg-muted/50" />
          </div>
          <div>
            <label htmlFor="filter-action" className="block text-sm font-medium text-muted-foreground mb-1">Filter by Action Type</label>
            <Select disabled>
              <SelectTrigger className="bg-muted/50">
                <SelectValue placeholder="Select action type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="profile_update">Profile Update</SelectItem>
                <SelectItem value="suggestion_approved">Suggestion Approved</SelectItem>
                <SelectItem value="user_created">User Account Created</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="filter-date-range" className="block text-sm font-medium text-muted-foreground mb-1">Filter by Date Range</label>
            <Input id="filter-date-range" type="date" disabled className="bg-muted/50" />
            {/* In a real app, this would be a date range picker */}
          </div>
          <Button disabled variant="outline" className="sm:col-span-2 lg:col-span-1">
            <Filter className="mr-2 h-4 w-4" />
            Apply Filters (Disabled)
          </Button>
        </div>
      </div>

      <div className="mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Timestamp</TableHead>
              <TableHead className="w-[150px]">User</TableHead>
              <TableHead className="w-[250px]">Action</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockAuditLogEntries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="text-xs">
                  {new Date(entry.timestamp).toLocaleString(undefined, {
                    year: 'numeric', month: 'short', day: 'numeric',
                    hour: '2-digit', minute: '2-digit', second: '2-digit'
                  })}
                </TableCell>
                <TableCell className="font-medium">{entry.user}</TableCell>
                <TableCell>{entry.action}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{entry.details || 'N/A'}</TableCell>
              </TableRow>
            ))}
            {mockAuditLogEntries.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-10">
                  No audit log entries found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
