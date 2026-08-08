import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WatchGroupContent } from "@/components/personal/WatchView";
import { getWatchGroupBySlug } from "@/lib/personal";
import { routes } from "@/lib/routes";

export const revalidate = 300;

type Params = { groupId: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { groupId } = await params;
  const group = await getWatchGroupBySlug(groupId);
  return {
    title: group ? `${group.label} — Dramas` : "Not found",
    robots: { index: false, follow: false },
  };
}

export default async function WatchGroupPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { groupId } = await params;
  const group = await getWatchGroupBySlug(groupId);
  if (!group) notFound();

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
          {group.emoji}
        </span>
        <h1 className="font-serif text-4xl text-foreground">{group.label}</h1>
      </header>

      <WatchGroupContent group={group} />
    </div>
  );
}
