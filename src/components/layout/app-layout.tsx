
import type { ReactNode } from 'react';
import { AppHeader } from './header';
import { MobileBottomNav } from './mobile-bottom-nav';
import { AppEntitySidebar, SidebarProvider } from '@/components/ui/sidebar';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <AppHeader />
        <div className="flex flex-1 overflow-hidden"> {/* Added overflow-hidden to parent flex */}
          <AppEntitySidebar />
          {/* 
            The main content area.
            - flex-1: Allows this main area to grow and take available space.
            - overflow-y-auto: Enables vertical scrolling within the main content if it exceeds viewport height.
            - p-4 md:p-6 lg:p-8: Provides responsive padding.
            - The 'container' class (mx-auto, max-width) is removed from here.
              Individual pages should use <div className="container mx-auto ..."> if they need centered, max-width content.
              This allows the main area to sit flush next to the sidebar.
          */}
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
        <MobileBottomNav />
        <div className="md:hidden h-16" /> {/* Spacer for mobile bottom nav */}
      </div>
    </SidebarProvider>
  );
}
