
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
  
  // Initialize navItems with a server-safe profile link (guest user)
  const [navItems, setNavItems] = useState(() => [
    ...baseNavItemsConfig,
    { href: `/profile/guestUser`, label: 'Profile', icon: UserCircle } 
  ]);

  useEffect(() => {
    // This effect runs only on the client after hydration
    const clientCurrentUser = getCurrentUser(); // Now it's safe to access localStorage
    
    // Determine the correct profile link based on the client-side user
    const profileLink = clientCurrentUser.role !== 'Guest' 
      ? `/profile/${clientCurrentUser.id || 'current-user'}` // Fallback if id is somehow undefined
      : '/auth/login'; // For guests, link to login page

    setNavItems([
      ...baseNavItemsConfig,
      { href: profileLink, label: 'Profile', icon: UserCircle }
    ]);
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-t-lg z-40">
      <div className={`grid grid-cols-${navItems.length} items-center h-16`}>
        {navItems.map((item) => {
          // Determine active state for the link
          let isActive;
          if (item.label === 'Profile' && item.href === '/auth/login') {
            // Special case: if profile link points to login, check for /auth/login active state
            isActive = pathname.startsWith('/auth/login');
          } else if (item.href === '/feed' && pathname === '/') {
            // Consider Feed active for the root path as well
            isActive = true;
          } else {
            isActive = item.href !== "/" && pathname.startsWith(item.href);
          }
          
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                // Removed justify-center, icon and text will now align to the start of the flex container (Link)
                // The grid parent's items-center will vertically center the Link block within its cell
                'flex flex-row items-center gap-1 p-1 rounded-md transition-colors h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50', 
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
