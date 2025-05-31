import type { ReactNode } from 'react';
import { AppHeader } from './header';
import { MobileBottomNav } from './mobile-bottom-nav';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-grow container py-8">
        {children}
      </main>
      <MobileBottomNav />
      {/* Add a spacer for the bottom nav on mobile */}
      <div className="md:hidden h-16" /> 
    </div>
  );
}
