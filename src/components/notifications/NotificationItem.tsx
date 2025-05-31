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
        return <Info className="mr-2 h-5 w-5 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="mr-2 h-5 w-5 text-red-500" />;
      case 'success':
        return <CheckCircle className="mr-2 h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className={`mb-2 ${notification.read ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'}`}>
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="flex items-center text-sm font-medium">
          {getIcon()}
          {notification.link ? (
            <a href={notification.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {notification.message}
            </a>
          ) : (
            notification.message
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-gray-500 dark:text-gray-400 pb-2">
        {new Date(notification.createdAt).toLocaleString()}
      </CardContent>
      {!notification.read && (
        <CardFooter className="pb-3 pt-0">
          <Button variant="outline" size="sm" onClick={() => markAsRead(notification.id)}>
            Mark as read
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default NotificationItem;
