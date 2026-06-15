import React from 'react';
import type { UserRole } from '@/types/auth';
import { useAuth } from '@/hooks/useAuth';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  fallback?:    React.ReactNode;
  children:     React.ReactNode;
}

export function RoleGuard({ allowedRoles, fallback = null, children }: RoleGuardProps) {
  const { hasRole } = useAuth();
  return hasRole(...allowedRoles) ? <>{children}</> : <>{fallback}</>;
}
export default RoleGuard;
