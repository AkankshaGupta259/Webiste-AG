import type { ActivityItem } from "./types";

/**
 * College & school activities (source-controlled).
 *
 * Drafted from Akanksha's resume docx + PDF (PDF preferred on conflicts).
 * Each item has its own detail page at /portfolio/<section>/<slug>, so
 * photos, certificates, and richer prose can be added per entry over time
 * via `coverImage`, `gallery`, `certificate`, and `body`.
 * Array order = display order.
 */
export const collegeActivities: ActivityItem[] = [
  {
    slug: "joint-technical-secretary",
    title: "Joint Technical Secretary",
    org: "IIIT Manipur",
    date: "Aug 2024 – Oct 2025",
    category: "Leadership",
    description:
      "Coordinated technical events, workshops, and knowledge-sharing sessions with peers and faculty, and drove initiatives that grow students' technical skills.",
  },
  {
    slug: "techfest-ahouba",
    title: "Organized TechFest AHOUBA",
    org: "IIIT Manipur",
    category: "Event",
    description:
      "Organized AHOUBA — the largest tech fest in the state of Manipur — with participation from colleges across the region.",
  },
  {
    slug: "fenomenon-25-ideathon",
    title: "First Prize — Fenomenon'25 Ideathon",
    role: "Aero-5G",
    date: "2025",
    category: "Competition",
    description:
      "Won first prize for Aero-5G, an air-traffic-control concept for ultra-low-altitude unmanned drones.",
  },
  {
    slug: "flipr-hackathon",
    title: "Third Place — Flipr Hackathon",
    category: "Competition",
    description: "Built an interactive real-time chat application.",
  },
  {
    slug: "ai-ml-club",
    title: "Co-Lead, AI/ML Club",
    org: "IIIT Manipur",
    date: "Aug 2023 – Apr 2024",
    category: "Club",
    description:
      "Led club activities introducing AI/ML through hands-on projects and discussions, and ran interactive sessions encouraging peers to explore the field.",
  },
  {
    slug: "think-india-convention",
    title: "Think India Convention",
    org: "IIT Roorkee",
    category: "Workshop",
    description: "Focused on national development and youth leadership.",
  },
  {
    slug: "north-east-summit",
    title: "North East Summit",
    org: "IIT Guwahati",
    category: "Workshop",
    description: "Discussions on regional innovation and opportunities.",
  },
];

/**
 * School (pre-college) activities. Seeded with the IIRS-ISRO program
 * (2022); more to come once Akanksha gathers the material.
 */
export const schoolActivities: ActivityItem[] = [
  {
    slug: "iirs-isro-outreach",
    title: "IIRS-ISRO Outreach Program",
    date: "2022",
    category: "Workshop",
    description:
      "Gained insights into satellite technology and geospatial applications.",
  },
];

/* ── Accessors ──────────────────────────────────────────────────── */

export function getCollegeActivityBySlug(
  slug: string,
): ActivityItem | undefined {
  return collegeActivities.find((a) => a.slug === slug);
}

export function getSchoolActivityBySlug(slug: string): ActivityItem | undefined {
  return schoolActivities.find((a) => a.slug === slug);
}
