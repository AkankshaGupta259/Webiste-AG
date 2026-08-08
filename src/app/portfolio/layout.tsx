import { TechBackground } from "@/components/backgrounds/TechBackground";
import { PortfolioNav } from "@/components/portfolio/PortfolioNav";

/**
 * Shared layout for the whole professional surface. Provides the fixed
 * navigation shell (Home + sections) and the bioluminescent "tech" scene
 * behind it — kept subtle so long-form content stays readable.
 */
export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-dvh">
      {/* Fixed scene sits behind everything. */}
      <TechBackground />

      <div className="relative z-10 flex min-h-dvh flex-col">
        <PortfolioNav />
        <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12 sm:px-8 sm:py-16">
          {children}
        </main>
      </div>
    </div>
  );
}
