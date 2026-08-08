import { LandingBackground } from "@/components/backgrounds/LandingBackground";
import { Hero } from "@/components/landing/Hero";

/**
 * Landing page (Server Component).
 * Composes the cinematic landing scene with the interactive hero.
 * Keeping this a Server Component means only the pieces that need
 * interactivity (background, Hero / ProfilePhoto) ship JS to the client.
 */
export default function LandingPage() {
  return (
    <main className="relative min-h-dvh w-full overflow-hidden">
      <LandingBackground />
      <Hero />
    </main>
  );
}
