import Image from "next/image";
import type { WatchTitle } from "@/content/personal";

/**
 * A single watch title (drama / anime / movie). Shows a poster when one
 * is set, otherwise a cozy emoji cover. Title + year only — no
 * copyrighted artwork is bundled.
 */
export function WatchCard({
  title,
  emoji,
}: {
  title: WatchTitle;
  emoji: string;
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-background-elevated/50">
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-surface">
        {title.image ? (
          <Image
            src={title.image}
            alt={title.title}
            fill
            sizes="(max-width: 640px) 45vw, 200px"
            className="object-cover"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-4xl"
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
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h4 className="text-sm font-medium leading-snug text-foreground">
          {title.title}
        </h4>
        {title.year ? (
          <span className="font-mono text-xs text-foreground-subtle">
            {title.year}
          </span>
        ) : null}
        {title.note ? (
          <p className="text-xs leading-relaxed text-foreground-muted">
            {title.note}
          </p>
        ) : null}
      </div>
    </div>
  );
}
