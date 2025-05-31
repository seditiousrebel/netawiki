
"use client";

import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Search, UserCircle, ShieldCheck, Home, VoteIcon, NewspaperIcon } from 'lucide-react'; // Added NewspaperIcon
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { UserProfile } from '@/types/gov';
import { useState, useEffect } from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/politicians', label: 'Politicians' },
  { href: '/parties', label: 'Parties' },
  { href: '/bills', label: 'Bills' },
  { href: '/promises', label: 'Promises' },
  { href: '/controversies', label: 'Controversies' },
  { href: '/elections', label: 'Elections' },
  { href: '/news', label: 'News' }, // New News link
  { href: '/feed', label: 'My Feed' },
];

export function AppHeader() {
  const pathname = usePathname();
  const [user, setUser] = useState<UserProfile | null>(null); // Mock user state

  // Simulate user login state
  useEffect(() => {
    // In a real app, you'd fetch user data or check auth status
    // For now, simulate a logged-in user after a delay
    const timer = setTimeout(() => {
       // setUser({ id: 'user123', email: 'user@example.com', name: 'Demo User', followedPoliticians: [], followedParties: [] });
    }, 100);
    return () => clearTimeout(timer);
  }, []);


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg font-headline font-semibold text-primary">
          <ShieldCheck className="h-7 w-7" />
          <span>GovTrackr</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'transition-colors hover:text-primary',
                (pathname === '/' && link.href === '/') || (link.href !== '/' && pathname.startsWith(link.href))
                  ? 'text-primary' 
                  : 'text-foreground/70'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="hidden md:inline-flex">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

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
          <div className="md:hidden">
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
                        'text-lg transition-colors hover:text-primary',
                         (pathname === '/' && link.href === '/') || (link.href !== '/' && pathname.startsWith(link.href))
                          ? 'text-primary font-semibold' 
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
