/**
 * Personal-side VIEW MODELS (types only).
 *
 * The actual data now comes from the backend API via `src/lib/personal.ts`,
 * which maps the database rows into these shapes. Keeping the types here
 * (where the components already import them from) means the components
 * didn't need to change when the data source moved to the API.
 */

/** A generic entry for list-style categories (anime, books, wishlist…). */
export interface PersonalEntry {
  id: string;
  title: string;
  year?: number;
  image?: string;
  note?: string;
  date?: string;
  rating?: number; // 0–5
  status?: string;
  tags?: string[];
}

/** A visited place, positioned on the India map (x/y are % of the map). */
export interface TravelPlace {
  id: string;
  place: string;
  region?: string;
  note?: string;
  date?: string;
  photos?: string[];
  x: number;
  y: number;
}

/** A single watch title (drama / anime / movie). */
export interface WatchTitle {
  id: string;
  title: string;
  year?: number;
  note?: string;
  image?: string;
}

/** A collection that drills into its own page (e.g. MCU). */
export interface WatchCollection {
  id: string;
  title: string;
  emoji?: string;
  note?: string;
  titles: WatchTitle[];
}

/** A group inside a "watch" category (K-Drama, Movies, Series…). */
export interface WatchGroup {
  id: string;
  label: string;
  emoji?: string;
  titles?: WatchTitle[];
  subgroups?: WatchGroup[];
  collections?: WatchCollection[];
}

/** Total titles within a group (incl. subgroups + collections). Pure. */
export function countGroupTitles(group: WatchGroup): number {
  let n = group.titles?.length ?? 0;
  group.subgroups?.forEach((s) => (n += countGroupTitles(s)));
  group.collections?.forEach((c) => (n += c.titles.length));
  return n;
}
