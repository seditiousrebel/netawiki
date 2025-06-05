
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

// --- Mock User Data & Simulation ---

// List of dummy users for testing:
// 1. Regular User:
//    - Email: seditiousrebel@gmail.com
//    - Password: sachinn1 (Note: Password is not used by this mock system)
//    - Intended Role: Member
// 2. Admin User:
//    - Email: bhup0004@gmail.com
//    - Password: sachinn1 (Note: Password is not used by this mock system)
//    - Intended Role: SuperAdmin (Updated from Admin)

const MOCK_USER_DETAILS: Record<string, { id: string; name: string; role: string }> = {
  'seditiousrebel@gmail.com': { id: 'memberUser_seditiousrebel', name: 'Seditious Rebel', role: 'Member' },
  'bhup0004@gmail.com': { id: 'adminUser_bhup0004', name: 'Bhup Admin', role: 'SuperAdmin' }, // Updated role
};

// Mock current user for development purposes
// In a real application, this would come from your authentication system
export const getCurrentUser = () => {
  const roles = ['Guest', 'Editor', 'Admin', 'SuperAdmin', 'Member'];

  if (typeof window !== 'undefined') {
    const simulatedEmail = localStorage.getItem('simulatedUserEmail');

    if (simulatedEmail && MOCK_USER_DETAILS[simulatedEmail]) {
      const userDetail = MOCK_USER_DETAILS[simulatedEmail];
      return { ...userDetail, email: simulatedEmail };
    }

    const roleFromStorage = localStorage.getItem('currentUserRole');
    if (roleFromStorage && roles.includes(roleFromStorage)) {
      const userName = roleFromStorage === 'Admin' ? 'Admin Mock User' : roleFromStorage === 'Editor' ? 'Editor Mock User' : 'Mock Member';
      return { id: 'mockUser_role_based', name: userName, email: 'mockuser@example.com', role: roleFromStorage };
    }
  }
  // Default to Guest if no specific simulation or role is found
  return { id: 'guestUser', name: 'Guest User', email: 'guest@example.com', role: 'Guest' };
};

/**
 * Simulates updating the current user's role.
 * This is a mock function for development and testing RBAC.
 * You can also use localStorage.setItem('simulatedUserEmail', 'email@example.com') to simulate specific users.
 * @param newRole The new role to assign to the mock user.
 */
export const setCurrentUserRole = (newRole: 'Guest' | 'Member' | 'Editor' | 'Admin' | 'SuperAdmin') => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('currentUserRole', newRole);
    // Clear simulated email if role is set directly, to avoid conflicts
    localStorage.removeItem('simulatedUserEmail');
    window.dispatchEvent(new Event('userRoleChanged')); // To help components react
    console.log(`Mock user role set to: ${newRole}. Refresh the page to see changes.`);
  } else {
    console.warn('setCurrentUserRole can only be used in the browser environment for mocking purposes.');
  }
};

/**
 * Simulates logging in a user by setting their email in localStorage.
 * @param email The email of the user to simulate logging in.
 * @returns True if the email corresponds to a known mock user, false otherwise.
 */
export const simulateLoginByEmail = (email: string): boolean => {
  if (typeof window !== 'undefined') {
    if (MOCK_USER_DETAILS[email.toLowerCase()]) {
      localStorage.setItem('simulatedUserEmail', email.toLowerCase());
      localStorage.removeItem('currentUserRole'); // Email simulation takes precedence
      window.dispatchEvent(new Event('userRoleChanged')); // Existing event should suffice
      console.log(`Simulated login for: ${email}`);
      return true;
    }
    console.log(`No mock user found for email: ${email}`);
    return false;
  }
  return false;
};


/**
 * Checks if the current user is logged in.
 * @returns True if the user's role is not 'Guest', false otherwise.
 */
export const isUserLoggedIn = (): boolean => {
  const user = getCurrentUser();
  return user.role !== 'Guest';
};

/**
 * Simulates logging out the current user.
 */
export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('currentUserRole');
    localStorage.removeItem('simulatedUserEmail');
    window.dispatchEvent(new Event('userLoggedOut')); // Dispatch specific logout event
    window.dispatchEvent(new Event('userRoleChanged')); // Also dispatch role change to update UI immediately
    console.log('User logged out (simulated).');
  }
};
