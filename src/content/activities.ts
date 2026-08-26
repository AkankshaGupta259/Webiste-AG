import type { ActivityItem, ActivitySection } from "./types";

/**
 * College & school activities (source-controlled).
 *
 * Each item has its own detail page at /portfolio/<section>/<slug>, which can
 * show richer prose (`body`), photos (`gallery`), and an embedded certificate
 * (`certificate` = a slug from content/certificates.ts). The College page
 * groups items by `section` in the order of `collegeSections` below.
 */

/** Display order of the College sub-sections. */
export const collegeSections: ActivitySection[] = [
  "Leadership & Roles",
  "Technical Events & Workshops",
  "Competitions",
  "Cultural & Arts",
];

export const collegeActivities: ActivityItem[] = [
  // ── Leadership & Roles ──
  {
    slug: "joint-technical-secretary",
    title: "Joint Technical Secretary",
    org: "IIIT Manipur",
    date: "Aug 2024 – Oct 2025",
    category: "Leadership",
    section: "Leadership & Roles",
    description:
      "Coordinated technical events, workshops, and knowledge-sharing sessions with peers and faculty, and drove initiatives that grow students' technical skills.",
    body:
      "As Joint Technical Secretary I led end-to-end planning and execution of the institute's technical events and workshops — managing schedules, logistics, budgets, and stakeholder coordination — including organizing AHOUBA, the largest tech fest in the state of Manipur.",
    certificate: "joint-technical-secretary",
  },
  {
    slug: "rbi-youth-ambassador",
    title: "RBI Youth Ambassador",
    org: "Reserve Bank of India",
    date: "Nov 2025 – Present",
    category: "Leadership",
    section: "Leadership & Roles",
    description:
      "Selected as a Youth Ambassador for the Reserve Bank of India, leading financial-literacy outreach.",
    body:
      "Planned and executed 4+ financial-literacy sessions for 150+ participants, acting as the primary liaison between RBI officials and institute stakeholders and coordinating a cross-functional team to deliver the outreach on schedule.",
    gallery: ["/events/rbi-youth-ambassador.jpg"],
    // certificate: placeholder — file not provided yet.
  },
  {
    slug: "ai-ml-club",
    title: "Co-Lead, AI/ML Club",
    org: "IIIT Manipur",
    date: "Aug 2023 – Apr 2024",
    category: "Club",
    section: "Leadership & Roles",
    description:
      "Led club activities introducing AI/ML through hands-on projects and discussions, and ran interactive sessions encouraging peers to explore the field.",
  },

  // ── Technical Events & Workshops ──
  {
    slug: "think-india-convention",
    title: "Think India Convention",
    org: "IIT Roorkee",
    category: "Workshop",
    section: "Technical Events & Workshops",
    description: "Focused on national development and youth leadership.",
  },
  {
    slug: "north-east-summit",
    title: "North East Summit",
    org: "IIT Guwahati",
    category: "Workshop",
    section: "Technical Events & Workshops",
    description: "Discussions on regional innovation and opportunities.",
    certificate: "north-east-summit",
  },

  // ── Competitions ──
  {
    slug: "fenomenon-25-ideathon",
    title: "First Prize — Fenomenon'25 Ideathon",
    role: "Aero-5G",
    date: "2025",
    category: "Competition",
    section: "Competitions",
    description:
      "Won first prize for Aero-5G, an air-traffic-control concept for ultra-low-altitude unmanned drones.",
    certificate: "fenomenon-25",
  },
  {
    slug: "flipr-hackathon",
    title: "Third Place — Flipr Hackathon",
    category: "Competition",
    section: "Competitions",
    description: "Built an interactive real-time chat application.",
    certificate: "flipr-hackathon",
  },

  // ── Cultural & Arts ──
  {
    slug: "solo-dance-ahouba-24",
    title: "Second Place — Solo Dance, Ahouba'24",
    org: "IIIT Manipur",
    category: "Achievement",
    section: "Cultural & Arts",
    description:
      "Placed second in the solo dance competition at Ahouba'24, the institute's annual fest.",
    certificate: "solo-dance-ahouba-24",
  },
  {
    slug: "content-team-lead-ahouba-24",
    title: "Content Team Lead — Ahouba'24",
    org: "IIIT Manipur",
    category: "Leadership",
    section: "Cultural & Arts",
    description:
      "Led the content team for Ahouba'24, coordinating write-ups, scripts, and communications for the fest.",
    certificate: "content-team-lead-ahouba-24",
  },
  {
    slug: "republic-day-2025",
    title: "Republic Day Cultural Celebrations",
    date: "2025",
    category: "Event",
    section: "Cultural & Arts",
    description:
      "Participated in the cultural programme for the 2025 Republic Day celebrations.",
    certificate: "republic-day-2025",
  },
];

/**
 * School (pre-college) activities. Seeded with the IIRS-ISRO program (2022);
 * more to come once Akanksha gathers the material.
 */
export const schoolActivities: ActivityItem[] = [
  {
    slug: "iirs-isro-outreach",
    title: "IIRS-ISRO Outreach Program",
    date: "2022",
    category: "Workshop",
    description:
      "Gained insights into satellite technology and geospatial applications.",
    body:
      "Participated in the IIRS-ISRO Outreach Program (2022), gaining hands-on insights into satellite technology, remote sensing, and geospatial applications.",
    certificate: "iirs-isro",
    gallery: ["/events/iirs-isro-1.jpg", "/events/iirs-isro-2.jpg"],
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

/** College activities grouped by section, in `collegeSections` order. */
export function getCollegeBySection(): {
  section: ActivitySection;
  items: ActivityItem[];
}[] {
  return collegeSections
    .map((section) => ({
      section,
      items: collegeActivities.filter((a) => a.section === section),
    }))
    .filter((group) => group.items.length > 0);
}
