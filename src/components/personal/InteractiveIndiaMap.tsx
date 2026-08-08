"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { TravelPlace } from "@/content/personal";

/**
 * Interactive travel map. The base is a clean India SILHOUETTE
 * (public/india-silhouette.png — derived from the states map, rendered as
 * a CSS mask over a theme-accent fill, so no colours). Markers are placed
 * by each place's normalized x/y; a place's dialog opens only when its
 * marker is clicked, and closes on any click elsewhere.
 */
export function InteractiveIndiaMap({ places }: { places: TravelPlace[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = places.find((p) => p.id === selectedId) ?? null;

  // Close the dialog when clicking anywhere that isn't a marker or dialog.
  useEffect(() => {
    if (!selectedId) return;
    function onDown(e: PointerEvent) {
      const target = e.target as Element | null;
      if (target?.closest("[data-marker],[data-dialog]")) return;
      setSelectedId(null);
    }
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [selectedId]);

  return (
    <div className="relative mx-auto max-w-md">
      <div
        aria-hidden="true"
        className="w-full select-none"
        style={{
          aspectRatio: "590 / 700",
          opacity: 0.85,
          background: "linear-gradient(155deg, var(--accent), var(--aurora-1))",
          WebkitMaskImage: "url(/india-silhouette.png)",
          maskImage: "url(/india-silhouette.png)",
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
        }}
      />

      {/* Markers */}
      {places.map((p) => {
        const active = selectedId === p.id;
        return (
          <button
            key={p.id}
            type="button"
            data-marker
            onClick={() => setSelectedId(p.id)}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            className="group absolute -translate-x-1/2 -translate-y-1/2 focus-visible:outline-none"
            aria-label={p.place}
            aria-pressed={active}
          >
            {active ? (
              <span className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-accent/50" />
            ) : null}
            <span
              className={`relative block rounded-full ring-2 ring-background shadow transition-all ${
                active
                  ? "h-4 w-4 bg-accent"
                  : "h-3 w-3 bg-accent/80 group-hover:scale-125 group-hover:bg-accent"
              }`}
            />
            {!active ? (
              <span className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-surface px-2 py-0.5 text-xs text-foreground opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                {p.place}
              </span>
            ) : null}
          </button>
        );
      })}

      {/* Dialog — opens on marker click, closes on outside click */}
      {selected ? <PlaceDialog place={selected} onClose={() => setSelectedId(null)} /> : null}
    </div>
  );
}

function PlaceDialog({
  place,
  onClose,
}: {
  place: TravelPlace;
  onClose: () => void;
}) {
  const tx = place.x < 25 ? "-10%" : place.x > 75 ? "-90%" : "-50%";
  const below = place.y < 45;
  const ty = below ? "18px" : "calc(-100% - 18px)";

  return (
    <div
      data-dialog
      role="dialog"
      style={{ left: `${place.x}%`, top: `${place.y}%`, transform: `translate(${tx}, ${ty})` }}
      className="absolute z-20 w-60 rounded-2xl border border-border-strong bg-surface p-4 shadow-2xl shadow-black/40"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-2 top-2 text-foreground-subtle transition-colors hover:text-foreground"
      >
        ✕
      </button>

      <h3 className="pr-5 font-serif text-xl text-foreground">{place.place}</h3>
      {place.region ? (
        <p className="mt-0.5 text-sm text-accent">{place.region}</p>
      ) : null}
      {place.date ? (
        <p className="mt-1 font-mono text-xs text-foreground-subtle">
          {place.date}
        </p>
      ) : null}
      {place.note ? (
        <p className="mt-2 text-pretty text-sm leading-relaxed text-foreground-muted">
          {place.note}
        </p>
      ) : null}

      {place.photos && place.photos.length ? (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {place.photos.map((src) => (
            <div
              key={src}
              className="relative aspect-square overflow-hidden rounded-lg border border-border bg-background-elevated"
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="120px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-xs text-foreground-subtle">
          No photos yet — add memories from the editor.
        </p>
      )}
    </div>
  );
}
