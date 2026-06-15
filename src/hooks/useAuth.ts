import { useAuthStore } from '@/store/authStore';
import { authService }  from '@/services/authService';
import { useMutation }  from '@tanstack/react-query';
import type { UserRole } from '@/types/auth';

export function useAuth() {
  const { user, session, isLoggedIn, setSession, clearSession } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => setSession(data.data),
  });

  const hasRole = (...roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const logout = () => {
    clearSession();
    authService.logout().catch(() => {}); // fire-and-forget
  };

  return {
    user,
    session,
    isLoggedIn,
    hasRole,
    login:    loginMutation.mutateAsync, // mutateAsync is useful to await redirection on login submit
    logout,
    isLoggingIn: loginMutation.isPending,
    loginError:  loginMutation.error,
  };
}
