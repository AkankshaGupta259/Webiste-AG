import type { Metadata } from "next";
import { SectionHeading } from "@/components/portfolio/SectionHeading";
import { ActivityCard } from "@/components/portfolio/ActivityCard";
import { getCollegeBySection } from "@/content/activities";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "College Activities" };

export default function CollegePage() {
  const groups = getCollegeBySection();

  return (
    <div>
      <SectionHeading
        eyebrow="Beyond the coursework"
        title="College Activities"
        lead="Leadership, technical events, competitions, and cultural activities from my time at IIIT Manipur. Open any card for the full story and its certificate."
      />

      <div className="flex flex-col gap-12">
        {groups.map((group) => (
          <section key={group.section}>
            <h2 className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-foreground-subtle">
              {group.section}
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {group.items.map((activity) => (
                <li key={activity.slug}>
                  <ActivityCard
                    activity={activity}
                    href={`${routes.college}/${activity.slug}`}
                  />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
