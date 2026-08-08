import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/lib/auth";

const API =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000";

/** Authenticated multipart image upload → FastAPI /uploads/image. */
export async function POST(req: NextRequest) {
  const token = await getToken();
  const form = await req.formData();

  const res = await fetch(`${API}/uploads/image`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
    cache: "no-store",
  }).catch(() => null);

  if (!res) {
    return NextResponse.json({ error: "Backend unreachable" }, { status: 502 });
  }

  const data = await res.text();
  return new NextResponse(data || null, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("Content-Type") ?? "application/json" },
  });
}
