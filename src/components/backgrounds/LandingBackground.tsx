"use client";

import { useRef } from "react";
import { ParticleField } from "./ParticleField";
import { ProceduralForest } from "./ProceduralForest";
import { useParallax } from "./useParallax";

/**
 * Landing scene — a mystical winter-forest corridor at twilight (inspired by
 * bg-2). A snow-covered trail recedes in strong one-point perspective toward a
 * faint lavender vanishing point, flanked by symmetric rows of tall, slender,
 * leafless trees that parallax by depth. Deep midnight-blue → indigo → violet
 * throughout, with soft volumetric mist, drifting snow, and darkened flanks so
 * the hero text (and portrait) stay readable. Atmosphere over brightness.
 */
export function LandingBackground() {
  const ref = useRef<HTMLDivElement>(null);
  useParallax(ref);

  return (
    <div ref={ref} className="scene scene--landing" aria-hidden="true">
      {/* Sky + ground gradients and the faint moonlit vanishing point. */}
      <div className="scene--landing__sky" />
      <div className="scene--landing__glow" />
      {/* Soft moonlight rays fanning from the distance, behind the trees. */}
      <div className="scene--landing__rays" />
      {/* Snow-covered ground and the receding, moonlit trail. */}
      <div className="scene--landing__snow" />
      <div className="scene--landing__trail" />
      {/* Slender leafless trees, two parallaxing depth bands. */}
      <ProceduralForest />
      {/* Volumetric mist softening the distant trees around the horizon. */}
      <div className="scene--landing__mist" />
      {/* Gently falling snow motes. */}
      <ParticleField
        mode="fall"
        colors={["#e9e2ff", "#f4efff", "#ccbcff"]}
        density={0.5}
      />
      {/* Darkened flanks (negative space) that keep white text legible. */}
      <div className="scene--landing__readzone" />
      <div className="scene--landing__vignette" />
      <div className="scene__grain" />
    </div>
  );
}
