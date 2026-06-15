import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { LogOut, Navigation } from 'lucide-react';

export function DriverAppPage() {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-6">
      {/* Driver mobile header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="h-10 w-10 rounded-full border border-slate-800 bg-slate-950" />
          ) : (
            <div className="h-10 w-10 rounded-full border border-slate-800 bg-slate-950 flex items-center justify-center text-slate-400 font-bold">
              D
            </div>
          )}
          <div>
            <h1 className="text-sm font-bold text-slate-200">{user?.name}</h1>
            <p className="text-xs text-slate-500 font-medium">Driver Console</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="p-2 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-red-400 transition-colors"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>

      {/* Driver info card */}
      <div className="glass-panel rounded-xl p-5 space-y-4">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Today's Assigned Route</h2>
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="h-2 w-2 rounded-full bg-brand-500" />
              <div className="w-0.5 h-8 bg-slate-800" />
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            <div className="space-y-3 text-xs text-slate-300">
              <div>
                <p className="font-semibold text-slate-400">Origin</p>
                <p className="mt-0.5">Mumbai Warehouse</p>
              </div>
              <div>
                <p className="font-semibold text-slate-400">Destination</p>
                <p className="mt-0.5">Pune Distribution Centre</p>
              </div>
            </div>
          </div>
        </div>
        <Button variant="primary" className="w-full text-xs" leftIcon={<Navigation className="h-3.5 w-3.5" />}>
          Start Navigation (Phase 5)
        </Button>
      </div>
    </div>
  );
}
export default DriverAppPage;
