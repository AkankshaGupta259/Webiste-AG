from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from ..schemas import UploadResponse
from ..security import require_admin
from ..storage import get_storage

router = APIRouter(prefix="/uploads", tags=["uploads"])

MAX_BYTES = 10 * 1024 * 1024  # 10 MB
ALLOWED = {"image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"}


@router.post("/image", response_model=UploadResponse)
async def upload_image(
    file: UploadFile = File(...), _: str = Depends(require_admin)
) -> UploadResponse:
    """Admin-only. Stores the image externally and returns its public URL."""
    if file.content_type not in ALLOWED:
        raise HTTPException(400, f"Unsupported image type: {file.content_type}")

    data = await file.read()
    if len(data) > MAX_BYTES:
        raise HTTPException(413, "Image exceeds the 10 MB limit.")

    url = get_storage().upload(data, file.filename or "upload", file.content_type or "")
    return UploadResponse(url=url)
