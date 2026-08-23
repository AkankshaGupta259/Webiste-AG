"use client";

import { useEffect } from "react";
import { prewarmPersonalApi } from "@/lib/prewarm";

/**
 * Invisible helper: pings the content API on mount so entering any personal
 * route starts waking the free-tier backend immediately (A3). Renders nothing.
 */
export function PrewarmPersonalApi() {
  useEffect(() => {
    prewarmPersonalApi();
  }, []);
  return null;
}
