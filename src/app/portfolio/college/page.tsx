import type { Metadata } from "next";
import { SectionHeading } from "@/components/portfolio/SectionHeading";
import { ActivityCard } from "@/components/portfolio/ActivityCard";
import { collegeActivities } from "@/content/activities";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "College Activities" };

export default function CollegePage() {
  return (
    <div>
      <SectionHeading
        eyebrow="Beyond the coursework"
        title="College Activities"
        lead="Leadership, clubs, competitions, and workshops from my time at IIIT Manipur. Open any card for the full story."
      />

      <ul className="grid gap-4 sm:grid-cols-2">
        {collegeActivities.map((activity) => (
          <li key={activity.slug}>
            <ActivityCard
              activity={activity}
              href={`${routes.college}/${activity.slug}`}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
