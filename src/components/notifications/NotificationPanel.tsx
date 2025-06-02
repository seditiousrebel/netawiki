import React from 'react';
import { useNotificationStore } from '@/lib/notifications';
import NotificationItem from './NotificationItem';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const NotificationPanel: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotificationStore();

  // Sort notifications by creation date, newest first
  const sortedNotifications = [...notifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="w-full">
      <div className="p-4">
        <div className="mb-2 flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <h3 className="text-lg font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="link" size="sm" onClick={markAllAsRead} className="p-0 h-auto text-primary self-start sm:self-center">
              Mark all as read
            </Button>
          )}
        </div>
        <Separator className="mt-2" />
      </div>

      {notifications.length === 0 ? (
        <p className="p-4 text-sm text-center text-gray-500 dark:text-gray-400">
          No new notifications.
        </p>
      ) : (
        <ScrollArea className="h-[300px] md:h-[400px] px-4">
          {sortedNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              markAsRead={markAsRead}
            />
          ))}
        </ScrollArea>
      )}
    </div>
  );
};

export default NotificationPanel;
