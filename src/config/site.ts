/**
 * Central content configuration for the professional side.
 *
 * Professional content is intentionally source-controlled (not editable
 * from the site), so this file is the single place to update copy, links,
 * and the profile photo. Keeping it here avoids scattering strings across
 * components and makes the site trivially re-brandable.
 *
 * 👉 TODO(you): replace the placeholder copy below with your real details,
 *    and drop a photo in /public then set `profilePhoto` to its path
 *    (e.g. "/profile.jpg"). Leave it as `null` to use the CSS portrait
 *    fallback in the meantime.
 */

export interface SiteConfig {
  /** Full name as it should display in the hero. */
  name: string;
  /** Initials used by the photo fallback. Derived if omitted. */
  initials?: string;
  /** Short role/eyebrow line, e.g. "Full-Stack Developer". */
  role: string;
  /** One-line intro / tagline shown under the name. */
  intro: string;
  /** 1–2 sentence description shown under the intro. */
  description: string;
  /** Absolute site URL (used for metadata / OG). */
  url: string;
  /** Path to the profile photo in /public, or null for the fallback. */
  profilePhoto: string | null;
  /** External links — surfaced in later sections (not the landing hero). */
  links: {
    github?: string;
    linkedin?: string;
    email?: string;
  };
}

export const siteConfig: SiteConfig = {
  name: "Akanksha Gupta",
  role: "Full-Stack & AI Systems",
  intro: "I build scalable full-stack applications and real-time AI systems.",
  description:
    "Final-year Computer Science student at IIIT Manipur, working across software engineering, computer vision, and applied ML — with a systems-and-optimization mindset for products that run fast and scale cleanly.",
  url: "https://akankshagupta.org",
  profilePhoto: "/my-pic.jpg",
  links: {
    github: "https://github.com/AkankshaGupta259",
    linkedin: "https://www.linkedin.com/in/akanksha-gupta",
    email: "akkigupta259@gmail.com",
  },
};

/** Compute display initials from the name when not explicitly set. */
export function getInitials(config: SiteConfig = siteConfig): string {
  if (config.initials) return config.initials;
  return config.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
