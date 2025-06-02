// src/components/common/FollowButton.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import FollowButton from './FollowButton';
import * as userLib from '@/lib/user';

// Mock the user library
jest.mock('@/lib/user', () => ({
  __esModule: true, // This is important for ES6 modules
  ...jest.requireActual('@/lib/user'), // Keep actual implementation for types, constants
  isEntityFollowed: jest.fn(),
  followEntity: jest.fn(),
  unfollowEntity: jest.fn(),
}));

// Helper to cast mocks
const mockedIsEntityFollowed = userLib.isEntityFollowed as jest.Mock;
const mockedFollowEntity = userLib.followEntity as jest.Mock;
const mockedUnfollowEntity = userLib.unfollowEntity as jest.Mock;

describe('FollowButton', () => {
  const mockEntityId = 'test-entity-id';
  const mockEntityType: userLib.FollowableEntityType = 'politician';
  const mockEntityName = 'Test Entity Politician';

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock implementations for each test
    mockedIsEntityFollowed.mockResolvedValue(false); // Default to not followed
    mockedFollowEntity.mockResolvedValue(undefined); // Default to resolve successfully
    mockedUnfollowEntity.mockResolvedValue(undefined); // Default to resolve successfully
  });

  it('should display loader then "Follow" when not initially following', async () => {
    mockedIsEntityFollowed.mockReturnValue(false);
    render(<FollowButton entityId={mockEntityId} entityType={mockEntityType} entityName={mockEntityName} />);

    expect(screen.getByRole('button')).toBeDisabled(); // Check for loading state via disabled
    expect(screen.getByRole('button').querySelector('.animate-spin')).toBeInTheDocument(); // Check for loader icon

    await waitFor(() => expect(screen.getByText('Follow')).toBeInTheDocument());
    expect(screen.getByRole('button')).not.toBeDisabled();
    expect(screen.queryByRole('button')?.querySelector('.animate-spin')).not.toBeInTheDocument();
  });

  it('should display loader then "Unfollow" when initially following', async () => {
    mockedIsEntityFollowed.mockReturnValue(true);
    render(<FollowButton entityId={mockEntityId} entityType={mockEntityType} entityName={mockEntityName} />);

    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('button').querySelector('.animate-spin')).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText('Unfollow')).toBeInTheDocument());
    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  it('should call followEntity and update to "Unfollow" when "Follow" is clicked', async () => {
    mockedIsEntityFollowed.mockReturnValue(false);
    render(<FollowButton entityId={mockEntityId} entityType={mockEntityType} entityName={mockEntityName} />);

    await waitFor(() => expect(screen.getByText('Follow')).toBeInTheDocument()); // Ensure initial state is set

    const followButton = screen.getByText('Follow');
    fireEvent.click(followButton);

    expect(mockedFollowEntity).toHaveBeenCalledWith(mockEntityId, mockEntityType, mockEntityName);
    // Check for loading state during the call
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('button').querySelector('.animate-spin')).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText('Unfollow')).toBeInTheDocument());
    expect(screen.getByRole('button')).not.toBeDisabled(); // Re-enabled after action
  });

  it('should call unfollowEntity and update to "Follow" when "Unfollow" is clicked', async () => {
    mockedIsEntityFollowed.mockReturnValue(true);
    render(<FollowButton entityId={mockEntityId} entityType={mockEntityType} entityName={mockEntityName} />);

    await waitFor(() => expect(screen.getByText('Unfollow')).toBeInTheDocument());

    const unfollowButton = screen.getByText('Unfollow');
    fireEvent.click(unfollowButton);

    expect(mockedUnfollowEntity).toHaveBeenCalledWith(mockEntityId, mockEntityType, mockEntityName);
    expect(screen.getByRole('button')).toBeDisabled(); // Loading state
    expect(screen.getByRole('button').querySelector('.animate-spin')).toBeInTheDocument();


    await waitFor(() => expect(screen.getByText('Follow')).toBeInTheDocument());
    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  it('should handle errors during followEntity call and revert state', async () => {
    mockedIsEntityFollowed.mockReturnValue(false);
    mockedFollowEntity.mockRejectedValue(new Error('API Error')); // Simulate an error
    console.error = jest.fn(); // Suppress console.error for this test

    render(<FollowButton entityId={mockEntityId} entityType={mockEntityType} entityName={mockEntityName} />);
    await waitFor(() => expect(screen.getByText('Follow')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Follow'));

    expect(mockedFollowEntity).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.getByText('Follow')).toBeInTheDocument()); // Should revert to "Follow"
    expect(screen.getByRole('button')).not.toBeDisabled();
    expect(console.error).toHaveBeenCalledWith("Error toggling follow state:", expect.any(Error));
  });

  it('should handle errors during unfollowEntity call and revert state', async () => {
    mockedIsEntityFollowed.mockReturnValue(true);
    mockedUnfollowEntity.mockRejectedValue(new Error('API Error'));
    console.error = jest.fn();

    render(<FollowButton entityId={mockEntityId} entityType={mockEntityType} entityName={mockEntityName} />);
    await waitFor(() => expect(screen.getByText('Unfollow')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Unfollow'));

    expect(mockedUnfollowEntity).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.getByText('Unfollow')).toBeInTheDocument()); // Should revert to "Unfollow"
    expect(screen.getByRole('button')).not.toBeDisabled();
    expect(console.error).toHaveBeenCalledWith("Error toggling follow state:", expect.any(Error));
  });

  it('should update state when "followedItemsChanged" event is dispatched for followed action', async () => {
    mockedIsEntityFollowed.mockReturnValue(false); // Initially not following
    render(<FollowButton entityId={mockEntityId} entityType={mockEntityType} entityName={mockEntityName} />);

    await waitFor(() => expect(screen.getByText('Follow')).toBeInTheDocument());

    // Dispatch a custom event as if another component followed this entity
    act(() => {
      const event = new CustomEvent('followedItemsChanged', {
        detail: { entityId: mockEntityId, entityType: mockEntityType, action: 'followed' },
      });
      window.dispatchEvent(event);
    });

    await waitFor(() => expect(screen.getByText('Unfollow')).toBeInTheDocument());
  });

  it('should update state when "followedItemsChanged" event is dispatched for unfollowed action', async () => {
    mockedIsEntityFollowed.mockReturnValue(true); // Initially following
    render(<FollowButton entityId={mockEntityId} entityType={mockEntityType} entityName={mockEntityName} />);

    await waitFor(() => expect(screen.getByText('Unfollow')).toBeInTheDocument());

    // Dispatch a custom event as if another component unfollowed this entity
    act(() => {
      const event = new CustomEvent('followedItemsChanged', {
        detail: { entityId: mockEntityId, entityType: mockEntityType, action: 'unfollowed' },
      });
      window.dispatchEvent(event);
    });

    await waitFor(() => expect(screen.getByText('Follow')).toBeInTheDocument());
  });

  it('should not update state if "followedItemsChanged" event is for a different entityId', async () => {
    mockedIsEntityFollowed.mockReturnValue(false);
    render(<FollowButton entityId={mockEntityId} entityType={mockEntityType} entityName={mockEntityName} />);
    await waitFor(() => expect(screen.getByText('Follow')).toBeInTheDocument());

    act(() => {
      const event = new CustomEvent('followedItemsChanged', {
        detail: { entityId: 'different-id', entityType: mockEntityType, action: 'followed' },
      });
      window.dispatchEvent(event);
    });

    // Wait a bit to ensure no change happens
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(screen.getByText('Follow')).toBeInTheDocument()); // State should remain "Follow"
  });

  it('should not update state if "followedItemsChanged" event is for a different entityType', async () => {
    mockedIsEntityFollowed.mockReturnValue(false);
    render(<FollowButton entityId={mockEntityId} entityType={mockEntityType} entityName={mockEntityName} />);
    await waitFor(() => expect(screen.getByText('Follow')).toBeInTheDocument());

    act(() => {
      const event = new CustomEvent('followedItemsChanged', {
        detail: { entityId: mockEntityId, entityType: 'party', action: 'followed' }, // Different type
      });
      window.dispatchEvent(event);
    });

    await new Promise(resolve => setTimeout(resolve, 100));
    expect(screen.getByText('Follow')).toBeInTheDocument());
  });
});
