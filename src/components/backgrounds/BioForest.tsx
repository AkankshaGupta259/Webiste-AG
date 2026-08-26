"use client";

import { useEffect, useRef, type CSSProperties } from "react";

const depth = (n: number): CSSProperties => ({ "--depth": n } as CSSProperties);

// Restrained bioluminescent palette — cyan, turquoise, violet, indigo. No pink.
const GLOW = ["#5eead4", "#67e8f9", "#22d3ee", "#a78bfa", "#818cf8"];
// Deep navy / teal foliage bodies (dark, but light enough to read as leaves).
const LEAF = ["#123a52", "#154257", "#123650", "#184a5e", "#103046"];

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

/** Point on a quadratic Bézier at parameter t. */
function qpt(
  ax: number, ay: number, bx: number, by: number, cx: number, cy: number, t: number,
) {
  const u = 1 - t;
  return {
    x: u * u * ax + 2 * u * t * bx + t * t * cx,
    y: u * u * ay + 2 * u * t * by + t * t * cy,
  };
}

/** A dark, layered foliage clump — a mound of overlapping leaf ellipses. */
function clump(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  const blades = Math.floor(rand(8, 14));
  for (let i = 0; i < blades; i++) {
    const a = rand(0, Math.PI * 2);
    const rr = r * rand(0.45, 1);
    const ex = x + Math.cos(a) * rr * 0.7;
    const ey = y + Math.sin(a) * rr * 0.45 - r * 0.1;
    ctx.beginPath();
    ctx.ellipse(ex, ey, r * rand(0.55, 0.95), r * rand(0.3, 0.55), a, 0, Math.PI * 2);
    ctx.fillStyle = pick(LEAF);
    ctx.globalAlpha = rand(0.55, 0.9);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

/**
 * A feathered, glowing fern frond: a curved central stalk (rachis) lined with
 * paired leaflets that shrink toward a bright tip. The hero "plant" of the
 * bioluminescent grove.
 */
function fern(
  ctx: CanvasRenderingContext2D,
  x0: number, y0: number,
  len: number,
  dir: number, // radians the frond points (−PI/2 = straight up)
  color: string,
  thick: number,
) {
  const bend = rand(-0.5, 0.5);
  const cx = x0 + Math.cos(dir + bend) * len * 0.5;
  const cy = y0 + Math.sin(dir + bend) * len * 0.5;
  const tx = x0 + Math.cos(dir) * len;
  const ty = y0 + Math.sin(dir) * len;

  ctx.lineCap = "round";
  ctx.shadowColor = color;
  ctx.strokeStyle = color;

  // Rachis — a soft outer glow pass plus a brighter core.
  for (let g = 0; g < 2; g++) {
    ctx.globalAlpha = g === 0 ? 0.34 : 0.82;
    ctx.shadowBlur = (g === 0 ? 10 : 3) * thick;
    ctx.lineWidth = (g === 0 ? 3 : 1.2) * thick;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.quadraticCurveTo(cx, cy, tx, ty);
    ctx.stroke();
  }

  // Paired leaflets along the rachis, curving toward the tip.
  const steps = Math.floor(rand(11, 17));
  for (let i = 1; i <= steps; i++) {
    const t = i / (steps + 1);
    const p = qpt(x0, y0, cx, cy, tx, ty, t);
    const p2 = qpt(x0, y0, cx, cy, tx, ty, Math.min(1, t + 0.02));
    const tang = Math.atan2(p2.y - p.y, p2.x - p.x);
    const leafLen = len * 0.22 * (1 - t * 0.85);
    for (const side of [-1, 1]) {
      const la = tang + side * 1.0;
      const lx = p.x + Math.cos(la) * leafLen;
      const ly = p.y + Math.sin(la) * leafLen;
      const mx = (p.x + lx) / 2 + Math.cos(tang) * leafLen * 0.35;
      const my = (p.y + ly) / 2 + Math.sin(tang) * leafLen * 0.35;
      ctx.globalAlpha = 0.6;
      ctx.shadowBlur = 5 * thick;
      ctx.lineWidth = 1.1 * thick;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.quadraticCurveTo(mx, my, lx, ly);
      ctx.stroke();
    }
  }

  // Bright tip bead.
  ctx.globalAlpha = 0.95;
  ctx.fillStyle = color;
  ctx.shadowBlur = 11 * thick;
  ctx.beginPath();
  ctx.arc(tx, ty, 2.2 * thick, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
}

/** A small glowing flower / mushroom nestled in the foliage. */
function flower(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
  ctx.shadowColor = color;
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.85;
  ctx.shadowBlur = r * 5;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 0.35;
  ctx.shadowBlur = r * 9;
  ctx.beginPath();
  ctx.arc(x, y, r * 1.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
}

/** A cluster of ferns fanning out from a point (a glowing plant). */
function fernBush(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  size: number,
  spread: number, // center angle to fan around (radians)
  count: number,
  thick: number,
) {
  for (let i = 0; i < count; i++) {
    const dir = spread + rand(-0.7, 0.7);
    fern(ctx, x + rand(-size * 0.1, size * 0.1), y, size * rand(0.7, 1.1), dir, pick(GLOW), thick);
  }
  // A couple of glowing flowers at the base.
  for (let i = 0; i < 2; i++) {
    flower(ctx, x + rand(-size * 0.2, size * 0.2), y - rand(0, size * 0.12), rand(1.6, 3) * thick, pick(GLOW));
  }
}

/**
 * Paint one depth band of the grove. `near` bands are larger, brighter and
 * denser; far bands are smaller and hazier. Everything hugs the bottom and the
 * left/right edges, keeping the upper center-left open for page text.
 */
function paint(canvas: HTMLCanvasElement, band: "back" | "front") {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);

  const near = band === "front";
  const thick = near ? 1 : 0.66;
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

  // Stack several fern bushes up an edge so plants pile on top of each other.
  const stack = (
    xLo: number, xHi: number,
    yFrom: number, yTo: number,
    tiers: number,
    dir: number,
    sizeFrom: number, sizeTo: number,
    count: number,
  ) => {
    for (let i = 0; i < tiers; i++) {
      const f = tiers === 1 ? 0 : i / (tiers - 1);
      fernBush(
        ctx,
        rand(xLo, xHi) * w,
        lerp(yFrom, yTo, f) * h,
        lerp(sizeFrom, sizeTo, f) * h,
        dir,
        count,
        thick,
      );
    }
  };

  // 1) Forest floor — dark foliage clumps spread evenly across the full width.
  const floorY = h * (near ? 1.03 : 0.93);
  const clumps = near ? 22 : 15;
  for (let i = 0; i < clumps; i++) {
    const x = clamp((i + rand(-0.5, 0.5)) / (clumps - 1), 0, 1) * w;
    const r = (near ? rand(0.12, 0.24) : rand(0.08, 0.15)) * h;
    clump(ctx, x, floorY - rand(0, h * 0.06), r);
  }

  // 2) Dark foliage climbing both side edges (balanced left and right).
  for (const sideX of [rand(0, w * 0.08), w - rand(0, w * 0.08)]) {
    const n = near ? 4 : 3;
    for (let i = 0; i < n; i++) {
      const y = h * (0.5 + i * 0.16) + rand(-h * 0.05, h * 0.05);
      clump(ctx, sideX + rand(-w * 0.03, w * 0.03), y, (near ? rand(0.11, 0.18) : rand(0.07, 0.12)) * h);
    }
  }

  // 3) Big glowing ferns — an even band across the whole bottom (smaller
  //    through the middle, larger at the edges) plus matched stacks climbing
  //    each side, so the growth frames the page evenly instead of piling right.
  const bottom = near ? 7 : 5;
  for (let i = 0; i < bottom; i++) {
    const x = clamp((i + rand(-0.32, 0.32)) / (bottom - 1), 0.02, 0.98) * w;
    const cf = Math.abs(x / w - 0.5) * 2; // 0 = center … 1 = edge
    const size = (near ? rand(0.2, 0.32) : rand(0.14, 0.22)) * (0.7 + 0.55 * cf) * h;
    fernBush(ctx, x, h * (1.03 + rand(0, 0.05)), size, -Math.PI / 2 + rand(-0.35, 0.35), near ? 5 : 4, thick);
  }
  if (near) {
    stack(0.0, 0.1, 1.04, 0.6, 3, -Math.PI / 2 + 0.3, 0.3, 0.2, 4); // left edge
    stack(0.9, 1.0, 1.04, 0.6, 3, -Math.PI / 2 - 0.3, 0.3, 0.2, 4); // right edge
  }

  // 4) Hanging tendrils from the top — balanced across both corners.
  const tendrils = 4;
  for (let i = 0; i < tendrils; i++) {
    const x = i % 2 === 0 ? rand(0, w * 0.1) : rand(w * 0.9, w);
    fern(ctx, x, -h * 0.02, (near ? rand(0.3, 0.52) : rand(0.22, 0.38)) * h, Math.PI / 2 + rand(-0.28, 0.28), pick(GLOW), thick * 0.85);
  }
}

/**
 * Ancient bioluminescent grove drawn on two parallaxing canvases — layered
 * dark foliage, large feathered glowing ferns, hanging tendrils and floor
 * flowers, all pushed to the edges/corners so the center-left stays a dark,
 * readable negative space. Redrawn once per resize (no per-frame cost).
 */
export function BioForest() {
  const back = useRef<HTMLCanvasElement>(null);
  const front = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = back.current;
    if (!el) return;
    let lastW = 0;
    function draw() {
      if (back.current) paint(back.current, "back");
      if (front.current) paint(front.current, "front");
    }
    // Redraw when the canvas's rendered WIDTH settles or changes. A
    // ResizeObserver (not window 'resize') catches the first-paint layout
    // settle — so the scene never stays drawn at a stale width until a manual
    // refresh — while the width-only guard still ignores mobile address-bar
    // height changes (which would otherwise re-randomise the grove on scroll).
    draw(); // instant paint at the current width
    lastW = el.clientWidth; // so an unchanged first observation doesn't redraw
    const ro = new ResizeObserver((entries) => {
      const w = Math.round(entries[0].contentRect.width);
      if (!w || w === lastW) return;
      lastW = w;
      draw();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <>
      <div className="scene__layer" style={depth(4)} aria-hidden="true">
        <canvas ref={back} className="block h-full w-full" />
      </div>
      <div className="scene__layer" style={depth(12)} aria-hidden="true">
        <canvas ref={front} className="block h-full w-full" />
      </div>
    </>
  );
}
