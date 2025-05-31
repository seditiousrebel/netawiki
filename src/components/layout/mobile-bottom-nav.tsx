
"use client";

import Link from 'next/link';
import { Home, Search, UserCircle } from 'lucide-react'; // Keep Home, Search, add UserCircle for Profile
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/explore', label: 'Explore', icon: Search },
  { href: '/settings', label: 'Profile', icon: UserCircle }, // Assuming /settings is the profile/settings page
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
              {/* Increased font size from 0.65rem to text-xs (0.75rem) for better readability */}
              <span className="text-xs font-medium leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

    