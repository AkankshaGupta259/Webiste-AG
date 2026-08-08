import { routes } from "@/lib/routes";

/**
 * A personal-side category (view model). Data comes from the API; this
 * defines the shape and the route helper. `special` flags categories with
 * a custom view (Travel → map, Dramas → grouped "watch" view).
 */
export interface PersonalCategory {
  /** The category slug — used as the route param and identity. */
  id: string;
  label: string;
  emoji: string;
  description: string;
  special?: "travel" | "watch";
}

/** Route to a category's view. */
export function categoryHref(id: string): string {
  return `${routes.personalViewer}/${id}`;
}
