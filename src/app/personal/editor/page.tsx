import Link from "next/link";
import type { Metadata } from "next";
import { getAdminCategories, getAdminEntries } from "@/lib/personal";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Editor",
  robots: { index: false, follow: false },
};

/** Editor dashboard — pick a category to manage its entries. */
export default async function EditorDashboard() {
  const categories = await getAdminCategories();
  const counts = await Promise.all(
    categories.map((c) => getAdminEntries(c.id).then((e) => e.length)),
  );

  return (
    <div>
      <header className="mb-8">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.25em] text-accent">
          Manage
        </p>
        <h1 className="font-serif text-4xl text-foreground">Your universe</h1>
        <p className="mt-2 text-sm text-foreground-muted">
          Pick a collection to add, edit, or remove entries.
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c, i) => (
          <li key={c.id}>
            <Link
              href={`${routes.personalEditor}/${c.slug}`}
              className="group flex h-full items-center gap-4 rounded-2xl border border-border bg-background-elevated/50 p-5 transition-all hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <span className="text-3xl" aria-hidden="true">
                {c.emoji ?? "✨"}
              </span>
              <div>
                <h2 className="font-serif text-xl text-foreground">{c.label}</h2>
                <p className="font-mono text-xs text-foreground-subtle">
                  {counts[i]} entries
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
