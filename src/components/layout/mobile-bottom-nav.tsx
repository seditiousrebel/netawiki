
"use client";

import Link from 'next/link';
import { Home, Compass, UserCircle, SettingsIcon } from 'lucide-react'; // Changed icon for Explore, Added SettingsIcon
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { getCurrentUser } from '@/lib/auth';
import React, { useState, useEffect } from 'react';

const baseNavItemsConfig = [
  { href: '/feed', label: 'Feed', icon: Home },
  { href: '/explore', label: 'Explore', icon: Compass },
  { href: '/settings', label: 'Settings', icon: SettingsIcon }, // Added Settings
];

export function MobileBottomNav() {
  const pathname = usePathname();
  
  // Initialize state with a server-safe default for the profile link
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
      <div className="flex items-center justify-around h-16 px-1"> {/* Main container is flex */}
        {navItems.map((item) => {
          let isActive;
          // Special handling for profile active state:
          if (item.href.startsWith('/profile/')) {
            isActive = pathname.startsWith('/profile/');
          } else if (item.href === '/auth/login') {
            isActive = pathname.startsWith('/auth/login');
          } else if (item.href === '/feed' && pathname === '/') {
            isActive = true;
          } else {
            isActive = item.href !== "/" ? pathname.startsWith(item.href) : pathname === item.href;
          }
          
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex flex-row items-center justify-center gap-1 p-2 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 w-full h-full', 
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
