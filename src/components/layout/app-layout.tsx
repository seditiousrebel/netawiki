import type { ReactNode } from 'react';
import { AppHeader } from './header';
import { MobileBottomNav } from './mobile-bottom-nav';
import { AppEntitySidebar, SidebarProvider, SidebarInset } from '@/components/ui/sidebar'; // Added SidebarInset

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  // Note: The SidebarProvider could also be placed in src/app/(app)/layout.tsx
  // if sidebar state needs to be accessed by more components than just AppLayout and its children.
  // For now, placing it here to encapsulate sidebar logic with its direct usage.
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col bg-background"> {/* Added bg-background for consistency with SidebarInset */}
        <AppHeader />
        <div className="flex flex-1">
          <AppEntitySidebar /> {/* This component handles its own desktop/mobile visibility */}
          {/*
            Using SidebarInset here assumes AppEntitySidebar is using variant="inset".
            If AppEntitySidebar is using variant="sidebar" (default),
            the main content might need margin/padding adjustments instead of SidebarInset.
            Let's check AppEntitySidebar's definition. It uses variant="sidebar", not "inset".
            So, SidebarInset might not be the right component here unless AppEntitySidebar's variant changes.
            For now, let's use a standard main tag and adjust its padding/margin if needed later,
            or rely on the sidebar's own spacer div.
          */}
          {/* <SidebarInset> */}
          {/* The default 'Sidebar' component (when not 'inset') creates a spacer div,
              so the main content should flow next to it.
              The 'container' class provides horizontal padding. 'py-8' is vertical padding.
              We might need to adjust how 'container' interacts with the sidebar.
           */}
          <main className="flex-grow container py-8">
            {children}
          </main>
          {/* </SidebarInset> */}
        </div>
        <MobileBottomNav /> {/* This component handles its own mobile/desktop visibility */}
        {/* Spacer for the bottom nav on mobile, already correctly implemented */}
        <div className="md:hidden h-16" />
      </div>
    </SidebarProvider>
  );
}
