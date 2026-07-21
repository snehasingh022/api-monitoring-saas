import { useEffect, useState } from 'react';
import { dashboardApi, type DashboardResponse } from '../api/dashboard';

export function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await dashboardApi.getDashboard();
        setDashboard(data);
      } catch (err) {
        setError('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
  <div className="rounded-lg border p-4 shadow-sm">
    <p className="text-sm text-gray-500">Total Monitors</p>
    <h2 className="mt-2 text-3xl font-bold">
      {dashboard?.summary.totalMonitors}
    </h2>
  </div>

  <div className="rounded-lg border p-4 shadow-sm">
    <p className="text-sm text-gray-500">Up</p>
    <h2 className="mt-2 text-3xl font-bold text-green-600">
      {dashboard?.summary.upCount}
    </h2>
  </div>

  <div className="rounded-lg border p-4 shadow-sm">
    <p className="text-sm text-gray-500">Down</p>
    <h2 className="mt-2 text-3xl font-bold text-red-600">
      {dashboard?.summary.downCount}
    </h2>
  </div>

  <div className="rounded-lg border p-4 shadow-sm">
    <p className="text-sm text-gray-500">Uptime</p>
    <h2 className="mt-2 text-3xl font-bold text-blue-600">
      {dashboard?.summary.overallUptimePercent ?? '--'}%
    </h2>
  </div>

  <div className="rounded-lg border p-4 shadow-sm">
  <p className="text-sm text-gray-500">Avg Response</p>
  <h2 className="mt-2 text-3xl font-bold text-purple-600">
    {dashboard?.summary.overallAvgResponseTimeMs ?? '--'} ms
  </h2>
</div>

<div className="mt-8">
  <h2 className="mb-4 text-xl font-semibold">Monitors</h2>

  {dashboard?.monitors.length === 0 ? (
    <div className="rounded-lg border border-dashed p-8 text-center text-gray-500">
      No monitors found. Create your first monitor to start tracking APIs.
    </div>
  ) : (
    <div>
      {/* Monitor table will go here in the next step */}
    </div>
  )}
</div>
</div>
    </div>
  );
}
