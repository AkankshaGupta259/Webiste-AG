import Image from "next/image";
import type { PersonalEntry } from "@/content/personal";

/** A 0–5 star rating, filled to `value`. */
function Stars({ value }: { value: number }) {
  return (
    <span className="text-accent" aria-label={`${value} out of 5`}>
      {"★".repeat(value)}
      <span className="text-foreground-subtle">{"★".repeat(5 - value)}</span>
    </span>
  );
}

/**
 * A single personal entry. Shows a cover (image when available, else a
 * cozy emoji block), the title, an optional status/rating, and a note.
 */
export function PersonalEntryCard({
  entry,
  emoji,
}: {
  entry: PersonalEntry;
  emoji: string;
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-background-elevated/50">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface">
        {entry.image ? (
          <Image
            src={entry.image}
            alt={entry.title}
            fill
            sizes="(max-width: 640px) 50vw, 240px"
            className="object-cover"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-5xl"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(120% 120% at 30% 20%, var(--aurora-2), transparent 60%), radial-gradient(120% 120% at 80% 90%, var(--aurora-1), transparent 60%), var(--surface)",
            }}
          >
            {emoji}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-serif text-lg leading-tight text-foreground">
          {entry.title}
        </h3>

        {entry.year ? (
          <span className="font-mono text-xs text-foreground-subtle">
            {entry.year}
          </span>
        ) : null}

        {entry.status || typeof entry.rating === "number" ? (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
            {entry.status ? (
              <span className="rounded-full border border-border px-2 py-0.5 text-foreground-muted">
                {entry.status}
              </span>
            ) : null}
            {typeof entry.rating === "number" ? (
              <Stars value={entry.rating} />
            ) : null}
          </div>
        ) : null}

        {entry.note ? (
          <p className="text-pretty text-sm leading-relaxed text-foreground-muted">
            {entry.note}
          </p>
        ) : null}
      </div>
    </div>
  );
}
