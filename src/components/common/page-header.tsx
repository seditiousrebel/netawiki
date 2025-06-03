import React, { memo } from 'react'; // Import memo
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string | ReactNode; // Title can also be a ReactNode
  description?: string | ReactNode;
  actions?: ReactNode;
}

// Original component function
const PageHeaderComponent: React.FC<PageHeaderProps> = ({ title, description, actions }) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold tracking-tight text-primary">{title}</h1>
          {description && typeof description === 'string' && (
            <p className="mt-1 text-muted-foreground">{description}</p>
          )}
          {description && typeof description !== 'string' && (
            <div className="mt-1 text-muted-foreground">{description}</div>
          )}
        </div>
        {actions && <div className="flex-shrink-0">{actions}</div>}
      </div>
    </div>
  );
};

// Export the memoized version
export const PageHeader = memo(PageHeaderComponent);
