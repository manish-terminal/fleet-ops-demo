import { useAuth } from './useAuth';
import type { UserRole } from '@/types/auth';

export function usePermission(role: UserRole): boolean {
  const { hasRole } = useAuth();
  return hasRole(role);
}
