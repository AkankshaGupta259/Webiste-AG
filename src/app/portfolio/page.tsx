import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { portfolioSections } from "@/config/navigation";

export const metadata: Metadata = { title: "Portfolio" };

/**
 * Professional hub — the dashboard that introduces Akanksha and routes
 * into each section. Cards are generated from the `portfolioSections`
 * config, so the hub stays in sync with the nav automatically.
 */
export default function PortfolioPage() {
  return (
    <div className="flex flex-col gap-12">
      {/* Intro */}
      <header className="max-w-2xl">
        <h1 className="text-balance font-serif text-4xl leading-tight text-foreground sm:text-5xl">
          {siteConfig.name}
        </h1>
        <p className="mt-5 text-pretty text-lg text-foreground-muted">
          {/* {siteConfig.description} */}
          Hi! I enjoy building intelligent systems that solve real-world problems and turning complex ideas into elegant, user-friendly solutions. Whether it's developing scalable software or exploring emerging technologies, I'm driven by curiosity, continuous learning, and a passion for making technology more accessible.
        </p>
      </header>

      {/* Section cards */}
      <ul className="grid gap-4 sm:grid-cols-2">
        {portfolioSections.map((section) => (
          <li key={section.href}>
            <Link
              href={section.href}
              className="group flex h-full flex-col justify-between gap-6 rounded-2xl border border-border bg-background-elevated/60 p-6 transition-colors hover:border-border-strong hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <div>
                <h2 className="font-serif text-2xl text-foreground">
                  {section.label}
                </h2>
                <p className="mt-2 text-sm text-foreground-muted">
                  {section.description}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-sm text-accent">
                View
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
