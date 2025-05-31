import React from 'react';
import { useNotificationStore } from '@/lib/notifications';
import NotificationPanel from '@/components/notifications/NotificationPanel';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Bell } from 'lucide-react';

const NotificationBell: React.FC = () => {
  const { unreadCount } = useNotificationStore();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="end">
        <NotificationPanel />
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
