import React from 'react';
import { Button } from '@/components/ui/Button';
import { ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 text-red-500 border border-red-500/20 shadow-inner">
        <ShieldAlert className="h-10 w-10 animate-pulse" />
      </div>
      <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Access Denied</h1>
      <p className="mt-2 text-sm text-slate-400 max-w-sm leading-relaxed">
        You do not have the required permissions to view this page. Please contact your administrator if you believe this is an error.
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
export default UnauthorizedPage;
