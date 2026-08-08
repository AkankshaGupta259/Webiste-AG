import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAdminCategoryBySlug,
  getAdminEntries,
  getAdminGroups,
} from "@/lib/personal";
import { EntryManager } from "@/components/personal/EntryManager";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Edit collection",
  robots: { index: false, follow: false },
};

type Params = { category: string };

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { category } = await params;
  const cat = await getAdminCategoryBySlug(category);
  if (!cat) notFound();

  const [entries, groups] = await Promise.all([
    getAdminEntries(cat.id),
    getAdminGroups(cat.id),
  ]);

  return (
    <div>
      <Link
        href={routes.personalEditor}
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-foreground-muted transition-colors hover:text-foreground"
      >
        <span aria-hidden="true">←</span> All collections
      </Link>

      <header className="mb-8 flex items-center gap-3">
        <span className="text-3xl" aria-hidden="true">
          {cat.emoji ?? "✨"}
        </span>
        <h1 className="font-serif text-3xl text-foreground">{cat.label}</h1>
      </header>

      <EntryManager
        categoryId={cat.id}
        groups={groups.map((g) => ({ id: g.id, label: g.label }))}
        initialEntries={entries}
        special={cat.special as "travel" | "watch" | null}
      />
    </div>
  );
}
