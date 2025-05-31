
"use client";

import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Search, UserCircle, ShieldCheck, LogOut, SettingsIcon } from 'lucide-react'; // Added SettingsIcon
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { UserProfile } from '@/types/gov';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import NotificationBell from './NotificationBell';
import { getCurrentUser, logout } from '@/lib/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mainNavLinks = [
  { href: '/feed', label: 'My Feed' },
  { href: '/explore', label: 'Explore' },
];

const mobileSheetNavLinks = [ // Separate for mobile sheet if needed, or combine
  { href: '/feed', label: 'My Feed' },
  { href: '/explore', label: 'Explore' },
  { href: '/settings', label: 'Settings', icon: SettingsIcon }, // Added settings here
];


export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    const updateUserData = () => {
      const currentUser = getCurrentUser();
      if (currentUser && currentUser.role !== 'Guest') {
        setUser({ id: currentUser.id, name: currentUser.name, email: currentUser.email, followedPoliticians: [], followedParties: [] });
      } else {
        setUser(null);
      }
    };

    updateUserData();

    window.addEventListener('userRoleChanged', updateUserData);
    window.addEventListener('userLoggedOut', updateUserData);

    return () => {
      window.removeEventListener('userRoleChanged', updateUserData);
      window.removeEventListener('userLoggedOut', updateUserData);
    };
  }, [pathname]);

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSheetOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    router.push('/auth/login');
    setIsSheetOpen(false);
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
          {mainNavLinks.map((link) => (
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
              className="h-9 pl-8 pr-2 w-40 lg:w-56 xl:w-64 rounded-full focus:ring-primary/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          <NotificationBell />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-1.5 px-2 sm:px-3 rounded-full">
                  <UserCircle className="h-5 w-5" />
                  <span className="hidden sm:inline text-sm">{user.name || 'Profile'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{user.name || 'My Account'}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={profileLink} className="cursor-pointer">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-1">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="rounded-full">Log In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="default" size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full">Sign Up</Button>
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
                  <SheetTitle className="text-lg font-semibold text-primary sr-only">Mobile Menu</SheetTitle>
                   <Link href="/feed" className="flex items-center gap-2 text-lg font-headline font-semibold text-primary" onClick={() => setIsSheetOpen(false)}>
                    <ShieldCheck className="h-7 w-7" />
                    <span>GovTrackr</span>
                  </Link>
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
                  <nav className="flex flex-col space-y-1">
                    {mobileSheetNavLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          'text-base transition-colors hover:bg-accent/50 p-2.5 rounded-md flex items-center gap-2.5',
                           (pathname === '/' && link.href === '/feed') || (link.href !== '/' && pathname.startsWith(link.href))
                            ? 'text-primary font-semibold bg-primary/10'
                            : 'text-foreground/80 hover:text-primary'
                        )}
                        onClick={() => setIsSheetOpen(false)}
                      >
                        {link.icon && <link.icon className="h-5 w-5" />}
                        {link.label}
                      </Link>
                    ))}
                    <div className="pt-3 border-t mt-2">
                       {user ? (
                         <>
                          <Link href={profileLink} onClick={() => setIsSheetOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start gap-2 text-base p-2.5">
                              <UserCircle className="h-5 w-5" />
                              My Profile
                            </Button>
                          </Link>
                           <Button variant="ghost" className="w-full justify-start gap-2 text-base p-2.5 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={handleLogout}>
                              <LogOut className="h-5 w-5" />
                              Sign Out
                           </Button>
                         </>
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
