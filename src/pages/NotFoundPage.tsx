import React from 'react';
import { Button } from '@/components/ui/Button';
import { FileQuestion } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-800 text-slate-400 border border-slate-700/50 shadow-inner">
        <FileQuestion className="h-10 w-10 animate-pulse" />
      </div>
      <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Page Not Found</h1>
      <p className="mt-2 text-sm text-slate-400 max-w-sm leading-relaxed">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="mt-8 flex gap-4">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Go Back
        </Button>
        <Button variant="primary" onClick={() => navigate('/dashboard')}>
          Dashboard Home
        </Button>
      </div>
    </div>
  );
}
export default NotFoundPage;
