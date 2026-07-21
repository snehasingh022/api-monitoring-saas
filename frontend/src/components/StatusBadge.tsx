export function StatusBadge({
  status,
}: {
  status: 'up' | 'down' | 'unknown' | string;
}) {
  const styles =
    status === 'up'
      ? 'bg-emerald-50 text-emerald-800 ring-emerald-200'
      : status === 'down'
        ? 'bg-red-50 text-red-800 ring-red-200'
        : 'bg-slate-100 text-slate-600 ring-slate-200';

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${styles}`}
    >
      {status.toUpperCase()}
    </span>
  );
}
