from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from .config import get_settings

_engine = None
_SessionLocal: sessionmaker[Session] | None = None


def get_engine():
    """
    Lazily create the engine so the app can boot (and serve /health)
    before DATABASE_URL is configured — useful while setting up.
    """
    global _engine, _SessionLocal
    if _engine is None:
        settings = get_settings()
        if not settings.database_url:
            raise RuntimeError(
                "DATABASE_URL is not set. Copy .env.example to .env and add "
                "your Supabase Postgres connection string."
            )
        _engine = create_engine(
            settings.database_url,
            pool_pre_ping=True,   # survive Supabase idling connections
            pool_size=5,
            max_overflow=5,
        )
        _SessionLocal = sessionmaker(bind=_engine, autoflush=False, expire_on_commit=False)
    return _engine


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency yielding a request-scoped session."""
    get_engine()
    assert _SessionLocal is not None
    db = _SessionLocal()
    try:
        yield db
    finally:
        db.close()
