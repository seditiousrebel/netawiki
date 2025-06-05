import React from 'react';
import { LucideIcon } from 'lucide-react'; // Or a more generic Icon type if you have one

interface EmptyStateProps {
  IconComponent: LucideIcon; // Or React.ElementType if you want to pass any component
  title: string;
  message: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ IconComponent, title, message, className }) => {
  return (
    <div className={`text-center py-10 ${className}`}>
      <IconComponent className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-2 text-lg font-medium text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{message}</p>
    </div>
  );
};
