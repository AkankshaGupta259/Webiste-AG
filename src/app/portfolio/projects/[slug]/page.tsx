import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProjects, getProjectBySlug } from "@/content/projects";
import { ProjectCover } from "@/components/portfolio/ProjectCover";
import { TechTags } from "@/components/portfolio/TechTags";
import type { ResourceLink } from "@/content/types";
import { routes } from "@/lib/routes";

type Params = { slug: string };

/** Pre-render every project page at build time (content is static). */
export function generateStaticParams(): Params[] {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  return { title: project.title, description: project.tagline };
}

export default async function ProjectCaseStudy({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const { github, demo, resources } = project.links;
  const hasLinks = Boolean(github || demo || (resources && resources.length));

  return (
    <article className="mx-auto max-w-3xl">
      <Link
        href={routes.projects}
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-foreground-muted transition-colors hover:text-foreground"
      >
        <span aria-hidden="true">←</span> All projects
      </Link>

      {/* Header */}
      <header className="mb-8">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-accent">
          {project.timeline }
        </p>
        <h1 className="text-balance font-serif text-4xl leading-tight text-foreground sm:text-5xl">
          {project.title}
        </h1>
        <p className="mt-4 text-pretty text-lg text-foreground-muted">
          {project.tagline}
        </p>

        {hasLinks ? (
          <div className="mt-6 flex flex-wrap gap-3">
            {github ? <LinkButton href={github} label="GitHub" primary /> : null}
            {demo ? <LinkButton href={demo} label="Web App" /> : null}
            {resources?.map((r: ResourceLink) => (
              <LinkButton key={r.href} href={r.href} label={r.label} />
            ))}
          </div>
        ) : null}
      </header>

      {/* Cover */}
      <ProjectCover
        project={project}
        priority
        className="mb-10 aspect-video w-full rounded-2xl border border-border"
        sizes="(max-width: 768px) 100vw, 768px"
      />

      {/* Tech stack */}
      <Block title="Tech stack">
        <TechTags items={project.techStack} />
      </Block>

      <Block title="The problem">
        <p className="leading-relaxed text-foreground-muted">{project.problem}</p>
      </Block>

      <Block title="The solution">
        <p className="leading-relaxed text-foreground-muted">{project.solution}</p>
      </Block>

      {project.architecture ? (
        <Block title="Architecture">
          <p className="leading-relaxed text-foreground-muted">
            {project.architecture}
          </p>
        </Block>
      ) : null}

      {project.highlights && project.highlights.length ? (
        <Block title="Highlights">
          <ul className="flex flex-col gap-2">
            {project.highlights.map((h) => (
              <li key={h} className="flex gap-3 text-foreground-muted">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span className="leading-relaxed">{h}</span>
              </li>
            ))}
          </ul>
        </Block>
      ) : null}
    </article>
  );
}

/** A titled content block with a consistent rhythm. */
function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-foreground-subtle">
        {title}
      </h2>
      {children}
    </section>
  );
}

/** External link button (opens in a new tab). */
function LinkButton({
  href,
  label,
  primary = false,
}: {
  href: string;
  label: string;
  primary?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`rounded-full px-5 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
        primary
          ? "bg-foreground text-background hover:bg-accent-strong"
          : "border border-border-strong text-foreground hover:bg-surface"
      }`}
    >
      {label}
    </a>
  );
}
