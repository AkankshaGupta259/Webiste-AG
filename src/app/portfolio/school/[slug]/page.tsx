import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  schoolActivities,
  getSchoolActivityBySlug,
} from "@/content/activities";
import { ActivityDetail } from "@/components/portfolio/ActivityDetail";
import { routes } from "@/lib/routes";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return schoolActivities.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const activity = getSchoolActivityBySlug(slug);
  if (!activity) return { title: "Activity not found" };
  return { title: activity.title, description: activity.description };
}

export default async function SchoolActivityPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const activity = getSchoolActivityBySlug(slug);
  if (!activity) notFound();

  return (
    <ActivityDetail
      activity={activity}
      backHref={routes.school}
      backLabel="All school activities"
    />
  );
}
