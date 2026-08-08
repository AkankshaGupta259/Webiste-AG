import Link from "next/link";
import type { Metadata } from "next";
import { categoryHref } from "@/config/personal";
import { getViewerCategories, type CategoryWithCount } from "@/lib/personal";

export const metadata: Metadata = {
  title: "The universe",
  robots: { index: false, follow: false },
};

// ISR: cached and revalidated; the editor busts it on save via the
// `personal` cache tag.
export const revalidate = 300;

function noun(category: CategoryWithCount): string {
  if (category.special === "travel") return "places";
  if (category.special === "watch") return "titles";
  return "entries";
}

/** Viewer hub — a warm welcome and a grid of category doors. */
export default async function ViewerHubPage() {
  const categories = await getViewerCategories();

  return (
    <div>
      <header className="mb-10 max-w-2xl">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-accent">
          Welcome in
        </p>
        <h1 className="text-balance font-serif text-4xl leading-tight text-foreground sm:text-5xl">
          A little universe of things I love.
        </h1>
        <p className="mt-4 text-pretty text-foreground-muted">
          Wander around — every corner is a small collection. Pick a door.
        </p>
      </header>

      {categories.length ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={categoryHref(category.id)}
                className="group flex h-full flex-col gap-3 rounded-2xl border border-border bg-background-elevated/50 p-6 transition-all hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <span className="text-3xl" aria-hidden="true">
                  {category.emoji}
                </span>
                <div>
                  <h2 className="font-serif text-2xl text-foreground">
                    {category.label}
                  </h2>
                  <p className="mt-1 text-sm text-foreground-muted">
                    {category.description}
                  </p>
                </div>
                <span className="mt-auto font-mono text-xs text-foreground-subtle">
                  {category.count} {noun(category)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed border-border-strong bg-background-elevated/40 p-8 text-sm text-foreground-muted">
          The universe is quiet right now — the content service may be waking
          up. Refresh in a moment.
        </p>
      )}
    </div>
  );
}
