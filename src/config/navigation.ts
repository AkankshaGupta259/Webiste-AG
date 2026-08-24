import { routes } from "@/lib/routes";

/**
 * The professional-side sections. This single list drives both the hub
 * cards and the header nav, so adding/reordering a section happens in one
 * place. `shortLabel` (optional) is used for the compact header pill when
 * the full `label` would be too long there.
 */
export interface NavSection {
  label: string;
  /** Compact label for the header nav pill (falls back to `label`). */
  shortLabel?: string;
  href: string;
  /** One-line summary shown on the hub cards. */
  description: string;
}

export const portfolioSections: NavSection[] = [
  {
    label: "Projects",
    href: routes.projects,
    description:
      "Selected projects demonstrating technical skills and practical application.",
  },
  {
    label: "Experience & Expertise",
    shortLabel: "Experience",
    href: routes.experience,
    description:
      "Professional experience, technical skills, courses & certifications, and achievements.",
  },
  {
    label: "College",
    href: routes.college,
    description: "Academic activities, events, workshops, and notable experiences.",
  },
  {
    label: "School",
    href: routes.school,
    description:
      "Academic achievements, extracurricular activities, and notable accomplishments.",
  },
];
