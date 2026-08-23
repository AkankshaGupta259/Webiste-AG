import Link from "next/link";
import type { Metadata } from "next";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "A quiet doorway",
  robots: { index: false, follow: false }, // keep the hidden side out of search
};

/**
 * Personal gateway — the playful "are you sure?" warning shown before
 * the personal universe. Reached via a triple-click on the profile
 * photo. Placeholder copy/styling; the viewer itself comes later.
 */
export default function PersonalGatewayPage() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
        You found a door
      </p>
      <h1 className="max-w-xl text-balance font-serif text-4xl leading-tight text-foreground sm:text-5xl">
        You&apos;re about to step into my personal universe.
      </h1>
      <p className="max-w-md text-pretty text-foreground-muted">
        Beyond here lives a scrapbook of the things I love — anime, dramas,
        books, places, and small memories. No résumés. No polish. Just me.
        Wander in?
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        <Link
          href={routes.personalViewer}
          className="rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-all hover:bg-accent-strong active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Enter the universe →
        </Link>
        <Link
          href={routes.home}
          className="rounded-full border border-border-strong px-6 py-2.5 text-sm text-foreground transition-all hover:bg-surface active:scale-95"
        >
          Maybe later
        </Link>
      </div>
    </main>
  );
}
