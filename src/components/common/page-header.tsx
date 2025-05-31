import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string | ReactNode;
  actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
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
}
