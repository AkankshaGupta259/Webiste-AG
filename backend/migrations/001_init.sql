-- ============================================================
--  Personal-side schema (run once against your Supabase Postgres)
--
--  Design notes:
--   * `groups` is SELF-REFERENCING: a "subgroup" (Hollywood) and a
--     "collection" (MCU) are the same thing structurally — a group
--     nested in a group. They differ only in presentation, captured
--     by `display` ('inline' renders in place, 'card' drills in).
--   * `entries` hangs off a category directly (anime, books, wishlist)
--     OR off a group (K-Drama titles, MCU films) — one table for all
--     list content, including travel places (region/map_x/map_y).
--   * Categories live here (not in code) so new ones can be added
--     from the editor without a deploy.
-- ============================================================

create table if not exists categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  label       text not null,
  emoji       text,
  description text,
  special     text,                       -- null | 'travel' | 'watch'
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists groups (
  id          uuid primary key default gen_random_uuid(),
  category_id uuid not null references categories(id) on delete cascade,
  parent_id   uuid references groups(id) on delete cascade,
  slug        text not null,
  label       text not null,
  emoji       text,
  note        text,
  display     text not null default 'inline',   -- 'inline' | 'card'
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now(),
  unique (category_id, slug)
);

create table if not exists entries (
  id          uuid primary key default gen_random_uuid(),
  category_id uuid not null references categories(id) on delete cascade,
  group_id    uuid references groups(id) on delete cascade,
  title       text not null,
  year        int,
  note        text,
  body        text,
  status      text,
  rating      int check (rating between 0 and 5),
  image_url   text,
  entry_date  date,
  -- travel-specific (null for everything else)
  region      text,
  map_x       numeric(5,2),
  map_y       numeric(5,2),
  tags        text[],
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists entry_photos (
  id         uuid primary key default gen_random_uuid(),
  entry_id   uuid not null references entries(id) on delete cascade,
  url        text not null,
  caption    text,
  sort_order int  not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_groups_category  on groups(category_id);
create index if not exists idx_groups_parent    on groups(parent_id);
create index if not exists idx_entries_category on entries(category_id);
create index if not exists idx_entries_group    on entries(group_id);
create index if not exists idx_photos_entry     on entry_photos(entry_id);
