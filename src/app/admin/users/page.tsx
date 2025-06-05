"use client";

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/page-header';
import { getCurrentUser, canAccess, EDITOR_ROLES } from '@/lib/auth';
import { getAllUsers, updateUserRole, getAssignableRoles, type ManagedUser, type ManagedUserRole } from '@/lib/data/users';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
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
import { PlusCircle, Pencil } from 'lucide-react';

// Modal Component for Editing User Role
interface EditRoleModalProps {
  isOpen: boolean;
  user: ManagedUser | null;
  currentRole: ManagedUserRole | '';
  assignableRoles: ManagedUserRole[];
  onClose: () => void;
  onSave: (newRole: ManagedUserRole) => void;
  loggedInUserId: string; // To prevent self-editing role
}

const EditRoleModal: React.FC<EditRoleModalProps> = ({
  isOpen,
  user,
  currentRole,
  assignableRoles,
  onClose,
  onSave,
  loggedInUserId,
}) => {
  const [selectedRole, setSelectedRole] = useState<ManagedUserRole | ''>(currentRole);

  useEffect(() => {
    if (isOpen) {
      setSelectedRole(currentRole);
    }
  }, [isOpen, currentRole]);

  if (!isOpen || !user) return null;

  const isSelfEdit = user.id === loggedInUserId;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Role for {user.name}</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-2">
          <p className="text-sm text-muted-foreground">User: {user.email}</p>
          <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as ManagedUserRole)} disabled={isSelfEdit}>
            <SelectTrigger>
              <SelectValue placeholder="Select new role" />
            </SelectTrigger>
            <SelectContent>
              {assignableRoles.map(role => (
                <SelectItem key={role} value={role}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isSelfEdit && <p className="text-sm text-yellow-600">You cannot edit your own role.</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => selectedRole && onSave(selectedRole)} disabled={!selectedRole || isSelfEdit}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


const getRoleBadgeVariant = (role: ManagedUserRole | string): 'default' | 'secondary' | 'outline' | 'destructive' => {
  switch (role.toLowerCase()) {
    case 'admin':
      return 'destructive';
    case 'superadmin':
      return 'destructive';
    case 'editor':
      return 'secondary';
    case 'member':
    case 'guest': // Added guest for completeness
      return 'outline';
    default:
      return 'outline';
  }
};

export default function UserRoleManagementPage() {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);
  const [selectedRoleForEdit, setSelectedRoleForEdit] = useState<ManagedUserRole | ''>('');
  const [assignableRoles, setAssignableRoles] = useState<ManagedUserRole[]>([]);

  const authUser = getCurrentUser(); // Renamed to authUser to avoid confusion

  useEffect(() => {
    setUsers(getAllUsers());
    setAssignableRoles(getAssignableRoles());
  }, []);

  // For user management, let's use EDITOR_ROLES for now as per simplification
  if (!canAccess(authUser.role, EDITOR_ROLES)) {
    return <div className="container mx-auto py-8 text-center">Access Denied. You do not have permission to view this page.</div>;
  }

  const handleOpenEditModal = (user: ManagedUser) => {
    setEditingUser(user);
    setSelectedRoleForEdit(user.role);
    setIsEditRoleModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditRoleModalOpen(false);
    setEditingUser(null);
    setSelectedRoleForEdit('');
  };

  const handleSaveRole = (newRole: ManagedUserRole) => {
    if (editingUser) {
      if (updateUserRole(editingUser.id, newRole)) {
        setUsers(getAllUsers()); // Refresh user list
      } else {
        alert(`Failed to update role for ${editingUser.name}.`);
      }
    }
    handleCloseEditModal();
  };

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="User Role Management"
        description="View and manage user roles across the platform."
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
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-mono text-xs">{user.id}</TableCell>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
                </TableCell>
                <TableCell>{new Date(user.joinDate).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => handleOpenEditModal(user)}>
                    <Pencil className="mr-1 h-3 w-3" /> Edit Role
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <EditRoleModal
        isOpen={isEditRoleModalOpen}
        user={editingUser}
        currentRole={selectedRoleForEdit}
        assignableRoles={assignableRoles}
        onClose={handleCloseEditModal}
        onSave={handleSaveRole}
        loggedInUserId={authUser.id}
      />
    </div>
  );
}
