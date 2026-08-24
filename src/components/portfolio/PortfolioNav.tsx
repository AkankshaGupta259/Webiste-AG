"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { routes } from "@/lib/routes";
import { portfolioSections } from "@/config/navigation";

/**
 * Persistent professional-side header: a Home control back to the
 * landing page, plus links to each section with an active-state
 * indicator. On narrow screens the section links collapse into a
 * toggleable menu so every section stays reachable without the page
 * ever needing to scroll sideways. Client component because it reads
 * the current path (active state) and owns the menu open/close state.
 */
export function PortfolioNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // The menu closes itself on link tap (onClick, below) and on the toggle;
  // this also lets Escape close it while it's open.
  useEffect(() => {
    if (!menuOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
      <nav
        aria-label="Portfolio"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 sm:px-8"
      >
        {/* Home (landing) + Portfolio hub */}
        <div className="flex items-center gap-3">
          <Link
            href={routes.home}
            aria-label="Back to home"
            className="group flex items-center rounded-md text-foreground-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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

        {/* Section links — inline on ≥ sm, collapsed into a menu below sm. */}
        <ul className="hidden items-center gap-1 sm:flex sm:gap-2">
          {portfolioSections.map((section) => {
            const isActive = pathname === section.href;
            return (
              <li key={section.href}>
                <Link
                  href={section.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`rounded-full px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-95 ${
                    isActive
                      ? "bg-surface text-foreground"
                      : "text-foreground-muted hover:text-foreground"
                  }`}
                >
                  {section.shortLabel ?? section.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile menu toggle (< sm). */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="portfolio-menu"
          className="-mr-1 flex h-10 w-10 items-center justify-center rounded-md text-foreground-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-95 sm:hidden"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
            {menuOpen ? (
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile dropdown panel. */}
      {menuOpen ? (
        <div
          id="portfolio-menu"
          className="border-t border-border bg-background/95 backdrop-blur-md sm:hidden"
        >
          <ul className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {portfolioSections.map((section) => {
              const isActive = pathname === section.href;
              return (
                <li key={section.href}>
                  <Link
                    href={section.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                    className={`block rounded-lg px-4 py-3 text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-[0.98] ${
                      isActive
                        ? "bg-surface text-foreground"
                        : "text-foreground-muted hover:bg-surface/60 hover:text-foreground"
                    }`}
                  >
                    {section.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </header>
  );
}
