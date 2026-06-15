import React from 'react';

interface EmptyStateProps {
  icon?:        React.ReactNode;
  title:        string;
  description?: string;
  action?:      React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center glass-panel rounded-xl p-8 max-w-lg mx-auto">
      {icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 text-brand-400 border border-slate-700/50 shadow-inner">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
      {description && <p className="mt-2 text-sm text-slate-400 max-w-sm leading-relaxed">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
export default EmptyState;
