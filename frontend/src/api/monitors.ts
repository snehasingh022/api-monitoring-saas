import { apiRequest } from './client';
import type {
  CreateMonitorPayload,
  DashboardData,
  Monitor,
  MonitorHistoryData,
} from '../types/monitor';

export const monitorsApi = {
  list() {
    return apiRequest<{ monitors: Monitor[] }>('/api/monitors', {
      auth: true,
    });
  },

  get(id: string) {
    return apiRequest<{ monitor: Monitor }>(`/api/monitors/${id}`, {
      auth: true,
    });
  },

  create(payload: CreateMonitorPayload) {
    return apiRequest<{ monitor: Monitor }>('/api/monitors', {
      method: 'POST',
      auth: true,
      body: payload,
    });
  },

  remove(id: string) {
    return apiRequest<undefined>(`/api/monitors/${id}`, {
      method: 'DELETE',
      auth: true,
    });
  },

  history(id: string, limit = 50, offset = 0) {
    return apiRequest<MonitorHistoryData>(
      `/api/monitors/${id}/history?limit=${limit}&offset=${offset}`,
      { auth: true }
    );
  },
};

export const dashboardApi = {
  get(hours = 24) {
    return apiRequest<DashboardData>(`/api/dashboard?hours=${hours}`, {
      auth: true,
    });
  },
};
