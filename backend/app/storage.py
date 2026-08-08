"""
Image storage behind a small interface so the provider is swappable via
one env var (STORAGE_PROVIDER). Images are never stored in the backend
itself — only the returned public URL is persisted in the database.
"""

import uuid
from abc import ABC, abstractmethod

import httpx
from fastapi import HTTPException

from .config import get_settings


class StorageProvider(ABC):
    @abstractmethod
    def upload(self, data: bytes, filename: str, content_type: str) -> str:
        """Upload bytes and return a public URL."""


class CloudinaryStorage(StorageProvider):
    def upload(self, data: bytes, filename: str, content_type: str) -> str:
        import cloudinary
        import cloudinary.uploader

        s = get_settings()
        if not (s.cloudinary_cloud_name and s.cloudinary_api_key and s.cloudinary_api_secret):
            raise HTTPException(503, "Cloudinary credentials are not configured.")

        cloudinary.config(
            cloud_name=s.cloudinary_cloud_name,
            api_key=s.cloudinary_api_key,
            api_secret=s.cloudinary_api_secret,
            secure=True,
        )
        result = cloudinary.uploader.upload(
            data,
            folder="personal",
            resource_type="image",
            # Auto-optimise: right format + quality, capped dimensions.
            transformation=[{"width": 1600, "height": 1600, "crop": "limit"}],
            fetch_format="auto",
            quality="auto",
        )
        return str(result["secure_url"])


class SupabaseStorage(StorageProvider):
    def upload(self, data: bytes, filename: str, content_type: str) -> str:
        s = get_settings()
        if not (s.supabase_url and s.supabase_service_key):
            raise HTTPException(503, "Supabase storage credentials are not configured.")

        key = f"{uuid.uuid4().hex}-{filename}"
        base = s.supabase_url.rstrip("/")
        endpoint = f"{base}/storage/v1/object/{s.supabase_bucket}/{key}"
        resp = httpx.post(
            endpoint,
            content=data,
            headers={
                "Authorization": f"Bearer {s.supabase_service_key}",
                "Content-Type": content_type or "application/octet-stream",
            },
            timeout=30,
        )
        if resp.status_code >= 400:
            raise HTTPException(502, f"Supabase upload failed: {resp.text}")
        return f"{base}/storage/v1/object/public/{s.supabase_bucket}/{key}"


def get_storage() -> StorageProvider:
    provider = get_settings().storage_provider.lower()
    if provider == "cloudinary":
        return CloudinaryStorage()
    if provider == "supabase":
        return SupabaseStorage()
    raise HTTPException(500, f"Unknown STORAGE_PROVIDER: {provider}")
