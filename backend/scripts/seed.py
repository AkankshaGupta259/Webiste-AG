"""
Seed the database with the current front-end sample content, so the DB
mirrors what the viewer already shows. Idempotent: it clears the personal
tables first, then re-inserts. Run after migrate.py:

    python scripts/seed.py
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.db import get_engine  # noqa: E402
from app.models import Base, Category, Entry, Group  # noqa: E402
from sqlalchemy.orm import Session  # noqa: E402


def seed(db: Session) -> None:
    # Clear (cascade handles groups/entries/photos)
    db.query(Category).delete()
    db.commit()

    def cat(slug, label, emoji, description, special=None, order=0) -> Category:
        c = Category(
            slug=slug, label=label, emoji=emoji, description=description,
            special=special, sort_order=order,
        )
        db.add(c)
        db.flush()
        return c

    def grp(category, slug, label, emoji, display="inline", parent=None, note=None, order=0) -> Group:
        g = Group(
            category_id=category.id, parent_id=parent.id if parent else None,
            slug=slug, label=label, emoji=emoji, display=display, note=note, sort_order=order,
        )
        db.add(g)
        db.flush()
        return g

    def entry(category, title, *, group=None, year=None, note=None, status=None,
              rating=None, region=None, map_x=None, map_y=None, order=0) -> Entry:
        e = Entry(
            category_id=category.id, group_id=group.id if group else None,
            title=title, year=year, note=note, status=status, rating=rating,
            region=region, map_x=map_x, map_y=map_y, sort_order=order,
        )
        db.add(e)
        return e

    # ── Categories ──────────────────────────────────────────────
    anime = cat("anime", "Anime", "🌸", "Series I've fallen for.", order=0)
    dramas = cat("dramas", "Dramas", "🎭", "K-dramas, C-dramas, movies & series.", "watch", 1)
    novels = cat("novels", "Novels", "📖", "Stories that stayed with me.", order=2)
    books = cat("books", "Books", "📚", "Everything else I've read.", order=3)
    travel = cat("travel", "Travel", "🗺️", "Places I've wandered.", "travel", 4)
    wishlist = cat("wishlist", "Wishlist", "✨", "Dreams for someday.", order=5)

    # ── Anime ───────────────────────────────────────────────────
    for i, (t, y) in enumerate([
        ("Jujutsu Kaisen", 2020), ("Horimiya", 2021), ("Link Click", 2021),
        ("Spy × Family", 2022), ("Lord of Mysteries", 2025),
    ]):
        entry(anime, t, year=y, order=i)

    # ── Dramas: groups ──────────────────────────────────────────
    kdrama = grp(dramas, "kdrama", "K-Drama", "🎭", order=0)
    cdrama = grp(dramas, "cdrama", "C-Drama", "🏮", order=1)
    movies = grp(dramas, "movies", "Movies", "🎬", order=2)
    series = grp(dramas, "series", "Series", "📺", order=3)
    hollywood = grp(dramas, "hollywood", "Hollywood", "🎬", parent=movies, order=0)
    bollywood = grp(dramas, "bollywood", "Bollywood", "🎬", parent=movies, order=1)
    animated = grp(dramas, "animated", "Animated", "🐉", parent=movies, order=2)
    mcu = grp(dramas, "mcu", "Marvel Cinematic Universe", "🦸", display="card",
              parent=series, note="The Iron Man trilogy and the Avengers saga.", order=0)

    for i, (t, y) in enumerate([
        ("Goblin (Guardian: The Lonely and Great God)", 2016), ("He Is Psychometric", 2019),
        ("Extraordinary You", 2019), ("The King: Eternal Monarch", 2020),
    ]):
        entry(dramas, t, group=kdrama, year=y, order=i)
    for i, (t, y) in enumerate([
        ("Love O2O", 2016), ("Legend of Yunxi", 2018), ("Prisoner of Beauty", 2025), ("How Dare You", None),
    ]):
        entry(dramas, t, group=cdrama, year=y, order=i)
    for i, (t, y) in enumerate([("Rush Hour", 1998), ("Rush Hour 2", 2001), ("Rush Hour 3", 2007)]):
        entry(dramas, t, group=hollywood, year=y, order=i)
    for i, (t, y) in enumerate([("Dangal", 2016), ("Padmaavat", 2018), ("Chhichhore", 2019)]):
        entry(dramas, t, group=bollywood, year=y, order=i)
    for i, (t, y) in enumerate([
        ("How to Train Your Dragon", 2010), ("How to Train Your Dragon 2", 2014),
        ("How to Train Your Dragon: The Hidden World", 2019), ("Elemental", 2023),
    ]):
        entry(dramas, t, group=animated, year=y, order=i)
    for i, (t, y) in enumerate([
        ("Iron Man", 2008), ("Iron Man 2", 2010), ("Iron Man 3", 2013), ("The Avengers", 2012),
        ("Avengers: Age of Ultron", 2015), ("Avengers: Infinity War", 2018), ("Avengers: Endgame", 2019),
    ]):
        entry(dramas, t, group=mcu, year=y, order=i)

    # ── Novels / Books / Wishlist (samples) ─────────────────────
    entry(novels, "Norwegian Wood", year=1987, note="Sample entry.", rating=4, status="Read")
    entry(books, "Atomic Habits", year=2018, note="Sample entry.", rating=4, status="Read")
    entry(wishlist, "See the cherry blossoms in Japan", note="Someday ✨", order=0)
    entry(wishlist, "Learn to play the piano", note="On the list.", order=1)

    # ── Travel (places with map coords) ─────────────────────────
    entry(travel, "Imphal", region="Manipur", note="Where IIIT Manipur is.", map_x=87, map_y=41, order=0)
    entry(travel, "Dehradun", region="Uttarakhand", note="Home town.", map_x=37, map_y=24, order=1)
    entry(travel, "Bengaluru", region="Karnataka", note="Sample entry.", map_x=37, map_y=76, order=2)

    db.commit()
    print("Seeded:",
          db.query(Category).count(), "categories,",
          db.query(Group).count(), "groups,",
          db.query(Entry).count(), "entries.")


def main() -> None:
    engine = get_engine()
    Base.metadata.create_all(engine)  # safety net if migrate.py wasn't run
    with Session(engine) as db:
        seed(db)


if __name__ == "__main__":
    main()
