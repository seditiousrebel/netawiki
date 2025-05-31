
"use client";

import Link from 'next/link';
import { Compass, Grid3X3, UserCircle, Home } from 'lucide-react'; // Updated icons
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { getCurrentUser } from '@/lib/auth'; // To construct profile link

const navItems = [
  { href: '/feed', label: 'Feed', icon: Home }, // Changed Home to Feed, kept Home icon for familiarity
  { href: '/explore', label: 'Explore', icon: Grid3X3 }, // Used Grid3X3 for Explore
  { href: `/profile/current-user`, label: 'Profile', icon: UserCircle }, // Dynamic profile link
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const currentUser = getCurrentUser(); // Get current user to construct profile link

  // Update profile link dynamically based on user ID
  const dynamicNavItems = navItems.map(item => {
    if (item.label === 'Profile') {
      return { ...item, href: `/profile/${currentUser.id || 'current-user'}` };
    }
    return item;
  });

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-t-lg z-40">
      {/* Switched to CSS Grid for equal distribution */}
      <div className={`grid grid-cols-${dynamicNavItems.length} items-center h-16`}>
        {dynamicNavItems.map((item) => {
          const isActive = (pathname === '/' && item.href === '/feed') || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center p-1 rounded-md transition-colors h-full text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                isActive ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-primary'
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon className={cn("h-6 w-6 mb-0.5", isActive ? "text-primary" : "")} />
              <span className="text-xs font-medium leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
