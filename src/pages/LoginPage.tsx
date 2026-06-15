import React from 'react';
import { LoginForm } from '@/features/auth/components/LoginForm';

export function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 w-full max-w-sm mx-auto">
      <div className="flex flex-col items-center space-y-1">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-600">
          FleetOps Pro
        </h1>
        <p className="text-slate-500 text-[10px] font-mono tracking-widest uppercase">
          Enterprise Logistics Management
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
export default LoginPage;
