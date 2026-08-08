"""
Apply SQL migrations in backend/migrations/ in filename order.
Run once your DATABASE_URL is set in backend/.env :

    python scripts/migrate.py
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from sqlalchemy import text  # noqa: E402

from app.db import get_engine  # noqa: E402

MIGRATIONS = Path(__file__).resolve().parents[1] / "migrations"


def main() -> None:
    engine = get_engine()
    files = sorted(MIGRATIONS.glob("*.sql"))
    if not files:
        print("No migration files found.")
        return
    with engine.begin() as conn:
        for f in files:
            print(f"Applying {f.name} ...")
            conn.execute(text(f.read_text(encoding="utf-8")))
    print("Done.")


if __name__ == "__main__":
    main()
