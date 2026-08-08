/**
 * Typed data model for the professional (source-controlled) content.
 *
 * Pages render *from* these shapes, so adding a project, job, or activity
 * is a single typed object — never a layout edit. Optional fields let
 * entries be as rich or as sparse as the material allows.
 */

/** A named external resource attached to a project. */
export interface ResourceLink {
  label: string;
  href: string;
}

/**
 * A project, presented as a case study rather than a card. Mirrors the
 * requested structure: cover, description, stack, timeline, problem,
 * solution, architecture, and links.
 */
export interface Project {
  /** URL-safe id, e.g. "sonic-3d". */
  slug: string;
  title: string;
  /** Short one-line description for listings. */
  tagline: string;
  /** Cover image path (/public) or Cloudinary URL. */
  coverImage?: string;
  techStack: string[];
  /** Optional human-readable timeline, e.g. "2025". Hidden when unset. */
  timeline?: string;
  problem: string;
  solution: string;
  /** Optional prose on the system design. */
  architecture?: string;
  /** Outcome bullets (metrics, results). */
  highlights?: string[];
  links: {
    github?: string;
    demo?: string;
    resources?: ResourceLink[];
  };
  /** Surface on the hub / featured rails. */
  featured?: boolean;
}

/* ── Resume ─────────────────────────────────────────────────────── */

export interface ExperienceItem {
  role: string;
  org: string;
  type?: string; // e.g. "Internship", "Leadership"
  location?: string;
  start: string;
  end: string; // or "Present"
  bullets: string[];
}

export interface EducationItem {
  institution: string;
  qualification: string;
  detail?: string; // e.g. "CPI: 9.58"
  location?: string;
  start: string;
  end: string;
}

export interface SkillGroup {
  label: string; // e.g. "Languages"
  items: string[];
}

export interface ResumeData {
  summary: string;
  skills: SkillGroup[];
  experience: ExperienceItem[];
  education: EducationItem[];
  achievements: string[];
  research: string[];
  /** Path to the downloadable PDF in /public. */
  resumePdf?: string;
}

/* ── Activities (college / school) ──────────────────────────────── */

export type ActivityCategory =
  | "Leadership"
  | "Club"
  | "Event"
  | "Technical"
  | "Volunteering"
  | "Competition"
  | "Workshop"
  | "Achievement";

/** A certificate / proof link attached to an activity. */
export interface ActivityLink {
  label: string;
  href: string;
}

export interface ActivityItem {
  /** URL-safe id for the activity's own detail page. */
  slug: string;
  title: string;
  org?: string;
  role?: string;
  /** Human-readable date or range. */
  date?: string;
  category: ActivityCategory;
  /** Short summary shown on the card. */
  description?: string;
  /** Longer prose shown on the activity's detail page. */
  body?: string;
  /** Cover/hero image (/public path or Cloudinary URL). */
  coverImage?: string;
  /** Photos from the event/activity (added later). */
  gallery?: string[];
  /** Certificate or proof link, e.g. a workshop certification. */
  certificate?: ActivityLink;
}
