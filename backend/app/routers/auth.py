from fastapi import APIRouter, HTTPException, status

from ..config import get_settings
from ..schemas import LoginRequest, TokenResponse
from ..security import create_access_token, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest) -> TokenResponse:
    """
    Single-admin login. The password is compared against a bcrypt hash
    held in an env var — the plaintext is never stored anywhere.
    """
    settings = get_settings()

    if not settings.admin_password_hash:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="ADMIN_PASSWORD_HASH is not configured on the server.",
        )

    valid = payload.username == settings.admin_username and verify_password(
        payload.password, settings.admin_password_hash
    )
    if not valid:
        # Same message for bad user or bad password — don't leak which.
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )

    return TokenResponse(access_token=create_access_token(payload.username))
