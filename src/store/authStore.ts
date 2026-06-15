import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthSession, User } from '@/types/auth';

interface AuthState {
  session:      AuthSession | null;
  // Derived
  user:         User | null;
  isLoggedIn:   boolean;
  // Actions
  setSession:   (session: AuthSession) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      session:    null,
      user:       null,
      isLoggedIn: false,
      setSession:   (session) => set({ session, user: session.user, isLoggedIn: true }),
      clearSession: ()        => set({ session: null, user: null, isLoggedIn: false }),
    }),
    {
      name:    'fleetops-auth',
      // Persist session, user, and login status for page refresh
      partialize: (state) => ({
        session: state.session,
        user: state.user,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);
