
"use client";

import Link from 'next/link';
import { Home, Users, Flag, FileText, ShieldAlert, VoteIcon, NewspaperIcon } from 'lucide-react'; // Added NewspaperIcon
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

// Adjusted items for better fit, keeping it to 5-6 crucial ones for mobile bottom nav.
// Controversies (Alerts) might be better in a "More" menu or integrated elsewhere if space is tight.
const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/politicians', label: 'People', icon: Users },
  { href: '/bills', label: 'Bills', icon: FileText },
  { href: '/elections', label: 'Votes', icon: VoteIcon },
  { href: '/news', label: 'News', icon: NewspaperIcon },
  // { href: '/parties', label: 'Parties', icon: Flag }, // Example: Could be moved to a secondary nav if too crowded
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
                'flex flex-col items-center justify-center p-2 rounded-md transition-colors h-full',
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
