import React from 'react';

interface PageWrapperProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function PageWrapper({ title, description, actions, children }: PageWrapperProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">{title}</h1>
          {description && <p className="text-sm text-slate-400 mt-1">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
      </div>
      <div className="min-h-[calc(100vh-12rem)]">{children}</div>
    </div>
  );
}
export default PageWrapper;
