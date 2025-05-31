import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import NotificationBell from './NotificationBell';
import { useNotificationStore } from '@/lib/notifications';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'; // Ensure Popover is correctly mocked or real

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  // ...jest.requireActual('lucide-react'), // Removed to prevent ESM issues
  Bell: () => <div data-testid="bell-icon">BellIconMock</div>,
  Info: () => <div data-testid="info-icon">InfoIconMock</div>,
  AlertTriangle: () => <div data-testid="warning-icon">WarningIconMock</div>,
  XCircle: () => <div data-testid="error-icon">ErrorIconMock</div>,
  CheckCircle: () => <div data-testid="success-icon">SuccessIconMock</div>,
}));

// Mock ShadCN Popover to simplify testing - by default, it will render its children
jest.mock('@/components/ui/popover', () => ({
  Popover: ({ children }: { children: React.ReactNode }) => <div data-testid="popover">{children}</div>,
  PopoverTrigger: ({ children, asChild }: { children: React.ReactNode, asChild?: boolean }) =>
    asChild ? <>{children}</> : <button data-testid="popover-trigger">{children}</button>,
  PopoverContent: ({ children }: { children: React.ReactNode }) => <div data-testid="popover-content">{children}</div>,
}));


const initialStoreState = useNotificationStore.getState();

describe('NotificationBell and NotificationPanel', () => {
  beforeEach(() => {
    act(() => {
      useNotificationStore.setState(initialStoreState, true);
    });
    // Clear any timers, if necessary for future tests with timeouts
    jest.clearAllTimers();
  });

  test('renders Bell icon and no badge initially', () => {
    render(<NotificationBell />);
    expect(screen.getByTestId('bell-icon')).toBeInTheDocument();
    // The badge structure involves specific spans, check for their absence or a specific "unread count" element
    // For simplicity, we'll check that the count itself (if rendered as text) isn't there.
    // The current implementation uses visual spans, not text for '0'.
    // A more robust way would be to query for the badge element specifically if it had a data-testid.
    // For now, we assume if unreadCount is 0, the specific badge spans are not rendered.
    expect(screen.queryByText(/^\d+$/)).toBeNull(); // No digit text
  });

  test('shows unread count badge when there are unread notifications', async () => {
    render(<NotificationBell />); // Render first
    act(() => {
      useNotificationStore.getState().addNotification('Unread message', 'info');
    });
    // Re-rendering or waiting for state update in component if necessary
    // In this case, Zustand should trigger a re-render.
    // The badge is a visual element, not text. The current Bell component uses spans for the badge.
    // We will look for the ping animation span as an indicator.
    await waitFor(() => {
      const pingSpan = document.querySelector('.animate-ping'); // More specific selector might be needed
      expect(pingSpan).toBeInTheDocument();
    });
  });

  test('opens panel and displays notifications when bell is clicked', async () => {
    act(() => {
      useNotificationStore.getState().addNotification('Test Notification 1', 'info');
    });
    render(<NotificationBell />);

    // Our mock PopoverContent will be rendered immediately by Popover mock
    // If Popover was not mocked to be always open, we would fireEvent.click here
    // fireEvent.click(screen.getByTestId('popover-trigger')); // or screen.getByRole('button', { name: /open notifications/i }) if accessible name is set

    await waitFor(() => {
      expect(screen.getByText('Notifications')).toBeInTheDocument();
      expect(screen.getByText('Test Notification 1')).toBeInTheDocument();
    });
  });

  test('marks a single notification as read from panel', async () => {
    act(() => {
      useNotificationStore.getState().addNotification('Mark me as read', 'warning');
    });
    render(<NotificationBell />);

    // Open panel (mocked to be open)
    // fireEvent.click(screen.getByTestId('popover-trigger'));

    await waitFor(() => {
      expect(screen.getByText('Mark me as read')).toBeInTheDocument();
    });

    const markAsReadButton = screen.getByRole('button', { name: /mark as read/i });
    act(() => {
      fireEvent.click(markAsReadButton);
    });

    await waitFor(() => {
      // Button might disappear or change text. Let's assume it disappears.
      expect(screen.queryByRole('button', { name: /mark as read/i })).toBeNull();
    });

    // Check if unread count on bell disappears (ping animation)
    // This requires NotificationBell to re-render based on store update
    await waitFor(() => {
       expect(document.querySelector('.animate-ping')).not.toBeInTheDocument();
    });
    expect(useNotificationStore.getState().unreadCount).toBe(0);
  });

  test('marks all notifications as read from panel', async () => {
    act(() => {
      useNotificationStore.getState().addNotification('All Read Msg 1', 'success');
      useNotificationStore.getState().addNotification('All Read Msg 2', 'error');
    });
    render(<NotificationBell />);

    // Open panel
    // fireEvent.click(screen.getByTestId('popover-trigger'));

    await waitFor(() => {
      expect(screen.getByText('All Read Msg 1')).toBeInTheDocument();
      expect(screen.getByText('All Read Msg 2')).toBeInTheDocument();
    });

    const markAllAsReadButton = screen.getByRole('button', { name: /mark all as read/i });
    act(() => {
      fireEvent.click(markAllAsReadButton);
    });

    await waitFor(() => {
      // Individual "Mark as read" buttons should be gone
      expect(screen.queryAllByRole('button', { name: /mark as read/i })).toHaveLength(0);
    });
     await waitFor(() => {
       expect(document.querySelector('.animate-ping')).not.toBeInTheDocument();
    });
    expect(useNotificationStore.getState().unreadCount).toBe(0);
  });

  test('displays "No new notifications." message when empty', async () => {
    render(<NotificationBell />);
    // Open panel
    // fireEvent.click(screen.getByTestId('popover-trigger'));

    await waitFor(() => {
      expect(screen.getByText('No new notifications.')).toBeInTheDocument();
    });
  });

   test('notification link is rendered if present', async () => {
    act(() => {
      useNotificationStore.getState().addNotification('Click me!', 'info', 'https://example.com');
    });
    render(<NotificationBell />);
    // fireEvent.click(screen.getByTestId('popover-trigger'));

    await waitFor(() => {
      const linkElement = screen.getByText('Click me!').closest('a');
      expect(linkElement).toHaveAttribute('href', 'https://example.com');
    });
  });

});
