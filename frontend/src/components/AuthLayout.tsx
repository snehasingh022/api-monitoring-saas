import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-4.5rem)] w-full max-w-md flex-col justify-center px-6 py-12">
      <div className="mb-8">
        <Link to="/" className="text-sm font-medium text-teal-800 hover:underline">
          ← API Tracker
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
          {title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{subtitle}</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        {children}
      </div>

      <p className="mt-6 text-center text-sm text-slate-600">{footer}</p>
    </section>
  );
}
