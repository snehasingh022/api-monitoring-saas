import { apiRequest } from './client';

export interface DashboardSummary {
  totalMonitors: number;
  upCount: number;
  downCount: number;
  unknownCount: number;
  overallUptimePercent: number | null;
  overallAvgResponseTimeMs: number | null;
  checksInWindow: {
    total: number;
    up: number;
    down: number;
  };
  lookbackHours: number;
}

export interface DashboardMonitor {
  id: string;
  name: string;
  url: string;
  method: string;
  intervalMinutes: number;
  isActive: boolean;
  currentStatus: 'up' | 'down' | 'unknown';
  uptimePercent: number | null;
  avgResponseTimeMs: number | null;
  lastStatusCode: number | null;
  lastResponseTimeMs: number | null;
  lastCheckedAt: string | null;
  lastErrorMessage: string | null;
}

export interface DashboardResponse {
  summary: DashboardSummary;
  monitors: DashboardMonitor[];
  generatedAt: string;
  fromCache: boolean;
}

export const dashboardApi = {
  getDashboard(hours = 24) {
    return apiRequest<DashboardResponse>(
      `/api/dashboard?hours=${hours}`,
      {
        auth: true,
      }
    );
  },
};