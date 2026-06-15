import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export function DriverLayout() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user = useAuthStore((state) => state.user);

  if (!isLoggedIn || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'driver') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex justify-center">
      <div className="w-full max-w-md bg-slate-900 border-x border-slate-800/80 min-h-screen flex flex-col relative shadow-2xl">
        <main className="flex-1 p-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
export default DriverLayout;
