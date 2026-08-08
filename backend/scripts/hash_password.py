"""
Generate a bcrypt hash for the admin password, to paste into .env as
ADMIN_PASSWORD_HASH. The plaintext never leaves your machine.

Usage:
    python scripts/hash_password.py
    (you'll be prompted; input is hidden)
"""

import getpass
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.security import hash_password  # noqa: E402


def main() -> None:
    pw = getpass.getpass("New admin password: ")
    confirm = getpass.getpass("Confirm password: ")
    if pw != confirm:
        print("Passwords do not match.")
        raise SystemExit(1)
    if len(pw) < 8:
        print("Please use at least 8 characters.")
        raise SystemExit(1)
    print("\nAdd this line to backend/.env :\n")
    print(f"ADMIN_PASSWORD_HASH={hash_password(pw)}")


if __name__ == "__main__":
    main()
