import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/portfolio/SectionHeading";
import { TechTags } from "@/components/portfolio/TechTags";
import { ViewCertificateLink } from "@/components/portfolio/ViewCertificateLink";
import {
  ExperienceSubNav,
  type SubNavSection,
} from "@/components/portfolio/ExperienceSubNav";
import { ResumeDownload } from "@/components/portfolio/ResumeDownload";
import { resume } from "@/content/resume";
import type { ExperienceItem } from "@/content/types";

export const metadata: Metadata = { title: "Experience & Expertise" };

const SECTIONS: SubNavSection[] = [
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "leadership", label: "Leadership" },
  { id: "education", label: "Education" },
  { id: "certifications", label: "Certifications & Courses" },
  { id: "achievements", label: "Achievements" },
];

export default function ExperiencePage() {
  return (
    <div>
      <SectionHeading
        eyebrow="Professional"
        title="Experience & Expertise"
        lead={resume.summary}
      />

      <div className="lg:grid lg:grid-cols-[200px_1fr] lg:gap-12">
        <ExperienceSubNav sections={SECTIONS} />

        <div className="flex flex-col gap-14">
          {/* Skills */}
          <Section id="skills" title="Skills">
            <dl className="flex flex-col gap-4">
              {resume.skills.map((group) => (
                <div key={group.label} className="sm:grid sm:grid-cols-[160px_1fr] sm:gap-4">
                  <dt className="mb-2 text-sm font-medium text-foreground sm:mb-0">
                    {group.label}
                  </dt>
                  <dd>
                    <TechTags items={group.items} strong />
                  </dd>
                </div>
              ))}
            </dl>
          </Section>

          {/* Experience */}
          <Section id="experience" title="Experience">
            <ExperienceList items={resume.experience} />
          </Section>

          {/* Leadership */}
          <Section id="leadership" title="Leadership & Project Coordination">
            <ExperienceList items={resume.leadership} />
          </Section>

          {/* Education */}
          <Section id="education" title="Education">
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
          </Section>

          {/* Certifications & Courses */}
          <Section id="certifications" title="Certifications & Courses">
            <ol className="flex flex-col gap-8">
              {resume.certifications.map((c) => (
                <li key={c.title}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h3 className="font-serif text-xl text-foreground">{c.title}</h3>
                    {c.year ? (
                      <span className="font-mono text-xs text-foreground-subtle">
                        {c.year}
                      </span>
                    ) : null}
                  </div>
                  {c.issuer ? (
                    <p className="mt-0.5 text-sm text-accent">{c.issuer}</p>
                  ) : null}
                  {c.bullets?.length ? (
                    <ul className="mt-3 flex flex-col gap-2">
                      {c.bullets.map((b) => (
                        <Bullet key={b}>{b}</Bullet>
                      ))}
                    </ul>
                  ) : null}
                  {c.certificate ? (
                    <div className="mt-3">
                      <ViewCertificateLink slug={c.certificate} />
                    </div>
                  ) : null}
                </li>
              ))}
            </ol>
          </Section>

          {/* Achievements */}
          {resume.achievements.length ? (
            <Section id="achievements" title="Achievements">
              <ul className="flex flex-col gap-3">
                {resume.achievements.map((a) => (
                  <li key={a.text} className="flex gap-3 text-foreground-muted">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                    />
                    <span className="leading-relaxed">
                      {a.text}
                      {a.href ? (
                        <Link
                          href={a.href}
                          aria-label="See full details"
                          title="See full details"
                          className="ml-1.5 inline-flex translate-y-0.5 text-accent transition-colors hover:text-accent-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                        >
                          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
                            <path
                              d="M7 13 13 7m0 0H8m5 0v5"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </Link>
                      ) : null}
                    </span>
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}

          {/* Download résumé */}
          <ResumeDownload />
        </div>
      </div>
    </div>
  );
}

/** A jump-linkable section with a consistent mono heading. */
function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 lg:scroll-mt-24">
      <h2 className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-foreground-subtle">
        {title}
      </h2>
      {children}
    </section>
  );
}

/** A bulleted line with the accent dot. */
function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 text-foreground-muted">
      <span
        aria-hidden="true"
        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
      />
      <span className="leading-relaxed">{children}</span>
    </li>
  );
}

/** Shared renderer for Experience and Leadership entries. */
function ExperienceList({ items }: { items: ExperienceItem[] }) {
  return (
    <ol className="flex flex-col gap-8">
      {items.map((job) => (
        <li key={`${job.org}-${job.role}`}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <h3 className="font-serif text-xl text-foreground">{job.role}</h3>
            <span className="font-mono text-xs text-foreground-subtle">
              {job.start} – {job.end}
            </span>
          </div>
          <p className="mt-0.5 text-sm text-accent">
            {[job.org, job.type, job.location].filter(Boolean).join(" · ")}
          </p>
          <ul className="mt-3 flex flex-col gap-2">
            {job.bullets.map((b) => (
              <Bullet key={b}>{b}</Bullet>
            ))}
          </ul>
          {job.certificate ? (
            <div className="mt-3">
              <ViewCertificateLink slug={job.certificate} />
            </div>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
