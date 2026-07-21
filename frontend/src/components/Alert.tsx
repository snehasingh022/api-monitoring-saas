type AlertProps = {
  variant?: 'error' | 'success';
  message: string;
};

export function Alert({ variant = 'error', message }: AlertProps) {
  const styles =
    variant === 'success'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
      : 'border-red-200 bg-red-50 text-red-800';

  return (
    <div className={`rounded-lg border px-3 py-2.5 text-sm ${styles}`} role="alert">
      {message}
    </div>
  );
}
