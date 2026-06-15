import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUiStore } from '@/store/uiStore';
import { Bell, Menu, User as UserIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

export function Header() {
  const { user } = useAuth();
  const { toggleSidebar } = useUiStore();

  const formattedRole = user?.role
    ? user.role.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : '';

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-6">
      {/* Left items */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          {/* Custom breadcrumb indicator or section description */}
          <span className="text-sm text-slate-500 font-medium">FleetOps Pro</span>
          <span className="text-slate-700">/</span>
          <span className="text-sm text-slate-300 font-medium capitalize">
            {window.location.pathname.substring(1) || 'dashboard'}
          </span>
        </div>
      </div>

      {/* Right items */}
      <div className="flex items-center gap-4">
        {/* Notifications Trigger */}
        <button className="relative p-2 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brand-500 shadow-md shadow-brand-500/50" />
        </button>

        {/* User profile capsule */}
        {user && (
          <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-200 leading-none">{user.name}</p>
              <p className="text-xs text-slate-500 mt-1 leading-none">{formattedRole}</p>
            </div>
            
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="h-9 w-9 rounded-full border border-slate-800 bg-slate-950 shadow-inner"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-800 bg-slate-950 text-slate-400">
                <UserIcon className="h-5 w-5" />
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
export default Header;
