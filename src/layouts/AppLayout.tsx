import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useUiStore } from '@/store/uiStore';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '@/utils/cn';

export function AppLayout() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user = useAuthStore((state) => state.user);
  const { sidebarOpen } = useUiStore();

  if (!isLoggedIn || !user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect driver role to mobile-first DriverLayout
  if (user.role === 'driver') {
    return <Navigate to="/driver" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Pane */}
      <div
        className={cn(
          'flex-1 flex flex-col min-h-screen transition-all duration-300',
          sidebarOpen ? 'md:pl-64' : 'md:pl-20'
        )}
      >
        {/* Global Toolbar Header */}
        <Header />

        {/* Dynamic Inner Route Viewport */}
        <main className="flex-1 p-6 md:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
export default AppLayout;
