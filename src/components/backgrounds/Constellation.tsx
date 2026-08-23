"use client";

import { useEffect, useRef } from "react";

/**
 * A soft field of drifting points linked by faint lines that lean toward
 * the cursor — the playful signature of the personal side, layered over
 * the aurora. Canvas-based and capped in density for performance;
 * honours `prefers-reduced-motion` by drawing a single static frame.
 */
export function Constellation({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Resolve the accent colour from the (personal) theme once.
    const accent =
      getComputedStyle(canvas).getPropertyValue("--accent").trim() || "#ff8fab";

    let width = 0;
    let height = 0;
    let dpr = 1;
    let lastW = 0;
    type Pt = { x: number; y: number; vx: number; vy: number };
    let points: Pt[] = [];
    const mouse = { x: -9999, y: -9999 };

    function seed() {
      const target = Math.min(70, Math.floor((width * height) / 22000));
      points = Array.from({ length: target }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      }));
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas!.clientWidth;
      height = canvas!.clientHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);
      const linkDist = 130;

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        if (!reduce) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
        }

        // Node
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
        ctx!.fillStyle = accent;
        ctx!.globalAlpha = 0.5;
        ctx!.fill();

        // Links to nearby points
        for (let j = i + 1; j < points.length; j++) {
          const q = points[j];
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < linkDist) {
            ctx!.beginPath();
            ctx!.moveTo(p.x, p.y);
            ctx!.lineTo(q.x, q.y);
            ctx!.strokeStyle = accent;
            ctx!.globalAlpha = (1 - d / linkDist) * 0.18;
            ctx!.lineWidth = 1;
            ctx!.stroke();
          }
        }

        // Link toward the cursor
        const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (dm < 160) {
          ctx!.beginPath();
          ctx!.moveTo(p.x, p.y);
          ctx!.lineTo(mouse.x, mouse.y);
          ctx!.strokeStyle = accent;
          ctx!.globalAlpha = (1 - dm / 160) * 0.3;
          ctx!.lineWidth = 1;
          ctx!.stroke();
        }
      }
      ctx!.globalAlpha = 1;
    }

    let raf = 0;
    function loop() {
      draw();
      raf = requestAnimationFrame(loop);
    }

    function onMove(e: PointerEvent) {
      const r = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    }
    function onLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    // Only re-seed on a real width change — mobile scroll toggles the address
    // bar (height-only resize) and re-seeding there makes the field flicker.
    function onResize() {
      if (window.innerWidth === lastW) return;
      lastW = window.innerWidth;
      resize();
    }

    lastW = window.innerWidth;
    resize();
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);

    if (reduce) {
      draw(); // single static frame
    } else {
      loop();
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
