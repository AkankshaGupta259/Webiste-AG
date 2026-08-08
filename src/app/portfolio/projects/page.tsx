import Link from "next/link";
import type { Metadata } from "next";
import { getAllProjects } from "@/content/projects";
import { SectionHeading } from "@/components/portfolio/SectionHeading";
import { ProjectCover } from "@/components/portfolio/ProjectCover";
import { TechTags } from "@/components/portfolio/TechTags";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "Projects" };

/**
 * Projects index — a list of case-study previews. Each entry links to
 * its own `/portfolio/projects/[slug]` page. Rendered from the
 * source-controlled `projects` data, so the list stays in sync with the
 * content module automatically.
 */
export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div>
      <SectionHeading
        eyebrow="Selected work"
        title="Projects"
        lead="Each project is a case study — the problem, the approach, the architecture, and the outcome."
      />

      <ul className="flex flex-col gap-6">
        {projects.map((project, i) => (
          <li key={project.slug}>
            <Link
              href={`${routes.projects}/${project.slug}`}
              className="group grid gap-6 overflow-hidden rounded-2xl border border-border bg-background-elevated/60 transition-colors hover:border-border-strong hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:grid-cols-[300px_1fr]"
            >
              <ProjectCover
                project={project}
                priority={i === 0}
                sizes="(max-width: 768px) 100vw, 300px"
                className="aspect-video md:h-full md:aspect-auto"
              />

              <div className="flex flex-col gap-3 p-6 md:pl-0">
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="font-serif text-2xl text-foreground">
                    {project.title}
                  </h2>
                  {project.timeline ? (
                    <span className="shrink-0 font-mono text-xs text-foreground-subtle">
                      {project.timeline}
                    </span>
                  ) : null}
                </div>

                <p className="text-pretty text-foreground-muted">
                  {project.tagline}
                </p>

                <TechTags items={project.techStack.slice(0, 5)} className="mt-1" />

                <span className="mt-2 inline-flex items-center gap-1.5 text-sm text-accent">
                  View Project
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
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
