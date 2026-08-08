from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    All configuration comes from environment variables (see .env.example).
    Secrets never live in code — the admin password is stored only as a
    bcrypt hash, and is never handled in plaintext by the app.
    """

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # --- Database (Supabase Postgres connection string) ---
    database_url: str = ""

    # --- Auth (single admin) ---
    admin_username: str = "admin"
    admin_password_hash: str = ""   # bcrypt hash, generate with scripts/hash_password.py
    jwt_secret: str = "change-me"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 12

    # --- CORS: the Next.js frontend origin(s), comma-separated ---
    cors_origins: str = "http://localhost:3000"

    # --- Image storage: "cloudinary" | "supabase" ---
    storage_provider: str = "cloudinary"

    cloudinary_cloud_name: str = ""
    cloudinary_api_key: str = ""
    cloudinary_api_secret: str = ""

    supabase_url: str = ""
    supabase_service_key: str = ""
    supabase_bucket: str = "personal"

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
