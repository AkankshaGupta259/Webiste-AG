import { routes } from "@/lib/routes";

/**
 * The professional-side sections. This single list drives both the hub
 * cards and the header nav, so adding/reordering a section happens in one
 * place. `Icon` is a short label glyph for now (swapped for real icons
 * once the visual language is set).
 */
export interface NavSection {
  label: string;
  href: string;
  /** One-line summary shown on the hub cards. */
  description: string;
}

export const portfolioSections: NavSection[] = [
  {
    label: "Projects",
    href: routes.projects,
    description: "Selected work, told as case studies.",
  },
  {
    label: "Resume",
    href: routes.resume,
    description: "Skills, experience, education & achievements.",
  },
  {
    label: "College",
    href: routes.college,
    description: "Clubs, leadership, events & competitions.",
  },
  {
    label: "School",
    href: routes.school,
    description: "Achievements from before college.",
  },
];
