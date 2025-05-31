
"use client";

import Link from 'next/link';
import { Home, Users, Flag, FileText, ShieldAlert, VoteIcon } from 'lucide-react'; // Added VoteIcon
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/politicians', label: 'People', icon: Users }, // Shortened label
  { href: '/parties', label: 'Parties', icon: Flag },
  { href: '/bills', label: 'Bills', icon: FileText },
  { href: '/elections', label: 'Votes', icon: VoteIcon }, // New Elections Item, shortened label
  // { href: '/controversies', label: 'Alerts', icon: ShieldAlert }, // Can be re-added if space allows
];

export function MobileBottomNav() {
  const pathname = usePathname();

  // Dynamically calculate width based on the number of items to ensure they fit
  // Max 5 items recommended for bottom nav. If more, consider a "More" tab or scrollable.
  const itemWidthClass = `w-1/${Math.min(navItems.length, 5)}`;


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
                'flex flex-col items-center justify-center p-2 rounded-md transition-colors h-full', // ensure h-full for consistent click area
                itemWidthClass, 
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon className={cn("h-5 w-5 mb-0.5", isActive ? "text-primary" : "")} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
