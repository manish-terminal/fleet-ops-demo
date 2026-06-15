import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

export const http = axios.create({
  // @ts-ignore
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach auth token to every request
http.interceptors.request.use(config => {
  const token = useAuthStore.getState().session?.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalise errors and handle 401 token expiry
http.interceptors.response.use(
  response => response.data,
  async error => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearSession();
      window.location.href = '/login';
    }
    return Promise.reject({
      code:    error.response?.data?.code ?? 'UNKNOWN',
      message: error.response?.data?.message ?? 'An unexpected error occurred',
      details: error.response?.data?.details ?? null,
    });
  }
);
