# Personal API (backend)

FastAPI + SQLAlchemy backend for the hidden "personal" side of the
portfolio. Public `GET`s feed the viewer; JWT-protected writes power the
editor. Images go to external storage (Cloudinary or Supabase Storage);
only their URLs are stored in Postgres (Supabase).

## First-time setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate            # Windows (PowerShell: .venv\Scripts\Activate.ps1)
pip install -r requirements.txt

cp .env.example .env              # then fill it in (see below)
python scripts/hash_password.py   # -> paste output into .env as ADMIN_PASSWORD_HASH
python scripts/migrate.py         # create tables in Supabase
python scripts/seed.py            # optional: load the current sample content
```

### Filling in `.env`
- **DATABASE_URL** — Supabase → Project Settings → Database → Connection
  string (URI). Change the scheme to `postgresql+psycopg://`.
- **ADMIN_PASSWORD_HASH** — from `scripts/hash_password.py`.
- **JWT_SECRET** — `python -c "import secrets;print(secrets.token_urlsafe(48))"`.
- **Cloudinary** keys (recommended) or Supabase Storage keys.

## Run

```bash
uvicorn app.main:app --reload --port 8000
```

- Interactive docs: http://localhost:8000/docs
- Health check: http://localhost:8000/health

## API shape

| Method | Path | Auth |
|---|---|---|
| POST | `/auth/login` | — |
| GET | `/categories` `/groups` `/entries` `/entries/{id}` | public |
| POST/PATCH/DELETE | `/categories` `/groups` `/entries` `/…/photos` | admin |
| POST | `/uploads/image` | admin |

Nothing runs until `.env` is configured — the app still boots and serves
`/health` so you can verify it's alive first.
