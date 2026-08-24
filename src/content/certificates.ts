/**
 * Certificate registry (source-controlled).
 *
 * Each certificate is a static file in /public/certificates. Content items
 * (experience, activities, courses…) reference a certificate by its `slug`;
 * the "View Certificate" link opens the branded viewer at
 * `/certificate/<slug>` in a new tab. Keeping the file paths and titles here
 * (not scattered in content) means one place to manage proofs — and no
 * backend, so there's zero latency: the files are served from the CDN.
 */
export interface Certificate {
  /** URL-safe id used in the viewer route and referenced from content. */
  slug: string;
  /** Shown as the viewer's heading. */
  title: string;
  /** Issuing body, shown under the title. */
  issuer?: string;
  /** Path to the file in /public (PDF or image). */
  file: string;
}

export const certificates: Certificate[] = [
  // ── Experience ──
  {
    slug: "lumovate-internship",
    title: "Software Development Internship",
    issuer: "Lumovate Intelligence",
    file: "/certificates/lumovate-internship.pdf",
  },
  {
    slug: "joint-technical-secretary",
    title: "Joint Technical Secretary",
    issuer: "IIIT Manipur",
    file: "/certificates/joint-technical-secretary.pdf",
  },

  // ── Certifications & Courses ──
  {
    slug: "business-intelligence-analytics",
    title: "Business Intelligence and Analytics",
    issuer: "Swayam (NPTEL) · 2026",
    file: "/certificates/business-intelligence-analytics.pdf",
  },
  {
    slug: "data-analytics",
    title: "Data Science & Analysis",
    file: "/certificates/data-analytics.pdf",
  },
  {
    slug: "blockchain-applications",
    title: "Blockchain and Its Applications",
    issuer: "Swayam (NPTEL) · 2026",
    file: "/certificates/blockchain-applications.pdf",
  },
  {
    slug: "competitive-programming-nptel",
    title: "Getting Started with Competitive Programming",
    issuer: "Swayam (NPTEL) · 2025",
    file: "/certificates/competitive-programming-nptel.pdf",
  },
  {
    slug: "saras-powers-of-ai",
    title: "Powers of AI",
    issuer: "Saras Institute",
    file: "/certificates/saras-powers-of-ai.pdf",
  },

  // ── College / activities ──
  {
    slug: "fenomenon-25",
    title: "Fenomenon'25 Ideathon — First Prize",
    issuer: "IIIT Manipur",
    file: "/certificates/fenomenon-25.pdf",
  },
  {
    slug: "flipr-hackathon",
    title: "Flipr Hackathon — Third Place",
    issuer: "Flipr",
    file: "/certificates/flipr-hackathon.png",
  },
  {
    slug: "solo-dance-ahouba-24",
    title: "Solo Dance — 2nd Place, Ahouba'24",
    issuer: "IIIT Manipur",
    file: "/certificates/solo-dance-ahouba-24.pdf",
  },
  {
    slug: "content-team-lead-ahouba-24",
    title: "Content Team Lead — Ahouba'24",
    issuer: "IIIT Manipur",
    file: "/certificates/content-team-lead-ahouba-24.pdf",
  },
  {
    slug: "republic-day-2025",
    title: "Republic Day Cultural Celebrations 2025",
    issuer: "IIIT Manipur",
    file: "/certificates/republic-day-2025.pdf",
  },
  {
    slug: "north-east-summit",
    title: "North East Summit",
    issuer: "IIT Guwahati",
    file: "/certificates/north-east-summit.pdf",
  },

  // ── School ──
  {
    slug: "iirs-isro",
    title: "IIRS-ISRO Outreach Program",
    issuer: "IIRS, ISRO · 2022",
    file: "/certificates/iirs-isro.pdf",
  },
];

const bySlug = new Map(certificates.map((c) => [c.slug, c]));

export function getCertificate(slug: string): Certificate | undefined {
  return bySlug.get(slug);
}

/** Route to the branded certificate viewer for a slug. */
export function certificateHref(slug: string): string {
  return `/certificate/${slug}`;
}
