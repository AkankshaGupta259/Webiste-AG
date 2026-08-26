import type { Metadata } from "next";
import { SectionHeading } from "@/components/portfolio/SectionHeading";
import { ActivityCard } from "@/components/portfolio/ActivityCard";
import { schoolActivities } from "@/content/activities";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "School Activities" };

export default function SchoolPage() {
  return (
    <div>
      <SectionHeading
        eyebrow="Before college"
        title="School Activities"
        lead="Achievements and activities from before college. Open any card for the full story, photos, and its certificate."
      />

      <ul className="grid gap-4 sm:grid-cols-2">
        {schoolActivities.map((activity) => (
          <li key={activity.slug}>
            <ActivityCard
              activity={activity}
              href={`${routes.school}/${activity.slug}`}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
