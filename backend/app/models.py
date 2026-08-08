import uuid
from datetime import date, datetime

from sqlalchemy import (
    CheckConstraint,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import ARRAY, UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


def _pk() -> Mapped[uuid.UUID]:
    return mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)


class Category(Base):
    """A top-level personal collection (anime, dramas, travel, …)."""

    __tablename__ = "categories"

    id: Mapped[uuid.UUID] = _pk()
    slug: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    label: Mapped[str] = mapped_column(String, nullable=False)
    emoji: Mapped[str | None] = mapped_column(String)
    description: Mapped[str | None] = mapped_column(Text)
    # null | 'travel' | 'watch' — flags categories with a custom view
    special: Mapped[str | None] = mapped_column(String)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    groups: Mapped[list["Group"]] = relationship(
        back_populates="category", cascade="all, delete-orphan"
    )
    entries: Mapped[list["Entry"]] = relationship(
        back_populates="category", cascade="all, delete-orphan"
    )


class Group(Base):
    """
    A group inside a category. Self-referencing: a subgroup (Hollywood)
    and a collection (MCU) are the same structure, differing only in
    `display` ('inline' renders in place, 'card' drills into its own page).
    """

    __tablename__ = "groups"
    __table_args__ = (UniqueConstraint("category_id", "slug"),)

    id: Mapped[uuid.UUID] = _pk()
    category_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("categories.id", ondelete="CASCADE"), nullable=False
    )
    parent_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("groups.id", ondelete="CASCADE")
    )
    slug: Mapped[str] = mapped_column(String, nullable=False)
    label: Mapped[str] = mapped_column(String, nullable=False)
    emoji: Mapped[str | None] = mapped_column(String)
    note: Mapped[str | None] = mapped_column(Text)
    display: Mapped[str] = mapped_column(String, default="inline", nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    category: Mapped[Category] = relationship(back_populates="groups")
    children: Mapped[list["Group"]] = relationship(
        back_populates="parent", cascade="all, delete-orphan"
    )
    parent: Mapped["Group | None"] = relationship(back_populates="children", remote_side=[id])
    entries: Mapped[list["Entry"]] = relationship(back_populates="group")


class Entry(Base):
    """
    A single item. Belongs to a category, and optionally to a group.
    Travel places are entries that carry region/map_x/map_y.
    """

    __tablename__ = "entries"
    __table_args__ = (CheckConstraint("rating between 0 and 5", name="rating_range"),)

    id: Mapped[uuid.UUID] = _pk()
    category_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("categories.id", ondelete="CASCADE"), nullable=False
    )
    group_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("groups.id", ondelete="CASCADE")
    )
    title: Mapped[str] = mapped_column(String, nullable=False)
    year: Mapped[int | None] = mapped_column(Integer)
    note: Mapped[str | None] = mapped_column(Text)
    body: Mapped[str | None] = mapped_column(Text)
    status: Mapped[str | None] = mapped_column(String)
    rating: Mapped[int | None] = mapped_column(Integer)
    image_url: Mapped[str | None] = mapped_column(Text)
    entry_date: Mapped[date | None] = mapped_column(Date)

    # Travel-specific
    region: Mapped[str | None] = mapped_column(String)
    map_x: Mapped[float | None] = mapped_column(Numeric(5, 2))
    map_y: Mapped[float | None] = mapped_column(Numeric(5, 2))

    tags: Mapped[list[str] | None] = mapped_column(ARRAY(Text))
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    category: Mapped[Category] = relationship(back_populates="entries")
    group: Mapped[Group | None] = relationship(back_populates="entries")
    photos: Mapped[list["EntryPhoto"]] = relationship(
        back_populates="entry", cascade="all, delete-orphan", order_by="EntryPhoto.sort_order"
    )


class EntryPhoto(Base):
    """A photo attached to an entry (travel galleries, event photos)."""

    __tablename__ = "entry_photos"

    id: Mapped[uuid.UUID] = _pk()
    entry_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("entries.id", ondelete="CASCADE"), nullable=False
    )
    url: Mapped[str] = mapped_column(Text, nullable=False)
    caption: Mapped[str | None] = mapped_column(Text)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    entry: Mapped[Entry] = relationship(back_populates="photos")
