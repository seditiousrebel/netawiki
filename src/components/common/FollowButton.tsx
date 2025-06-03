// src/components/common/FollowButton.tsx
import React, { useState, useEffect, useCallback, memo } from 'react'; // Import memo
import { Button } from '@/components/ui/button';
import { followEntity, unfollowEntity, isEntityFollowed } from '@/lib/user';
import type { FollowableEntityType } from '@/lib/user';
import { Loader2 } from 'lucide-react';
import { isUserLoggedIn } from '@/lib/auth'; // Added import
import { useRouter } from 'next/navigation'; // Added import

interface FollowButtonProps {
  entityId: string;
  entityType: FollowableEntityType;
  entityName: string; // For notifications
  className?: string; // Allow custom styling
}

const FollowButton: React.FC<FollowButtonProps> = ({ entityId, entityType, entityName, className }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true to check initial state
  const router = useRouter(); // Initialize router

  // Memoize checkInitialFollowStatus to prevent re-creation on every render
  const checkInitialFollowStatus = useCallback(() => {
    setIsLoading(true);
    try {
      const currentlyFollowing = isEntityFollowed(entityId, entityType);
      setIsFollowing(currentlyFollowing);
    } catch (error) {
      console.error("Error checking follow status:", error);
      // Optionally set an error state here
    } finally {
      setIsLoading(false);
    }
  }, [entityId, entityType]);

  useEffect(() => {
    checkInitialFollowStatus();

    // Listen for custom event dispatched by follow/unfollow functions
    // This helps sync buttons for the same entity across different parts of the UI
    const handleFollowChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail.entityId === entityId && customEvent.detail.entityType === entityType) {
        setIsFollowing(customEvent.detail.action === 'followed');
      }
    };

    window.addEventListener('followedItemsChanged', handleFollowChange);

    return () => {
      window.removeEventListener('followedItemsChanged', handleFollowChange);
    };
  }, [checkInitialFollowStatus, entityId, entityType]);

  const handleFollowToggle = async () => {
    if (!isUserLoggedIn()) { // Check if user is logged in
      router.push('/auth/login'); // Redirect to login page
      return; // Stop further execution
    }

    setIsLoading(true);
    try {
      if (isFollowing) {
        await unfollowEntity(entityId, entityType, entityName);
        setIsFollowing(false);
      } else {
        await followEntity(entityId, entityType, entityName);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Error toggling follow state:", error);
      // Revert UI state or show error notification if needed
      // For now, notifications are handled within follow/unfollowEntity
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleFollowToggle}
      disabled={isLoading}
      variant={isFollowing ? 'outline' : 'default'}
      className={className}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : isFollowing ? (
        'Unfollow'
      ) : (
        'Follow'
      )}
    </Button>
  );
};

export default memo(FollowButton);
