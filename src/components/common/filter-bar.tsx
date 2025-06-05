import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Assuming Card components are here

interface FilterBarProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({ title, children, className }) => {
  return (
    <Card className={`mb-8 shadow-md ${className}`}>
      {title && (
        <CardHeader>
          <CardTitle className="font-headline text-lg">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};
