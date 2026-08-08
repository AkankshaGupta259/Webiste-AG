import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WatchCard } from "@/components/personal/WatchCard";
import { getWatchCollectionBySlug } from "@/lib/personal";
import { routes } from "@/lib/routes";

export const revalidate = 300;

type Params = { collectionId: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { collectionId } = await params;
  const c = await getWatchCollectionBySlug(collectionId);
  return {
    title: c ? c.title : "Not found",
    robots: { index: false, follow: false },
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { collectionId } = await params;
  const collection = await getWatchCollectionBySlug(collectionId);
  if (!collection) notFound();

  return (
    <div>
      <Link
        href={`${routes.personalViewer}/dramas`}
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-foreground-muted transition-colors hover:text-foreground"
      >
        <span aria-hidden="true">←</span> Dramas
      </Link>

      <header className="mb-8 flex items-center gap-3">
        <span className="text-4xl" aria-hidden="true">
          {collection.emoji ?? "🎬"}
        </span>
        <div>
          <h1 className="font-serif text-4xl text-foreground">
            {collection.title}
          </h1>
          {collection.note ? (
            <p className="text-sm text-foreground-muted">{collection.note}</p>
          ) : null}
        </div>
      </header>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {collection.titles.map((t) => (
          <li key={t.id}>
            <WatchCard title={t} emoji={collection.emoji ?? "🎬"} />
          </li>
        ))}
      </ul>
    </div>
  );
}
