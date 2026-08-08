import { AuroraBackground } from "./AuroraBackground";
import { Constellation } from "./Constellation";

/**
 * The personal side's backdrop: the shared aurora (auto-warmed by the
 * `.theme-personal` tokens) with the interactive constellation layered
 * on top. Fixed behind the content.
 */
export function PersonalBackground() {
  return (
    <div className="fixed inset-0 -z-0" aria-hidden="true">
      <AuroraBackground className="opacity-70" />
      <Constellation />
    </div>
  );
}
