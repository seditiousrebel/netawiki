import { AppLayout } from '@/components/layout/app-layout';
import type { ReactNode } from 'react';

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  // Here you would typically add authentication checks
  // For now, we assume the user is authenticated if they reach this layout
  return <AppLayout>{children}</AppLayout>;
}
