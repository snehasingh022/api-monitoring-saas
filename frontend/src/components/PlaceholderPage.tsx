export function PlaceholderPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col justify-center px-6 py-16">
      <p className="mb-3 text-sm font-medium tracking-wide text-teal-800 uppercase">
        API Tracker
      </p>
      <h1 className="mb-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </h1>
      <p className="max-w-xl text-base leading-relaxed text-slate-600">
        {description}
      </p>
    </section>
  );
}
