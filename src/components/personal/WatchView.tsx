import Link from "next/link";
import { countGroupTitles, type WatchGroup } from "@/content/personal";
import { routes } from "@/lib/routes";
import { WatchCard } from "./WatchCard";

/** Grid of titles for a group/subgroup. */
function TitleGrid({ group }: { group: WatchGroup }) {
  if (!group.titles?.length) return null;
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {group.titles.map((t) => (
        <li key={t.id}>
          <WatchCard title={t} emoji={group.emoji ?? "🎬"} />
        </li>
      ))}
    </ul>
  );
}

/**
 * Dramas landing: just the placecards for each group (K-Drama, C-Drama,
 * Movies, Series). Content stays hidden until a card is opened — each
 * links to its own group page.
 */
export function WatchView({ groups }: { groups: WatchGroup[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((group) => (
        <li key={group.id}>
          <Link
            href={`${routes.personalViewer}/watch/${group.id}`}
            className="group flex h-full flex-col gap-3 rounded-2xl border border-border bg-background-elevated/50 p-6 transition-all hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <span className="text-3xl" aria-hidden="true">
              {group.emoji}
            </span>
            <h2 className="font-serif text-2xl text-foreground">
              {group.label}
            </h2>
            <span className="mt-auto font-mono text-xs text-foreground-subtle">
              {countGroupTitles(group)} titles →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/**
 * Full content of a single Dramas group — its titles, any subgroups
 * (Movies → Hollywood/Bollywood/Animated), and any collections
 * (Series → MCU). Rendered on the group's own page.
 */
export function WatchGroupContent({ group }: { group: WatchGroup }) {
  return (
    <div className="flex flex-col gap-10">
      <TitleGrid group={group} />

      {group.subgroups?.length ? (
        <div className="flex flex-col gap-8">
          {group.subgroups.map((sub) => (
            <div key={sub.id}>
              <h3 className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-foreground-subtle">
                {sub.label}
              </h3>
              <TitleGrid group={sub} />
            </div>
          ))}
        </div>
      ) : null}

      {group.collections?.length ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {group.collections.map((c) => (
            <li key={c.id}>
              <Link
                href={`${routes.personalViewer}/collection/${c.id}`}
                className="group flex h-full items-center gap-4 rounded-2xl border border-border bg-background-elevated/50 p-5 transition-all hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <span className="text-4xl" aria-hidden="true">
                  {c.emoji ?? "🎬"}
                </span>
                <div>
                  <h4 className="font-serif text-xl text-foreground">
                    {c.title}
                  </h4>
                  <p className="mt-0.5 font-mono text-xs text-foreground-subtle">
                    {c.titles.length} titles →
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
