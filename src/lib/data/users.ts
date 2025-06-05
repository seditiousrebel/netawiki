
export type ManagedUserRole = 'Guest' | 'Member' | 'Editor' | 'Admin' | 'SuperAdmin';

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: ManagedUserRole;
  joinDate: string; // ISO date string
}

export let mockManagedUsers: ManagedUser[] = [
  { id: 'adminUser_bhup0004', name: 'Bhup Admin', email: 'bhup0004@gmail.com', role: 'SuperAdmin', joinDate: '2023-01-15' }, // Updated user for bhup0004@gmail.com
  { id: 'usr_002', name: 'Editor Bob', email: 'editor.bob@example.com', role: 'Editor', joinDate: '2023-02-20' },
  { id: 'memberUser_seditiousrebel', name: 'Seditious Rebel', email: 'seditiousrebel@gmail.com', role: 'Member', joinDate: '2023-03-10' }, // Updated user for seditiousrebel@gmail.com
  { id: 'usr_004', name: 'Member Charlie', email: 'charlie@example.com', role: 'Member', joinDate: '2023-05-01' },
  { id: 'usr_005', name: 'Editor Eve', email: 'eve.editor@example.com', role: 'Editor', joinDate: '2023-06-15' },
  { id: 'usr_006', name: 'SuperAdmin Sue', email: 'sue.super@example.com', role: 'SuperAdmin', joinDate: '2022-12-01' },
];

export const getAllUsers = (): ManagedUser[] => {
  return JSON.parse(JSON.stringify(mockManagedUsers)); // Return a deep clone
};

export const updateUserRole = (userId: string, newRole: ManagedUserRole): boolean => {
  const userIndex = mockManagedUsers.findIndex(user => user.id === userId);
  if (userIndex === -1) {
    console.error(`User with ID ${userId} not found.`);
    return false;
  }
  // Basic role update. Add more complex logic if needed (e.g., preventing self-demotion, SuperAdmin changes).
  mockManagedUsers[userIndex].role = newRole;
  console.log(`User ${userId} role updated to ${newRole}`);
  return true;
};

export const getAssignableRoles = (): ManagedUserRole[] => {
  return ['Guest', 'Member', 'Editor', 'Admin', 'SuperAdmin'];
};
