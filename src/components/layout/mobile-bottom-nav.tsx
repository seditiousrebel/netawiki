
"use client";

import Link from 'next/link';
import { Home, Users, Flag, FileText, ShieldAlert, VoteIcon, NewspaperIcon, Landmark as CommitteeIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

// Max 5-6 items for mobile bottom nav. "Committees" is added.
// If more are needed, a "More" tab strategy would be best.
const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/politicians', label: 'People', icon: Users },
  { href: '/bills', label: 'Bills', icon: FileText },
  { href: '/elections', label: 'Votes', icon: VoteIcon },
  { href: '/committees', label: 'Cmtes', icon: CommitteeIcon }, // Shortened label
  // { href: '/news', label: 'News', icon: NewspaperIcon }, // Example: Could be in "More" or accessed from Home
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const itemWidthClass = `w-1/${navItems.length}`;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-t-lg z-40">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = (pathname === '/' && item.href === '/') || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center p-1 rounded-md transition-colors h-full text-center',
                itemWidthClass, 
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon className={cn("h-5 w-5 mb-0.5", isActive ? "text-primary" : "")} />
              <span className="text-[0.65rem] font-medium leading-tight">{item.label}</span> {/* Smaller text */}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
