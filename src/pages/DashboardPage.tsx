import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { PageWrapper } from '@/layouts/PageWrapper';
import { ArrowRight, BarChart3, ShieldCheck, Truck, Users, Calendar, Fuel, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';

export function DashboardPage() {
  const { user } = useAuth();

  const formattedRole = user?.role
    ? user.role.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : '';

  return (
    <PageWrapper
      title={`Welcome back, ${user?.name || 'User'}!`}
      description={`You are logged in as ${formattedRole}. Here's an overview of the fleet operations.`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Stat cards */}
        <div className="glass-panel glass-panel-hover rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Trucks</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Truck className="h-5 w-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-extrabold text-slate-100">12 / 20</h3>
            <p className="text-xs text-blue-400 font-medium">In transit right now</p>
          </div>
        </div>

        <div className="glass-panel glass-panel-hover rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Bookings</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <BarChart3 className="h-5 w-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-extrabold text-slate-100">8</h3>
            <p className="text-xs text-emerald-400 font-medium">4 dispatched today</p>
          </div>
        </div>

        <div className="glass-panel glass-panel-hover rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Compliance Status</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-extrabold text-slate-100">98.5%</h3>
            <p className="text-xs text-amber-400 font-medium">1 document expiring soon</p>
          </div>
        </div>

        <div className="glass-panel glass-panel-hover rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Drivers Assigned</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-extrabold text-slate-100">18 / 22</h3>
            <p className="text-xs text-purple-400 font-medium">4 active standby drivers</p>
          </div>
        </div>
      </div>

      {/* Quick links & module navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-panel rounded-xl p-6 space-y-4 lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-100">Operational Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/fleet" className="flex items-center justify-between p-4 rounded-lg bg-slate-950 border border-slate-900 hover:border-slate-800 hover:bg-slate-900/50 transition-all group">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-brand-400" />
                <span className="text-sm font-semibold text-slate-200">Track Fleet Map</span>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-slate-300 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link to="/bookings" className="flex items-center justify-between p-4 rounded-lg bg-slate-950 border border-slate-900 hover:border-slate-800 hover:bg-slate-900/50 transition-all group">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-emerald-400" />
                <span className="text-sm font-semibold text-slate-200">Manage Bookings</span>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-slate-300 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link to="/fuel" className="flex items-center justify-between p-4 rounded-lg bg-slate-950 border border-slate-900 hover:border-slate-800 hover:bg-slate-900/50 transition-all group">
              <div className="flex items-center gap-3">
                <Fuel className="h-5 w-5 text-amber-400" />
                <span className="text-sm font-semibold text-slate-200">Fuel & Anomalies</span>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-slate-300 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link to="/maintenance" className="flex items-center justify-between p-4 rounded-lg bg-slate-950 border border-slate-900 hover:border-slate-800 hover:bg-slate-900/50 transition-all group">
              <div className="flex items-center gap-3">
                <Wrench className="h-5 w-5 text-purple-400" />
                <span className="text-sm font-semibold text-slate-200">Service Logs</span>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-slate-300 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>

        {user && (
          <div className="glass-panel rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-100">Your Activity Profile</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="h-12 w-12 rounded-full border border-slate-800 bg-slate-950" />
                ) : (
                  <div className="h-12 w-12 rounded-full border border-slate-800 bg-slate-950 flex items-center justify-center text-slate-400 font-bold">
                    {user.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">{user.name}</h3>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
              </div>
              <div className="bg-slate-950 border border-slate-900 rounded-lg p-4 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Clearance:</span>
                  <span className="text-brand-400 font-bold uppercase">{user.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone:</span>
                  <span className="text-slate-300">{user.phone || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Signed In:</span>
                  <span className="text-slate-300 truncate max-w-[120px]">{new Date(user.lastLoginAt).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
export default DashboardPage;
