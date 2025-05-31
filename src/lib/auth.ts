// src/lib/auth.ts

export const ADMIN_ROLES = ['Admin', 'SuperAdmin'];
export const EDITOR_ROLES = ['Admin', 'SuperAdmin', 'Editor'];

/**
 * Checks if a user with a given role has access based on required roles.
 * @param userRole The role of the current user.
 * @param requiredRoles An array of roles that are allowed access.
 * @returns True if the user has access, false otherwise.
 */
export const canAccess = (userRole: string, requiredRoles: string[]): boolean => {
  return requiredRoles.includes(userRole);
};

// Mock current user for development purposes
// In a real application, this would come from your authentication system
export const getCurrentUser = () => {
  // Cycle through roles for testing: Guest, Editor, Admin
  const roles = ['Guest', 'Editor', 'Admin'];
  // To simulate different users, you could use localStorage or a more sophisticated mock
  // For now, let's just pick one, or allow easy switching via a global variable or dev tools
  if (typeof window !== 'undefined') {
    const roleFromStorage = localStorage.getItem('currentUserRole');
    if (roleFromStorage && roles.includes(roleFromStorage)) {
      return { id: 'mockUser', name: 'Mock User', role: roleFromStorage };
    }
  }
  return { id: 'mockUser', name: 'Mock User', role: 'Guest' }; // Default to Guest
};

/**
 * Simulates updating the current user's role.
 * This is a mock function for development and testing RBAC.
 * In a real application, user roles would be managed by an authentication system.
 * @param newRole The new role to assign to the mock user.
 */
export const setCurrentUserRole = (newRole: 'Guest' | 'Editor' | 'Admin' | 'SuperAdmin') => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('currentUserRole', newRole);
    // Optional: dispatch a custom event to notify components of role change
    window.dispatchEvent(new Event('userRoleChanged'));
    console.log(`Mock user role set to: ${newRole}. Refresh the page to see changes.`);
  } else {
    console.warn('setCurrentUserRole can only be used in the browser environment for mocking purposes.');
  }
};

/**
 * Checks if the current user is logged in.
 * @returns True if the user's role is not 'Guest', false otherwise.
 */
export const isUserLoggedIn = (): boolean => {
  const user = getCurrentUser();
  return user.role !== 'Guest';
};
