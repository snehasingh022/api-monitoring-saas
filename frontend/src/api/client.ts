import { API_BASE_URL } from '../config/env';
import type { ApiError, ApiSuccess } from '../types/api';
import type { AuthTokens } from '../types/auth';
import { tokenStorage } from '../utils/storage';

export class ApiRequestError extends Error {
  status: number;
  errors?: ApiError['errors'];

  constructor(message: string, status: number, errors?: ApiError['errors']) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.errors = errors;
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  auth?: boolean;
  _retry?: boolean;
};

let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = tokenStorage.getRefreshToken();
  const user = tokenStorage.getUser();

  if (!refreshToken || !user) {
    return false;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    const payload = (await response.json().catch(() => null)) as
      | ApiSuccess<{ tokens: AuthTokens }>
      | ApiError
      | null;

    if (!response.ok || !payload || payload.success === false) {
      return false;
    }

    tokenStorage.setSession(user, payload.data.tokens);
    return true;
  } catch {
    return false;
  }
}

function clearSessionAndRedirect() {
  tokenStorage.clearSession();
  if (window.location.pathname !== '/login') {
    window.location.assign('/login');
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = 'GET', body, auth = false, _retry = false } = options;

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = tokenStorage.getAccessToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401 && auth && !_retry) {
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
    }

    const refreshed = await refreshPromise;

    if (refreshed) {
      return apiRequest<T>(path, { ...options, _retry: true });
    }

    clearSessionAndRedirect();
    throw new ApiRequestError('Session expired. Please sign in again.', 401);
  }

  // DELETE may return success with only message
  const payload = (await response.json().catch(() => null)) as
    | (ApiSuccess<T> & { message?: string })
    | ApiError
    | null;

  if (!response.ok || !payload || payload.success === false) {
    const message =
      payload && 'message' in payload
        ? payload.message
        : `Request failed with status ${response.status}`;
    const errors =
      payload && 'errors' in payload ? payload.errors : undefined;

    throw new ApiRequestError(message, response.status, errors);
  }

  // Some endpoints (delete) have no data field
  if (!('data' in payload) || payload.data === undefined) {
    return undefined as T;
  }

  return payload.data;
}
