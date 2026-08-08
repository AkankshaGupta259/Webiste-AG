"""
Content API.

Convention: GET endpoints are PUBLIC (the viewer reads them without
credentials); every write is guarded by `require_admin`.
"""

import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from ..db import get_db
from ..models import Category, Entry, EntryPhoto, Group
from ..schemas import (
    CategoryCreate,
    CategoryOut,
    CategoryUpdate,
    EntryCreate,
    EntryOut,
    EntryUpdate,
    GroupCreate,
    GroupOut,
    GroupUpdate,
    PhotoCreate,
    PhotoOut,
)
from ..security import require_admin

router = APIRouter(tags=["content"])


def _get_or_404(db: Session, model, obj_id: uuid.UUID):
    obj = db.get(model, obj_id)
    if obj is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"{model.__name__} not found"
        )
    return obj


def _apply(obj, payload) -> None:
    """Apply only the fields the client actually sent (PATCH semantics)."""
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(obj, field, value)


# ── Categories ──────────────────────────────────────────────────────
@router.get("/categories", response_model=list[CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    stmt = select(Category).order_by(Category.sort_order, Category.label)
    return db.scalars(stmt).all()


@router.post("/categories", response_model=CategoryOut, status_code=201)
def create_category(
    payload: CategoryCreate, _: str = Depends(require_admin), db: Session = Depends(get_db)
):
    category = Category(**payload.model_dump())
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


@router.patch("/categories/{category_id}", response_model=CategoryOut)
def update_category(
    category_id: uuid.UUID,
    payload: CategoryUpdate,
    _: str = Depends(require_admin),
    db: Session = Depends(get_db),
):
    category = _get_or_404(db, Category, category_id)
    _apply(category, payload)
    db.commit()
    db.refresh(category)
    return category


@router.delete("/categories/{category_id}", status_code=204)
def delete_category(
    category_id: uuid.UUID, _: str = Depends(require_admin), db: Session = Depends(get_db)
):
    db.delete(_get_or_404(db, Category, category_id))
    db.commit()


# ── Groups ──────────────────────────────────────────────────────────
@router.get("/groups", response_model=list[GroupOut])
def list_groups(
    category_id: uuid.UUID | None = Query(default=None),
    db: Session = Depends(get_db),
):
    stmt = select(Group).order_by(Group.sort_order, Group.label)
    if category_id:
        stmt = stmt.where(Group.category_id == category_id)
    return db.scalars(stmt).all()


@router.post("/groups", response_model=GroupOut, status_code=201)
def create_group(
    payload: GroupCreate, _: str = Depends(require_admin), db: Session = Depends(get_db)
):
    group = Group(**payload.model_dump())
    db.add(group)
    db.commit()
    db.refresh(group)
    return group


@router.patch("/groups/{group_id}", response_model=GroupOut)
def update_group(
    group_id: uuid.UUID,
    payload: GroupUpdate,
    _: str = Depends(require_admin),
    db: Session = Depends(get_db),
):
    group = _get_or_404(db, Group, group_id)
    _apply(group, payload)
    db.commit()
    db.refresh(group)
    return group


@router.delete("/groups/{group_id}", status_code=204)
def delete_group(
    group_id: uuid.UUID, _: str = Depends(require_admin), db: Session = Depends(get_db)
):
    db.delete(_get_or_404(db, Group, group_id))
    db.commit()


# ── Entries ─────────────────────────────────────────────────────────
@router.get("/entries", response_model=list[EntryOut])
def list_entries(
    category_id: uuid.UUID | None = Query(default=None),
    group_id: uuid.UUID | None = Query(default=None),
    q: str | None = Query(default=None, description="Search in title"),
    db: Session = Depends(get_db),
):
    stmt = (
        select(Entry)
        .options(selectinload(Entry.photos))
        .order_by(Entry.sort_order, Entry.year, Entry.title)
    )
    if category_id:
        stmt = stmt.where(Entry.category_id == category_id)
    if group_id:
        stmt = stmt.where(Entry.group_id == group_id)
    if q:
        stmt = stmt.where(Entry.title.ilike(f"%{q}%"))
    return db.scalars(stmt).all()


@router.get("/entries/{entry_id}", response_model=EntryOut)
def get_entry(entry_id: uuid.UUID, db: Session = Depends(get_db)):
    return _get_or_404(db, Entry, entry_id)


@router.post("/entries", response_model=EntryOut, status_code=201)
def create_entry(
    payload: EntryCreate, _: str = Depends(require_admin), db: Session = Depends(get_db)
):
    entry = Entry(**payload.model_dump())
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@router.patch("/entries/{entry_id}", response_model=EntryOut)
def update_entry(
    entry_id: uuid.UUID,
    payload: EntryUpdate,
    _: str = Depends(require_admin),
    db: Session = Depends(get_db),
):
    entry = _get_or_404(db, Entry, entry_id)
    _apply(entry, payload)
    db.commit()
    db.refresh(entry)
    return entry


@router.delete("/entries/{entry_id}", status_code=204)
def delete_entry(
    entry_id: uuid.UUID, _: str = Depends(require_admin), db: Session = Depends(get_db)
):
    db.delete(_get_or_404(db, Entry, entry_id))
    db.commit()


# ── Entry photos ────────────────────────────────────────────────────
@router.post("/entries/{entry_id}/photos", response_model=PhotoOut, status_code=201)
def add_photo(
    entry_id: uuid.UUID,
    payload: PhotoCreate,
    _: str = Depends(require_admin),
    db: Session = Depends(get_db),
):
    _get_or_404(db, Entry, entry_id)
    photo = EntryPhoto(entry_id=entry_id, **payload.model_dump())
    db.add(photo)
    db.commit()
    db.refresh(photo)
    return photo


@router.delete("/photos/{photo_id}", status_code=204)
def delete_photo(
    photo_id: uuid.UUID, _: str = Depends(require_admin), db: Session = Depends(get_db)
):
    db.delete(_get_or_404(db, EntryPhoto, photo_id))
    db.commit()
