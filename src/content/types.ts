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
  type?: string; // e.g. "Research Internship", "Student Leadership"
  location?: string; // e.g. "Onsite", "Remote"
  start: string;
  end: string; // or "Present"
  bullets: string[];
  /** Certificate slug (see content/certificates.ts) → "View certificate" link. */
  certificate?: string;
}

/** A certification or course, shown in the "Certifications & Courses" section. */
export interface CertificationItem {
  title: string;
  issuer?: string; // e.g. "Swayam (NPTEL)"
  year?: string;
  bullets?: string[];
  /** Certificate slug (see content/certificates.ts). */
  certificate?: string;
}

/** An achievement line, optionally linking to its detailed card elsewhere. */
export interface AchievementItem {
  text: string;
  /** Link to a fuller description (e.g. its College activity page). */
  href?: string;
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
  /** Leadership & project-coordination roles (shown as a distinct section). */
  leadership: ExperienceItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
  achievements: AchievementItem[];
  research: string[];
  /**
   * Role-targeted résumé PDFs in /public. The download control offers the
   * viewer a role, then hands them the matching file. A missing entry shows
   * as "coming soon" rather than breaking the button.
   */
  resumesByRole?: {
    sde?: string;
    aiml?: string;
    management?: string;
  };
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

/** Grouping used to organize the College page into labelled sections. */
export type ActivitySection =
  | "Leadership & Roles"
  | "Technical Events & Workshops"
  | "Competitions"
  | "Cultural & Arts";

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
  /** Which College section this belongs to (grouping). */
  section?: ActivitySection;
  /** Short summary shown on the card. */
  description?: string;
  /** Longer prose shown on the activity's detail page. */
  body?: string;
  /** Cover/hero image (/public path or Cloudinary URL). */
  coverImage?: string;
  /** Photos from the event/activity (added later). */
  gallery?: string[];
  /** Certificate slug (see content/certificates.ts) — embedded on the detail page. */
  certificate?: string;
}
