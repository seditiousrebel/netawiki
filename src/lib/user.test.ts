// src/lib/user.test.ts
import { followEntity, unfollowEntity, isEntityFollowed, getFollowedItems, FollowableEntityType, FOLLOWED_ITEMS_KEY_PREFIX } from './user';
import { useNotificationStore } from '@/lib/notifications';

// Mock localStorage
let mockStorage: Record<string, string> = {};

const mockLocalStorage = {
  getItem: jest.fn((key: string) => mockStorage[key] || null),
  setItem: jest.fn((key: string, value: string) => { mockStorage[key] = value; }),
  removeItem: jest.fn((key: string) => { delete mockStorage[key]; }),
  clear: jest.fn(() => { mockStorage = {}; }),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock useNotificationStore
const mockAddNotification = jest.fn();
jest.mock('@/lib/notifications', () => ({
  useNotificationStore: {
    getState: jest.fn().mockReturnValue({
      addNotification: mockAddNotification,
    }),
  },
}));

// Mock window.dispatchEvent
global.dispatchEvent = jest.fn();

describe('User Follow Management', () => {
  beforeEach(() => {
    mockLocalStorage.clear(); // Clear storage before each test
    jest.clearAllMocks(); // Clear mocks, including dispatchEvent and addNotification
  });

  const entityType: FollowableEntityType = 'politician';
  const entityId = 'test-politician-id';
  const entityName = 'Test Politician';
  const storageKey = `${FOLLOWED_ITEMS_KEY_PREFIX}${entityType}s`;

  describe('getFollowedItems', () => {
    it('should return an empty array if no items are stored', () => {
      expect(getFollowedItems(entityType)).toEqual([]);
    });

    it('should return an array of IDs if items are stored', () => {
      const ids = ['id1', 'id2'];
      mockStorage[storageKey] = JSON.stringify(ids);
      expect(getFollowedItems(entityType)).toEqual(ids);
    });

    it('should return an empty array if localStorage throws an error during parse', () => {
      mockStorage[storageKey] = 'invalid-json';
      expect(getFollowedItems(entityType)).toEqual([]);
      // console.error is expected here
    });

    it('should return an empty array if stored item is not an array', () => {
      mockStorage[storageKey] = JSON.stringify({ not: "an array" });
      expect(getFollowedItems(entityType)).toEqual([]);
    });
  });

  describe('followEntity', () => {
    it('should add entity to localStorage, show notification, and dispatch event', () => {
      followEntity(entityId, entityType, entityName);
      expect(mockStorage[storageKey]).toBe(JSON.stringify([entityId]));
      expect(mockAddNotification).toHaveBeenCalledWith(
        `You are now following ${entityName}`,
        'success'
      );
      expect(global.dispatchEvent).toHaveBeenCalledWith(expect.any(CustomEvent));
      const event = (global.dispatchEvent as jest.Mock).mock.calls[0][0] as CustomEvent;
      expect(event.type).toBe('followedItemsChanged');
      expect(event.detail).toEqual({ entityType, entityId, action: 'followed' });
    });

    it('should not add entity or dispatch event if already followed, but still show notification', () => {
      mockStorage[storageKey] = JSON.stringify([entityId]);
      followEntity(entityId, entityType, entityName);
      // Storage should remain the same
      expect(mockStorage[storageKey]).toBe(JSON.stringify([entityId]));
      // Notification should still be shown as per current implementation in user.ts (no check before notification)
      // This might be a point of discussion for desired behavior: should it notify if already followed?
      // Based on current code, it re-adds and re-notifies, which is fine.
      // Oh, wait, the code is: if (!currentFollowedItems.includes(entityId)) { ... }
      // So it should NOT add again, NOT dispatch, and NOT notify. Let's correct the test based on this.

      // Re-running with a clean slate to test the "already followed" logic
      mockLocalStorage.clear();
      jest.clearAllMocks();

      // First follow
      followEntity(entityId, entityType, entityName);
      expect(mockAddNotification).toHaveBeenCalledTimes(1);
      expect(global.dispatchEvent).toHaveBeenCalledTimes(1);

      // Second follow attempt
      followEntity(entityId, entityType, entityName);
      expect(mockStorage[storageKey]).toBe(JSON.stringify([entityId])); // Should still be just one
      expect(mockAddNotification).toHaveBeenCalledTimes(1); // Should not have been called again
      expect(global.dispatchEvent).toHaveBeenCalledTimes(1); // Should not have been called again
    });

    it('should add to existing list of followed items for the same type', () => {
        const existingId = 'another-id';
        mockStorage[storageKey] = JSON.stringify([existingId]);
        followEntity(entityId, entityType, entityName);
        expect(mockStorage[storageKey]).toBe(JSON.stringify([existingId, entityId]));
        expect(mockAddNotification).toHaveBeenCalledTimes(1);
        expect(global.dispatchEvent).toHaveBeenCalledTimes(1);
    });
  });

  describe('unfollowEntity', () => {
    it('should remove entity from localStorage, show notification, and dispatch event', () => {
      mockStorage[storageKey] = JSON.stringify([entityId, 'other-id']);
      unfollowEntity(entityId, entityType, entityName);
      expect(mockStorage[storageKey]).toBe(JSON.stringify(['other-id']));
      expect(mockAddNotification).toHaveBeenCalledWith(
        `You have unfollowed ${entityName}`,
        'info'
      );
      expect(global.dispatchEvent).toHaveBeenCalledWith(expect.any(CustomEvent));
      const event = (global.dispatchEvent as jest.Mock).mock.calls[0][0] as CustomEvent;
      expect(event.type).toBe('followedItemsChanged');
      expect(event.detail).toEqual({ entityType, entityId, action: 'unfollowed' });
    });

    it('should not do anything or dispatch event if entity was not followed', () => {
      unfollowEntity(entityId, entityType, entityName);
      expect(mockStorage[storageKey]).toBeUndefined();
      expect(mockAddNotification).not.toHaveBeenCalled();
      expect(global.dispatchEvent).not.toHaveBeenCalled();
    });
  });

  describe('isEntityFollowed', () => {
    it('should return true if entity is in localStorage for the type', () => {
      mockStorage[storageKey] = JSON.stringify([entityId]);
      expect(isEntityFollowed(entityId, entityType)).toBe(true);
    });

    it('should return false if entity is not in localStorage for the type', () => {
      mockStorage[storageKey] = JSON.stringify(['other-id']);
      expect(isEntityFollowed(entityId, entityType)).toBe(false);
    });

    it('should return false if key does not exist in localStorage', () => {
      expect(isEntityFollowed(entityId, entityType)).toBe(false);
    });
  });

  // getCurrentUserProfile and getAllFollowedItems are less critical for core follow logic
  // but could be tested for completeness if they were more complex or used by critical UI.
  // For now, focusing on the main follow/unfollow mechanics.
});
