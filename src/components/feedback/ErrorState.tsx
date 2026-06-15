import React from 'react';
import { Button } from '../ui/Button';
import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ title = 'Something went wrong', message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center border border-red-500/20 bg-red-950/10 rounded-xl p-8 max-w-lg mx-auto">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-400 border border-red-500/20 shadow-inner">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-semibold text-red-400">{title}</h3>
      <p className="mt-2 text-sm text-slate-400 max-w-sm leading-relaxed">{message}</p>
      {onRetry && (
        <Button variant="secondary" className="mt-6 border-red-500/20 hover:bg-red-500/10" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}
export default ErrorState;
