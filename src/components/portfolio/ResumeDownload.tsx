"use client";

import { useEffect, useState } from "react";
import { resume } from "@/content/resume";

type RoleKey = "sde" | "aiml" | "management";

const ROLES: { key: RoleKey; label: string; desc: string }[] = [
  { key: "sde", label: "SDE", desc: "Software engineering" },
  { key: "aiml", label: "AI / ML", desc: "ML & computer vision" },
  { key: "management", label: "Management", desc: "Leadership & coordination" },
];

/**
 * Résumé download control. The button opens a small dialog asking which role
 * the résumé is for; each choice downloads a role-specific PDF. Roles without
 * a file yet show "coming soon" so the flow is visible but never broken.
 */
export function ResumeDownload() {
  const [open, setOpen] = useState(false);
  const files = resume.resumesByRole ?? {};

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <section className="rounded-2xl border border-border bg-background-elevated/50 p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl text-foreground">Download my résumé</h2>
          <p className="mt-1 text-sm text-foreground-muted">
            Tailored to the role you&apos;re hiring for.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-all hover:bg-accent-strong active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
            <path
              d="M10 3v10m0 0 4-4m-4 4-4-4M4 16h12"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Download résumé
        </button>
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Choose a résumé"
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-md rounded-2xl border border-border-strong bg-background-elevated p-6 shadow-2xl shadow-black/50">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl text-foreground">Select a role</h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="-mr-1 -mt-1 rounded-md p-1 text-foreground-subtle transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <ul className="flex flex-col gap-3">
              {ROLES.map((role) => {
                const file = files[role.key];
                return (
                  <li key={role.key}>
                    {file ? (
                      <a
                        href={file}
                        download
                        onClick={() => setOpen(false)}
                        className="group flex items-center justify-between gap-4 rounded-xl border border-border bg-surface/40 px-5 py-4 transition-all hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        <span>
                          <span className="block font-medium text-foreground">{role.label}</span>
                          <span className="block text-sm text-foreground-muted">{role.desc}</span>
                        </span>
                        <span className="font-mono text-xs text-accent">Download →</span>
                      </a>
                    ) : (
                      <div
                        aria-disabled="true"
                        className="flex cursor-not-allowed items-center justify-between gap-4 rounded-xl border border-dashed border-border px-5 py-4 opacity-60"
                      >
                        <span>
                          <span className="block font-medium text-foreground">{role.label}</span>
                          <span className="block text-sm text-foreground-muted">{role.desc}</span>
                        </span>
                        <span className="font-mono text-xs text-foreground-subtle">Coming soon</span>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ) : null}
    </section>
  );
}
