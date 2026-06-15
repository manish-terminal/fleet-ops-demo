import React, { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout }    from '@/layouts/AppLayout';
import { AuthLayout }   from '@/layouts/AuthLayout';
import { DriverLayout } from '@/layouts/DriverLayout';
import { RoleGuard }    from '@/features/auth/components/RoleGuard';
import { AuthGuard }    from '@/features/auth/components/AuthGuard';

// Pages — lazy-loaded for code splitting
const LoginPage         = lazy(() => import('@/pages/LoginPage'));
const DashboardPage     = lazy(() => import('@/pages/DashboardPage'));
const FleetPage         = lazy(() => import('@/pages/FleetPage'));
const BookingsPage      = lazy(() => import('@/pages/BookingsPage'));
const BookingDetailPage = lazy(() => import('@/pages/BookingDetailPage'));
const FuelPage          = lazy(() => import('@/pages/FuelPage'));
const CompliancePage    = lazy(() => import('@/pages/CompliancePage'));
const FinancePage       = lazy(() => import('@/pages/FinancePage'));
const AnalyticsPage     = lazy(() => import('@/pages/AnalyticsPage'));
const RoutesPage        = lazy(() => import('@/pages/RoutesPage'));
const MaintenancePage   = lazy(() => import('@/pages/MaintenancePage'));
const DriverAppPage     = lazy(() => import('@/pages/DriverAppPage'));
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'));
const AdminPage         = lazy(() => import('@/pages/AdminPage'));
const NotFoundPage      = lazy(() => import('@/pages/NotFoundPage'));
const UnauthorizedPage  = lazy(() => import('@/pages/UnauthorizedPage'));

export const router = createBrowserRouter([
  // ── Public routes (no auth required)
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
    ],
  },

  // ── Protected app routes
  {
    element: <AuthGuard><AppLayout /></AuthGuard>,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: '/dashboard',              element: <DashboardPage /> },
      { path: '/fleet',                  element: <FleetPage /> },
      { path: '/bookings',               element: <BookingsPage /> },
      { path: '/bookings/:id',           element: <BookingDetailPage /> },
      { path: '/fuel',                   element: <FuelPage /> },
      { path: '/compliance',             element: <CompliancePage /> },
      { path: '/routes',                 element: <RoutesPage /> },
      { path: '/maintenance',            element: <MaintenancePage /> },
      { path: '/notifications',          element: <NotificationsPage /> },

      // Finance — admin + manager only
      {
        path: '/finance',
        element: (
          <RoleGuard allowedRoles={['admin', 'manager']} fallback={<UnauthorizedPage />}>
            <FinancePage />
          </RoleGuard>
        )
      },

      // Analytics — admin + manager only
      {
        path: '/analytics',
        element: (
          <RoleGuard allowedRoles={['admin', 'manager']} fallback={<UnauthorizedPage />}>
            <AnalyticsPage />
          </RoleGuard>
        )
      },

      // Admin — admin only
      {
        path: '/admin',
        element: (
          <RoleGuard allowedRoles={['admin']} fallback={<UnauthorizedPage />}>
            <AdminPage />
          </RoleGuard>
        )
      },
    ],
  },

  // ── Driver mobile layout
  {
    element: <AuthGuard><DriverLayout /></AuthGuard>,
    children: [
      { path: '/driver', element: <DriverAppPage /> },
    ],
  },

  // ── Catch-alls
  { path: '/unauthorized', element: <UnauthorizedPage /> },
  { path: '*',             element: <NotFoundPage /> },
]);
