import type { ApiResponse } from '@/types/api';
import type { AuthSession, LoginCredentials } from '@/types/auth';
import { mockUserProfiles, mockUsers } from '@/mocks/users';
import { simulateDelay, simulateError } from '@/utils/mockHelpers';
import { http } from './http';

interface IAuthService {
  login(credentials: LoginCredentials): Promise<ApiResponse<AuthSession>>;
  logout(): Promise<ApiResponse<null>>;
  refreshToken(): Promise<ApiResponse<AuthSession>>;
}

const mockAuthService: IAuthService = {
  async login({ email, password }) {
    await simulateDelay();
    await simulateError(0.01);

    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (!user) {
      throw { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password', details: null };
    }

    const profile = mockUserProfiles[email];
    const session: AuthSession = {
      user: profile,
      accessToken: `mock-access-token-${user.role}`,
      refreshToken: `mock-refresh-token-${user.role}`,
      expiresAt: Date.now() + 1000 * 60 * 60 * 2, // 2 hours
    };

    return { data: session, message: 'Login successful', success: true };
  },

  async logout() {
    await simulateDelay(200);
    return { data: null, message: 'Logged out successfully', success: true };
  },

  async refreshToken() {
    await simulateDelay();
    const profile = mockUserProfiles['admin@fleetops.demo'];
    const session: AuthSession = {
      user: profile,
      accessToken: `mock-access-token-refreshed`,
      refreshToken: `mock-refresh-token-refreshed`,
      expiresAt: Date.now() + 1000 * 60 * 60 * 2,
    };
    return { data: session, message: 'Token refreshed', success: true };
  }
};

const realAuthService: IAuthService = {
  login: (credentials) => http.post('/auth/login', credentials),
  logout: () => http.post('/auth/logout'),
  refreshToken: () => http.post('/auth/refresh'),
};

export const authService: IAuthService =
  // @ts-ignore
  import.meta.env.VITE_ENABLE_REAL_API === 'true'
    ? realAuthService
    : mockAuthService;
