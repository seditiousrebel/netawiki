import { create } from 'zustand';
import { Notification } from '../types/gov';

interface NotificationState {
  notifications: Notification[];
  addNotification: (message: string, type: Notification['type'], link?: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  unreadCount: number;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  addNotification: (message, type, link) => {
    const newNotification: Notification = {
      id: `${Date.now().toString()}-${Math.random().toString(36).substr(2, 9)}`, // Added random suffix
      message,
      type,
      read: false,
      createdAt: new Date(),
      link,
    };
    set((state) => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: get().notifications.filter((n) => n.id === id && !n.read).length > 0 ? state.unreadCount - 1 : state.unreadCount,
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),
}));
