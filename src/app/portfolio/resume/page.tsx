import type { Metadata } from "next";
import { SectionHeading } from "@/components/portfolio/SectionHeading";
import { TechTags } from "@/components/portfolio/TechTags";
import { resume } from "@/content/resume";

export const metadata: Metadata = { title: "Resume" };

/**
 * Resume — readable on-page, rendered from the source-controlled
 * `resume` data. Skeleton for now: structure is complete; a final
 * downloadable PDF and any Research entries are still to come.
 */
export default function ResumePage() {
  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <SectionHeading
          eyebrow="Experience & background"
          title="Resume"
          lead={resume.summary}
        />
        <DownloadButton />
      </div>

      <div className="mt-4 flex flex-col gap-12">
        {/* Skills */}
        <ResumeSection title="Skills">
          <dl className="flex flex-col gap-4">
            {resume.skills.map((group) => (
              <div key={group.label} className="sm:grid sm:grid-cols-[160px_1fr] sm:gap-4">
                <dt className="mb-2 text-sm text-foreground-subtle sm:mb-0">
                  {group.label}
                </dt>
                <dd>
                  <TechTags items={group.items} />
                </dd>
              </div>
            ))}
          </dl>
        </ResumeSection>

        {/* Experience */}
        <ResumeSection title="Experience">
          <ol className="flex flex-col gap-8">
            {resume.experience.map((job) => (
              <li key={`${job.org}-${job.role}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="font-serif text-xl text-foreground">
                    {job.role}
                  </h3>
                  <span className="font-mono text-xs text-foreground-subtle">
                    {job.start} – {job.end}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-accent">
                  {[job.org, job.type].filter(Boolean).join(" · ")}
                </p>
                <ul className="mt-3 flex flex-col gap-2">
                  {job.bullets.map((b) => (
                    <li key={b} className="flex gap-3 text-foreground-muted">
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                      />
                      <span className="leading-relaxed">{b}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </ResumeSection>

        {/* Education */}
        <ResumeSection title="Education">
          <ol className="flex flex-col gap-6">
            {resume.education.map((edu) => (
              <li key={`${edu.institution}-${edu.qualification}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="font-serif text-lg text-foreground">
                    {edu.qualification}
                  </h3>
                  <span className="font-mono text-xs text-foreground-subtle">
                    {edu.start ? `${edu.start} – ${edu.end}` : edu.end}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-foreground-muted">
                  {[edu.institution, edu.location].filter(Boolean).join(" · ")}
                  {edu.detail ? (
                    <span className="text-accent"> · {edu.detail}</span>
                  ) : null}
                </p>
              </li>
            ))}
          </ol>
        </ResumeSection>

        {/* Achievements */}
        {resume.achievements.length ? (
          <ResumeSection title="Achievements">
            <ul className="flex flex-col gap-2">
              {resume.achievements.map((a) => (
                <li key={a} className="flex gap-3 text-foreground-muted">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                  />
                  <span className="leading-relaxed">{a}</span>
                </li>
              ))}
            </ul>
          </ResumeSection>
        ) : null}

        {/* Research (only when populated) */}
        {resume.research.length ? (
          <ResumeSection title="Research">
            <ul className="flex flex-col gap-2">
              {resume.research.map((r) => (
                <li key={r} className="flex gap-3 text-foreground-muted">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                  />
                  <span className="leading-relaxed">{r}</span>
                </li>
              ))}
            </ul>
          </ResumeSection>
        ) : null}
      </div>
    </div>
  );
}

/** A labelled resume section with a consistent mono heading. */
function ResumeSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-foreground-subtle">
        {title}
      </h2>
      {children}
    </section>
  );
}

/** Download button — real link when a PDF is set, otherwise a quiet note. */
function DownloadButton() {
  if (!resume.resumePdf) {
    return (
      <span className="rounded-full border border-dashed border-border-strong px-5 py-2.5 text-sm text-foreground-subtle">
        PDF coming soon
      </span>
    );
  }
  return (
    <a
      href={resume.resumePdf}
      download
      className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-accent-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      Download PDF
    </a>
  );
}
