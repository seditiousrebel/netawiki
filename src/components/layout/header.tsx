
"use client";

import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Search, UserCircle, ShieldCheck } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { UserProfile } from '@/types/gov';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import NotificationBell from './NotificationBell';
import { getCurrentUser } from '@/lib/auth'; // Import getCurrentUser

// Simplified navLinks for the main app header
const navLinks = [
  { href: '/feed', label: 'My Feed' },
  { href: '/explore', label: 'Explore' },
];

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.role !== 'Guest') {
      setUser({ id: currentUser.id, name: currentUser.name, email: currentUser.email, followedPoliticians: [], followedParties: [] });
    } else {
      setUser(null);
    }
  }, [pathname]); // Re-check user on pathname change (e.g., after login/logout simulation)

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSheetOpen(false); // Close sheet on search
    }
  };

  const profileLink = user ? `/profile/${user.id}` : '/auth/login';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/feed" className="flex items-center gap-2 text-lg font-headline font-semibold text-primary">
          <ShieldCheck className="h-7 w-7" />
          <span>GovTrackr</span>
        </Link>

        <nav className="hidden lg:flex items-center space-x-1 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'transition-colors hover:text-primary px-2.5 py-1.5 rounded-md text-sm',
                (pathname === '/' && link.href === '/feed') || (link.href !== '/' && pathname.startsWith(link.href))
                  ? 'text-primary bg-primary/10 font-semibold'
                  : 'text-foreground/70'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="h-9 pl-8 pr-2 w-40 lg:w-56 xl:w-64 rounded-full focus:ring-primary/50" // Added rounded-full
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          <NotificationBell />

          {user ? (
            <Link href={profileLink}>
              <Button variant="ghost" className="gap-1.5 px-2 sm:px-3 rounded-full"> {/* Added rounded-full */}
                <UserCircle className="h-5 w-5" />
                <span className="hidden sm:inline text-sm">{user.name || 'Profile'}</span>
              </Button>
            </Link>
          ) : (
            <div className="hidden md:flex items-center gap-1">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="rounded-full">Log In</Button> {/* Added rounded-full */}
              </Link>
              <Link href="/auth/signup">
                <Button variant="default" size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full">Sign Up</Button> {/* Added rounded-full */}
              </Link>
            </div>
          )}

          <div className="lg:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px] p-0">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle className="text-lg font-semibold text-primary">Menu</SheetTitle>
                </SheetHeader>
                <div className="p-4">
                  <form onSubmit={handleSearchSubmit} className="relative mb-4">
                    <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search GovTrackr..."
                      className="h-10 pl-9 rounded-md"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </form>
                  <nav className="flex flex-col space-y-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          'text-base transition-colors hover:bg-accent/50 p-2.5 rounded-md',
                           (pathname === '/' && link.href === '/feed') || (link.href !== '/' && pathname.startsWith(link.href))
                            ? 'text-primary font-semibold bg-primary/10'
                            : 'text-foreground/80 hover:text-primary'
                        )}
                        onClick={() => setIsSheetOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                    <div className="pt-3 border-t mt-2">
                       {user ? (
                          <Link href={profileLink} onClick={() => setIsSheetOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start gap-2 text-base p-2.5">
                              <UserCircle className="h-5 w-5" />
                              My Profile
                            </Button>
                          </Link>
                        ) : (
                          <>
                            <Link href="/auth/login" className="block w-full" onClick={() => setIsSheetOpen(false)}>
                              <Button variant="outline" className="w-full text-base p-2.5 mb-2">Log In</Button>
                            </Link>
                            <Link href="/auth/signup" className="block w-full" onClick={() => setIsSheetOpen(false)}>
                              <Button variant="default" className="w-full text-base p-2.5 bg-accent hover:bg-accent/90 text-accent-foreground">Sign Up</Button>
                            </Link>
                          </>
                        )}
                    </div>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
