
"use client";

import Link from 'next/link';
import { Home, Compass, UserCircle } from 'lucide-react'; // Updated Explore icon to Compass
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { getCurrentUser } from '@/lib/auth';
import React, { useState, useEffect } from 'react';

const baseNavItemsConfig = [
  { href: '/feed', label: 'Feed', icon: Home },
  { href: '/explore', label: 'Explore', icon: Compass }, // Changed icon
];

export function MobileBottomNav() {
  const pathname = usePathname();
  
  const [navItems, setNavItems] = useState(() => {
    const initialProfileLink = `/profile/guestUser`; // Default for server-side rendering
    return [
      ...baseNavItemsConfig,
      { href: initialProfileLink, label: 'Profile', icon: UserCircle } 
    ];
  });

  useEffect(() => {
    const clientCurrentUser = getCurrentUser();
    const profileLink = clientCurrentUser.role !== 'Guest' 
      ? `/profile/${clientCurrentUser.id || 'current-user'}` // Ensure ID exists
      : '/auth/login'; // Redirect to login if guest

    setNavItems([
      ...baseNavItemsConfig,
      { href: profileLink, label: 'Profile', icon: UserCircle }
    ]);
  // Effect should re-run if pathname changes, e.g., after login/logout
  // which might trigger a change in getCurrentUser() result.
  }, [pathname]);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-t-lg z-40">
      {/* Changed from grid to flex for the main container */}
      <div className="flex items-center justify-around h-16 px-1">
        {navItems.map((item) => {
          let isActive;
          // Special handling for profile active state:
          // If the user is a guest, the profile link points to /auth/login.
          // We want the "Profile" tab to be active if they are on /auth/login.
          if (item.label === 'Profile' && item.href === '/auth/login') {
            isActive = pathname.startsWith('/auth/login');
          } else if (item.href === '/feed' && pathname === '/') {
            // Handle case where '/' should highlight 'Feed'
            isActive = true;
          } else {
            // For /profile/[userId], check if pathname starts with /profile/
            if (item.href.startsWith('/profile/')) {
                isActive = pathname.startsWith('/profile/');
            } else {
                // For other paths, check if pathname starts with item.href
                // (but not for root, which is handled by the feed condition)
                isActive = item.href !== "/" ? pathname.startsWith(item.href) : pathname === item.href;
            }
          }
          
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                // Ensure icon and text are side-by-side and centered within the link
                'flex flex-row items-center justify-center gap-1 p-2 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50', 
                isActive ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-primary'
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-primary" : "")} />
              <span className="text-xs font-medium whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
