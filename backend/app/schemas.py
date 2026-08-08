import uuid
from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


# ── Auth ────────────────────────────────────────────────────────────
class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ── Photos ──────────────────────────────────────────────────────────
class PhotoCreate(BaseModel):
    url: str
    caption: str | None = None
    sort_order: int = 0


class PhotoOut(ORMModel):
    id: uuid.UUID
    url: str
    caption: str | None = None
    sort_order: int = 0


# ── Entries ─────────────────────────────────────────────────────────
class EntryBase(BaseModel):
    title: str
    year: int | None = None
    note: str | None = None
    body: str | None = None
    status: str | None = None
    rating: int | None = Field(default=None, ge=0, le=5)
    image_url: str | None = None
    entry_date: date | None = None
    region: str | None = None
    map_x: float | None = None
    map_y: float | None = None
    tags: list[str] | None = None
    sort_order: int = 0


class EntryCreate(EntryBase):
    category_id: uuid.UUID
    group_id: uuid.UUID | None = None


class EntryUpdate(BaseModel):
    """All fields optional — PATCH semantics."""

    title: str | None = None
    year: int | None = None
    note: str | None = None
    body: str | None = None
    status: str | None = None
    rating: int | None = Field(default=None, ge=0, le=5)
    image_url: str | None = None
    entry_date: date | None = None
    region: str | None = None
    map_x: float | None = None
    map_y: float | None = None
    tags: list[str] | None = None
    sort_order: int | None = None
    group_id: uuid.UUID | None = None


class EntryOut(EntryBase, ORMModel):
    id: uuid.UUID
    category_id: uuid.UUID
    group_id: uuid.UUID | None = None
    created_at: datetime
    photos: list[PhotoOut] = []


# ── Groups ──────────────────────────────────────────────────────────
class GroupBase(BaseModel):
    slug: str
    label: str
    emoji: str | None = None
    note: str | None = None
    display: str = "inline"          # 'inline' | 'card'
    sort_order: int = 0


class GroupCreate(GroupBase):
    category_id: uuid.UUID
    parent_id: uuid.UUID | None = None


class GroupUpdate(BaseModel):
    slug: str | None = None
    label: str | None = None
    emoji: str | None = None
    note: str | None = None
    display: str | None = None
    sort_order: int | None = None
    parent_id: uuid.UUID | None = None


class GroupOut(GroupBase, ORMModel):
    id: uuid.UUID
    category_id: uuid.UUID
    parent_id: uuid.UUID | None = None


# ── Categories ──────────────────────────────────────────────────────
class CategoryBase(BaseModel):
    slug: str
    label: str
    emoji: str | None = None
    description: str | None = None
    special: str | None = None       # null | 'travel' | 'watch'
    sort_order: int = 0


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    slug: str | None = None
    label: str | None = None
    emoji: str | None = None
    description: str | None = None
    special: str | None = None
    sort_order: int | None = None


class CategoryOut(CategoryBase, ORMModel):
    id: uuid.UUID


# ── Uploads ─────────────────────────────────────────────────────────
class UploadResponse(BaseModel):
    url: str
