export function formatDateTime(value?: string | null) {
  if (!value) {
    return '—';
  }

  return new Date(value).toLocaleString();
}

export function formatMs(value?: number | null) {
  if (value == null) {
    return '—';
  }

  return `${value} ms`;
}

export function formatPercent(value?: number | null) {
  if (value == null) {
    return '—';
  }

  return `${value}%`;
}
