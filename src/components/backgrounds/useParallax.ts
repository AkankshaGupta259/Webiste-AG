import { useEffect, type RefObject } from "react";

/**
 * Drives the scene's `--mx` / `--my` custom properties from the pointer
 * (smoothed), so depth layers can shift for a 3-D parallax feel. Disabled
 * under prefers-reduced-motion.
 */
export function useParallax(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    let raf = 0;

    function onMove(e: PointerEvent) {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    }
    function loop() {
      cur.x += (target.x - cur.x) * 0.06;
      cur.y += (target.y - cur.y) * 0.06;
      el!.style.setProperty("--mx", cur.x.toFixed(3));
      el!.style.setProperty("--my", cur.y.toFixed(3));
      raf = requestAnimationFrame(loop);
    }

    window.addEventListener("pointermove", onMove);
    loop();
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [ref]);
}
