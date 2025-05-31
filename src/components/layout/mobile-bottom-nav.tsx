
"use client";

import Link from 'next/link';
import { Home, Users, Flag, ListChecks, FileText, LayoutDashboard, ShieldAlert } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/politicians', label: 'Politicians', icon: Users },
  { href: '/parties', label: 'Parties', icon: Flag },
  { href: '/bills', label: 'Bills', icon: FileText },
  { href: '/controversies', label: 'Alerts', icon: ShieldAlert }, // Using Alerts label for brevity
  // { href: '/feed', label: 'Feed', icon: LayoutDashboard }, // Removed feed for now to make space
];

export function MobileBottomNav() {
  const pathname = usePathname();

  // Ensure there are 5 items for even distribution if feed is re-added or another icon is used.
  // If we have 5 items, w-1/5 is correct. If 6, it would be w-1/6.
  const itemWidthClass = `w-1/${navItems.length}`;


  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-t-lg z-40">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center p-2 rounded-md transition-colors',
                itemWidthClass, // Dynamically set width
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon className={cn("h-5 w-5 mb-0.5", isActive ? "text-primary" : "")} /> {/* Slightly smaller icon */}
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
