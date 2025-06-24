
"use client";

import Link from 'next/link';
import { Home, Compass, UserCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { getCurrentUser } from '@/lib/auth';
import React, { useState, useEffect } from 'react';

const baseNavItemsConfig = [
  { href: '/feed', label: 'Feed', icon: Home },
  { href: '/explore', label: 'Explore', icon: Compass },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const [profileLink, setProfileLink] = useState<string | null>(null);

  useEffect(() => {
    const clientCurrentUser = getCurrentUser();
    const link = clientCurrentUser.role !== 'Guest' 
      ? `/profile/${clientCurrentUser.id || 'current-user'}`
      : '/auth/login';
    setProfileLink(link);
  }, [pathname]); // Re-evaluating on pathname change is sufficient for this mock setup.

  const navItems = baseNavItemsConfig;

  // Calculate active state for profile link
  const isProfileActive = profileLink ? (pathname.startsWith('/profile/') || pathname.startsWith('/auth/login')) : false;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-t-lg z-40">
      <div className="flex items-center justify-around h-16 px-1"> 
        {navItems.map((item) => {
          const isActive = (item.href === '/feed' && pathname === '/') || (item.href !== "/" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex flex-row items-center justify-center gap-1 p-2 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 w-full h-full',
                isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:text-primary hover:bg-accent/50'
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
              <span className="text-xs font-medium whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
        
        {/* Profile Link with Hydration Safety */}
        {profileLink ? (
          <Link
            href={profileLink}
            className={cn(
              'flex flex-row items-center justify-center gap-1 p-2 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 w-full h-full',
              isProfileActive ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:text-primary hover:bg-accent/50'
            )}
            aria-current={isProfileActive ? "page" : undefined}
          >
            <UserCircle className={cn("h-5 w-5 shrink-0", isProfileActive && "text-primary")} />
            <span className="text-xs font-medium whitespace-nowrap">Profile</span>
          </Link>
        ) : (
          // Render a disabled-looking placeholder on server and initial client render
          <div className="flex flex-row items-center justify-center gap-1 p-2 rounded-md w-full h-full text-muted-foreground/50">
            <UserCircle className="h-5 w-5 shrink-0" />
            <span className="text-xs font-medium whitespace-nowrap">Profile</span>
          </div>
        )}
      </div>
    </nav>
  );
}
