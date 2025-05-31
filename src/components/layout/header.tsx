
"use client";

import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Search, UserCircle, ShieldCheck, Users, Landmark, ClipboardList, ShieldAlert, Vote, FileText, MapPinIcon } from 'lucide-react'; // Removed Bell
import { usePathname } from 'next/navigation';
// import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'; // Removed Popover
import { cn } from '@/lib/utils';
import type { UserProfile } from '@/types/gov';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Added
import { Input } from '@/components/ui/input'; // Added
import NotificationBell from './NotificationBell'; // Added NotificationBell import

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/explore', label: 'Explore' },
  { href: '/politicians', label: 'Politicians' },
  { href: '/parties', label: 'Parties' },
  { href: '/bills', label: 'Bills' },
  { href: '/promises', label: 'Promises' },
  { href: '/controversies', label: 'Controversies' },
  { href: '/elections', label: 'Elections' },
  { href: '/committees', label: 'Committees' },
  { href: '/constituencies', label: 'Constituencies' }, // New Constituency link
  { href: '/news', label: 'News' },
  { href: '/feed', label: 'My Feed' },
  // Note: The /explore path should ideally be /app/explore, but navLink paths seem to be root-relative.
  // If issues arise, this might need adjustment based on router configuration.
];

// Mock Notification Data
// const mockNotifications = [
//   { id: 'n1', title: 'Suggestion Approved', message: 'Your suggestion for Politician Alice D. bio was approved.', date: '2 hours ago', read: false, link: '/admin/suggestions' },
//   { id: 'n2', title: 'New Bill: Education Reform Act', message: 'A new bill matching your interest "Education" was introduced.', date: '1 day ago', read: false, link: '/bills/bill_edu_reform' }, // Assuming a bill slug or ID
//   { id: 'n3', title: 'Promise Update: Park Project', message: 'The "City Park Revitalization" promise you follow is now "In Progress".', date: '3 days ago', read: true, link: '/promises#promise_park_1' }, // Assuming promise ID for anchor link
//   { id: 'n4', title: 'Welcome to GovTrackr!', message: 'Explore features and start following entities.', date: '1 week ago', read: true, link: '/' }
// ];

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter(); // Added
  const [user, setUser] = useState<UserProfile | null>(null); // Mock user state
  const [searchQuery, setSearchQuery] = useState(''); // Added

  // Simulate user login state
  useEffect(() => {
    const timer = setTimeout(() => {
       // setUser({ id: 'user123', email: 'user@example.com', name: 'Demo User', followedPoliticians: [], followedParties: [] });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // const unreadNotificationCount = mockNotifications.filter(n => !n.read).length; // Removed, will be handled by Zustand store

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      // setSearchQuery(''); // Optionally clear input after search
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg font-headline font-semibold text-primary">
          <ShieldCheck className="h-7 w-7" />
          <span>GovTrackr</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-2 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'transition-colors hover:text-primary px-2 py-1 rounded-md text-xs', // Reduced padding and text size
                (pathname === '/' && link.href === '/') || (link.href !== '/' && pathname.startsWith(link.href))
                  ? 'text-primary bg-primary/10' 
                  : 'text-foreground/70'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2"> {/* Reduced gap-3 to gap-2 to accommodate search bar better */}
          <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search entities..."
              className="h-9 pl-8 pr-2 w-48 lg:w-64" // Adjusted width
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          <NotificationBell />

          {user ? (
            <Link href="/settings">
              <Button variant="ghost" className="gap-2">
                <UserCircle className="h-5 w-5" />
                <span className="hidden sm:inline">{user.name || 'Profile'}</span>
              </Button>
            </Link>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="ghost">Log In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground">Sign Up</Button>
              </Link>
            </div>
          )}

          {/* Mobile Navigation */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        'text-lg transition-colors hover:text-primary p-2 rounded-md',
                         (pathname === '/' && link.href === '/') || (link.href !== '/' && pathname.startsWith(link.href))
                          ? 'text-primary font-semibold bg-primary/10' 
                          : 'text-foreground/80'
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="pt-4 border-t">
                     {user ? (
                        <Link href="/settings">
                          <Button variant="ghost" className="w-full justify-start gap-2 text-lg">
                            <UserCircle className="h-5 w-5" />
                            Profile
                          </Button>
                        </Link>
                      ) : (
                        <>
                          <Link href="/auth/login" className="block w-full">
                            <Button variant="outline" className="w-full text-lg mb-2">Log In</Button>
                          </Link>
                          <Link href="/auth/signup" className="block w-full">
                            <Button variant="default" className="w-full text-lg bg-accent hover:bg-accent/90 text-accent-foreground">Sign Up</Button>
                          </Link>
                        </>
                      )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

    