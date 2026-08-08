/**
 * AuroraBackground
 *
 * A soft, slow-drifting field of blurred colour used behind the
 * professional side. Intentionally a Server Component: it renders only
 * static markup, and every bit of motion/styling lives in globals.css
 * (`.aurora*`). That keeps it zero-JS, cheap, and easy to swap out.
 *
 * Motion is GPU-composited (transform-only) and fully disabled under
 * `prefers-reduced-motion`, where it degrades to a still composition.
 *
 * `className` lets callers tweak placement/opacity per-page without
 * touching the component.
 */
export function AuroraBackground({ className = "" }: { className?: string }) {
  return (
    <div className={`aurora ${className}`} aria-hidden="true">
      <div className="aurora__blob aurora__blob--1" />
      <div className="aurora__blob aurora__blob--2" />
      <div className="aurora__blob aurora__blob--3" />
      <div className="aurora__blob aurora__blob--4" />
      <div className="aurora__grain" />
      <div className="aurora__veil" />
    </div>
  );
}
