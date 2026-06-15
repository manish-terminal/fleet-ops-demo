export type UserRole = 'admin' | 'manager' | 'office_staff' | 'driver';

export interface User {
  id:          string;
  name:        string;
  email:       string;
  role:        UserRole;
  avatarUrl:   string | null;
  phone:       string | null;
  lastLoginAt: string;        // ISO 8601
  isActive:    boolean;
}

export interface AuthSession {
  user:         User;
  accessToken:  string;
  refreshToken: string;
  expiresAt:    number;       // Unix timestamp ms
}

export interface LoginCredentials {
  email:    string;
  password: string;
}
