/**
 * Pre-warm the personal-side backend (A3).
 *
 * The content API runs on a free tier that spins down after idle, so the
 * first request pays a long cold-start. The moment a visitor signals intent
 * to enter the personal side (clicks the secret photo, or lands on the
 * gateway), we fire a throw-away ping so the container/DB start booting while
 * they read the "are you sure?" screen — overlapping the wait instead of
 * paying it after they click "Enter".
 *
 * Fire-and-forget: `no-cors` avoids CORS noise (we never read the response),
 * `keepalive` lets it survive the navigation, and a short throttle prevents
 * spamming if several triggers fire close together.
 */
let lastPing = 0;

export function prewarmPersonalApi(): void {
  if (typeof window === "undefined") return;
  const now = Date.now();
  if (now - lastPing < 60_000) return; // at most once a minute
  lastPing = now;

  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (!base) return;

  try {
    void fetch(`${base}/health`, {
      mode: "no-cors",
      cache: "no-store",
      keepalive: true,
    }).catch(() => {
      // Ignore — this is a best-effort warm-up, not a real request.
    });
  } catch {
    // Ignore — never let a warm-up attempt break the UI.
  }
}
