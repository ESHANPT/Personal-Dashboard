export function PageHeader({
  emoji,
  title,
  subtitle,
}: {
  emoji: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="fade-up mb-8">
      <h1 className="text-3xl font-semibold text-forest sm:text-4xl">
        <span className="mr-2">{emoji}</span>
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-2 max-w-2xl text-muted-foreground">{subtitle}</p>
      ) : null}
    </header>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
      {children}
    </p>
  );
}
