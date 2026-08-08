import type { TravelPlace } from "@/content/personal";
import { InteractiveIndiaMap } from "./InteractiveIndiaMap";

/**
 * Travel view: an interactive India map (markers → photos/notes) over the
 * list of visited places, both driven by the same `places` data (each
 * place carries normalized x/y map coordinates).
 */
export function TravelView({ places }: { places: TravelPlace[] }) {
  return (
    <div>
      <div className="mb-10">
        <InteractiveIndiaMap places={places} />
      </div>

      <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-foreground-subtle">
        All places
      </h2>
      {places.length ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {places.map((p) => (
            <li
              key={p.id}
              className="flex h-full flex-col gap-2 rounded-2xl border border-border bg-background-elevated/50 p-5"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-serif text-xl text-foreground">{p.place}</h3>
                {p.date ? (
                  <span className="font-mono text-xs text-foreground-subtle">
                    {p.date}
                  </span>
                ) : null}
              </div>
              {p.region ? (
                <p className="text-sm text-accent">{p.region}</p>
              ) : null}
              {p.note ? (
                <p className="text-pretty text-sm leading-relaxed text-foreground-muted">
                  {p.note}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed border-border-strong bg-background-elevated/40 p-8 text-sm text-foreground-muted">
          No places yet — add some from the editor. ✨
        </p>
      )}
    </div>
  );
}
