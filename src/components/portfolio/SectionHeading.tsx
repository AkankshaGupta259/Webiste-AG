/**
 * Consistent section header used across every professional page:
 * a mono eyebrow, a serif title, and an optional lead paragraph.
 * Centralizing it keeps the sections visually in lockstep.
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <header className="mb-10 max-w-2xl">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-accent">
        {eyebrow}
      </p>
      <h1 className="text-balance font-serif text-4xl leading-tight text-foreground sm:text-5xl">
        {title}
      </h1>
      {lead ? (
        <p className="mt-4 text-pretty text-lg text-foreground-muted">{lead}</p>
      ) : null}
    </header>
  );
}

/** Temporary placeholder shown in sections whose content isn't wired yet. */
export function SectionPlaceholder({ note }: { note: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border-strong bg-background-elevated/40 p-8 text-sm text-foreground-muted">
      {note}
    </div>
  );
}
