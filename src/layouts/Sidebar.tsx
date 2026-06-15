import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUiStore } from '@/store/uiStore';
import { cn } from '@/utils/cn';
import {
  LayoutDashboard,
  Truck,
  Calendar,
  Fuel,
  ShieldCheck,
  Map,
  Wrench,
  IndianRupee,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

interface SidebarLink {
  to: string;
  label: string;
  icon: React.ComponentType<any>;
  roles?: string[];
}

const SIDEBAR_LINKS: SidebarLink[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/fleet', label: 'Fleet Map', icon: Truck, roles: ['admin', 'manager', 'office_staff'] },
  { to: '/bookings', label: 'Bookings', icon: Calendar, roles: ['admin', 'manager', 'office_staff'] },
  { to: '/fuel', label: 'Fuel Monitor', icon: Fuel, roles: ['admin', 'manager', 'office_staff'] },
  { to: '/compliance', label: 'Compliance', icon: ShieldCheck, roles: ['admin', 'manager', 'office_staff'] },
  { to: '/routes', label: 'Route Optimisation', icon: Map, roles: ['admin', 'manager', 'office_staff'] },
  { to: '/maintenance', label: 'Maintenance', icon: Wrench, roles: ['admin', 'manager', 'office_staff'] },
  { to: '/finance', label: 'Financials', icon: IndianRupee, roles: ['admin', 'manager'] },
  { to: '/analytics', label: 'Analytics', icon: BarChart3, roles: ['admin', 'manager'] },
  { to: '/admin', label: 'Admin panel', icon: Settings, roles: ['admin'] },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const { sidebarOpen, toggleSidebar } = useUiStore();

  const filteredLinks = SIDEBAR_LINKS.filter(
    (link) => !link.roles || (user && link.roles.includes(user.role))
  );

  return (
    <aside
      className={cn(
        'fixed top-0 bottom-0 left-0 z-20 flex flex-col bg-slate-950 border-r border-slate-900 transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-20'
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-slate-900">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 shadow-md shadow-brand-500/20 text-white font-bold shrink-0">
            <TrendingUp className="h-5 w-5" />
          </div>
          {sidebarOpen && (
            <span className="font-bold text-lg tracking-wider text-slate-100 whitespace-nowrap">
              FleetOps <span className="text-brand-500">Pro</span>
            </span>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className="hidden md:flex h-6 w-6 items-center justify-center rounded border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200 transition-colors"
        >
          {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        {filteredLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 select-none group',
                  isActive
                    ? 'bg-brand-600/10 text-brand-400 border border-brand-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 border border-transparent'
                )
              }
            >
              <Icon className="h-5 w-5 shrink-0 group-hover:scale-105 transition-transform duration-200" />
              {sidebarOpen && <span className="truncate">{link.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Profile/Logout */}
      <div className="p-4 border-t border-slate-900">
        <button
          onClick={logout}
          className={cn(
            'flex w-full items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-950/10 transition-colors border border-transparent'
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {sidebarOpen && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
export default Sidebar;
