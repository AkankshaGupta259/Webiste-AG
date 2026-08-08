"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { routes } from "@/lib/routes";
import { portfolioSections } from "@/config/navigation";

/**
 * Persistent professional-side header: a Home control back to the
 * landing page, plus links to each section with an active-state
 * indicator. Client component only because it reads the current path
 * to highlight the active section.
 */
export function PortfolioNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/70 backdrop-blur-md">
      <nav
        aria-label="Portfolio"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 sm:px-8"
      >
        {/* Home (landing) + Portfolio hub */}
        <div className="flex items-center gap-3">
          <Link
            href={routes.home}
            aria-label="Back to home"
            className="group flex items-center text-foreground-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md"
          >
            <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden="true">
              <path
                d="M3 9.5 10 4l7 5.5M5 8.5V16h10V8.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          <span aria-hidden="true" className="text-border-strong">
            /
          </span>

          <Link
            href={routes.portfolio}
            aria-current={pathname === routes.portfolio ? "page" : undefined}
            className={`rounded-md font-serif text-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              pathname === routes.portfolio
                ? "text-foreground"
                : "text-foreground-muted hover:text-foreground"
            }`}
          >
            Portfolio
          </Link>
        </div>

        {/* Section links */}
        <ul className="flex items-center gap-1 sm:gap-2">
          {portfolioSections.map((section) => {
            const isActive = pathname === section.href;
            return (
              <li key={section.href}>
                <Link
                  href={section.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`rounded-full px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    isActive
                      ? "bg-surface text-foreground"
                      : "text-foreground-muted hover:text-foreground"
                  }`}
                >
                  {section.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
