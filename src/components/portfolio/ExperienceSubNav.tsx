"use client";

import { useEffect, useState } from "react";

export interface SubNavSection {
  id: string;
  label: string;
}

/**
 * "On this page" jump-nav for the Experience & Expertise page. On large
 * screens it's a labelled, sticky rail with a vertical line and an accent
 * marker on the active section (a recognizable table-of-contents pattern).
 * On small screens it collapses to a compact sticky strip of pills under the
 * header. Highlights the section currently in view (scroll-spy).
 */
export function ExperienceSubNav({ sections }: { sections: SubNavSection[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!els.length) return;

    // Track the full set of sections crossing the active band, not just the
    // ones that changed in a given callback — otherwise a fast scroll can
    // leave the highlight stale.
    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.set(e.target.id, e.boundingClientRect.top);
          else visible.delete(e.target.id);
        }
        if (visible.size) {
          const topId = [...visible.entries()].sort((a, b) => a[1] - b[1])[0][0];
          setActive(topId);
        }
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav
      aria-label="On this page"
      className="sticky top-16 z-20 mb-8 border-b border-border bg-background/85 py-3 backdrop-blur-md lg:top-24 lg:mb-0 lg:self-start lg:border-0 lg:bg-transparent lg:py-0 lg:backdrop-blur-none"
    >
      <p className="mb-3 hidden font-mono text-[10px] uppercase tracking-[0.22em] text-foreground-subtle lg:block">
        On this page
      </p>
      <ul className="flex gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] lg:flex-col lg:gap-0 lg:overflow-visible lg:border-l lg:border-border [&::-webkit-scrollbar]:hidden">
        {sections.map((s) => {
          const isActive = active === s.id;
          return (
            <li key={s.id} className="shrink-0">
              <a
                href={`#${s.id}`}
                aria-current={isActive ? "true" : undefined}
                className={`block whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition-colors active:scale-95 lg:-ml-px lg:rounded-none lg:border-l-2 lg:px-4 ${
                  isActive
                    ? "max-lg:bg-surface max-lg:text-foreground lg:border-accent lg:font-medium lg:text-accent"
                    : "text-foreground-muted hover:text-foreground lg:border-transparent lg:hover:border-border-strong"
                }`}
              >
                {s.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
