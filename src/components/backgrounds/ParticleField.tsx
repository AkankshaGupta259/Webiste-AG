"use client";

import { useEffect, useRef } from "react";

interface Props {
  colors: string[];
  /**
   * "drift" = float in all directions; "rise" = float upward (spores);
   * "fall" = drift gently downward with a slight sway (snow).
   */
  mode?: "drift" | "rise" | "fall";
  /** Scales the particle count relative to the viewport area. */
  density?: number;
  className?: string;
}

/**
 * A field of soft, glowing particles on a canvas. Each particle has a
 * depth (z) that drives its size, opacity, speed, and how much it shifts
 * with the pointer — giving the scene a parallax-driven 3-D feel.
 * Renders a single static frame under prefers-reduced-motion.
 */
export function ParticleField({
  colors,
  mode = "drift",
  density = 1,
  className = "",
}: Props) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = { x: 0, y: 0 };
    let w = 0;
    let h = 0;
    let lastW = 0;

    type P = { x: number; y: number; z: number; vx: number; vy: number; r: number; c: string; a: number };
    let ps: P[] = [];

    function seed() {
      const n = Math.min(75, Math.floor(((w * h) / 15000) * density));
      ps = Array.from({ length: n }, () => {
        const z = Math.random();
        const vy =
          mode === "rise"
            ? -(0.15 + z * 0.5)
            : mode === "fall"
              ? 0.12 + z * 0.45 // drift down; nearer flakes fall a touch faster
              : (Math.random() - 0.5) * 0.2 * (0.4 + z);
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          z,
          vx:
            mode === "fall"
              ? (Math.random() - 0.5) * 0.28 * (0.4 + z) // gentle sideways sway
              : (Math.random() - 0.5) * 0.2 * (0.4 + z),
          vy,
          r: 0.6 + z * 2.1,
          c: colors[Math.floor(Math.random() * colors.length)],
          a: 0.2 + z * 0.55,
        };
      });
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas!.clientWidth;
      h = canvas!.clientHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function draw() {
      ctx!.clearRect(0, 0, w, h);
      for (const p of ps) {
        if (!reduce) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < -6) p.x = w + 6;
          if (p.x > w + 6) p.x = -6;
          if (p.y < -6) p.y = h + 6;
          if (p.y > h + 6) p.y = -6;
        }
        const ox = mouse.x * p.z * 16;
        const oy = mouse.y * p.z * 16;
        ctx!.beginPath();
        ctx!.arc(p.x + ox, p.y + oy, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = p.c;
        ctx!.globalAlpha = p.a;
        ctx!.shadowBlur = p.r * 4;
        ctx!.shadowColor = p.c;
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;
      ctx!.shadowBlur = 0;
    }

    let raf = 0;
    function loop() {
      draw();
      raf = requestAnimationFrame(loop);
    }
    function onMove(e: PointerEvent) {
      const r = canvas!.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      mouse.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    }

    // Re-seed only on a real width change. Mobile scroll toggles the address
    // bar (height-only resize); re-seeding there makes particles jump.
    function onResize() {
      if (window.innerWidth === lastW) return;
      lastW = window.innerWidth;
      resize();
    }

    lastW = window.innerWidth;
    resize();
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove);
    if (reduce) draw();
    else loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
    };
  }, [colors, mode, density]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
