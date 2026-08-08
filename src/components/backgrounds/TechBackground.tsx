"use client";

import { useRef, type CSSProperties } from "react";
import { ParticleField } from "./ParticleField";
import { BioForest } from "./BioForest";
import { useParallax } from "./useParallax";

const depth = (n: number): CSSProperties =>
  ({ "--depth": n } as CSSProperties);

/**
 * Technical scene — an ancient bioluminescent forest at night (inspired by
 * background-inspo, in the spirit of Pandora but wholly original). Massive
 * dark trunks frame the edges and fade into blackness; luminous vines cascade
 * with cyan/violet light droplets; spores rise and floor flora glows in the
 * corners. A restrained navy → indigo → cyan palette (no pink), with layered
 * fog for depth. The center-left is kept dark as negative space so long-form
 * professional content stays readable. Fixed behind every portfolio page.
 */
export function TechBackground() {
  const ref = useRef<HTMLDivElement>(null);
  useParallax(ref);

  return (
    <div ref={ref} className="scene scene--tech fixed inset-0" aria-hidden="true">
      <div className="scene--tech__base" />
      {/* Ambient glow blooms — pushed to the right side and corners. */}
      <div className="scene__layer scene__bloom scene--tech__b1" style={depth(9)} />
      <div className="scene__layer scene__bloom scene--tech__b2" style={depth(6)} />
      <div className="scene__layer scene__bloom scene--tech__b3" style={depth(11)} />
      {/* Massive ancient trunks framing the edges, dissolving into darkness. */}
      <div
        className="scene__layer scene--tech__trunk scene--tech__trunk--l"
        style={depth(14)}
      />
      <div
        className="scene__layer scene--tech__trunk scene--tech__trunk--r"
        style={depth(16)}
      />
      <BioForest />
      {/* Atmospheric fog banding the mid-ground for depth. */}
      <div className="scene--tech__mist" />
      <ParticleField
        mode="rise"
        colors={["#5eead4", "#a78bfa", "#67e8f9"]}
        density={0.6}
      />
      {/* Bioluminescent flowers / mushrooms glowing along the floor corners. */}
      <div className="scene--tech__flora" />
      <div className="scene--tech__floor" />
      {/* Center-left darkening so white text stays highly legible. */}
      <div className="scene--tech__readzone" />
      <div className="scene--tech__vignette" />
      <div className="scene__grain" />
    </div>
  );
}
