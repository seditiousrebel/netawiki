
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
        {/* AppHeader is MOVED FROM HERE */}
        <div className="flex flex-1 overflow-hidden"> {/* Added overflow-hidden to parent flex */}
          <AppEntitySidebar />
          {/* 
            The main content area.
            - flex-1: Allows this main area to grow and take available space.
            - overflow-y-auto: Enables vertical scrolling within the main content if it exceeds viewport height.
            - Centering and padding are now handled by a nested div.
          */}
          <main className="flex-1 overflow-y-auto flex flex-col"> {/* Added flex-col here */}
            <AppHeader /> {/* New position: Inside main, will be sticky to main's scroll area */}
            {/* The existing content wrapper div */}
            <div className="mx-auto w-full px-4 sm:px-6 md:px-8 py-6 md:py-8 lg:max-w-screen-xl xl:max-w-screen-2xl">
              {children}
            </div>
          </main>
        </div>
        <MobileBottomNav />
        <div className="md:hidden h-16" /> {/* Spacer for mobile bottom nav */}
      </div>
    </SidebarProvider>
  );
}
