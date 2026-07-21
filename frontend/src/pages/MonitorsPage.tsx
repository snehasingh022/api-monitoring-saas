import { useEffect, useState } from 'react';
import { monitorsApi } from '../api/monitors';
import type { Monitor } from '../types/monitor';
import { Link } from 'react-router-dom';

export function MonitorsPage() {
    const [monitors, setMonitors] = useState<Monitor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        url: '',
        method: 'GET' as 'GET' | 'POST' | 'HEAD',
        intervalMinutes: 5,
        alertEmail: '',
    });

    useEffect(() => {
        async function loadMonitors() {
            try {
                const data = await monitorsApi.list();
                setMonitors(data.monitors);
            } catch {
                setError('Failed to load monitors');
            } finally {
                setLoading(false);
            }
        }

        loadMonitors();
    }, []);

    async function handleCreateMonitor() {
        try {
            await monitorsApi.create(formData);

            alert('Monitor created successfully!');

            setShowCreateForm(false);

            setFormData({
                name: '',
                url: '',
                method: 'GET',
                intervalMinutes: 5,
                alertEmail: '',
            });

            const data = await monitorsApi.list();
            setMonitors(data.monitors);
        } catch (err: any) {
            console.error(err);

            alert(err.message || 'Failed to create monitor');
        }
    }

    async function handleDeleteMonitor(id: string) {
        const confirmed = window.confirm(
            'Are you sure you want to delete this monitor?'
        );

        if (!confirmed) return;

        try {
            await monitorsApi.remove(id);

            const data = await monitorsApi.list();
            setMonitors(data.monitors);

            alert('Monitor deleted successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to delete monitor.');
        }
    }

    return (
        <div className="mx-auto max-w-6xl p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Monitors</h1>

                <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="rounded-lg bg-teal-700 px-4 py-2 text-white"
                >
                    + Create Monitor
                </button>
            </div>

            {showCreateForm && (
                <div className="mt-6 rounded-lg border bg-white p-6 shadow">
                    <h2 className="mb-4 text-xl font-semibold">Create Monitor</h2>

                    <div className="grid gap-4 md:grid-cols-2">
                        <input
                            type="text"
                            placeholder="Monitor Name"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                            className="rounded-lg border p-3"
                        />

                        <input
                            type="url"
                            placeholder="https://example.com"
                            value={formData.url}
                            onChange={(e) =>
                                setFormData({ ...formData, url: e.target.value })
                            }
                            className="rounded-lg border p-3"
                        />

                        <select
                            value={formData.method}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    method: e.target.value as 'GET' | 'POST' | 'HEAD',
                                })
                            }
                            className="rounded-lg border p-3"
                        >
                            <option value="GET">GET</option>
                            <option value="POST">POST</option>
                            <option value="HEAD">HEAD</option>
                        </select>

                        <input
                            type="number"
                            value={formData.intervalMinutes}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    intervalMinutes: Number(e.target.value),
                                })
                            }
                            className="rounded-lg border p-3"
                        />

                        <input
                            type="email"
                            placeholder="Alert Email (optional)"
                            value={formData.alertEmail}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    alertEmail: e.target.value,
                                })
                            }
                            className="rounded-lg border p-3 md:col-span-2"
                        />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleCreateMonitor}
                            className="rounded-lg bg-teal-700 px-5 py-2 text-white"
                        >
                            Create
                        </button>
                    </div>
                </div>
            )}

            {loading && (
                <div className="mt-8 rounded-lg border p-8 text-center">
                    Loading monitors...
                </div>
            )}

            {error && (
                <div className="mt-8 rounded-lg border border-red-300 bg-red-50 p-4 text-red-600">
                    {error}
                </div>
            )}

            {!loading && !error && monitors.length === 0 && (
                <div className="mt-8 rounded-lg border border-dashed p-10 text-center text-gray-500">
                    No monitors found.
                </div>
            )}

            {!loading && !error && monitors.length > 0 && (
                <div className="mt-8 overflow-hidden rounded-lg border bg-white shadow">
                    <table className="min-w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-left">Method</th>
                                <th className="px-4 py-3 text-left">URL</th>
                                <th className="px-4 py-3 text-left">Interval</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {monitors.map((monitor) => (
                                <tr key={monitor.id} className="border-t">
                                    <td className="px-4 py-3 font-medium">
                                        <Link
                                            to={`/monitors/${monitor.id}`}
                                            className="text-teal-700 hover:underline"
                                        >
                                            {monitor.name}
                                        </Link>
                                    </td>

                                    <td className="px-4 py-3">
                                        <span className="rounded bg-blue-100 px-2 py-1 text-blue-700">
                                            {monitor.method}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3">{monitor.url}</td>

                                    <td className="px-4 py-3">
                                        {monitor.intervalMinutes} min
                                    </td>

                                    <td className="px-4 py-3">
                                        {monitor.isActive ? (
                                            <span className="rounded bg-green-100 px-2 py-1 text-green-700">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="rounded bg-red-100 px-2 py-1 text-red-700">
                                                Inactive
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => handleDeleteMonitor(monitor.id)}
                                            className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}