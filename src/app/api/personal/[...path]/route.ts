import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getToken } from "@/lib/auth";

const API =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000";

/**
 * Authenticated proxy to the FastAPI content API. Attaches the admin JWT
 * from the httpOnly cookie so the token never touches the browser, and
 * revalidates the `personal` cache tag after any successful write so the
 * public viewer reflects the change immediately.
 */
async function handle(req: NextRequest, path: string[]) {
  const token = await getToken();
  const url = `${API}/${path.join("/")}${req.nextUrl.search}`;

  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let body: string | undefined;
  if (req.method !== "GET" && req.method !== "DELETE") {
    const text = await req.text();
    if (text) {
      headers["Content-Type"] = "application/json";
      body = text;
    }
  }

  const res = await fetch(url, {
    method: req.method,
    headers,
    body,
    cache: "no-store",
  }).catch(() => null);

  if (!res) {
    return NextResponse.json({ error: "Backend unreachable" }, { status: 502 });
  }

  if (res.ok && req.method !== "GET") {
    // Next 16: revalidateTag requires a cacheLife profile. The admin sees
    // changes immediately via router.refresh() (fresh, no-store reads);
    // the public viewer refreshes stale-while-revalidate.
    revalidateTag("personal", "max");
  }

  const data = await res.text();
  return new NextResponse(data || null, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("Content-Type") ?? "application/json" },
  });
}

type Ctx = { params: Promise<{ path: string[] }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  return handle(req, (await ctx.params).path);
}
export async function POST(req: NextRequest, ctx: Ctx) {
  return handle(req, (await ctx.params).path);
}
export async function PATCH(req: NextRequest, ctx: Ctx) {
  return handle(req, (await ctx.params).path);
}
export async function DELETE(req: NextRequest, ctx: Ctx) {
  return handle(req, (await ctx.params).path);
}
