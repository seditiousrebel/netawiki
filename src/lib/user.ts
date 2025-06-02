// src/lib/user.ts
import { useNotificationStore } from '@/lib/notifications';
import type { UserProfile } from '@/types/gov'; // Assuming UserProfile might be enhanced or used later

// LocalStorage keys definition
const BASE_KEY = 'govtrackr_';
export const FOLLOWED_ITEMS_KEY_PREFIX = BASE_KEY + 'followed_'; // e.g., govtrackr_followed_politicians

// Entity types that can be followed
export type FollowableEntityType = 'politician' | 'party' | 'promise' | 'bill' | 'news'; // Added news as per feed example

/**
 * Generates the localStorage key for a given entity type.
 */
const getKeyForEntityType = (entityType: FollowableEntityType): string => {
  return `${FOLLOWED_ITEMS_KEY_PREFIX}${entityType}s`; // Appends 's' to make it plural, e.g., politicians
};

/**
 * Retrieves a list of followed entity IDs for a given type from localStorage.
 * @param entityType The type of entity (e.g., 'politician', 'party').
 * @returns An array of entity IDs.
 */
export const getFollowedItems = (entityType: FollowableEntityType): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const key = getKeyForEntityType(entityType);
    const item = localStorage.getItem(key);
    if (item) {
      const parsed = JSON.parse(item);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (error) {
    console.error(`Error parsing localStorage key "${getKeyForEntityType(entityType)}":`, error);
  }
  return [];
};

/**
 * Adds an entity to the followed list in localStorage and shows a notification.
 * @param entityId The ID of the entity to follow.
 * @param entityType The type of the entity.
 * @param entityName The display name of the entity (for notification).
 */
export const followEntity = (entityId: string, entityType: FollowableEntityType, entityName: string): void => {
  if (typeof window === 'undefined') return;
  const key = getKeyForEntityType(entityType);
  let currentFollowedItems = getFollowedItems(entityType);

  if (!currentFollowedItems.includes(entityId)) {
    currentFollowedItems = [...currentFollowedItems, entityId];
    localStorage.setItem(key, JSON.stringify(currentFollowedItems));
    useNotificationStore.getState().addNotification(`You are now following ${entityName}`, 'success');
    // Dispatch a custom event to notify other components if necessary
    window.dispatchEvent(new CustomEvent('followedItemsChanged', { detail: { entityType, entityId, action: 'followed' } }));
  }
};

/**
 * Removes an entity from the followed list in localStorage and shows a notification.
 * @param entityId The ID of the entity to unfollow.
 * @param entityType The type of the entity.
 * @param entityName The display name of the entity (for notification).
 */
export const unfollowEntity = (entityId: string, entityType: FollowableEntityType, entityName:string): void => {
  if (typeof window === 'undefined') return;
  const key = getKeyForEntityType(entityType);
  let currentFollowedItems = getFollowedItems(entityType);

  if (currentFollowedItems.includes(entityId)) {
    currentFollowedItems = currentFollowedItems.filter(id => id !== entityId);
    localStorage.setItem(key, JSON.stringify(currentFollowedItems));
    useNotificationStore.getState().addNotification(`You have unfollowed ${entityName}`, 'info');
    // Dispatch a custom event to notify other components if necessary
    window.dispatchEvent(new CustomEvent('followedItemsChanged', { detail: { entityType, entityId, action: 'unfollowed' } }));
  }
};

/**
 * Checks if a specific entity is currently followed by the user.
 * @param entityId The ID of the entity.
 * @param entityType The type of the entity.
 * @returns True if the entity is followed, false otherwise.
 */
export const isEntityFollowed = (entityId: string, entityType: FollowableEntityType): boolean => {
  if (typeof window === 'undefined') return false;
  const currentFollowedItems = getFollowedItems(entityType);
  return currentFollowedItems.includes(entityId);
};

// Example of how UserProfile might be used or expanded in the future, though not directly modifying it here.
// This is more for conceptual alignment with the types.
export const getCurrentUserProfile = async (): Promise<Partial<UserProfile>> => {
  // In a real app, this would fetch from a backend.
  // For now, it could synthesize information from localStorage or mock data.
  if (typeof window === 'undefined') return { id: 'mock-user', followedPoliticians: [], followedParties: [] };

  return {
    id: 'mock-user', // Or get from auth.ts if available and makes sense
    email: 'mockuser@example.com', // from auth.ts or mock
    name: 'Mock User', // from auth.ts or mock
    followedPoliticians: getFollowedItems('politician'),
    followedParties: getFollowedItems('party'),
    // Add other followed types as needed from FollowableEntityType
    // followedPromises: getFollowedItems('promise'),
    // followedBills: getFollowedItems('bill'),
  };
};

/**
 * Helper to get all followed items across all known types.
 * This could be useful for a settings page or debugging.
 */
export const getAllFollowedItems = (): Record<FollowableEntityType, string[]> => {
  const allFollowed: Record<FollowableEntityType, string[]> = {
    politician: [],
    party: [],
    promise: [],
    bill: [],
    news: [],
  };
  const types: FollowableEntityType[] = ['politician', 'party', 'promise', 'bill', 'news'];
  types.forEach(type => {
    allFollowed[type] = getFollowedItems(type);
  });
  return allFollowed;
};
