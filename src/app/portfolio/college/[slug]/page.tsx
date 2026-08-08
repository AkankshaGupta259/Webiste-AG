import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  collegeActivities,
  getCollegeActivityBySlug,
} from "@/content/activities";
import { ActivityDetail } from "@/components/portfolio/ActivityDetail";
import { routes } from "@/lib/routes";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return collegeActivities.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const activity = getCollegeActivityBySlug(slug);
  if (!activity) return { title: "Activity not found" };
  return { title: activity.title, description: activity.description };
}

export default async function CollegeActivityPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const activity = getCollegeActivityBySlug(slug);
  if (!activity) notFound();

  return (
    <ActivityDetail
      activity={activity}
      backHref={routes.college}
      backLabel="All college activities"
    />
  );
}
