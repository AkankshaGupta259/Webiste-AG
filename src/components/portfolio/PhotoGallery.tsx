"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

/**
 * A grid of activity photos that expand into a full-screen lightbox on click.
 * The lightbox closes on backdrop click, the ✕ button, or Escape, and (with
 * more than one photo) supports arrow-key / on-screen prev-next navigation.
 */
export function PhotoGallery({ photos }: { photos: string[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const open = index !== null;

  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (dir: number) =>
      setIndex((i) => (i === null ? i : (i + dir + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    }
    document.addEventListener("keydown", onKey);
    // Lock background scroll while the lightbox is open.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close, step]);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photos.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Open photo ${i + 1} of ${photos.length}`}
            className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-surface transition-all hover:border-border-strong active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="(max-width: 640px) 50vw, 240px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
        >
          {/* Backdrop — click anywhere to close. */}
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
          />

          {/* Image (letterboxed, aspect preserved); clicks pass through to close. */}
          <div className="pointer-events-none absolute inset-4 sm:inset-12">
            <Image
              key={photos[index]}
              src={photos[index]}
              alt=""
              fill
              sizes="95vw"
              className="object-contain"
              priority
            />
          </div>

          {/* Close */}
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-3 top-3 rounded-full bg-surface/70 p-2 text-foreground backdrop-blur-sm transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </button>

          {photos.length > 1 ? (
            <>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-surface/70 p-2.5 text-foreground backdrop-blur-sm transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                  <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-surface/70 p-2.5 text-foreground backdrop-blur-sm transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                  <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <span className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-surface/70 px-3 py-1 font-mono text-xs text-foreground backdrop-blur-sm">
                {index + 1} / {photos.length}
              </span>
            </>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
