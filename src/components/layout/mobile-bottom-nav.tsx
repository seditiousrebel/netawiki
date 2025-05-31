
"use client";

import Link from 'next/link';
import { Home, Grid3X3, UserCircle } from 'lucide-react'; // Updated icons
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { getCurrentUser } from '@/lib/auth'; // To construct profile link
import React, { useState, useEffect } from 'react'; // Import useState and useEffect

// Base navigation items, Profile link will be added dynamically
const baseNavItemsConfig = [
  { href: '/feed', label: 'Feed', icon: Home },
  { href: '/explore', label: 'Explore', icon: Grid3X3 },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  
  const [navItems, setNavItems] = useState(() => {
    // Initial server-safe state for the profile link
    const initialProfileLink = `/profile/guestUser`; 
    return [
      ...baseNavItemsConfig,
      { href: initialProfileLink, label: 'Profile', icon: UserCircle } 
    ];
  });

  useEffect(() => {
    const clientCurrentUser = getCurrentUser();
    const profileLink = clientCurrentUser.role !== 'Guest' 
      ? `/profile/${clientCurrentUser.id || 'current-user'}`
      : '/auth/login';

    setNavItems([
      ...baseNavItemsConfig,
      { href: profileLink, label: 'Profile', icon: UserCircle }
    ]);
  }, []);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-t-lg z-40">
      <div className={`grid grid-cols-${navItems.length} items-center h-16`}>
        {navItems.map((item) => {
          let isActive;
          if (item.label === 'Profile' && item.href === '/auth/login') {
            isActive = pathname.startsWith('/auth/login');
          } else if (item.href === '/feed' && pathname === '/') {
            isActive = true;
          } else {
            // Ensure that for /profile/[userId], only /profile is matched, not deeper paths if any.
            // And for other paths, ensure it's an exact match or startsWith for parent routes.
            if (item.href.startsWith('/profile/')) {
                isActive = pathname.startsWith('/profile/');
            } else {
                isActive = item.href !== "/" ? pathname.startsWith(item.href) : pathname === item.href;
            }
          }
          
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex flex-row items-center justify-center w-full h-full gap-1 p-1 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50', 
                isActive ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-primary'
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-primary" : "")} />
              <span className="text-xs font-medium leading-tight whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

