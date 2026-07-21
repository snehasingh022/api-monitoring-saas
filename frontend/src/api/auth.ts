import { apiRequest } from './client';
import type { LoginResponse, RegisterResponse, User } from '../types/auth';
import type { AuthTokens } from '../types/auth';

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export const authApi = {
  login(payload: LoginPayload) {
    return apiRequest<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: payload,
    });
  },

  register(payload: RegisterPayload) {
    return apiRequest<RegisterResponse>('/api/auth/register', {
      method: 'POST',
      body: payload,
    });
  },

  refresh(refreshToken: string) {
    return apiRequest<{ tokens: AuthTokens }>('/api/auth/refresh', {
      method: 'POST',
      body: { refreshToken },
    });
  },

  getProfile() {
    return apiRequest<{ user: User }>('/api/auth/profile', {
      method: 'GET',
      auth: true,
    });
  },
};
