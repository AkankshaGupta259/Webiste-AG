import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PersonalEntryCard } from "@/components/personal/PersonalEntryCard";
import { TravelView } from "@/components/personal/TravelView";
import { WatchView } from "@/components/personal/WatchView";
import {
  getCategoryBySlug,
  getCategoryEntries,
  getTravelPlaces,
  getWatchGroups,
} from "@/lib/personal";
import { routes } from "@/lib/routes";

export const revalidate = 300;

type Params = { category: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category } = await params;
  const found = await getCategoryBySlug(category);
  return {
    title: found ? found.label : "Not found",
    robots: { index: false, follow: false },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { category } = await params;
  const found = await getCategoryBySlug(category);
  if (!found) notFound();

  return (
    <div>
      <Link
        href={routes.personalViewer}
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-foreground-muted transition-colors hover:text-foreground"
      >
        <span aria-hidden="true">←</span> the universe
      </Link>

      <header className="mb-8 flex items-center gap-3">
        <span className="text-4xl" aria-hidden="true">
          {found.emoji}
        </span>
        <div>
          <h1 className="font-serif text-4xl text-foreground">{found.label}</h1>
          <p className="text-sm text-foreground-muted">{found.description}</p>
        </div>
      </header>

      <CategoryBody slug={found.id} special={found.special} emoji={found.emoji} />
    </div>
  );
}

async function CategoryBody({
  slug,
  special,
  emoji,
}: {
  slug: string;
  special?: "travel" | "watch";
  emoji: string;
}) {
  if (special === "travel") {
    return <TravelView places={await getTravelPlaces()} />;
  }
  if (special === "watch") {
    return <WatchView groups={await getWatchGroups()} />;
  }

  const entries = await getCategoryEntries(slug);
  if (!entries.length) {
    return (
      <p className="rounded-2xl border border-dashed border-border-strong bg-background-elevated/40 p-8 text-sm text-foreground-muted">
        Nothing here yet — this collection is waiting to be filled. ✨
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {entries.map((entry) => (
        <li key={entry.id}>
          <PersonalEntryCard entry={entry} emoji={emoji} />
        </li>
      ))}
    </ul>
  );
}
