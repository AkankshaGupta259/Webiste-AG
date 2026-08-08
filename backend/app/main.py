from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .routers import auth, content, uploads

settings = get_settings()

app = FastAPI(
    title="Personal API",
    description="Backend for the personal (hidden) side of the portfolio.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(content.router)
app.include_router(uploads.router)


@app.get("/health", tags=["meta"])
def health() -> dict[str, str]:
    """
    Liveness probe. Also the endpoint a keep-alive cron can ping so the
    free-tier host (and Supabase project) never idles out.
    """
    return {"status": "ok"}
