/**
 * Personal-side data access (server-only).
 *
 * Fetches from the FastAPI backend and maps the flat database rows into
 * the view-model shapes the viewer components expect. Uses Next.js ISR:
 * responses are cached and tagged `personal`, so the editor can bust the
 * cache on save via `revalidateTag('personal')`. If the backend is
 * unreachable, builders degrade to empty results rather than crashing —
 * so a sleeping free-tier backend never takes the site down.
 */

import type { PersonalCategory } from "@/config/personal";
import type {
  PersonalEntry,
  TravelPlace,
  WatchCollection,
  WatchGroup,
  WatchTitle,
} from "@/content/personal";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000";
const REVALIDATE = 300; // seconds

// ── Raw API shapes ──────────────────────────────────────────────────
export interface ApiCategory {
  id: string;
  slug: string;
  label: string;
  emoji: string | null;
  description: string | null;
  special: string | null;
  sort_order: number;
}
export interface ApiGroup {
  id: string;
  category_id: string;
  parent_id: string | null;
  slug: string;
  label: string;
  emoji: string | null;
  note: string | null;
  display: string; // 'inline' | 'card'
  sort_order: number;
}
export interface ApiPhoto {
  id: string;
  url: string;
  caption: string | null;
  sort_order: number;
}
export interface ApiEntry {
  id: string;
  category_id: string;
  group_id: string | null;
  title: string;
  year: number | null;
  note: string | null;
  body: string | null;
  status: string | null;
  rating: number | null;
  image_url: string | null;
  entry_date: string | null;
  region: string | null;
  map_x: number | string | null;
  map_y: number | string | null;
  tags: string[] | null;
  sort_order: number;
  created_at: string;
  photos: ApiPhoto[];
}

// ── Fetch helpers ───────────────────────────────────────────────────
async function apiGet<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      next: { revalidate: REVALIDATE, tags: ["personal"] },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null; // backend unreachable — degrade gracefully
  }
}

const fetchCategories = async (): Promise<ApiCategory[]> =>
  (await apiGet<ApiCategory[]>("/categories")) ?? [];

const fetchGroups = async (categoryId?: string): Promise<ApiGroup[]> =>
  (await apiGet<ApiGroup[]>(`/groups${categoryId ? `?category_id=${categoryId}` : ""}`)) ?? [];

async function fetchEntries(categoryId?: string): Promise<ApiEntry[]> {
  const q = categoryId ? `?category_id=${categoryId}` : "";
  return (await apiGet<ApiEntry[]>(`/entries${q}`)) ?? [];
}

// ── Mappers ─────────────────────────────────────────────────────────
const num = (v: number | string | null): number => (v == null ? 0 : Number(v));

const toCategory = (c: ApiCategory): PersonalCategory => ({
  id: c.slug,
  label: c.label,
  emoji: c.emoji ?? "",
  description: c.description ?? "",
  special: (c.special as PersonalCategory["special"]) ?? undefined,
});

const toEntry = (e: ApiEntry): PersonalEntry => ({
  id: e.id,
  title: e.title,
  year: e.year ?? undefined,
  image: e.image_url ?? undefined,
  note: e.note ?? undefined,
  date: e.entry_date ?? undefined,
  rating: e.rating ?? undefined,
  status: e.status ?? undefined,
  tags: e.tags ?? undefined,
});

const toTitle = (e: ApiEntry): WatchTitle => ({
  id: e.id,
  title: e.title,
  year: e.year ?? undefined,
  note: e.note ?? undefined,
  image: e.image_url ?? undefined,
});

const toTravel = (e: ApiEntry): TravelPlace => ({
  id: e.id,
  place: e.title,
  region: e.region ?? undefined,
  note: e.note ?? undefined,
  date: e.entry_date ?? undefined,
  photos: e.photos?.length ? e.photos.map((p) => p.url) : undefined,
  x: num(e.map_x),
  y: num(e.map_y),
});

const bySort = <T extends { sort_order: number }>(a: T, b: T) =>
  a.sort_order - b.sort_order;

/**
 * "Most recent first" for entries: newest release year wins; for undated
 * items, fall back to when the entry was added. sort_order breaks ties.
 */
function recencyTs(e: ApiEntry): number {
  if (e.year != null) return Date.UTC(e.year, 0, 1);
  if (e.entry_date) {
    const t = Date.parse(e.entry_date);
    if (!Number.isNaN(t)) return t;
  }
  const c = Date.parse(e.created_at);
  return Number.isNaN(c) ? 0 : c;
}

const byRecency = (a: ApiEntry, b: ApiEntry) =>
  recencyTs(b) - recencyTs(a) || a.sort_order - b.sort_order;

// ── Public builders (called by the viewer pages) ────────────────────

export interface CategoryWithCount extends PersonalCategory {
  count: number;
}

/** Hub: all categories with an item count each. */
export async function getViewerCategories(): Promise<CategoryWithCount[]> {
  const [cats, entries] = await Promise.all([fetchCategories(), fetchEntries()]);
  const counts = new Map<string, number>();
  for (const e of entries) counts.set(e.category_id, (counts.get(e.category_id) ?? 0) + 1);
  return cats
    .sort(bySort)
    .map((c) => ({ ...toCategory(c), count: counts.get(c.id) ?? 0 }));
}

export async function getCategoryBySlug(slug: string): Promise<PersonalCategory | null> {
  const c = (await fetchCategories()).find((x) => x.slug === slug);
  return c ? toCategory(c) : null;
}

/** A normal category's direct entries (those not inside a group). */
export async function getCategoryEntries(slug: string): Promise<PersonalEntry[]> {
  const c = (await fetchCategories()).find((x) => x.slug === slug);
  if (!c) return [];
  const entries = await fetchEntries(c.id);
  return entries.filter((e) => !e.group_id).sort(byRecency).map(toEntry);
}

/** Travel places (entries of the `special = 'travel'` category). */
export async function getTravelPlaces(): Promise<TravelPlace[]> {
  const c = (await fetchCategories()).find((x) => x.special === "travel");
  if (!c) return [];
  return (await fetchEntries(c.id)).sort(byRecency).map(toTravel);
}

/** Assemble the full group tree of the `special = 'watch'` category. */
async function buildWatchGroups(): Promise<WatchGroup[]> {
  const c = (await fetchCategories()).find((x) => x.special === "watch");
  if (!c) return [];
  const [groups, entries] = await Promise.all([fetchGroups(c.id), fetchEntries(c.id)]);

  const titlesFor = (groupId: string): WatchTitle[] =>
    entries.filter((e) => e.group_id === groupId).sort(byRecency).map(toTitle);
  const childrenOf = (parentId: string) =>
    groups.filter((g) => g.parent_id === parentId).sort(bySort);

  return groups
    .filter((g) => !g.parent_id)
    .sort(bySort)
    .map((top) => {
      const kids = childrenOf(top.id);
      const subgroups: WatchGroup[] = kids
        .filter((k) => k.display !== "card")
        .map((k) => ({ id: k.slug, label: k.label, emoji: k.emoji ?? "🎬", titles: titlesFor(k.id) }));
      const collections: WatchCollection[] = kids
        .filter((k) => k.display === "card")
        .map((k) => ({
          id: k.slug,
          title: k.label,
          emoji: k.emoji ?? "🎬",
          note: k.note ?? undefined,
          titles: titlesFor(k.id),
        }));
      return {
        id: top.slug,
        label: top.label,
        emoji: top.emoji ?? "🎬",
        titles: titlesFor(top.id),
        subgroups: subgroups.length ? subgroups : undefined,
        collections: collections.length ? collections : undefined,
      };
    });
}

/** Dramas landing: the top-level group placecards. */
export const getWatchGroups = buildWatchGroups;

/** A single Dramas group (by slug) with its full content. */
export async function getWatchGroupBySlug(slug: string): Promise<WatchGroup | null> {
  return (await buildWatchGroups()).find((g) => g.id === slug) ?? null;
}

/** A collection (a `display = 'card'` group) with its titles, by slug. */
export async function getWatchCollectionBySlug(
  slug: string,
): Promise<WatchCollection | null> {
  for (const g of await buildWatchGroups()) {
    const found = g.collections?.find((c) => c.id === slug);
    if (found) return found;
  }
  return null;
}

// ── Editor (admin) reads — always fresh, never cached ───────────────
async function apiGetFresh<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export const getAdminCategories = async (): Promise<ApiCategory[]> =>
  ((await apiGetFresh<ApiCategory[]>("/categories")) ?? []).sort(bySort);

export const getAdminCategoryBySlug = async (
  slug: string,
): Promise<ApiCategory | null> =>
  (await getAdminCategories()).find((c) => c.slug === slug) ?? null;

export const getAdminGroups = async (categoryId: string): Promise<ApiGroup[]> =>
  ((await apiGetFresh<ApiGroup[]>(`/groups?category_id=${categoryId}`)) ?? []).sort(bySort);

export const getAdminEntries = async (categoryId: string): Promise<ApiEntry[]> =>
  ((await apiGetFresh<ApiEntry[]>(`/entries?category_id=${categoryId}`)) ?? []).sort(byRecency);
