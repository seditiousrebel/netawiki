import { PageHeader } from '@/components/common/page-header';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle } from 'lucide-react';

const mockUsers = [
  { id: 'usr_001', name: 'Admin User', email: 'admin@example.com', role: 'Admin', joinDate: '2023-01-15' },
  { id: 'usr_002', name: 'Editor Bob', email: 'editor.bob@example.com', role: 'Editor', joinDate: '2023-02-20' },
  { id: 'usr_003', name: 'Member Alice', email: 'alice.m@example.com', role: 'Member', joinDate: '2023-03-10' },
  { id: 'usr_004', name: 'Member Charlie', email: 'charlie@example.com', role: 'Member', joinDate: '2023-05-01' },
  { id: 'usr_005', name: 'Editor Eve', email: 'eve.editor@example.com', role: 'Editor', joinDate: '2023-06-15' },
  { id: 'usr_006', name: 'SuperAdmin Sue', email: 'sue.super@example.com', role: 'SuperAdmin', joinDate: '2022-12-01' },
];

const getRoleBadgeVariant = (role: string): 'default' | 'secondary' | 'outline' | 'destructive' => {
  switch (role.toLowerCase()) {
    case 'admin':
      return 'destructive';
    case 'superadmin':
      return 'destructive'; // Or another distinct style like primary if available
    case 'editor':
      return 'secondary';
    case 'member':
      return 'outline';
    default:
      return 'outline';
  }
};

export default function UserRoleManagementPage() {
  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="User Role Management"
        description="View and manage user roles across the platform. (Currently view-only)"
        actions={
          <Button variant="outline" disabled>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New User (Disabled)
          </Button>
        }
      />

      <div className="mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-mono text-xs">{user.id}</TableCell>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
                </TableCell>
                <TableCell>{new Date(user.joinDate).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" disabled>
                    Edit Role
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
