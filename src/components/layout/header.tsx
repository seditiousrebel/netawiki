
"use client";

import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Search, UserCircle, ShieldCheck, LogOut, SettingsIcon, Compass, HomeIcon, Gavel, PanelLeftOpen } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { UserProfile } from '@/types/gov';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import NotificationBell from './NotificationBell';
import { getCurrentUser, logout, canAccess, EDITOR_ROLES } from '@/lib/auth';
import { entityNavItems } from '@/lib/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from '@/components/ui/sidebar'; // Import useSidebar

const mainNavLinks = [
  { href: '/feed', label: 'My Feed' },
  { href: '/explore', label: 'Explore' },
];

const mobileSheetNavLinks = [
  { href: '/feed', label: 'My Feed', icon: HomeIcon },
  { href: '/explore', label: 'Explore', icon: Compass },
];

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { open: sidebarOpen, toggleSidebar, isMobile } = useSidebar(); // Get sidebar state and toggle

  useEffect(() => {
    const updateUserData = () => {
      const currentUserDetails = getCurrentUser();
      if (currentUserDetails && currentUserDetails.role !== 'Guest') {
        setUser({ id: currentUserDetails.id, name: currentUserDetails.name, email: currentUserDetails.email, followedPoliticians: [], followedParties: [] });
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
      setIsSheetOpen(false); // Close sheet on search submit
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    router.push('/auth/login');
    setIsSheetOpen(false);
  };

  const profileLink = user ? `/profile/${user.id}` : '/auth/login';
  const currentUserForRoles = getCurrentUser();
  const showAdminLinksInMobileSheet = user && canAccess(currentUserForRoles.role, EDITOR_ROLES);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">

        {/* Left Group: Sidebar Toggles & Brand */}
        <div className="flex items-center">
          {/* Desktop Sidebar Toggle */}
          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:text-foreground mr-2 hidden lg:flex"
              onClick={toggleSidebar}
              aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <PanelLeftOpen className={cn("h-5 w-5 transition-transform duration-300", sidebarOpen && "rotate-180")} />
            </Button>
          )}

          {/* Mobile Menu Trigger */}
          <div className="lg:hidden mr-2">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0 overflow-y-auto">
                 <SheetHeader className="p-4 border-b">
                  <SheetTitle className="text-lg font-semibold text-primary flex items-center gap-2">
                     <ShieldCheck className="h-6 w-6" /> GovTrackr
                  </SheetTitle>
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
                    <div className="mt-3 pt-3 border-t">
                      <p className="px-2.5 py-1.5 text-xs font-semibold text-muted-foreground">Categories</p>
                      {entityNavItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            'text-base transition-colors hover:bg-accent/50 p-2.5 rounded-md flex items-center gap-2.5',
                            pathname.startsWith(item.href) ? 'text-primary font-semibold bg-primary/10' : 'text-foreground/80 hover:text-primary'
                          )}
                          onClick={() => setIsSheetOpen(false)}
                        >
                          <item.icon className="h-5 w-5" />
                          {item.label}
                        </Link>
                      ))}
                    </div>

                    {showAdminLinksInMobileSheet && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="px-2.5 py-1.5 text-xs font-semibold text-muted-foreground">Admin</p>
                        <Link
                          href="/admin/suggestions"
                          className={cn(
                            'text-base transition-colors hover:bg-accent/50 p-2.5 rounded-md flex items-center gap-2.5',
                            pathname.startsWith("/admin/suggestions") ? 'text-primary font-semibold bg-primary/10' : 'text-foreground/80 hover:text-primary'
                          )}
                          onClick={() => setIsSheetOpen(false)}
                        >
                          <Gavel className="h-5 w-5" />
                          Suggestions
                        </Link>
                        {/* Add other admin links here if needed */}
                      </div>
                    )}

                    <div className="pt-3 border-t mt-2">
                       {user ? (
                         <>
                          <Link href={profileLink} onClick={() => setIsSheetOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start gap-2 text-base p-2.5">
                              <UserCircle className="h-5 w-5" />
                              My Profile
                            </Button>
                          </Link>
                          <Link href="/settings" onClick={() => setIsSheetOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start gap-2 text-base p-2.5">
                              <SettingsIcon className="h-5 w-5" />
                              Settings
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

          {/* Brand - Visible on all screen sizes, text controlled */}
          <Link href="/" className="flex items-center gap-2 text-lg sm:text-xl font-headline font-semibold text-primary">
            <ShieldCheck className="h-6 w-6 sm:h-7 sm:w-7" />
            <span className="hidden lg:inline">GovTrackr</span>
          </Link>
        </div>

        {/* Center Group: Desktop Navigation Links */}
        <nav className="hidden lg:flex flex-grow justify-center items-center space-x-2 mx-4">
          {mainNavLinks.map((link) => {
             if (link.href === '/feed' && !user) {
               return null;
             }
             return (
               <Link
                 key={link.href}
                 href={link.href}
                 className={cn(
                   'transition-colors hover:text-primary px-3 py-1.5 rounded-md text-sm',
                   (pathname === '/' && link.href === '/feed') || (link.href !== '/' && pathname.startsWith(link.href))
                     ? 'text-primary bg-primary/10 font-semibold'
                     : 'text-foreground/70'
                 )}
               >
                 {link.label}
               </Link>
             );
          })}
        </nav>

        {/* Right Group: Actions (Search, Notifications, Profile/Login) */}
        <div className="flex items-center gap-1 sm:gap-2 ml-auto"> {/* Reduced gap for mobile */}
          <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="h-9 pl-8 pr-2 w-32 sm:w-40 lg:w-56 rounded-full focus:ring-primary/50" // Reduced mobile search width
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {user && <NotificationBell />}

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
            // Login/Signup buttons for all sizes when no user
            <div className="flex items-center gap-1">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="rounded-full px-2 sm:px-3">Log In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="default" size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-2 sm:px-3">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
