import { useNotificationStore } from './notifications';
import { act } from '@testing-library/react'; // Using @testing-library/react for act

// Define initial state for resetting
const initialState = useNotificationStore.getState();

describe('useNotificationStore', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    act(() => {
      useNotificationStore.setState(initialState, true);
    });
  });

  it('should have correct initial state', () => {
    const { notifications, unreadCount } = useNotificationStore.getState();
    expect(notifications).toEqual([]);
    expect(unreadCount).toBe(0);
  });

  it('should add a notification correctly', () => {
    act(() => {
      useNotificationStore.getState().addNotification('Test message 1', 'info');
    });
    const { notifications, unreadCount } = useNotificationStore.getState();
    expect(notifications).toHaveLength(1);
    expect(notifications[0].message).toBe('Test message 1');
    expect(notifications[0].type).toBe('info');
    expect(notifications[0].read).toBe(false);
    expect(notifications[0].createdAt).toBeInstanceOf(Date);
    expect(unreadCount).toBe(1);

    act(() => {
      useNotificationStore.getState().addNotification('Test message 2', 'success', '/link');
    });
    const { notifications: updatedNotifications, unreadCount: updatedUnreadCount } = useNotificationStore.getState();
    expect(updatedNotifications).toHaveLength(2);
    expect(updatedNotifications[0].message).toBe('Test message 2'); // Newest first
    expect(updatedNotifications[0].type).toBe('success');
    expect(updatedNotifications[0].link).toBe('/link');
    expect(updatedUnreadCount).toBe(2);
  });

  it('should mark a notification as read', () => {
    act(() => {
      useNotificationStore.getState().addNotification('To be read', 'warning');
    });
    const notificationId = useNotificationStore.getState().notifications[0].id;

    act(() => {
      useNotificationStore.getState().markAsRead(notificationId);
    });

    const { notifications, unreadCount } = useNotificationStore.getState();
    expect(notifications[0].read).toBe(true);
    expect(unreadCount).toBe(0);

    // Try marking a non-existent ID or already read notification
    act(() => {
      useNotificationStore.getState().markAsRead('non-existent-id');
    });
    expect(useNotificationStore.getState().unreadCount).toBe(0); // Should not change
  });

  it('should mark all notifications as read', () => {
    act(() => {
      useNotificationStore.getState().addNotification('Msg 1', 'info');
      useNotificationStore.getState().addNotification('Msg 2', 'error');
      useNotificationStore.getState().addNotification('Msg 3', 'success');
    });
    expect(useNotificationStore.getState().unreadCount).toBe(3);

    act(() => {
      useNotificationStore.getState().markAllAsRead();
    });

    const { notifications, unreadCount } = useNotificationStore.getState();
    notifications.forEach(n => expect(n.read).toBe(true));
    expect(unreadCount).toBe(0);
  });

  it('unreadCount should update correctly on multiple operations', () => {
    // Add 3 notifications
    act(() => useNotificationStore.getState().addNotification('N1', 'info'));
    act(() => useNotificationStore.getState().addNotification('N2', 'info'));
    act(() => useNotificationStore.getState().addNotification('N3', 'info'));
    expect(useNotificationStore.getState().unreadCount).toBe(3);

    // Mark one as read
    const idToMark = useNotificationStore.getState().notifications[1].id;
    act(() => useNotificationStore.getState().markAsRead(idToMark));
    expect(useNotificationStore.getState().unreadCount).toBe(2);
    expect(useNotificationStore.getState().notifications.find(n => n.id === idToMark)?.read).toBe(true);

    // Add another one
    act(() => useNotificationStore.getState().addNotification('N4', 'info'));
    expect(useNotificationStore.getState().unreadCount).toBe(3);

    // Mark all as read
    act(() => useNotificationStore.getState().markAllAsRead());
    expect(useNotificationStore.getState().unreadCount).toBe(0);

    // Add one more after marking all as read
    act(() => useNotificationStore.getState().addNotification('N5', 'info'));
    expect(useNotificationStore.getState().unreadCount).toBe(1);
    expect(useNotificationStore.getState().notifications[0].message).toBe('N5');
    expect(useNotificationStore.getState().notifications[0].read).toBe(false);
  });
});
