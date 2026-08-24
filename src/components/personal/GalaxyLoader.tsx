/**
 * The personal side's loading state — a slow galaxy that breathes while the
 * hidden universe streams in. Shown instantly on navigation via the route's
 * `loading.tsx` Suspense boundary, so a tap always gets immediate feedback.
 * Pure CSS (see `.galaxy` in globals.css); no client JS required.
 */
export function GalaxyLoader({
  label = "Opening Up",
}: {
  label?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[55vh] flex-col items-center justify-center gap-7"
    >
      <div className="galaxy" aria-hidden="true">
        <span className="galaxy__halo" />
        <span className="galaxy__arm" />
        <span className="galaxy__arm galaxy__arm--2" />
        <span className="galaxy__core" />
      </div>
      <p className="animate-pulse font-mono text-xs uppercase tracking-[0.3em] text-foreground-muted">
        {label}…
      </p>
    </div>
  );
}
