import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { monitorsApi } from '../api/monitors';
import type { MonitorHistoryData } from '../types/monitor';

export function MonitorDetailsPage() {
    const { id } = useParams();
    const [data, setData] = useState<MonitorHistoryData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadHistory() {
            if (!id) return;

            try {
                const result = await monitorsApi.history(id);
                setData(result);
            } catch (err) {
                console.error(err);
                setError('Failed to load monitor details.');
            } finally {
                setLoading(false);
            }
        }

        loadHistory();
    }, [id]);

    return (
        <div className="mx-auto max-w-6xl p-6">
            <h1 className="text-3xl font-bold">Monitor Details</h1>

            {loading && (
                <div className="mt-6 rounded-lg border p-6">
                    Loading...
                </div>
            )}

            {error && (
                <div className="mt-6 rounded-lg border border-red-300 bg-red-50 p-4 text-red-600">
                    {error}
                </div>
            )}

            {!loading && !error && data && (
                <div className="mt-6 space-y-6">

                    <div className="rounded-lg border bg-white p-6 shadow">
                        <h2 className="mb-4 text-xl font-semibold">
                            {data.monitor.name}
                        </h2>

                        <div className="grid gap-4 md:grid-cols-2">

                            <div>
                                <p className="text-sm text-gray-500">URL</p>
                                <p>{data.monitor.url}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Method</p>
                                <p>{data.monitor.method}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Interval</p>
                                <p>{data.monitor.intervalMinutes} min</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Status</p>

                                {data.monitor.isActive ? (
                                    <span className="rounded bg-green-100 px-2 py-1 text-green-700">
                                        Active
                                    </span>
                                ) : (
                                    <span className="rounded bg-red-100 px-2 py-1 text-red-700">
                                        Inactive
                                    </span>
                                )}

                            </div>

                        </div>
                    </div>

                    <div className="rounded-lg border bg-white shadow">

                        <div className="border-b p-4 font-semibold">
                            Recent Health Checks
                        </div>

                        <table className="min-w-full">

                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-3 text-left">Status</th>
                                    <th className="px-4 py-3 text-left">Code</th>
                                    <th className="px-4 py-3 text-left">Response</th>
                                    <th className="px-4 py-3 text-left">Checked At</th>
                                </tr>
                            </thead>

                            <tbody>

                                {data.history.map((check) => (

                                    <tr key={check.id} className="border-t">

                                        <td className="px-4 py-3">

                                            {check.status === 'up' ? (

                                                <span className="rounded bg-green-100 px-2 py-1 text-green-700">
                                                    Up
                                                </span>

                                            ) : (

                                                <span className="rounded bg-red-100 px-2 py-1 text-red-700">
                                                    Down
                                                </span>

                                            )}

                                        </td>

                                        <td className="px-4 py-3">
                                            {check.statusCode}
                                        </td>

                                        <td className="px-4 py-3">
                                            {check.responseTimeMs} ms
                                        </td>

                                        <td className="px-4 py-3">
                                            {new Date(check.checkedAt).toLocaleString()}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>
            )}
        </div>
    );
}