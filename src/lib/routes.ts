/**
 * Centralized route definitions. Using constants instead of scattered
 * string literals keeps navigation refactor-safe and documents the
 * (public vs. hidden) surface of the app in one place.
 */
export const routes = {
  home: "/",

  // Professional surface
  portfolio: "/portfolio",
  projects: "/portfolio/projects",
  resume: "/portfolio/resume",
  college: "/portfolio/college",
  school: "/portfolio/school",

  // Hidden surface — reached only via the secret profile-photo interaction.
  personalGateway: "/personal", // playful "are you sure?" warning
  personalViewer: "/personal/viewer", // the universe hub
  personalAuth: "/personal/auth", // password page → editor
  personalEditor: "/personal/editor", // protected editor dashboard
} as const;
