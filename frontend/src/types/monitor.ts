import type { AuthTokens, User } from './auth';

export type CheckResult = {
  id: string;
  monitorId: string;
  status: 'up' | 'down';
  statusCode: number | null;
  responseTimeMs: number | null;
  checkedAt: string;
  errorMessage: string | null;
};

export type Monitor = {
  id: string;
  name: string;
  url: string;
  method: string;
  intervalMinutes: number;
  isActive: boolean;
  alertEmail?: string | null;
  createdAt: string;
  updatedAt: string;
  latestCheck?: CheckResult | null;
};

export type CreateMonitorPayload = {
  name: string;
  url: string;
  method?: 'GET' | 'POST' | 'HEAD';
  intervalMinutes?: number;
  alertEmail?: string;
};

export type DashboardMonitor = {
  id: string;
  name: string;
  url: string;
  method: string;
  intervalMinutes: number;
  isActive: boolean;
  currentStatus: 'up' | 'down' | 'unknown';
  uptimePercent: number | null;
  downtime: {
    checkCount: number;
    estimatedMinutes: number;
  };
  avgResponseTimeMs: number | null;
  lastStatusCode: number | null;
  lastResponseTimeMs: number | null;
  lastCheckedAt: string | null;
  lastErrorMessage: string | null;
  checksInWindow: {
    total: number;
    up: number;
    down: number;
  };
  createdAt: string;
  updatedAt: string;
};

export type DashboardData = {
  summary: {
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
  };
  monitors: DashboardMonitor[];
  generatedAt: string;
  fromCache?: boolean;
};

export type MonitorHistoryData = {
  monitor: Monitor;
  history: CheckResult[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
};

export type { AuthTokens, User };
