"use client";

import { useEffect, useRef, type CSSProperties } from "react";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const depth = (n: number): CSSProperties => ({ "--depth": n } as CSSProperties);

/** Tiny deterministic PRNG so each tree keeps its shape across resizes. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Draw a slender, leafless winter tree: a tall near-vertical trunk with a
 * gentle sway, tapering as it rises, and a few sparse thin branches angled
 * steeply upward in its top half. `t` = 0 (near) … 1 (far) drives colour and
 * haze so distant trees dissolve into indigo mist (atmospheric perspective).
 */
function tree(
  ctx: CanvasRenderingContext2D,
  x: number,
  baseY: number,
  height: number,
  t: number,
  seed: number,
) {
  // Near trees read as near-black indigo silhouettes; far trees lift toward a
  // hazy lavender as the mist washes them out.
  const a = (0.96 - t * 0.52).toFixed(2);
  const r = Math.round(lerp(19, 120, t));
  const g = Math.round(lerp(15, 108, t));
  const b = Math.round(lerp(44, 182, t));
  const color = `rgba(${r}, ${g}, ${b}, ${a})`;

  const rnd = mulberry32(seed);
  const topX = x + (rnd() - 0.5) * height * 0.06; // slight lean of the trunk
  const topY = baseY - height;
  const baseW = Math.max(1, height * 0.02);

  ctx.strokeStyle = color;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Trunk — a gently curved, tapering line from base to top.
  const midX = lerp(x, topX, 0.5) + (rnd() - 0.5) * height * 0.03;
  const midY = lerp(baseY, topY, 0.5);
  ctx.lineWidth = baseW;
  ctx.beginPath();
  ctx.moveTo(x, baseY);
  ctx.quadraticCurveTo(midX, midY, topX, topY);
  ctx.stroke();
  // Thinner overstroke on the upper trunk to fake a taper toward the crown.
  ctx.lineWidth = Math.max(0.6, baseW * 0.5);
  ctx.beginPath();
  ctx.moveTo(midX, midY);
  ctx.quadraticCurveTo(lerp(midX, topX, 0.5), lerp(midY, topY, 0.5), topX, topY);
  ctx.stroke();

  // Sparse bare branches in the upper half, angled steeply upward.
  const nb = 3 + Math.floor(rnd() * 3); // 3–5 branches
  for (let i = 0; i < nb; i++) {
    const f = 0.45 + rnd() * 0.5; // fraction up the trunk (upper half)
    const bx = lerp(x, topX, f);
    const by = lerp(baseY, topY, f);
    const side = rnd() > 0.5 ? 1 : -1;
    const angle = Math.PI / 2 - side * (0.32 + rnd() * 0.46); // lean off vertical
    const len = height * (0.11 + rnd() * 0.16) * (1 - f * 0.4);
    const ex = bx + Math.cos(angle) * len;
    const ey = by - Math.sin(angle) * len;
    ctx.lineWidth = Math.max(0.5, baseW * (0.5 - f * 0.2));
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.quadraticCurveTo((bx + ex) / 2, (by + ey) / 2 - len * 0.15, ex, ey);
    ctx.stroke();
    // Occasional forked twig near the tip.
    if (rnd() > 0.5) {
      const a2 = angle + side * (0.3 + rnd() * 0.3);
      ctx.beginPath();
      ctx.moveTo(ex, ey);
      ctx.lineTo(ex + Math.cos(a2) * len * 0.5, ey - Math.sin(a2) * len * 0.5);
      ctx.stroke();
    }
  }
}

/** Paint a receding row of slender trees on each side of a central path. */
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

  const cx = w * 0.5;
  const vy = h * 0.42; // vanishing-point height (matches the snow horizon)
  // Kept sparse so individual trunks stay visible, per the brief.
  const N = band === "back" ? 9 : 7;
  const [from, to] = band === "back" ? [1, 0.46] : [0.44, 0]; // far→near within band

  for (let i = 0; i < N; i++) {
    const t = lerp(from, to, i / (N - 1));
    const x = lerp(w * 0.03, cx - w * 0.05, t); // near→edge, far→centre (corridor)
    const baseY = lerp(h * 1.04, vy + h * 0.02, t);
    const height = lerp(h * 0.74, h * 0.12, t);
    const s = (band === "back" ? 1000 : 2000) + i * 7;
    tree(ctx, x, baseY, height, t, s); // left row
    tree(ctx, w - x, baseY, height, t, s + 313); // right row (mirrored placement)
  }
}

/**
 * A procedural forest corridor: two receding rows of bare trees framing a
 * central path toward the light. Split into a far (back) and near (front)
 * canvas so each parallaxes at a different depth. Drawn once per resize.
 */
export function ProceduralForest() {
  const back = useRef<HTMLCanvasElement>(null);
  const front = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    function draw() {
      if (back.current) paint(back.current, "back");
      if (front.current) paint(front.current, "front");
    }
    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, []);

  return (
    <>
      <div className="scene__layer" style={depth(9)} aria-hidden="true">
        <canvas ref={back} className="block h-full w-full" />
      </div>
      <div className="scene__layer" style={depth(26)} aria-hidden="true">
        <canvas ref={front} className="block h-full w-full" />
      </div>
    </>
  );
}
