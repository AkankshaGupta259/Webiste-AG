import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { TOKEN_COOKIE } from "@/lib/auth";

const API =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000";

/**
 * Exchange the admin password for a JWT (via the FastAPI backend) and
 * store it in an httpOnly cookie. The token is never exposed to the
 * browser's JavaScript.
 */
export async function POST(req: Request) {
  const { username, password } = await req.json().catch(() => ({}));

  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: username || "admin", password: password ?? "" }),
    cache: "no-store",
  }).catch(() => null);

  if (!res || !res.ok) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const data = await res.json();
  const store = await cookies();
  store.set(TOKEN_COOKIE, data.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return NextResponse.json({ ok: true });
}
