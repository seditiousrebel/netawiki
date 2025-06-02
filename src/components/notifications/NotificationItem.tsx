import React from 'react';
import { Notification } from '@/types/gov';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface NotificationItemProps {
  notification: Notification;
  markAsRead: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, markAsRead }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'info':
        return <Info className="mr-2 h-5 w-5 text-blue-500 flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500 flex-shrink-0" />;
      case 'error':
        return <XCircle className="mr-2 h-5 w-5 text-red-500 flex-shrink-0" />;
      case 'success':
        return <CheckCircle className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />;
      default:
        return null;
    }
  };

  return (
    <Card className={`mb-2 ${notification.read ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'}`}>
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="flex items-start text-sm font-medium">
          {getIcon()}
          {notification.link ? (
            <a href={notification.link} target="_blank" rel="noopener noreferrer" className="hover:underline break-words">
              {notification.message}
            </a>
          ) : (
            <span className="break-words">{notification.message}</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-gray-500 dark:text-gray-400 pb-2 break-words pl-9"> {/* Indent content to align with message text */}
        {new Date(notification.createdAt).toLocaleString(undefined, {dateStyle: 'medium', timeStyle: 'short'})}
      </CardContent>
      {!notification.read && (
        <CardFooter className="pb-3 pt-0 pl-9"> {/* Indent footer content */}
          <Button variant="outline" size="sm" onClick={() => markAsRead(notification.id)}>
            Mark as read
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default NotificationItem;
