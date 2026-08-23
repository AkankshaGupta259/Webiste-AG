import { GalaxyLoader } from "@/components/personal/GalaxyLoader";

/**
 * Suspense fallback for the whole viewer subtree (hub + category, watch, and
 * collection pages). Appears the moment a door is tapped and stays until the
 * content — which may be waiting on a cold backend — streams in.
 */
export default function ViewerLoading() {
  return <GalaxyLoader />;
}
